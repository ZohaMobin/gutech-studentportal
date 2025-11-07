const processCoursePerformance = (grades) => {
  if (!Array.isArray(grades)) {
    console.error("processCoursePerformance: grades is not an array", grades);
    return {};
  }

  const coursePerformance = {};

  grades.forEach((grade, index) => {
    try {
      if (!grade) {
        return;
      }

      if (!grade.registrationId) {
        return;
      }

      const registration = grade.registrationId;

      if (!registration) {
        return;
      }

      if (!registration.courseId) {
        return;
      }

      const courseId = registration.courseId._id;
      const courseName = registration.courseId.name;
      const courseCode = registration.courseId.code;

      if (!courseId || !courseName) {
        return;
      }

      const displayName = `${courseCode || "Unknown"}: ${courseName}`;

      // Safely access sectionId with optional chaining
      const sectionId = registration.sectionId;

      if (!coursePerformance[courseId]) {
        coursePerformance[courseId] = {
          name: displayName,
          totalMarks: 0,
          obtainedMarks: 0,
          assessments: [],
          sectionId: sectionId || null,
        };
      }

      if (grade.obtainedMarks !== undefined && grade.assessmentId?.maxMarks !== undefined) {
        const maxMarks = grade.assessmentId.maxMarks;
        coursePerformance[courseId].totalMarks += maxMarks;
        coursePerformance[courseId].obtainedMarks += grade.obtainedMarks;

        coursePerformance[courseId].assessments.push({
          title: grade.assessmentId?.title || "Untitled Assessment",
          type: grade.assessmentId?.type || "Unknown",
          obtainedMarks: grade.obtainedMarks,
          maxMarks: maxMarks,
          date: grade.gradedAt || new Date(),
          feedback: grade.feedback || "",
        });
      }
    } catch (error) {
      console.error(`Error processing grade at index ${index}:`, error, grade);
    }
  });

  return coursePerformance;
};
