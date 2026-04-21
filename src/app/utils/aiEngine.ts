export type SeverityLevel = 'Low' | 'Medium' | 'Critical';

export interface AIAnalysisResult {
  priorityScore: number;
  severityLevel: SeverityLevel;
  recommendedSpecialty: string;
  analysis: string;
}

// Simple rule-based AI Triage Engine for Hackathon purposes
export const analyzeSymptoms = (
  condition: string,
  cause: string,
  ageStr: string
): AIAnalysisResult => {
  const text = `${condition} ${cause}`.toLowerCase();
  const age = parseInt(ageStr, 10) || 30;

  let baseScore = 10;
  let recommendedSpecialty = 'General Physician';
  let reasoning = [];

  // 1. Critical Keyword Matching
  const criticalKeywords = ['chest pain', 'heart', 'stroke', 'breathing', 'breath', 'unconscious', 'bleeding', 'blood', 'head trauma'];
  const isCritical = criticalKeywords.some((kw) => text.includes(kw));

  if (isCritical) {
    baseScore += 60; // Huge base penalty
    reasoning.push('Critical keywords detected (Potential life-threatening condition).');
    if (text.includes('chest') || text.includes('heart')) {
      recommendedSpecialty = 'Cardiologist';
    } else if (text.includes('head') || text.includes('stroke')) {
      recommendedSpecialty = 'Neurologist';
    } else {
      recommendedSpecialty = 'Emergency Specialist';
    }
  } 
  
  // 2. Medium Severity Keyword Matching
  const mediumKeywords = ['fracture', 'broken', 'bone', 'pain', 'vomit', 'fever', 'burn', 'accident'];
  const isMedium = !isCritical && mediumKeywords.some((kw) => text.includes(kw));
  
  if (isMedium) {
    baseScore += 30;
    reasoning.push('Moderate symptoms detected.');
    if (text.includes('bone') || text.includes('fracture') || text.includes('broken')) {
      recommendedSpecialty = 'Orthopedist';
    }
  }

  // 3. Age Factor (Vulnerable groups get higher priority)
  let agePenalty = 0;
  if (age >= 65) {
    agePenalty = 20;
    reasoning.push('Patient is in a high-risk age group (65+).');
  } else if (age <= 5) {
    agePenalty = 15;
    reasoning.push('Pediatric patient requires elevated priority.');
  }

  // 4. Calculate Final Score & Classification
  let priorityScore = baseScore + agePenalty;
  if (priorityScore > 100) priorityScore = 100;

  let severityLevel: SeverityLevel = 'Low';
  if (priorityScore >= 70) {
    severityLevel = 'Critical';
  } else if (priorityScore >= 40) {
    severityLevel = 'Medium';
  }

  if (severityLevel === 'Low' && reasoning.length === 0) {
    reasoning.push('Standard low-risk symptoms. Proceed with normal booking.');
  }

  return {
    priorityScore,
    severityLevel,
    recommendedSpecialty,
    analysis: reasoning.join(' ')
  };
};
