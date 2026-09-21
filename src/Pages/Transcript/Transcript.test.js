import React from "react";
import { createRoot } from "react-dom/client";
import { act } from "react";
import axios from "axios";
import Transcript from "./Transcript";

jest.mock("axios");
jest.mock("../../Components/PrintButton/PrintButton", () => () => <button type="button">Print</button>);
globalThis.IS_REACT_ACT_ENVIRONMENT = true;

const semester = (courses) => ({ name: "Fall 2026 - Semester 1", gpa: 3, creditsAttempted: 6, creditsEarned: 6, courses });
const transcript = (over = {}) => ({
  hasData: true, student: { name: "Ayesha Khan", rollNumber: "24F-1000", degree: "BS CS", department: "CS", program: "BSCS" },
  semesters: [semester([{ code: "CS101", name: "Programming", creditHours: 3, grade: "A", gradePoints: 4 }, { code: "MT101", name: "Calculus", creditHours: 3, grade: "I", gradePoints: null }])],
  cgpa: 4, totalCreditsAttempted: 6, totalCreditsEarned: 3, ...over,
});

let container; let root;
const show = async (data) => {
  axios.get.mockResolvedValue({ data });
  await act(async () => { root.render(<Transcript />); });
  await act(async () => { await new Promise((r) => setTimeout(r, 0)); });
};
beforeEach(() => { container = document.createElement("div"); document.body.appendChild(container); root = createRoot(container); sessionStorage.setItem("token", "t"); });
afterEach(() => { act(() => root.unmount()); container.remove(); axios.get.mockReset(); });

test("the transcript shows published grades and points, and Incomplete gets a note that it carries no points", async () => {
  await show(transcript());
  const rows = [...container.querySelectorAll(".course-table tbody tr")].map((r) => [...r.children].map((c) => c.textContent));
  expect(rows).toEqual([["CS101", "Programming", "3", "4.00", "A"], ["MT101", "Calculus", "3", "-", "I"]]);
  expect(container.querySelector(".grade-legend").textContent).toContain("I = Incomplete");
  expect(container.querySelector(".grade-legend").textContent).toContain("carry no grade points");
});

test("a course with no published result keeps its place in the term, with a dash and no grade", async () => {
  await show(transcript({ semesters: [semester([{ code: "CS101", name: "Programming", creditHours: 3, grade: "A", gradePoints: 4 }, { code: "CS201", name: "Data Structures", creditHours: 3, grade: "-", gradePoints: null }])] }));
  const rows = [...container.querySelectorAll(".course-table tbody tr")].map((r) => [...r.children].map((c) => c.textContent));
  expect(rows[1]).toEqual(["CS201", "Data Structures", "3", "-", "-"]);
  expect(container.querySelector(".in-progress")).toBeNull();
});

test("a term where nothing is published shows a dash instead of a 0.00 GPA, and so does the cumulative GPA", async () => {
  await show(transcript({ semesters: [semester([{ code: "CS201", name: "Data Structures", creditHours: 3, grade: "-", gradePoints: null }])], cgpa: 0, totalCreditsEarned: 0 }));
  expect(container.querySelector(".summary-details").textContent).toContain("Term GPA: –");
  expect(container.querySelector(".academic-summary").textContent).toContain("Cumulative GPA:–");
});

test("a transcript with no legend note when every grade is a letter", async () => {
  await show(transcript({ semesters: [semester([{ code: "CS101", name: "Programming", creditHours: 3, grade: "A", gradePoints: 4 }])] }));
  expect(container.querySelector(".grade-legend")).toBeNull();
});

test("a student with no registrations at all is told there is no transcript", async () => {
  await show({ hasData: false, student: { name: "Ayesha Khan", rollNumber: "24F-1000" }, semesters: [] });
  expect(container.textContent).toContain("No Transcript Available");
  expect(container.querySelector(".course-table")).toBeNull();
});

test("nothing on the transcript mentions an upgrade", async () => {
  await show(transcript());
  expect(container.textContent).not.toMatch(/upgrade|raw|adjust/i);
});
