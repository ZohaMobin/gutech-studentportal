import React, { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { CalendarDays } from "lucide-react";
import ErrorState from "../../Components/ErrorState/ErrorState";
import { messageOf } from "../../utils/apiMessage";
import { to12Hour } from "../../utils/timetablePeriods";
import { hasAnyClass } from "../../utils/studentDashboard";
import {
  breaksOf, classesOfDay, courseColors, courseKey, dayAgenda, defaultDay, isSameDay, teacherChipOf, teachersOf, visibleDays, weekAxis, weekDates,
} from "../../utils/timetableView";
import "./ClassSchedule.css";

const apiUrl = process.env.REACT_APP_BACKEND_URL;
const PX_PER_MINUTE = 56 / 60;            // one hour is 56px tall on the week view
const SHORT_CLASS = 50;                    // minutes: a block shorter than this shows only its name and time
const classes = (n) => `${n} ${n === 1 ? "class" : "classes"}`;
const hourLabel = (minutes) => { const h = Math.floor(minutes / 60); const m = minutes % 60; return `${h % 12 || 12}${m ? `:${String(m).padStart(2, "0")}` : ""}${h >= 12 ? "p" : "a"}`; };
const duration = (minutes) => (minutes >= 60 ? `${Math.floor(minutes / 60)}h${minutes % 60 ? ` ${minutes % 60}m` : ""}` : `${minutes} min`);
const timeRange = (item) => `${to12Hour(item.timeSlot.startTime).replace(/ (AM|PM)$/, "")}–${to12Hour(item.timeSlot.endTime)}`;
const roomOf = (item) => (String(item.timeSlot.room || "").toUpperCase() === "ONLINE" ? "Online" : item.timeSlot.room || "");

const useClock = () => {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => { const timer = setInterval(() => setNow(new Date()), 60000); return () => clearInterval(timer); }, []);
  return now;
};

// A phone has no room for five columns: the day view is used there.
const useNarrow = (width = 640) => {
  const query = `(max-width: ${width}px)`;
  const read = () => (typeof window !== "undefined" && typeof window.matchMedia === "function" ? window.matchMedia(query).matches : false);
  const [narrow, setNarrow] = useState(read);
  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") return undefined;
    const list = window.matchMedia(query);
    const onChange = () => setNarrow(list.matches);
    list.addEventListener?.("change", onChange);
    return () => list.removeEventListener?.("change", onChange);
  }, [query]);
  return narrow;
};

// The timetable, and the term it belongs to. The term is only a label: if it cannot be read, the page simply has no pill.
const useTimetable = () => {
  const [state, setState] = useState({ status: "loading" });
  const load = useCallback(async () => {
    setState({ status: "loading" });
    try {
      const user = JSON.parse(sessionStorage.getItem("user") || "null");
      if (!user?.studentId) throw new Error("Please sign in again.");
      const headers = { Authorization: `Bearer ${sessionStorage.getItem("token")}` };
      const fetchSchedule = () => axios.get(`${apiUrl}/api/section-schedules/student/${user.studentId}`, { headers });
      const term = axios.get(`${apiUrl}/api/academic-years/current`, { headers }).then((r) => r.data).catch(() => null);
      let response;
      try { response = await fetchSchedule(); } catch (first) { await new Promise((r) => setTimeout(r, 1200)); response = await fetchSchedule().catch(() => { throw first; }); }   // one quiet second try, for a patchy connection
      if (!response.data) throw new Error("The timetable could not be read.");
      const label = await term;
      setState({ status: "ready", schedule: response.data, term: label?.displayName || (label?.semesterType && label?.year ? `${label.semesterType} ${label.year}` : "") });
    } catch (error) {
      setState({ status: "error", message: messageOf(error, "Failed to fetch schedule") });
    }
  }, []);
  useEffect(() => { load(); }, [load]);
  return [state, load];
};

const Skeleton = () => (
  <div className="tt" aria-busy="true">
    <span className="ld-sr" role="status">Loading your timetable…</span>
    <div className="ld-bar" style={{ height: 30, width: "34%", marginBottom: 18 }} />
    <div className="ld-bar" style={{ height: 420 }} />
  </div>
);

