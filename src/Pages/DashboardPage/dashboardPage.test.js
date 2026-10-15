import React from "react";
import { createRoot } from "react-dom/client";
import { act } from "react";
import axios from "axios";
import Dashboard from "./dashboardPage";
import { DAY_NAMES } from "../../utils/studentDashboard";

jest.mock("axios");
jest.mock("lucide-react", () => new Proxy({}, { get: () => () => null }));
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({ useNavigate: () => mockNavigate }), { virtual: true });
globalThis.IS_REACT_ACT_ENVIRONMENT = true;

const todayName = DAY_NAMES[new Date().getDay()];
const student = { userId: { name: "Syed Ali Hassan Khan" }, rollNumber: "26G-BCS001", currentSemester: 3, CGPA: 3.4, program: { name: "BS Computer Science", code: "BSCS" }, department: { name: "Computer Science", code: "CS" } };
const course = (id, code, name, over = {}) => ({ courseId: id, registrationId: `reg-${id}`, code, name, creditHours: 3, term: { displayName: "Fall 2026" }, totals: { percentageSoFar: 0, gradedWeight: 0, missingCount: 0 }, assessments: [], ...over });
const summary = (total, present, late = 0) => ({ summary: { totalClasses: total, present, late, absent: total - present - late, percentage: 0 }, records: [] });
const klass = (id, courseId, name, start, end) => ({ _id: id, courseId: { _id: courseId, code: "X", name }, teacherId: { userId: { name: "Dr. T" } }, sectionId: { section: "A" }, timeSlot: { startTime: start, endTime: end, room: "SL" } });

let container; let root;
const wait = (ms = 0) => act(async () => { await new Promise((r) => setTimeout(r, ms)); });
const click = (el) => act(async () => { el.dispatchEvent(new MouseEvent("click", { bubbles: true })); });
const text = () => container.textContent;

const mount = async ({ results = { courses: [] }, schedule = {}, attendance = {}, fail = [] } = {}) => {
  sessionStorage.setItem("token", "t");
  sessionStorage.setItem("user", JSON.stringify({ studentId: "st1", name: "Syed Ali Hassan Khan" }));
  axios.get.mockImplementation(async (url) => {
    const failing = fail.some((part) => url.includes(part));
    if (failing) throw Object.assign(new Error("boom"), { response: { data: { message: "Server is down" } } });
    if (url.includes("/api/students/attendance/")) return { data: attendance[url.split("/").pop()] || summary(0, 0) };
    if (url.includes("/api/students/")) return { data: student };
    if (url.includes("/api/results/me")) return { data: results };
    if (url.includes("/section-schedules/student/")) return { data: schedule };
    return { data: {} };
  });
  container = document.createElement("div");
  document.body.appendChild(container);
  root = createRoot(container);
  await act(async () => { root.render(<Dashboard />); });
  await wait(30);
};
beforeEach(() => { jest.spyOn(console, "error").mockImplementation(() => {}); });
afterEach(() => { act(() => root.unmount()); container.remove(); sessionStorage.clear(); jest.restoreAllMocks(); jest.clearAllMocks(); });

test("the page never shows the semester or the CGPA, whatever the record says", async () => {
  await mount({ results: { courses: [course("a", "CS-1", "Databases")] } });
  expect(text()).not.toMatch(/semester/i);
  expect(text()).not.toMatch(/cgpa|gpa/i);
  expect(text()).not.toContain("3.4");
  expect(text()).toMatch(/Program\s*BS Computer Science/);
  expect(text()).toMatch(/Fall 2026/);
});

test("the avatar shows two initials, not one per name", async () => {
  await mount();
  expect(container.querySelector(".sd-avatar").textContent).toBe("SK");
  expect(text()).toMatch(/, Ali/);       // the title "Syed" is skipped: it is not the first name
});

