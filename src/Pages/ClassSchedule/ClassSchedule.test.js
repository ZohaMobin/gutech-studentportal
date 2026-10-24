import React from "react";
import { createRoot } from "react-dom/client";
import { act } from "react";
import axios from "axios";
import ClassSchedule from "./ClassSchedule";
import { DAY_NAMES } from "../../utils/studentDashboard";

jest.mock("axios");
jest.mock("lucide-react", () => new Proxy({}, { get: () => () => null }));
globalThis.IS_REACT_ACT_ENVIRONMENT = true;

const today = DAY_NAMES[new Date().getDay()];
const pad = (n) => String(Math.max(0, Math.min(23, n))).padStart(2, "0");
const hhmm = (h, m = 0) => `${pad(h)}:${String(m).padStart(2, "0")}`;
const cls = (id, code, name, start, end, room = "SL", teachers = ["Dr. Twaha Minai"]) => ({
  _id: id, courseId: { _id: code, code, name }, sectionId: { section: "A", teacherIds: teachers.map((n) => ({ userId: { name: n } })) },
  teacherId: { _id: "t" + id, userId: { name: teachers[0] } }, timeSlot: { startTime: start, endTime: end, room },
});
const week = {
  Monday: [cls("1", "CS-201", "Data Structures", "09:30", "11:30"), cls("2", "CS-301", "Artificial Intelligence", "12:00", "13:10", "ONLINE", ["Dr. Rauf Malick", "Ms. Sumra Khan"])],
  Tuesday: [], Wednesday: [cls("3", "CS-102", "Web Technologies", "08:30", "09:55", "SL", ["Mr. Umair Khan"]), cls("4", "CS-102", "Web Technologies", "14:00", "15:25", "SL", ["Mr. Umair Khan"])], Thursday: [], Friday: [],
};

let container; let root;
const wait = (ms = 0) => act(async () => { await new Promise((r) => setTimeout(r, ms)); });
const click = async (el) => { await act(async () => { el.dispatchEvent(new MouseEvent("click", { bubbles: true })); }); await wait(); };
const text = () => container.textContent;
const button = (label) => [...container.querySelectorAll("button")].find((b) => b.textContent.trim() === label);

const mount = async ({ schedule = week, fail = false, narrow = false, term = { semesterType: "Fall", year: 2026 } } = {}) => {
  window.matchMedia = jest.fn().mockImplementation(() => ({ matches: narrow, addEventListener: jest.fn(), removeEventListener: jest.fn() }));
  sessionStorage.setItem("token", "t"); sessionStorage.setItem("user", JSON.stringify({ studentId: "st1" }));
  axios.get.mockImplementation(async (url) => {
    if (url.includes("/academic-years/current")) return { data: term };
    if (fail) throw Object.assign(new Error("Network Error"), { request: {}, code: "ERR_NETWORK" });
    return { data: schedule };
  });
  container = document.createElement("div"); document.body.appendChild(container); root = createRoot(container);
  await act(async () => { root.render(<ClassSchedule />); });
  await wait(40);
};
afterEach(() => { act(() => root.unmount()); container.remove(); sessionStorage.clear(); jest.clearAllMocks(); });

test("it opens on the week, in the page's usual frame, with the term beside the title", async () => {
  await mount();
  expect(container.querySelector(".tt h1").textContent).toBe("Timetable");
  expect(container.querySelector(".tt-term").textContent).toBe("Fall 2026");
  expect(container.querySelector(".tt-week")).not.toBeNull();
  expect(container.querySelector(".tt-agenda")).toBeNull();
  expect(button("Week").getAttribute("aria-pressed")).toBe("true");
});

test("classes sit on their own times: the axis starts at the first class and an online class says so", async () => {
  await mount();
  const hours = [...container.querySelectorAll(".tt-hours span")].map((s) => s.textContent);
  expect(hours[0]).toBe("8:30a");                       // not 8:00
  const names = [...container.querySelectorAll(".tt-blk b")].map((b) => b.textContent);
  expect(names).toEqual(["Data Structures", "Artificial Intelligence", "Web Technologies", "Web Technologies"]);
  expect(text()).toContain("12:00–1:10 PM · Online");
  expect(text()).toContain("9:30–11:30 AM · SL");        // a class that is not on a standard period keeps its own time
  expect(text()).toMatch(/Rauf Malick \+1/);              // two teachers: the first, and +1
  expect(text()).toMatch(/Umair Khan/);
  expect(text()).toContain("No classes");                 // an empty day says so
});

test("the Day view has a tab per day, today's class states, breaks, and every teacher", async () => {
  const todays = { ...week, Monday: [], Tuesday: [], Wednesday: [], Thursday: [], Friday: [], Saturday: [], Sunday: [] };
  const now = new Date();
  const earlier = hhmm(now.getHours() - 3); const earlierEnd = hhmm(now.getHours() - 2);
  const liveStart = hhmm(now.getHours()); const liveEnd = hhmm(now.getHours(), 59);
  todays[today] = [cls("a", "CS-1", "Databases", earlier, earlierEnd), cls("b", "CS-2", "Networks", liveStart, liveEnd, "SL", ["Dr. A", "Mr. B"])];
  await mount({ schedule: todays });
  await click(button("Day"));
  expect(container.querySelector(".tt-agenda")).not.toBeNull();
  expect(container.querySelectorAll('.tt-days [role="tab"]').length).toBe(now.getDay() === 0 || now.getDay() === 6 ? 6 : 5);       // a weekend day shows once it has a class
  const weekend = now.getDay() === 0 || now.getDay() === 6;               // at the weekend the coming week is shown, so nothing is live
  if (!weekend && now.getHours() >= 3 && now.getHours() < 23) {
    expect(text()).toContain("Live now");
    expect(text()).toContain("Dr. A, Mr. B");
    expect(container.querySelector(".tt-break")).not.toBeNull();
  }
});

test("choosing another day shows that day's agenda, and a day without classes says so", async () => {
  await mount();
  await click(button("Day"));
  const tabs = [...container.querySelectorAll('.tt-days [role="tab"]')];
  const wednesday = tabs[2];
  await click(wednesday);
  expect(text()).toContain("Web Technologies");
  expect(text()).toMatch(/8:30/);
  expect(text()).toContain("4h 5m break");                 // 9:55 to 2:00
  await click(tabs[1]);
  expect(text()).toContain("No classes on Tuesday");
});

test("on a phone only the Day view is offered", async () => {
  await mount({ narrow: true });
  expect(container.querySelector(".tt-week")).toBeNull();
  expect(container.querySelector(".tt-agenda, .tt-empty")).not.toBeNull();
  expect(container.querySelector(".tt-seg")).toBeNull();
});

test("a timetable that is not published yet says so, calmly", async () => {
  await mount({ schedule: { Monday: [], Tuesday: [], Wednesday: [], Thursday: [], Friday: [] } });
  expect(text()).toContain("Your timetable isn't published yet");
  expect(container.querySelector(".tt-seg")).toBeNull();
});

test("with no internet it says so in plain words and offers to try again", async () => {
  await mount({ fail: true });
  await wait(1500);                                      // the page quietly tries a second time first
  expect(container.querySelector('[role="alert"]').textContent).toContain("Couldn't reach the server. Check your internet connection and try again.");
  expect(container.querySelector(".es-btn")).not.toBeNull();
  expect(text()).not.toMatch(/Network Error|Max retries/);
});
