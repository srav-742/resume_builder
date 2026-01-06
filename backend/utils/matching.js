/**
 * Simple Weighted Matching Algorithm
 * Factors:
 * 1. Mandatory Skills (Higher weight)
 * 2. Experience Level Match
 * 3. Employment Type & Work Mode Match
 */

const calculateMatch = (user, job) => {
    let score = 0;
    let weights = {
        skills: 0.6,
        experience: 0.2,
        preferences: 0.2
    };

    // 1. Skills Matching
    const jobSkills = job.skillsRequired.map(s => s.name.toLowerCase());
    const userSkills = user.skills.map(s => s.name.toLowerCase());

    const skillMatches = jobSkills.filter(s => userSkills.includes(s));
    const skillScore = jobSkills.length > 0 ? (skillMatches.length / jobSkills.length) * 100 : 100;

    // 2. Experience Match
    let expScore = 0;
    // Simplified: Check if user level matches label
    // In a real app, you'd calculate years of experience
    if (job.experienceRange.label === "Fresher" && user.role === "seeker") expScore = 100;
    else expScore = 80; // Placeholder

    // 3. Preferences Match
    let prefScore = 0;
    if (user.preferences) {
        const modeMatch = user.preferences.workModes.includes(job.workMode) ? 100 : 0;
        const typeMatch = user.preferences.jobTypes.includes(job.employmentType) ? 100 : 0;
        prefScore = (modeMatch + typeMatch) / 2;
    } else {
        prefScore = 70; // Default
    }

    const finalScore = (skillScore * weights.skills) + (expScore * weights.experience) + (prefScore * weights.preferences);

    return {
        score: Math.round(finalScore),
        explanation: `You match ${skillMatches.length} out of ${jobSkills.length} required skills. Your work mode preference aligns with the ${job.workMode} requirement.`
    };
};

module.exports = { calculateMatch };
