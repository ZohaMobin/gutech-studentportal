import { teacherChipOf, teachersOf, breaksOf, classesOfDay, courseColors, dayAgenda, defaultDay, isSameDay, layoutDay, visibleDays, weekAxis, weekDates } from "./timetableView";

const cls = (id, code, name, start, end, room = "SL") => ({ _id: id, courseId: { _id: "c" + code, code, name }, teacherId: { userId: { name: "Dr. T" } }, sectionId: { section: "A" }, timeSlot: { startTime: start, endTime: end, room } });
const schedule = {
  Monday: [cls("2", "CS-201", "Data Structures", "10:10", "11:35"), cls("1", "CS-202", "Databases", "08:30", "09:55")],
  Tuesday: [cls("3", "CS-202", "Databases", "08:30", "09:55")],
  Saturday: [cls("4", "CS-103", "Discrete", "09:00", "10:30")],
};
const monday = new Date(2026, 9, 19, 10, 30);   // Monday 19 October 2026, 10:30

test("Monday to Friday always show; a weekend day only when it has a class", () => {
  expect(visibleDays({})).toEqual(["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]);
  expect(visibleDays(schedule)).toEqual(["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]);
});

test("the shown week has the right dates, and a weekend shows the coming week", () => {
  const days = ["Monday", "Tuesday", "Friday"];
  expect(weekDates(monday, days).map((d) => d.date.getDate())).toEqual([19, 20, 23]);
  const thursday = new Date(2026, 9, 22);
  expect(weekDates(thursday, days).map((d) => d.date.getDate())).toEqual([19, 20, 23]);
  const saturday = new Date(2026, 9, 24);
  expect(weekDates(saturday, days).map((d) => d.date.getDate())).toEqual([26, 27, 30]);
  expect(weekDates(new Date(2026, 9, 25), ["Monday"]).map((d) => d.date.getDate())).toEqual([26]);   // Sunday: the day after is Monday
  expect(isSameDay(weekDates(monday, days)[0].date, monday)).toBe(true);
});

test("the page opens on today, or on the first day with classes at the weekend", () => {
  const days = visibleDays(schedule);
  expect(defaultDay(days, schedule, monday)).toBe("Monday");
  expect(defaultDay(days, schedule, new Date(2026, 9, 21))).toBe("Wednesday");        // a weekday with no class is still today
  expect(defaultDay(["Monday", "Tuesday"], schedule, new Date(2026, 9, 25))).toBe("Monday");
});

test("a day's classes are in time order", () => {
  expect(classesOfDay(schedule, "Monday").map((c) => c._id)).toEqual(["1", "2"]);
  expect(classesOfDay(schedule, "Friday")).toEqual([]);
});

test("today's agenda says what is done, live and next; another day has no live state", () => {
  const today = dayAgenda(schedule, "Monday", monday, true);
  expect(today.map((e) => e.state)).toEqual(["done", "live"]);
  const earlier = dayAgenda(schedule, "Monday", new Date(2026, 9, 19, 7, 0), true);
  expect(earlier.map((e) => [e.state, e.next])).toEqual([["later", true], ["later", false]]);
  expect(earlier[0].minutesUntil).toBe(90);
  expect(dayAgenda(schedule, "Monday", monday, false).map((e) => [e.state, e.next])).toEqual([["later", false], ["later", false]]);
});

test("the axis starts at the first class and ends at the last, to the half hour, with no empty strip above", () => {
  const axis = weekAxis(schedule, ["Monday", "Tuesday"]);
  expect(axis.start).toBe(8 * 60 + 30);                 // 8:30, not 8:00
  expect(axis.end).toBe(12 * 60);                       // the last class ends 11:35
  expect(axis.ticks).toEqual([8 * 60 + 30, 9 * 60, 10 * 60, 11 * 60, 12 * 60]);
  expect(weekAxis({}, ["Monday"])).toBeNull();
  const late = weekAxis({ Monday: [cls("9", "X", "Late", "09:30", "11:30"), cls("8", "Y", "Evening", "16:00", "17:10")] }, ["Monday"]);
  expect([late.start, late.end]).toEqual([9 * 60 + 30, 17 * 60 + 30]);
});

test("every class sits at its own start and length, whatever its period", () => {
  const odd = { Monday: [cls("a", "WT", "Web Tech", "09:30", "11:30"), cls("b", "AI", "AI online", "12:00", "13:10", "ONLINE"), cls("c", "CN", "Networks", "13:30", "16:35")] };
  const axis = weekAxis(odd, ["Monday"]);
  const [web, online, networks] = axis.columns[0].blocks;
  expect([web.top, web.length]).toEqual([0, 120]);                       // 9:30 is the top of the axis; two hours long
  expect([online.top, online.length]).toEqual([150, 70]);                // starts at 12:00, not at an 11:45 period
  expect(networks.length).toBe(185);
  expect(axis.columns[0].blocks.every((b) => b.cols === 1 && b.lane === 0)).toBe(true);
});

test("classes that overlap share the width side by side, and a later class goes back to full width", () => {
  const clash = layoutDay([cls("a", "A", "One", "09:00", "10:30"), cls("b", "B", "Two", "10:00", "11:00"), cls("c", "C", "Three", "10:15", "10:45"), cls("d", "D", "Later", "12:00", "13:00")], 540);
  expect(clash.map((b) => [b.item._id, b.lane, b.cols])).toEqual([["a", 0, 3], ["b", 1, 3], ["c", 2, 3], ["d", 0, 1]]);
});

test("breaks of 15 minutes or more are listed, and shorter ones are not", () => {
  const day = classesOfDay({ Monday: [cls("1", "A", "A", "08:30", "09:55"), cls("2", "B", "B", "10:10", "11:35"), cls("3", "C", "C", "11:45", "13:10"), cls("4", "D", "D", "14:00", "15:25")] }, "Monday");
  expect(breaksOf(day)).toEqual([{ before: "2", minutes: 15 }, { before: "4", minutes: 50 }]);
});

test("each course has one tone from the portal's palette, and a lab shares its theory course's tone, deeper", () => {
  const colors = courseColors({ Monday: [cls("1", "CS-301", "AI", "08:30", "09:55"), cls("2", "CS-301L", "AI Lab", "10:10", "11:35"), cls("3", "CS-202", "DB", "11:45", "13:10")] });
  expect(new Set(Object.values(colors).map((c) => c["--card-accent"])).size).toBe(2);       // the lab shares the AI course's tone
  expect(colors["CS-301"]["--card-accent"]).toBe(colors["CS-301L"]["--card-accent"]);
  expect(colors["CS-301"]["--card-bg"]).toMatch(/, 0\.12\)$/);
  expect(colors["CS-301L"]["--card-bg"]).toMatch(/, 0\.2\)$/);                                // a little deeper than the theory course
  expect(colors["CS-202"]["--card-accent"]).not.toBe(colors["CS-301"]["--card-accent"]);
});

test("colours do not depend on the order the rows arrive in, and never use gold", () => {
  const rows = [cls("1", "CS-301", "AI", "08:30", "09:55"), cls("3", "CS-202", "DB", "11:45", "13:10"), cls("2", "CS-103", "Discrete", "10:10", "11:35")];
  const one = courseColors({ Monday: rows });
  const two = courseColors({ Friday: [...rows].reverse() });
  expect(one).toEqual(two);
  const golds = ["#f5c32c", "#ecd07a", "#b45309"];
  expect(Object.values(one).some((c) => golds.includes(c["--card-accent"]))).toBe(false);
  const many = courseColors({ Monday: Array.from({ length: 12 }, (_, i) => cls(String(i), `CS-${100 + i}`, "X", "08:30", "09:55")) });
  expect(Object.keys(many).length).toBe(12);                                                // more courses than tones: the tones repeat, nothing breaks
});

test("teachers: the row's teacher first, then the section's others, never twice; a small chip shortens them", () => {
  const one = cls("1", "A", "A", "08:30", "09:55");
  expect(teachersOf(one)).toEqual(["Dr. T"]);
  expect(teacherChipOf(one)).toBe("T");
  const shared = { ...one, teacherId: { userId: { name: "Mr. Khalid Siddiqui" } }, sectionId: { section: "A", teacherIds: [{ userId: { name: "Mr. Khalid Siddiqui" } }, { userId: { name: "Ms. Sajida Tabssum" } }] } };
  expect(teachersOf(shared)).toEqual(["Mr. Khalid Siddiqui", "Ms. Sajida Tabssum"]);
  expect(teacherChipOf(shared)).toBe("Khalid Siddiqui +1");
  expect(teacherChipOf({ ...one, teacherId: null })).toBe("");
});
