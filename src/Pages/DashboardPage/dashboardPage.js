import React, { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AlertTriangle, CalendarClock, CalendarDays, CheckCircle2, ChevronRight, Clock, GraduationCap, RefreshCw, UserCheck, BookOpen } from "lucide-react";
import { Skeleton } from "../../Components/Loading/Loading";
import { to12Hour } from "../../utils/timetablePeriods";
import { rememberCourse } from "../../utils/dashboardHint";
import {
  DAY_NAMES, MIN_ATTENDANCE, attentionItems, clampPercent, courseRows, firstNameOf, greetingFor, hasAnyClass,
  initialsOf, nextClassAfter, overallAttendance, percent, todaysClasses,
} from "../../utils/studentDashboard";
import "./dashboardPage.css";
import { messageOf } from "../../utils/apiMessage";
import ErrorState from "../../Components/ErrorState/ErrorState";

const apiUrl = process.env.REACT_APP_BACKEND_URL;
const plural = (n, word) => `${n} ${n === 1 ? word : word.endsWith("s") ? `${word}es` : `${word}s`}`;
const empty = (value) => value === undefined || value === null || value === "";
const ATTENTION_SHOWN = 5;
const STATUS_PILLS = { present: ["Present", "is-ok"], late: ["Late", "is-warn"], absent: ["Absent", "is-bad"] };
const readUser = () => { try { return JSON.parse(sessionStorage.getItem("user") || "null"); } catch { return null; } };

// Everything the page needs, loaded in parallel. The student's record, results and timetable arrive first and the page appears;
// each course's attendance follows and fills in. A part that fails says so, instead of looking like "nothing yet".
const useDashboard = () => {
  const [state, setState] = useState({ status: "loading" });
  const load = useCallback(async ({ soft = false } = {}) => {
    if (soft) setState((current) => ({ ...current, refreshing: true })); else setState({ status: "loading" });
    const user = readUser();
    const headers = { Authorization: `Bearer ${sessionStorage.getItem("token")}` };
    if (!user?.studentId) { setState({ status: "error", message: "Please sign in again." }); return; }
    const [student, results, schedule] = await Promise.allSettled([
      axios.get(`${apiUrl}/api/students/${user.studentId}`, { headers }),
      axios.get(`${apiUrl}/api/results/me`, { headers }),
      axios.get(`${apiUrl}/api/section-schedules/student/${user.studentId}`, { headers }),
    ]);
    if ([student, results, schedule].every((r) => r.status === "rejected")) {
      const reason = student.reason;
      setState((current) => (soft && current.status === "ready" ? { ...current, refreshing: false, refreshFailed: true } : { status: "error", message: messageOf(reason, "The dashboard could not be loaded.") }));
      return;
    }
    const resultCourses = results.status === "fulfilled" ? results.value.data?.courses || [] : [];
    const base = {
      status: "ready", user, refreshing: false, refreshFailed: false, updatedAt: new Date(),
      student: student.status === "fulfilled" ? student.value.data : null,
      results: results.status === "fulfilled" ? resultCourses : null,
      schedule: schedule.status === "fulfilled" ? schedule.value.data || {} : null,
      attendance: null, records: {},
    };
    setState((current) => ({ ...base, ...(soft && current.status === "ready" ? { attendance: current.attendance, records: current.records } : {}) }));

    const fetched = await Promise.allSettled(resultCourses.map((course) => axios.get(`${apiUrl}/api/students/attendance/${course.courseId}`, { headers })));
    const attendance = {}; const records = {};
    fetched.forEach((result, index) => {
      const id = String(resultCourses[index].courseId);
      if (result.status === "fulfilled") { attendance[id] = result.value.data?.summary || {}; records[id] = result.value.data?.records || []; }
    });
    setState((current) => ({ ...current, attendance, records }));
  }, []);
  useEffect(() => { load(); }, [load]);
  return [state, load];
};

const useClock = () => {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => { const timer = setInterval(() => setNow(new Date()), 60000); return () => clearInterval(timer); }, []);
  return now;
};

const Skeletons = () => (
  <div className="sd" aria-busy="true">
    <span className="ld-sr" role="status">Loading your dashboard…</span>
    <div className="ld-bar" style={{ height: 30, width: "40%", marginBottom: 18 }} />
    <div className="ld-bar" style={{ height: 72, marginBottom: 16 }} />
    <div className="ld-bar" style={{ height: 92, marginBottom: 20 }} />
    <div className="sd-grid"><div className="ld-bar" style={{ height: 260 }} /><div className="ld-bar" style={{ height: 260 }} /></div>
  </div>
);

