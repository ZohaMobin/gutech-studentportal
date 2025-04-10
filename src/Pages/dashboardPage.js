const processCoursePerformance = (grades) => {
    if (!Array.isArray(grades)) {
        console.error('processCoursePerformance: grades is not an array', grades);
        return {};
    }
    
    const coursePerformance = {};
    
    grades.forEach((grade, index) => {
        try {
            // Log the grade object to see its structure
            console.log(`Processing grade ${index}:`, grade);
            
            if (!grade) {
                console.warn(`Grade at index ${index} is undefined or null`);
                return;
            }
            
            if (!grade.registrationId) {
                console.warn(`Grade at index ${index} has no registrationId:`, grade);
                return;
            }
            
            const registration = grade.registrationId;
            console.log(`Registration for grade ${index}:`, registration);
            
            if (!registration) {
                console.warn(`Registration for grade ${index} is undefined or null`);
                return;
            }
            
            if (!registration.courseId) {
                console.warn(`Registration for grade ${index} has no courseId:`, registration);
                return;
            }
            
            const courseId = registration.courseId._id;
            const courseName = registration.courseId.name;
            const courseCode = registration.courseId.code;
            
            if (!courseId || !courseName) {
                console.warn(`Course info for grade ${index} is incomplete:`, registration.courseId);
                return;
            }
            
            const displayName = `${courseCode || 'Unknown'}: ${courseName}`;
            
            // Safely access sectionId with optional chaining
            const sectionId = registration.sectionId;
            console.log(`SectionId for grade ${index}:`, sectionId);
            
            if (!coursePerformance[courseId]) {
                coursePerformance[courseId] = {
                    name: displayName,
                    totalMarks: 0,
                    obtainedMarks: 0,
                    assessments: [],
                    sectionId: sectionId || null
                };
            }
            
            if (grade.obtainedMarks !== undefined && grade.maxMarks !== undefined) {
                coursePerformance[courseId].totalMarks += grade.maxMarks;
                coursePerformance[courseId].obtainedMarks += grade.obtainedMarks;
                
                coursePerformance[courseId].assessments.push({
                    title: grade.assessmentId || 'Untitled Assessment',
                    type: grade.type || 'Unknown',
                    obtainedMarks: grade.obtainedMarks,
                    maxMarks: grade.maxMarks,
                    date: grade.gradedAt || new Date(),
                    feedback: grade.feedback || ''
                });
            }
        } catch (error) {
            console.error(`Error processing grade at index ${index}:`, error, grade);
        }
    });
    
    return coursePerformance;
}; 