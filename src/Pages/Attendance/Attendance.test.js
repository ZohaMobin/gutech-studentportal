import React from "react";
import { createRoot } from "react-dom/client";
import { act } from "react";
import axios from "axios";
import Attendance from "./Attendance";

jest.mock("axios");
jest.mock("lucide-react", () => new Proxy({ __esModule: true }, { get: (target, name) => (name in target ? target[name] : () => null) }));
globalThis.IS_REACT_ACT_ENVIRONMENT = true;

const statuses = ["present", "present", "absent", "late"];
const records = statuses.map((status, i) => ({ date: `2026-09-0${i + 1}T00:00:00.000Z`, slotNumber: 1, durationMinutes: 75, status }));
const summary = { totalClasses: 4, present: 2, absent: 1, late: 1, percentage: 75 };

let container; let root;
const wait = (ms = 0) => act(async () => { await new Promise((r) => setTimeout(r, ms)); });

beforeEach(async () => {
  sessionStorage.setItem("token", "t");
  sessionStorage.setItem("user", JSON.stringify({ studentId: "st1", name: "Ahmed" }));
  axios.get.mockImplementation((url) => {
    if (url.includes("/course-registrations/student/")) return Promise.resolve({ data: { courses: [{ id: "c1", name: "Programming", code: "CS-101", creditHours: 3 }] } });
    if (url.includes("/api/students/attendance/")) return Promise.resolve({ data: { summary, records } });
    return Promise.resolve({ data: [] });
  });
  container = document.createElement("div");
  document.body.appendChild(container);
  root = createRoot(container);
  await act(async () => { root.render(<Attendance />); });
  await wait(30);
});
afterEach(() => { act(() => root.unmount()); container.remove(); jest.clearAllMocks(); });

test("the heading stacks the title over a plain-language subtitle", () => {
  const heading = container.querySelector(".attendance-heading");
  expect(heading.querySelector("h1").textContent).toBe("Attendance");
  expect(heading.querySelector("p").textContent).toBe("Your attendance in each course this semester");
});

// The topbar and the dashboard both define global .header-content and .day-cell rules, which restyled this page's
// heading (title and subtitle side by side) and shaded its Day column. This page uses its own names.
test("it does not use class names that other stylesheets restyle globally", () => {
  expect(container.querySelector(".header-content")).toBeNull();
  expect(container.querySelector(".day-cell")).toBeNull();
  expect(container.querySelectorAll("td.attendance-day-cell").length).toBe(4);
});

test("the five statistics are shown together, each with its own label", () => {
  const cards = [...container.querySelectorAll(".attendance-stats .stat-card")];
  expect(cards.map((c) => c.querySelector(".stat-label").textContent)).toEqual(["Total Classes", "Present", "Absent", "Late", "Attendance %"]);
  expect(cards.map((c) => c.querySelector(".stat-value").textContent)).toEqual(["4", "2", "1", "1", "75.0%"]);
});

test("each record shows its date, day and status", () => {
  const first = container.querySelector(".students-table tbody tr");
  expect(first.querySelector(".date-cell").textContent).toBe("2026-09-04");     // newest first
  expect(first.querySelector(".status-badge").textContent).toBe("Late");
});