test("a brand-new student: dashes and plain messages, not fake zeros", async () => {
  await mount({ results: { courses: [] }, schedule: {} });
  expect(text()).toMatch(/Attendance—/);
  expect(text()).toMatch(/Courses—|Courses0/);
  expect(text()).toMatch(/Your timetable isn't published yet/);
  expect(text()).toMatch(/not registered in any courses/);
  expect(text()).not.toMatch(/0%/);
});

test("attendance below the minimum is flagged with how many classes it takes to recover, and the bar carries the 75% line", async () => {
  await mount({
    results: { courses: [course("a", "CS-1", "Databases", { totals: { percentageSoFar: 130, gradedWeight: 40, missingCount: 1 }, assessments: [{}, {}, {}] }), course("b", "CS-2", "Networks")] },
    attendance: { a: summary(16, 11), b: summary(10, 10) },
  });
  expect(text()).toMatch(/Attendance below 75%/);
  expect(text()).toMatch(/Databases · 69% · attend the next 4 classes to recover/);
  expect(text()).toMatch(/Attendance81%/);                            // 21 of 26 classes, pooled
  expect(text()).toMatch(/Minimum 75%/);
  expect(container.querySelectorAll(".sd-bar u").length).toBe(2);     // the 75% marker on each attendance bar
  const marksBar = [...container.querySelectorAll(".sd-metric")][1].querySelector("i");
  expect(marksBar.style.width).toBe("100%");                           // bonus marks never draw a bar past full
  expect(text()).toMatch(/100% · 2 of 3 graded/);
});

test("a request that fails says so, instead of looking like there is nothing", async () => {
  await mount({ fail: ["/api/results/me"] });
  expect(text()).toMatch(/Couldn't load your courses/);
  expect(text()).not.toMatch(/You're all caught up/);
});

test("one course whose attendance cannot be loaded does not break the others", async () => {
  await mount({ results: { courses: [course("a", "CS-1", "Databases"), course("b", "CS-2", "Networks")] }, attendance: { a: summary(10, 9) }, fail: ["/attendance/b"] });
  expect(text()).toMatch(/90% · 9 of 10 classes/);
  expect(text()).toMatch(/Couldn't load/);
});

test("today's classes show the live class and how finished ones were marked, with the teacher", async () => {
  const now = new Date();
  const hh = (n) => `${String(Math.min(Math.max(now.getHours() + n, 0), 23)).padStart(2, "0")}:00`;
  const records = [{ date: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 5).toISOString(), slotNumber: 1, status: "present" }];
  await mount({
    results: { courses: [course("a", "CS-1", "Databases")] },
    schedule: { [todayName]: [klass("1", "a", "Databases", "00:00", "00:01"), klass("2", "a", "Databases", hh(0), `${String(Math.min(now.getHours() + 1, 23)).padStart(2, "0")}:59`)] },
    attendance: { a: { ...summary(1, 1), records } },
  });
  expect(text()).toMatch(/Dr\. T/);
  expect(text()).toMatch(/Present/);
  expect(text()).toMatch(/Live now/);
});

test("a row opens Attendance on that course", async () => {
  await mount({ results: { courses: [course("a", "CS-1", "Databases")] }, attendance: { a: summary(10, 9) } });
  await click([...container.querySelectorAll(".sd-metric")][0]);
  expect(mockNavigate).toHaveBeenCalledWith("/main/attendance");
  expect(JSON.parse(sessionStorage.getItem("dashboard:course"))).toEqual({ courseId: "a", registrationId: "reg-a" });
});

test("everything failing shows a retry, and retrying loads again", async () => {
  await mount({ fail: ["/api/"] });
  expect(container.querySelector('[role="alert"]').textContent).toMatch(/Server is down/);
  axios.get.mockClear();
  await click(container.querySelector(".es-btn"));
  await wait(10);
  expect(axios.get).toHaveBeenCalled();
});

test("refresh fetches again without going back to the skeleton", async () => {
  await mount({ results: { courses: [course("a", "CS-1", "Databases")] }, attendance: { a: summary(10, 9) } });
  axios.get.mockClear();
  await click(container.querySelector(".sd-foot .sd-link"));
  expect(container.querySelector('[aria-busy="true"]')).toBeNull();
  await wait(30);
  expect(axios.get).toHaveBeenCalled();
  expect(text()).toMatch(/Updated \d\d:\d\d/);
});

test("low marks show up in Needs your attention and turn the marks figure amber", async () => {
  await mount({
    results: { courses: [course("a", "CS-1", "Databases", { totals: { percentageSoFar: 38, gradedWeight: 40, ordinaryWeight: 100, missingCount: 1 }, assessments: [{}, {}, {}] })] },
    attendance: { a: summary(10, 10) },
  });
  expect(text()).toMatch(/Marks below 50% so far/);
  expect(text()).toMatch(/Databases · 38% on the 40% graded so far/);
  expect(container.querySelector(".sd-metric-text.is-warn").textContent).toMatch(/38%/);
  await click(container.querySelector(".sd-attention button"));
  expect(mockNavigate).toHaveBeenCalledWith("/main/marks");
});
