import React from "react";
import { createRoot } from "react-dom/client";
import { act } from "react";
import axios from "axios";
import Dashboard from "./dashboardPage";

jest.mock("axios");
jest.mock("../ClassSchedule/ClassSchedule", () => () => <div data-testid="schedule">schedule</div>);
globalThis.IS_REACT_ACT_ENVIRONMENT = true;

const student = (over = {}) => ({
  userId: { name: "Ahmed Hassan" }, rollNumber: "26G-BCS001", currentSemester: 3,
  program: { name: "Bachelor of Science in Computer Science", code: "BSCS" },
  department: { name: "Electrical Engineering", code: "EE" },
  ...over,
});
const results = { courses: [{ courseId: "c1", code: "CS101", name: "Programming", totals: { weightedMarks: 10, gradedWeight: 20, percentageSoFar: 50 } }] };
const attendance = { summary: { percentage: "88", totalClasses: 10, present: 9, absent: 1, late: 0 } };

const deferred = () => { let resolve; let reject; const promise = new Promise((res, rej) => { resolve = res; reject = rej; }); return { promise, resolve, reject }; };
let container; let root; let studentReq; let resultsReq;
const wait = (ms = 0) => act(async () => { await new Promise((r) => setTimeout(r, ms)); });

const mount = async ({ width = 1200 } = {}) => {
  window.innerWidth = width;
  studentReq = deferred(); resultsReq = deferred();
  axios.get.mockImplementation((url) => {
    if (url.includes("/api/students/attendance/")) return Promise.resolve({ data: attendance });
    if (url.includes("/api/students/")) return studentReq.promise;
    if (url.includes("/api/results/me")) return resultsReq.promise;
    return Promise.resolve({ data: [] });
  });
  container = document.createElement("div");
  document.body.appendChild(container);
  root = createRoot(container);
  await act(async () => { root.render(<Dashboard />); });
  await wait();
};
const detail = (label) => [...container.querySelectorAll(".detail-item")].find((d) => d.querySelector(".detail-label").textContent === label).querySelector(".detail-value");
const card = (cls) => container.querySelector(`.${cls}`);

beforeEach(() => {
  sessionStorage.setItem("token", "t");
  sessionStorage.setItem("user", JSON.stringify({ studentId: "st1", name: "Ahmed Hassan" }));
  jest.spyOn(console, "error").mockImplementation(() => {});
  jest.spyOn(console, "warn").mockImplementation(() => {});
});
afterEach(() => { act(() => root.unmount()); container.remove(); jest.restoreAllMocks(); });

test("while the record is on its way every detail is an inline placeholder, under the same labels as the loaded page", async () => {
  await mount();
  const labels = [...container.querySelectorAll(".detail-label")].map((l) => l.textContent);
  expect(labels).toEqual(["Roll No:", "Program:", "Semester:", "Department:"]);        // not "Year:", which vanished on load
  for (const label of labels) expect(detail(label).querySelector(".ld-chip")).not.toBeNull();
  expect(container.textContent).not.toContain("st1");                                    // the database id is not a roll number
  expect(container.textContent).not.toMatch(/\bCS\b/);                                   // and no program is assumed
  expect(container.textContent).toContain("Ahmed Hassan");                               // the name is already known from login
});

test("the details appear as soon as the record arrives, while the cards are still loading", async () => {
  await mount();
  await act(async () => { studentReq.resolve({ data: student() }); });
  await wait();
  expect(detail("Roll No:").textContent).toBe("26G-BCS001");
  expect(detail("Program:").textContent).toBe("Bachelor of Science in Computer Science");
  expect(detail("Department:").textContent).toBe("Electrical Engineering");
  expect(detail("Semester:").textContent).toBe("3");
  expect(container.querySelector(".student-details .ld-chip")).toBeNull();
  expect(card("attendance-card").querySelector(".ld-inline")).not.toBeNull();            // still on its way
  expect(card("marks-card").querySelector(".ld-inline")).not.toBeNull();
  expect(container.querySelector('[data-testid="schedule"]')).not.toBeNull();            // the timetable starts loading straight away
});

test("the cards fill in when their data arrives", async () => {
  await mount();
  await act(async () => { studentReq.resolve({ data: student() }); });
  await act(async () => { resultsReq.resolve({ data: results }); });
  await wait(20);
  expect(card("attendance-card").querySelector(".ld-inline")).toBeNull();
  expect(card("attendance-card").textContent).toContain("88%");
  expect(card("marks-card").textContent).toContain("50.0% so far");
});

test("semester 0 is shown as 0, not as missing", async () => {
  await mount();
  await act(async () => { studentReq.resolve({ data: student({ currentSemester: 0 }) }); });
  await wait();
  expect(detail("Semester:").textContent).toBe("0");
});

test("on a small screen the program and department show their own codes, not a hard-coded one", async () => {
  await mount({ width: 500 });
  await act(async () => { studentReq.resolve({ data: student() }); });
  await wait();
  expect(detail("Program:").textContent).toBe("BSCS");
  expect(detail("Department:").textContent).toBe("EE");
});

test("if the record cannot be loaded, the details say N/A and the cards say there is no data", async () => {
  await mount();
  await act(async () => { studentReq.reject(new Error("boom")); });
  await wait();
  for (const label of ["Roll No:", "Program:", "Semester:", "Department:"]) expect(detail(label).textContent).toBe("N/A");
  expect(card("attendance-card").textContent).toContain("No attendance data");
});
