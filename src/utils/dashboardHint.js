// The dashboard can open Attendance or Marks on a particular course. The choice is read once and cleared, so a later visit
// from the menu starts on the first course as usual. Attendance identifies a course by its course id, Marks by the registration.
export const HINT_KEY = "dashboard:course";
export const rememberCourse = ({ courseId, registrationId }) => { try { sessionStorage.setItem(HINT_KEY, JSON.stringify({ courseId: String(courseId ?? ""), registrationId: String(registrationId ?? "") })); } catch { /* the page still opens, on its first course */ } };
export const takeCourseHint = (courses, field = "courseId") => {
  try {
    const hint = JSON.parse(sessionStorage.getItem(HINT_KEY) || "null");
    sessionStorage.removeItem(HINT_KEY);
    const wanted = hint?.[field];
    return (wanted && courses.find((course) => String(course.id) === wanted)) || null;
  } catch { return null; }
};
