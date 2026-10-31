import { Student, TeamMatchCandidate } from "@/types";
import { generateMatchExplanationWithGemma } from "./gemma";

const ROLE_KEYWORDS: Record<string, string[]> = {
  "Frontend Developer": ["frontend", "ui", "react", "next.js", "tailwind", "css", "web design"],
  "Backend Developer": ["backend", "api", "fastapi", "node", "express", "go", "python", "database", "sql", "postgres"],
  "UI/UX Designer": ["ui/ux", "designer", "figma", "wireframe", "prototype", "ux", "ui"],
  "AI/ML Engineer": ["ai", "ml", "machine learning", "pytorch", "tensorflow", "llm", "langchain", "deep learning", "nlp"],
  "Mobile App Developer": ["mobile", "flutter", "react native", "android", "ios", "kotlin", "swift"],
  "DevOps Engineer": ["devops", "docker", "kubernetes", "cloud", "aws", "ci/cd", "deployment"],
  "Full Stack Developer": ["full stack", "fullstack", "end to end", "web"],
};

export async function matchTeammates(params: {
  requirement: string;
  candidates: Student[];
  excludeStudentId?: string;
}): Promise<TeamMatchCandidate[]> {
  const { requirement, candidates, excludeStudentId } = params;
  const lowerReq = requirement.toLowerCase();

  // Filter out the requester themselves if specified
  const pool = excludeStudentId ? candidates.filter((s) => s.id !== excludeStudentId) : candidates;

  const scoredCandidates: Array<{
    student: Student;
    compatibility_score: number;
    matching_skills: string[];
    missing_skills: string[];
    complementary_roles: string[];
  }> = [];

  for (const candidate of pool) {
    // 1. Skill Overlap Calculation
    const matching_skills: string[] = [];
    const missing_skills: string[] = [];

    candidate.skills.forEach((skill) => {
      if (lowerReq.includes(skill.toLowerCase())) {
        matching_skills.push(skill);
      } else {
        missing_skills.push(skill);
      }
    });

    // 2. Role Alignment Calculation
    const complementary_roles: string[] = [];
    candidate.preferred_roles.forEach((role) => {
      const keywords = ROLE_KEYWORDS[role] || [role.toLowerCase()];
      const isMentioned = keywords.some((kw) => lowerReq.includes(kw));
      if (isMentioned || lowerReq.includes(role.toLowerCase())) {
        complementary_roles.push(role);
      }
    });

    // 3. Interest Alignment Calculation
    let interestPoints = 0;
    candidate.interests.forEach((interest) => {
      if (lowerReq.includes(interest.toLowerCase())) {
        interestPoints += 10;
      }
    });

    // 4. Deterministic Compatibility Scoring formula:
    // Base score: 45
    // Skill match: +15 points per matching skill (up to 35)
    // Role match: +15 points per matching role (up to 25)
    // Interest match: +5 to 10 points
    // Experience bonus: Advanced (+8), Intermediate (+5), Beginner (+2)
    let score = 42;
    score += Math.min(matching_skills.length * 15, 35);
    score += Math.min(complementary_roles.length * 15, 25);
    score += Math.min(interestPoints, 10);

    if (candidate.experience_level === "Advanced") score += 8;
    else if (candidate.experience_level === "Intermediate") score += 5;
    else score += 2;

    // Normalize between 35 and 98
    const finalScore = Math.max(38, Math.min(98, score));

    scoredCandidates.push({
      student: candidate,
      compatibility_score: finalScore,
      matching_skills: matching_skills.length > 0 ? matching_skills : candidate.skills.slice(0, 2),
      missing_skills: missing_skills.slice(0, 3),
      complementary_roles: complementary_roles.length > 0 ? complementary_roles : candidate.preferred_roles.slice(0, 1),
    });
  }

  // Sort by highest compatibility score
  scoredCandidates.sort((a, b) => b.compatibility_score - a.compatibility_score);

  // Take top candidates and attach Gemma natural-language explanations
  const results: TeamMatchCandidate[] = [];

  for (const item of scoredCandidates) {
    let explanation: TeamMatchCandidate["explanation"];
    try {
      explanation = await generateMatchExplanationWithGemma({
        requesterNeed: requirement,
        candidate: item.student,
        compatibilityScore: item.compatibility_score,
        matchingSkills: item.matching_skills,
        missingSkills: item.missing_skills,
      });
    } catch {
      const name = item.student.display_name;
      const strengths = item.matching_skills.length
        ? item.matching_skills
        : item.student.skills.slice(0, 3);
      explanation = {
        english: `${name} is ranked ${item.compatibility_score}% for this project based on their profile. Their ${strengths.join(", ") || "listed skills"} can support the team's requirements.`,
        hindi_simple: `${name} ke profile ke hisaab se inki skills project ki requirements se match karti hain.`,
        key_strengths: strengths,
        suggested_synergy: `Ask ${name} to own the ${item.complementary_roles[0] || "matching skill"} part of the project.`,
      };
    }

    results.push({
      student: item.student,
      compatibility_score: item.compatibility_score,
      matching_skills: item.matching_skills,
      missing_skills: item.missing_skills,
      complementary_roles: item.complementary_roles,
      explanation,
    });
  }

  return results;
}
