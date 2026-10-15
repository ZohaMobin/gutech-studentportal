// What the student dashboard shows, worked out from data the portal already loads: the timetable, each course's attendance
// and the marks entered so far. Pure functions, so every rule can be tested without a screen.

export const MIN_ATTENDANCE = 0.75;       // the university's minimum
export const PASS_PERCENT = 50;            // marks below this, on what has been graded so far, are an early warning
const MIN_GRADED_SHARE = 0.2;              // ...but only once a fifth of the course is graded: one early quiz says little
export const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const TITLES = new Set(["dr", "mr", "ms", "mrs", "prof", "professor", "molana", "engr", "hafiz", "syed", "syeda"]);

const pad = (n) => String(n).padStart(2, "0");
export const dateKey = (date) => `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
export const minutesOf = (time) => { const [h, m] = String(time || "").split(":").map(Number); return h * 60 + (m || 0); };
const nowMinutes = (now) => now.getHours() * 60 + now.getMinutes();
const idOf = (value) => String(value?._id ?? value ?? "");

export const greetingFor = (now) => (now.getHours() < 12 ? "Good morning" : now.getHours() < 17 ? "Good afternoon" : "Good evening");

export const firstNameOf = (name = "") => {
  const words = String(name).trim().split(/\s+/).filter(Boolean);
  return words.find((word) => !TITLES.has(word.toLowerCase().replace(/\./g, ""))) || words[0] || "";
};

// At most two letters: first and last name. "Syed Taloot Munim Khan" is "SK", not "STMK".
export const initialsOf = (name = "") => {
  const words = String(name).trim().split(/\s+/).filter(Boolean);
  if (!words.length) return "S";
  const first = words[0][0];
  const last = words.length > 1 ? words[words.length - 1][0] : "";
  return (first + last).toUpperCase();
};

export const percent = (rate) => (rate === null || rate === undefined || Number.isNaN(rate) ? null : Math.round(rate * 100));
export const clampPercent = (value) => Math.max(0, Math.min(100, Number(value) || 0));

// The server's student timetable is { Monday: [{ timeSlot: { startTime, endTime, room }, courseId, teacherId, sectionId }] }.
export const classesOn = (schedule, date) => {
  const list = [...(schedule?.[DAY_NAMES[date.getDay()]] || [])]
    .filter((item) => item?.timeSlot?.startTime && item?.timeSlot?.endTime)
    .sort((a, b) => minutesOf(a.timeSlot.startTime) - minutesOf(b.timeSlot.startTime));
  const seen = {};
  // `ordinal` is which class of that course this is on the day (0 = first), to match it with that day's attendance slot.
  return list.map((item) => { const key = idOf(item.courseId); const ordinal = seen[key] || 0; seen[key] = ordinal + 1; return { item, courseKey: key, ordinal }; });
};

export const hasAnyClass = (schedule) => Object.values(schedule || {}).some((list) => Array.isArray(list) && list.length > 0);

// recordsByCourse: { courseId: [{ date, slotNumber, status }] }. A finished class shows how it was marked, or null if it was not yet.
export const todaysClasses = (schedule, recordsByCourse, now) => {
  const today = dateKey(now);
  const minutes = nowMinutes(now);
  const classes = classesOn(schedule, now).map(({ item, courseKey, ordinal }) => {
    const start = minutesOf(item.timeSlot.startTime);
    const end = minutesOf(item.timeSlot.endTime);
    const state = minutes >= end ? "done" : minutes >= start ? "live" : "later";
    const slotsToday = (recordsByCourse[courseKey] || []).filter((record) => dateKey(new Date(record.date)) === today).sort((a, b) => a.slotNumber - b.slotNumber);
    return { item, courseKey, state, status: slotsToday[ordinal]?.status || null, minutesUntil: start - minutes };
  });
  const firstLater = classes.findIndex((entry) => entry.state === "later");
  return classes.map((entry, index) => ({ ...entry, next: index === firstLater }));
};

// The first class after `now`, on a later day when today is finished.
export const nextClassAfter = (schedule, now) => {
  for (let ahead = 0; ahead <= 7; ahead += 1) {
    const day = new Date(now.getFullYear(), now.getMonth(), now.getDate() + ahead);
    const found = classesOn(schedule, day).find(({ item }) => ahead > 0 || minutesOf(item.timeSlot.startTime) > nowMinutes(now));
    if (found) return { ...found, daysAhead: ahead, date: day };
  }
  return null;
};

// Present or late counts as attended. rate is null while nothing has been marked, so the screen shows a dash, not 0%.
export const attendanceOf = (summary) => {
  const total = Number(summary?.totalClasses) || 0;
  const attended = (Number(summary?.present) || 0) + (Number(summary?.late) || 0);
  return { total, attended, absent: Number(summary?.absent) || 0, rate: total ? attended / total : null };
};

// Below the minimum: how many more classes must be attended in a row to get back to it. Above it there is nothing to say.
export const attendanceAdvice = ({ attended, total }) => {
  if (!total) return { level: "none" };
  const rate = attended / total;
  if (rate < MIN_ATTENDANCE) {
    const needed = Math.ceil((MIN_ATTENDANCE * total - attended) / (1 - MIN_ATTENDANCE));
    return { level: "below", needed };
  }
  return { level: "ok" };
};

const plural = (n, word) => `${n} ${n === 1 ? word : word.endsWith("s") ? `${word}es` : `${word}s`}`;

// One line per course for the table: attendance and marks so far. `attendance` may be null if it could not be loaded.
export const courseRows = (results = [], attendanceByCourse = {}) => results.map((course) => {
  const id = idOf(course.courseId);
  const known = attendanceByCourse[id] || null;
  const att = known ? attendanceOf(known) : null;
  const rows = Array.isArray(course.assessments) ? course.assessments : [];
  const gradedWeight = course.totals?.gradedWeight || 0;
  const hasMarks = typeof course.totals?.percentageSoFar === "number" && gradedWeight > 0;
  const wholeWeight = course.totals?.ordinaryWeight > 0 ? course.totals.ordinaryWeight : 100;
  const gradedShare = Math.min(1, gradedWeight / wholeWeight);
  return {
    id, code: course.code, name: course.name, creditHours: course.creditHours || 0,
    attendance: att, attendanceUnavailable: !known,
    advice: att ? attendanceAdvice(att) : { level: "none" },
    marks: hasMarks ? { percent: clampPercent(course.totals.percentageSoFar), gradedShare, low: course.totals.percentageSoFar < PASS_PERCENT && gradedShare >= MIN_GRADED_SHARE, graded: rows.length ? rows.length - (course.totals.missingCount || 0) : null, of: rows.length || null } : null,
  };
});

// What needs the student: courses below the minimum attendance first, then courses whose marks so far are below the pass line.
export const attentionItems = (rows) => {
  const items = [];
  for (const row of rows) {
    const label = row.code ? `${row.name}` : row.name;
    if (row.advice.level === "below") items.push({ key: `below-${row.id}`, kind: "below", title: "Attendance below 75%", detail: `${label} · ${percent(row.attendance.rate)}% · attend the next ${plural(row.advice.needed, "class")} to recover`, to: "/main/attendance", courseId: row.id });
  }
  for (const row of rows) {
    if (row.marks?.low) items.push({ key: `marks-${row.id}`, kind: "marks", title: `Marks below ${PASS_PERCENT}% so far`, detail: `${row.name} · ${Math.round(row.marks.percent)}% on the ${Math.round(row.marks.gradedShare * 100)}% graded so far`, to: "/main/marks", courseId: row.id });
  }
  return items;
};

export const overallAttendance = (rows) => {
  const known = rows.filter((row) => row.attendance && row.attendance.total > 0);
  const total = known.reduce((sum, row) => sum + row.attendance.total, 0);
  const attended = known.reduce((sum, row) => sum + row.attendance.attended, 0);
  return { total, attended, rate: total ? attended / total : null };
};