const Bar = ({ value, label, tone, marker }) => (
  <div className="sd-bar" role="img" aria-label={label}>
    <i className={tone ? `is-${tone}` : ""} style={{ width: `${clampPercent(value)}%` }} />
    {marker && <u style={{ left: `${marker}%` }} />}
  </div>
);

const Dashboard = () => {
  const navigate = useNavigate();
  const now = useClock();
  const [state, reload] = useDashboard();

  const view = useMemo(() => {
    if (state.status !== "ready") return null;
    const rows = state.results ? courseRows(state.results, state.attendance || {}) : [];
    const attendanceReady = state.attendance !== null;
    const today = state.schedule ? todaysClasses(state.schedule, state.records, now) : [];
    return {
      rows, attendanceReady, today,
      overall: overallAttendance(rows),
      attention: attendanceReady ? attentionItems(rows) : [],
      next: state.schedule && (today.length === 0 || today.every((c) => c.state === "done")) ? nextClassAfter(state.schedule, now) : null,
      hasTimetable: state.schedule ? hasAnyClass(state.schedule) : false,
      credits: rows.reduce((sum, row) => sum + row.creditHours, 0),
    };
  }, [state, now]);

  if (state.status === "loading") return <Skeletons />;
  if (state.status === "error") {
    return (
      <div className="sd">
        <ErrorState message={state.message} onRetry={() => reload()} />
      </div>
    );
  }

  const { user, student, results, schedule } = state;
  const { rows, attendanceReady, today, overall, attention, next, hasTimetable, credits } = view;
  const name = student?.userId?.name || student?.name || user?.name || "";
  const program = typeof student?.program === "object" ? student.program?.name : student?.program;
  const department = typeof student?.department === "object" ? student.department?.name : student?.department;
  const termLabel = results?.find((c) => c.term?.displayName)?.term.displayName || "";
  const dateLabel = now.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" });
  const live = today.filter((c) => c.state === "live").length;
  const done = today.filter((c) => c.state === "done").length;
  const later = today.length - live - done;
  const overallPercent = percent(overall.rate);
  const below = overallPercent !== null && overall.rate < MIN_ATTENDANCE;
  const shown = attention.slice(0, ATTENTION_SHOWN);
  const updated = state.updatedAt ? state.updatedAt.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }) : "";
  const upcoming = today.find((c) => c.state === "live") || today.find((c) => c.next);
  const open = (to, row) => { rememberCourse({ courseId: row?.id, registrationId: results?.find((c) => String(c.courseId) === row?.id)?.registrationId }); navigate(to); };

  const stats = [
    { label: "Classes today", icon: CalendarClock, value: schedule ? today.length : "—", muted: !schedule || today.length === 0, note: !schedule ? "Timetable unavailable" : today.length === 0 ? "A free day" : [done && `${done} done`, live && `${live} live`, later && `${later} to come`].filter(Boolean).join(" · ") },
    { label: "Next class", icon: Clock, value: upcoming ? to12Hour(upcoming.item.timeSlot.startTime) : next ? to12Hour(next.item.timeSlot.startTime) : "—", muted: !upcoming && !next, small: true, note: upcoming ? upcoming.item.courseId?.name : next ? `${DAY_NAMES[next.date.getDay()]} · ${next.item.courseId?.name}` : "Nothing scheduled" },
    { label: "Attendance", icon: UserCheck, value: !attendanceReady ? <Skeleton width="3.5rem" /> : overallPercent === null ? "—" : `${overallPercent}%`, tone: below ? "warn" : "", muted: attendanceReady && overallPercent === null, note: !attendanceReady ? "Loading" : overallPercent === null ? "Starts after your first class" : `Minimum ${Math.round(MIN_ATTENDANCE * 100)}%` },
    { label: "Courses", icon: BookOpen, value: results ? rows.length : "—", muted: !results || rows.length === 0, note: !results ? "Couldn't load" : rows.length === 0 ? "Not registered yet" : `${plural(credits, "credit hour")}` },
  ];

  return (
    <div className="sd">
      <header className="sd-header">
        <div className="sd-title">
          <h1>Dashboard</h1>
          <p className="sd-sub">
            <span className="sd-greet">{greetingFor(now)}{firstNameOf(name) ? `, ${firstNameOf(name)}` : ""}</span>
            <span className="sd-date">{dateLabel}</span>
            {termLabel && <span className="sd-term">{termLabel}</span>}
          </p>
        </div>
      </header>

      <section className="sd-card sd-profile" aria-label="Your details">
        <div className="sd-avatar" aria-hidden="true">{initialsOf(name)}</div>
        <div className="sd-who"><strong>{name || "Student"}</strong><span>{empty(student?.rollNumber) ? "" : student.rollNumber}</span></div>
        <dl className="sd-facts">
          <div><dt>Program</dt><dd>{empty(program) ? "—" : program}</dd></div>
          <div><dt>Department</dt><dd>{empty(department) ? "—" : department}</dd></div>
        </dl>
      </section>

      <section className="sd-card sd-stats" aria-label="Summary">
        {stats.map((stat) => (
          <div className="sd-stat" key={stat.label}>
            <span className={`sd-stat-icon ${stat.tone ? `is-${stat.tone}` : ""}`} aria-hidden="true"><stat.icon size={17} /></span>
            <div className="sd-stat-body">
              <span className="sd-label">{stat.label}</span>
              <strong className={`${stat.small ? "is-small" : ""} ${stat.tone ? `is-${stat.tone}` : ""} ${stat.muted ? "is-muted" : ""}`}>{stat.value}</strong>
              <span className="sd-note">{stat.note}</span>
            </div>
          </div>
        ))}
      </section>

      <div className="sd-grid">
        <section className="sd-card" aria-labelledby="sd-today">
          <div className="sd-card-head"><h2 id="sd-today">Today's classes</h2>{today.length > 0 && <span className="sd-note">{dateLabel}</span>}</div>
          {!schedule ? (
            <div className="sd-quiet is-big"><AlertTriangle size={22} aria-hidden="true" /><p>Couldn't load your timetable.</p><button type="button" className="sd-link" onClick={() => reload({ soft: true })}>Try again</button></div>
          ) : today.length === 0 ? (
            <div className="sd-quiet is-big">
              <CalendarDays size={22} aria-hidden="true" />
              {!hasTimetable ? (
                <p>Your timetable isn't published yet.</p>
              ) : next ? (
                <><p>No classes today.</p><span className="sd-note">Next: {DAY_NAMES[next.date.getDay()]} at {to12Hour(next.item.timeSlot.startTime)} · {next.item.courseId?.name}</span></>
              ) : <p>No classes today.</p>}
              {hasTimetable && <button type="button" className="sd-link" onClick={() => navigate("/main/timetable")}>Full timetable<ChevronRight size={14} aria-hidden="true" /></button>}
            </div>
          ) : (
            <ol className="sd-timeline">
              {today.map(({ item, state: status, status: marked, next: isNext, minutesUntil }) => {
                const pill = marked ? STATUS_PILLS[marked] : null;
                const teacher = item.teacherId?.userId?.name;
                return (
                  <li key={item._id} className={`sd-class is-${status}`}>
                    <div className="sd-class-top">
                      <strong>{item.courseId?.name}</strong>
                      {status === "live" && <span className="sd-pill is-live">Live now</span>}
                      {status === "done" && (pill ? <span className={`sd-pill ${pill[1]}`}>{pill[0]}</span> : <span className="sd-pill">Not recorded yet</span>)}
                      {status === "later" && <span className="sd-pill">{isNext ? (minutesUntil < 60 ? `In ${minutesUntil} min` : "Next") : "Later"}</span>}
                    </div>
                    <span className="sd-note">{to12Hour(item.timeSlot.startTime)} – {to12Hour(item.timeSlot.endTime)} · {item.timeSlot.room}{teacher ? ` · ${teacher}` : ""}</span>
                  </li>
                );
              })}
            </ol>
          )}
        </section>

        <section className="sd-card" aria-labelledby="sd-attention">
          <div className="sd-card-head"><h2 id="sd-attention">Needs your attention</h2>{attention.length > 0 && <span className="sd-pill is-warn">{attention.length}</span>}</div>
          {!results ? (
            <div className="sd-quiet is-big"><AlertTriangle size={22} aria-hidden="true" /><p>Couldn't load your courses.</p><button type="button" className="sd-link" onClick={() => reload({ soft: true })}>Try again</button></div>
          ) : !attendanceReady ? (
            <div className="sd-quiet"><Skeleton width="60%" /></div>
          ) : attention.length === 0 ? (
            <div className="sd-quiet is-ok"><CheckCircle2 size={18} aria-hidden="true" /><p>{rows.length === 0 ? "Nothing to show until you're registered in courses." : "You're all caught up."}</p></div>
          ) : (
            <ul className="sd-attention">
              {shown.map((entry) => (
                <li key={entry.key}>
                  <button type="button" className={entry.kind === "below" ? "is-bad" : "is-warn"} onClick={() => open(entry.to, { id: entry.courseId })}>
                    <span className={`sd-ic ${entry.kind === "below" ? "is-bad" : "is-warn"}`}><AlertTriangle size={15} aria-hidden="true" /></span>
                    <span className="sd-attention-text"><strong>{entry.title}</strong><span className="sd-note">{entry.detail}</span></span>
                    <ChevronRight size={15} aria-hidden="true" className="sd-chev" />
                  </button>
                </li>
              ))}
              {attention.length > shown.length && <li className="sd-more">+{attention.length - shown.length} more</li>}
            </ul>
          )}
        </section>
      </div>

      <section className="sd-card sd-courses" aria-labelledby="sd-courses">
        <div className="sd-card-head"><h2 id="sd-courses">My courses</h2>{termLabel && <span className="sd-note">{termLabel}</span>}</div>
        {!results ? (
          <div className="sd-quiet"><AlertTriangle size={18} aria-hidden="true" /><p>Couldn't load your courses.</p><button type="button" className="sd-link" onClick={() => reload({ soft: true })}>Try again</button></div>
        ) : rows.length === 0 ? (
          <div className="sd-quiet"><GraduationCap size={18} aria-hidden="true" /><p>You're not registered in any courses this term yet.</p></div>
        ) : (
          <>
            <div className="sd-row sd-row-head" aria-hidden="true"><span>Course</span><span>Attendance</span><span>Marks so far</span></div>
            {rows.map((row) => {
              const att = row.attendance;
              const attPercent = att ? percent(att.rate) : null;
              const tone = row.advice.level === "below" ? "warn" : "";
              return (
                <div className="sd-row" key={row.id}>
                  <div className="sd-course"><strong>{row.name}</strong><span className="sd-note">{[row.code, row.creditHours ? plural(row.creditHours, "credit") : ""].filter(Boolean).join(" · ")}</span></div>
                  <button type="button" className="sd-metric" onClick={() => open("/main/attendance", row)}>
                    <span className={`sd-metric-text ${tone ? `is-${tone}` : ""}`}>
                      {!attendanceReady ? <Skeleton width="7rem" /> : row.attendanceUnavailable ? "Couldn't load" : attPercent === null ? "No classes yet" : `${attPercent}% · ${att.attended} of ${plural(att.total, "class")}`}
                    </span>
                    <Bar value={attPercent} tone={tone} marker={Math.round(MIN_ATTENDANCE * 100)} label={attPercent === null ? "No attendance yet" : `${attPercent}% attendance, minimum 75%`} />
                  </button>
                  <button type="button" className="sd-metric" onClick={() => open("/main/marks", row)}>
                    <span className={`sd-metric-text ${row.marks?.low ? "is-warn" : ""}`}>{row.marks ? `${Math.round(row.marks.percent)}%${row.marks.of ? ` · ${row.marks.graded} of ${row.marks.of} graded` : ""}` : "No marks yet"}</span>
                    <Bar value={row.marks ? row.marks.percent : 0} tone={row.marks?.low ? "warn" : ""} label={row.marks ? `${Math.round(row.marks.percent)}% so far` : "No marks yet"} />
                  </button>
                </div>
              );
            })}
          </>
        )}
      </section>

      <div className="sd-foot">
        <span>{state.refreshFailed ? "Couldn't refresh just now" : `Updated ${updated}`}</span>
        <button type="button" className="sd-link" onClick={() => reload({ soft: true })} disabled={state.refreshing}>
          <RefreshCw size={13} className={state.refreshing ? "is-spinning" : ""} aria-hidden="true" />{state.refreshing ? "Refreshing…" : "Refresh"}
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
