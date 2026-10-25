import React from "react";
import "./Loading.css";

// Placeholders shaped like the screens they stand in for, so the page does not jump when the data arrives. Each reuses the real
// screen's own container classes where it can, so the spacing and the phone layout are the real ones.
const Bar = ({ w, h, className = "" }) => <span className={`ld-bar sk-b ${className}`} style={{ width: w, height: h }} />;
const Status = ({ label }) => <span className="ld-sr" role="status">{label}…</span>;

// Attendance: the course list on the left, the date filter, five figures and the records on the right.
export const CourseListSkeleton = () => (
  <div className="sk-courses" aria-busy="true">
    <Status label="Loading courses" />
    {[62, 78, 54, 70].map((w, i) => (
      <div key={i} className="sk-course"><Bar w={`${w}%`} h={14} /><Bar w="34%" h={10} /></div>
    ))}
  </div>
);

export const AttendanceSkeleton = () => (
  <div className="sk-attendance" aria-busy="true">
    <Status label="Loading attendance" />
    <div className="sk-controls"><Bar w="11rem" h={40} /><Bar h={40} className="sk-grow" /></div>
    <div className="sk-stats">
      {[0, 1, 2, 3, 4].map((i) => <div key={i} className="sk-stat"><Bar w="38%" h={24} /><Bar w="62%" h={10} /></div>)}
    </div>
    <div className="sk-card sk-records">
      <div className="sk-thead"><Bar w="16%" h={11} /><Bar w="12%" h={11} /><Bar w="14%" h={11} /><Bar w="12%" h={11} /></div>
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="sk-line"><Bar w="22%" h={14} /><Bar w="14%" h={14} /><Bar w="16%" h={14} /><Bar w="5.5rem" h={24} className="sk-pill" /></div>
      ))}
    </div>
  </div>
);

// Marks: course tabs, the assessment-type bar, the table (seven centred columns) and the "Total so far" card.
const Cols = ({ n, h, w = "46%", first, className = "" }) => (
  <div className={`sk-cols ${className}`} style={{ gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))` }}>
    {Array.from({ length: n }, (_, i) => <span key={i} className="sk-cell"><Bar w={i === 0 && first ? first : w} h={h} /></span>)}
  </div>
);
export const MarksSkeleton = () => (
  <div className="sk-marks" aria-busy="true">
    <Status label="Loading marks" />
    <div className="sk-tabs">{[17, 14, 15].map((w, i) => <Bar key={i} w={`${w}rem`} h={38} className="sk-course-tab" />)}</div>
    <div className="sk-card sk-typebar"><Cols n={5} h={12} w="5.5rem" /><span className="sk-underline" /></div>
    <div className="sk-card sk-grid">
      <Cols n={7} h={11} className="sk-head" />
      {[0, 1, 2].map((i) => <Cols key={i} n={7} h={13} w="2.2rem" first="3.5rem" className="sk-row" />)}
    </div>
    <div className="sk-card sk-total">
      <span className="sk-total-title"><Bar w="9rem" h={20} /></span>
      <div className="sk-grid sk-total-grid">
        <Cols n={4} h={11} className="sk-head" />
        <Cols n={4} h={14} w="5rem" className="sk-row" />
      </div>
      <Bar w="min(34rem, 90%)" h={11} />
    </div>
  </div>
);

// Transcript: the letterhead, the student's details and a semester's course table.
export const TranscriptSkeleton = () => (
  <div className="sk-transcript" aria-busy="true">
    <Status label="Loading transcript" />
    <div className="sk-letterhead"><Bar w="7rem" h={26} /><Bar w="min(22rem, 70%)" h={18} /><Bar w="12rem" h={11} /></div>
    <div className="sk-info">
      {[0, 1].map((g) => (
        <div key={g} className="sk-info-group">{[0, 1].map((i) => <div key={i} className="sk-kv"><Bar w="4.5rem" h={12} /><Bar w={i ? "55%" : "70%"} h={12} /></div>)}</div>
      ))}
    </div>
    {[0, 1].map((s) => (
      <div key={s} className="sk-semester">
        <Bar w="9rem" h={18} />
        <div className="sk-card">
          <div className="sk-thead"><Bar w="12%" h={11} /><Bar w="30%" h={11} /><Bar w="8%" h={11} /><Bar w="8%" h={11} /><Bar w="8%" h={11} /></div>
          {Array.from({ length: s ? 3 : 5 }, (_, i) => <div key={i} className="sk-line"><Bar w="12%" h={13} /><Bar w={`${28 + ((i * 7) % 14)}%`} h={13} /><Bar w="6%" h={13} /><Bar w="8%" h={13} /><Bar w="6%" h={13} /></div>)}
        </div>
      </div>
    ))}
  </div>
);
