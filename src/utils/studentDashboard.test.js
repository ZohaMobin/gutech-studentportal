import { PASS_PERCENT, attendanceAdvice, attendanceOf, attentionItems, classesOn, clampPercent, courseRows, dateKey, firstNameOf, initialsOf, nextClassAfter, overallAttendance, percent, todaysClasses } from "./studentDashboard";

const cls = (id, course, start, end, name = "Database Systems") => ({ _id: id, courseId: { _id: course, code: "CS", name }, teacherId: { userId: { name: "Dr. T" } }, sectionId: { section: "A" }, timeSlot: { startTime: start, endTime: end, room: "SL" } });
const now = new Date(2026, 9, 15, 11, 20);   // Thursday 15 October 2026, 11:20
const schedule = { Thursday: [cls("c3", "net", "14:00", "15:25", "Networks"), cls("c1", "ds", "08:30", "09:55", "Data Structures"), cls("c2", "db", "10:10", "11:35"), cls("c4", "net", "15:30", "16:00", "Networks")], Monday: [cls("m1", "ds", "09:00", "10:00", "Data Structures")] };
const rec = (date, slot, status) => ({ date: new Date(date).toISOString(), slotNumber: slot, status });

test("names and initials", () => {
  expect(firstNameOf("Syed Ali Khan")).toBe("Ali");
  expect(firstNameOf("Dr. Zoha Mobin")).toBe("Zoha");
  expect(initialsOf("Syed Taloot Munim Khan")).toBe("SK");
  expect(initialsOf("Ali")).toBe("A");
  expect(initialsOf("")).toBe("S");
});

test("a day's classes are in time order and numbered per course", () => {
  const list = classesOn(schedule, now);
  expect(list.map((c) => c.item._id)).toEqual(["c1", "c2", "c3", "c4"]);
  expect(list.map((c) => c.ordinal)).toEqual([0, 0, 0, 1]);
});

test("today's classes: done, live or later, with how a finished one was marked", () => {
  const records = { ds: [rec(2026, 1, "present")].map((r) => ({ ...r, date: new Date(2026, 9, 15, 5).toISOString() })) };
  const list = todaysClasses(schedule, records, now);
  expect(list.map((c) => c.state)).toEqual(["done", "live", "later", "later"]);
  expect(list.map((c) => c.status)).toEqual(["present", null, null, null]);
  expect(list.map((c) => c.next)).toEqual([false, false, true, false]);
  expect(list[2].minutesUntil).toBe(160);
});

test("a class from another day's attendance is not shown as today's", () => {
  const records = { ds: [{ date: new Date(2026, 9, 14, 5).toISOString(), slotNumber: 1, status: "absent" }] };
  expect(todaysClasses(schedule, records, now)[0].status).toBeNull();
});

test("the next class is today's, or the next day that has one", () => {
  expect(nextClassAfter(schedule, now).item._id).toBe("c3");
  const evening = new Date(2026, 9, 15, 20, 0);
  const next = nextClassAfter(schedule, evening);
  expect(next.item._id).toBe("m1");
  expect(dateKey(next.date)).toBe("2026-10-19");
  expect(nextClassAfter({}, now)).toBeNull();
});

test("attendance counts present and late; no classes means no rate, not 0%", () => {
  expect(attendanceOf({ totalClasses: 0 }).rate).toBeNull();
  const a = attendanceOf({ totalClasses: 10, present: 7, late: 1, absent: 2 });
  expect(a).toMatchObject({ total: 10, attended: 8, absent: 2 });
  expect(percent(a.rate)).toBe(80);
});

test("advice: how many classes it takes to recover when below the minimum, nothing otherwise", () => {
  expect(attendanceAdvice({ attended: 11, total: 16 })).toEqual({ level: "below", needed: 4 });        // 15/20 = 75%
  expect(attendanceAdvice({ attended: 23, total: 26 })).toEqual({ level: "ok" });                      // 88%
  expect(attendanceAdvice({ attended: 14, total: 18 })).toEqual({ level: "ok" });                      // 78%: above the minimum, so no warning at all
  expect(attendanceAdvice({ attended: 0, total: 0 })).toEqual({ level: "none" });
});