const ClassSchedule = () => {
  const now = useClock();
  const narrow = useNarrow();
  const [state, reload] = useTimetable();
  const [view, setView] = useState("week");
  const [chosenDay, setChosenDay] = useState(null);

  const model = useMemo(() => {
    if (state.status !== "ready") return null;
    const { schedule } = state;
    const days = visibleDays(schedule);
    const dates = weekDates(now, days);
    return { days, dates, axis: weekAxis(schedule, days), colors: courseColors(schedule), any: hasAnyClass(schedule) };
  }, [state, now]);

  if (state.status === "loading") return <Skeleton />;
  if (state.status === "error") return <div className="tt"><div className="tt-card"><ErrorState message={state.message} title={state.message.startsWith("Couldn't reach") ? undefined : "Your timetable could not be loaded"} onRetry={reload} /></div></div>;

  const { schedule, term } = state;
  const { days, dates, axis, colors, any } = model;
  const effectiveView = narrow ? "day" : view;
  const day = chosenDay && days.includes(chosenDay) ? chosenDay : defaultDay(days, schedule, now);
  const colorOf = (item) => colors[courseKey(item)] || {};
  // The agenda cards stay white and carry only the course tone on their left edge; the week blocks are filled with it.
  const accentOf = (item) => { const { "--card-accent": accent } = colorOf(item); return accent ? { "--card-accent": accent } : {}; };

  const header = (
    <header className="tt-header">
      <div className="tt-title">
        <h1>Timetable</h1>
        <p className="tt-sub"><span>Your weekly classes</span>{term && <span className="tt-term">{term}</span>}</p>
      </div>
      {any && !narrow && (
        <div className="tt-seg" role="group" aria-label="View">
          <button type="button" className={view === "week" ? "is-on" : ""} aria-pressed={view === "week"} onClick={() => setView("week")}>Week</button>
          <button type="button" className={view === "day" ? "is-on" : ""} aria-pressed={view === "day"} onClick={() => setView("day")}>Day</button>
        </div>
      )}
    </header>
  );

  if (!any) {
    return (
      <div className="tt">
        {header}
        <div className="tt-card tt-empty"><CalendarDays size={24} aria-hidden="true" /><strong>Your timetable isn't published yet</strong><p>Your classes will appear here once the timetable is set for this term.</p></div>
      </div>
    );
  }

  const weekView = (
    <section className="tt-card tt-week" aria-label="Week view">
      <div className="tt-wkhead" role="row" style={{ gridTemplateColumns: `2.4rem repeat(${days.length}, minmax(0, 1fr))` }}>
        <div />
        {dates.map(({ name, short, date }) => <div key={name} role="columnheader" className={isSameDay(date, now) ? "is-today" : ""}>{short} {date.getDate()}</div>)}
      </div>
      <div className="tt-wkbody" style={{ gridTemplateColumns: `2.4rem repeat(${days.length}, minmax(0, 1fr))` }}>
        <div className="tt-hours" style={{ height: (axis.end - axis.start) * PX_PER_MINUTE }}>
          {axis.ticks.map((tick) => <span key={tick} style={{ top: (tick - axis.start) * PX_PER_MINUTE }}>{hourLabel(tick)}</span>)}
        </div>
        {axis.columns.map(({ day: name, blocks }, index) => {
          const today = isSameDay(dates[index].date, now);
          const nowMinutes = now.getHours() * 60 + now.getMinutes();
          return (
            <div key={name} className={`tt-col ${today ? "is-today" : ""}`} style={{ height: (axis.end - axis.start) * PX_PER_MINUTE }}>
              {axis.ticks.map((tick) => <i key={tick} className="tt-line" style={{ top: (tick - axis.start) * PX_PER_MINUTE }} />)}
              {blocks.length === 0 && <span className="tt-none">No classes</span>}
              {blocks.map(({ item, top, length, lane, cols }) => {
                const startsAt = axis.start + top;
                const live = today && nowMinutes >= startsAt && nowMinutes < startsAt + length;
                const teacher = teacherChipOf(item);
                return (
                  <div
                    key={item._id}
                    className={`tt-blk ${live ? "is-live" : ""} ${length < SHORT_CLASS ? "is-short" : ""}`}
                    style={{ ...colorOf(item), top: top * PX_PER_MINUTE, height: length * PX_PER_MINUTE - 2, left: `${(lane / cols) * 100}%`, width: `calc(${100 / cols}% - 2px)` }}
                    title={`${item.courseId?.name} · ${to12Hour(item.timeSlot.startTime)} – ${to12Hour(item.timeSlot.endTime)} · ${roomOf(item)}${teachersOf(item).length ? ` · ${teachersOf(item).join(", ")}` : ""}`}
                  >
                    <b>{item.courseId?.name}</b>
                    <span>{timeRange(item)} · {roomOf(item)}</span>
                    {teacher && <span className="tt-blk-teacher">{teacher}</span>}
                  </div>
                );
              })}
              {today && nowMinutes >= axis.start && nowMinutes <= axis.end && <div className="tt-now" style={{ top: (nowMinutes - axis.start) * PX_PER_MINUTE }} aria-hidden="true" />}
            </div>
          );
        })}
      </div>
    </section>
  );

  const selected = dates.find((entry) => entry.name === day) || dates[0];
  const isToday = isSameDay(selected.date, now);
  const agenda = dayAgenda(schedule, selected.name, now, isToday);
  const items = classesOfDay(schedule, selected.name);
  const gaps = Object.fromEntries(breaksOf(items).map((gap) => [gap.before, gap.minutes]));
  const dayView = (
    <section aria-label="Day view">
      <div className="tt-days" role="tablist" aria-label="Day">
        {dates.map(({ name, short, date }) => {
          const count = classesOfDay(schedule, name).length;
          return (
            <button key={name} type="button" role="tab" aria-selected={name === selected.name} className={`tt-day ${name === selected.name ? "is-on" : ""} ${isSameDay(date, now) ? "is-today" : ""}`} onClick={() => setChosenDay(name)}>
              <small>{short}</small><b>{date.getDate()}</b><i>{count || "–"}</i>
            </button>
          );
        })}
      </div>
      <div className="tt-day-head"><b>{selected.date.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" })}</b>{items.length > 0 && <span className="tt-note">{classes(items.length)}</span>}</div>
      {items.length === 0 ? (
        <div className="tt-card tt-empty tt-empty-day"><strong>No classes on {selected.name}</strong></div>
      ) : (
        <ol className="tt-agenda">
          {agenda.map(({ item, state: status, next, minutesUntil }) => (
            <React.Fragment key={item._id}>
              {gaps[item._id] && <li className="tt-break" aria-label={`${duration(gaps[item._id])} break`}>{duration(gaps[item._id])} break</li>}
              <li className={`tt-class is-${status}`} style={accentOf(item)}>
                <div className="tt-time"><b>{to12Hour(item.timeSlot.startTime).replace(/ (AM|PM)$/, "")}</b><span>{to12Hour(item.timeSlot.endTime)}</span></div>
                <div className="tt-what">
                  <strong>{item.courseId?.name}{roomOf(item) === "Online" && <em className="tt-online">Online</em>}</strong>
                  <span className="tt-note">{[roomOf(item) === "Online" ? "" : roomOf(item), teachersOf(item).join(", ")].filter(Boolean).join(" · ")}</span>
                </div>
                {status === "live" && <span className="tt-pill is-live">Live now</span>}
                {next && <span className="tt-pill">{minutesUntil < 60 ? `Next · in ${minutesUntil} min` : `Next · in ${duration(minutesUntil)}`}</span>}
              </li>
            </React.Fragment>
          ))}
        </ol>
      )}
    </section>
  );

  return <div className="tt">{header}{effectiveView === "week" ? weekView : dayView}</div>;
};

export default ClassSchedule;