test("course rows: attendance, clamped marks, and a missing attendance request is not shown as zero", () => {
  const results = [
    { courseId: "db", code: "CS-202", name: "Database Systems", creditHours: 3, totals: { percentageSoFar: 112, gradedWeight: 40, missingCount: 2 }, assessments: [{}, {}, {}, {}] },
    { courseId: "net", code: "CS-306", name: "Networks", creditHours: 3, totals: { percentageSoFar: 0, gradedWeight: 0, missingCount: 3 }, assessments: [{}, {}, {}] },
  ];
  const rows = courseRows(results, { db: { totalClasses: 16, present: 11, late: 0, absent: 5 } });
  expect(rows[0].marks).toEqual({ percent: 100, gradedShare: 0.4, low: false, graded: 2, of: 4 });       // bonus marks never draw a bar past 100%
  expect(rows[0].advice).toEqual({ level: "below", needed: 4 });
  expect(rows[1].marks).toBeNull();                                         // nothing graded yet
  expect(rows[1].attendanceUnavailable).toBe(true);
  expect(rows[1].attendance).toBeNull();
  expect(clampPercent(-4)).toBe(0);
});

test("attention: only courses below the minimum, never a \"you can miss\" message", () => {
  const rows = courseRows([
    { courseId: "a", code: "A", name: "Alpha", totals: {} },
    { courseId: "b", code: "B", name: "Beta", totals: {} },
  ], { a: { totalClasses: 18, present: 14, late: 0, absent: 4 }, b: { totalClasses: 16, present: 11, late: 0, absent: 5 } });
  const items = attentionItems(rows);
  expect(items.map((i) => i.kind)).toEqual(["below"]);
  expect(items[0].detail).toMatch(/Beta · 69% · attend the next 4 classes to recover/);
});

test("overall attendance pools every course that has classes", () => {
  const rows = courseRows([{ courseId: "a", totals: {} }, { courseId: "b", totals: {} }, { courseId: "c", totals: {} }], { a: { totalClasses: 10, present: 9, late: 0, absent: 1 }, b: { totalClasses: 10, present: 5, late: 1, absent: 4 } });
  expect(percent(overallAttendance(rows).rate)).toBe(75);
  expect(overallAttendance([]).rate).toBeNull();
});

test("marks below the pass line are an early warning, but only once a fifth of the course is graded", () => {
  const course = (id, pct, graded, ordinary = 100) => ({ courseId: id, code: id, name: `Course ${id}`, totals: { percentageSoFar: pct, gradedWeight: graded, ordinaryWeight: ordinary, missingCount: 0 } });
  const rows = courseRows([course("a", 38, 40), course("b", 38, 10), course("c", 50, 40), course("d", 49, 25, 50), course("e", 0, 0)], {});
  expect(PASS_PERCENT).toBe(50);
  expect(rows.map((r) => r.marks?.low ?? null)).toEqual([true, false, false, true, null]);      // b: only 10% graded; c: exactly 50% passes; d: 25 of 50 = half graded
  const items = attentionItems(rows);
  expect(items.map((i) => i.kind)).toEqual(["marks", "marks"]);
  expect(items[0].title).toBe("Marks below 50% so far");
  expect(items[0].detail).toBe("Course a · 38% on the 40% graded so far");
  expect(items[0].to).toBe("/main/marks");
});

test("attendance alerts come before marks alerts", () => {
  const rows = courseRows([
    { courseId: "m", name: "Marks problem", totals: { percentageSoFar: 30, gradedWeight: 50, ordinaryWeight: 100, missingCount: 0 } },
    { courseId: "t", name: "Attendance problem", totals: {} },
  ], { t: { totalClasses: 16, present: 11, late: 0, absent: 5 } });
  expect(attentionItems(rows).map((i) => i.kind)).toEqual(["below", "marks"]);
});
