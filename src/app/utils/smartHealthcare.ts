import { analyzeSymptoms } from './aiEngine';

type DoctorLike = {
  userId?: string;
  id?: string;
  name: string;
  specialty: string;
  experience?: string | number;
  rating?: number;
  reviewCount?: number;
  available?: boolean;
  languages?: string[];
  patients?: number;
};

type AppointmentLike = {
  id: string;
  patientName?: string;
  doctorName?: string;
  date: string;
  time: string;
  status: string;
  notes?: string;
  priorityScore?: number;
  severityLevel?: string;
  isEmergency?: boolean;
};

const specialtyKeywords: Record<string, string[]> = {
  Cardiology: ['chest', 'heart', 'bp', 'pressure', 'palpitation'],
  Neurology: ['headache', 'stroke', 'seizure', 'migraine', 'dizzy'],
  Orthopedics: ['bone', 'fracture', 'joint', 'knee', 'back'],
  Pediatrics: ['child', 'baby', 'infant', 'pediatric'],
  Dermatology: ['rash', 'skin', 'itch', 'acne'],
  'General Practice': ['fever', 'cough', 'cold', 'fatigue'],
};

const minutesFromTime = (time: string) => {
  const [rawHour, rawMinute = '0'] = time.replace(/\s/g, '').split(':');
  const isPm = /pm/i.test(time);
  const isAm = /am/i.test(time);
  let hour = Number(rawHour) || 9;
  const minute = Number(rawMinute.replace(/\D/g, '')) || 0;
  if (isPm && hour < 12) hour += 12;
  if (isAm && hour === 12) hour = 0;
  return hour * 60 + minute;
};

const experienceYears = (value: string | number | undefined) => {
  if (typeof value === 'number') return value;
  const match = `${value || ''}`.match(/\d+/);
  return match ? Number(match[0]) : 5;
};

export const calculateDynamicSlot = (
  specialty: string,
  priorityScore = 25,
  doctorSpeed = 1
) => {
  const baseBySpecialty: Record<string, number> = {
    Cardiology: 24,
    Neurology: 30,
    Orthopedics: 26,
    Pediatrics: 18,
    Dermatology: 16,
    'General Practice': 15,
  };
  const base = baseBySpecialty[specialty] || 20;
  const complexity = priorityScore >= 70 ? 12 : priorityScore >= 40 ? 6 : 0;
  const duration = Math.round((base + complexity) / Math.max(doctorSpeed, 0.75));

  return {
    duration,
    label: `${duration} min smart slot`,
    reason: priorityScore >= 70 ? 'Complex case buffer added' : 'Adjusted to doctor pace and specialty',
  };
};

export const predictWaitTime = (
  queueLength: number,
  averageSlotMinutes: number,
  doctorPace = 1,
  delayMinutes = 0
) => {
  const wait = Math.max(0, Math.round((queueLength * averageSlotMinutes) / Math.max(doctorPace, 0.75) + delayMinutes));
  return {
    wait,
    confidence: wait > 45 ? 72 : wait > 20 ? 84 : 91,
    label: wait <= 5 ? 'On time' : `~${wait} min wait`,
  };
};

export const rankDoctors = <T extends DoctorLike>(doctors: T[], symptoms: string, preferredLanguage = 'English') => {
  const triage = analyzeSymptoms(symptoms || 'general consultation', symptoms || '', '32');
  const desired = triage.recommendedSpecialty.replace('General Physician', 'General Practice');
  const text = symptoms.toLowerCase();

  return doctors
    .map((doctor, index) => {
      const specialtyMatch = doctor.specialty === desired || specialtyKeywords[doctor.specialty]?.some((kw) => text.includes(kw));
      const languageMatch = !doctor.languages || doctor.languages.includes(preferredLanguage);
      const loadPenalty = Math.min(18, Math.floor((doctor.patients || doctor.reviewCount || 300) / 250));
      const score =
        (specialtyMatch ? 44 : 16) +
        (doctor.available ? 16 : 0) +
        Math.round((doctor.rating || 4.2) * 6) +
        Math.min(12, experienceYears(doctor.experience)) +
        (languageMatch ? 8 : 0) -
        loadPenalty -
        index;

      return {
        ...doctor,
        matchScore: Math.max(35, Math.min(98, score)),
        matchReason: specialtyMatch ? `Best for ${desired}` : 'Good general fit',
        estimatedDistance: `${(0.8 + index * 1.1).toFixed(1)} km`,
        estimatedCost: 500 + index * 150,
      };
    })
    .sort((a, b) => b.matchScore - a.matchScore);
};

export const optimizeQueue = (appointments: AppointmentLike[]) => {
  return [...appointments].sort((a, b) => {
    const urgencyDelta = (b.priorityScore || 0) - (a.priorityScore || 0);
    if (urgencyDelta !== 0) return urgencyDelta;
    return minutesFromTime(a.time) - minutesFromTime(b.time);
  });
};

export const getWaitlistFill = (cancelledTime?: string) => ({
  candidate: 'Asha Kumar',
  responseWindow: '4 min',
  channel: 'Push + WhatsApp',
  slot: cancelledTime || 'Next open slot',
});

export const getPatientCarePlan = () => ({
  followUp: 'Auto follow-up in 7 days',
  lockerItems: ['Lab report', 'Prescription', 'Discharge note'],
  preventiveNudges: ['Annual lipid profile', 'Flu vaccine', 'Dental checkup'],
  recovery: 68,
  mentalHealth: 'Private anonymous intake available',
});

export const getDoctorOps = (appointments: AppointmentLike[]) => {
  const scheduled = appointments.filter((apt) => apt.status === 'scheduled');
  const critical = scheduled.filter((apt) => apt.isEmergency || apt.severityLevel === 'Critical').length;
  const overtimeRisk = Math.min(94, scheduled.length * 11 + critical * 9);

  return {
    loadIndex: Math.min(100, scheduled.length * 13),
    stressIndex: overtimeRisk,
    queueRecommendation: critical > 0 ? 'Move critical cases before routine reviews' : 'Keep current order',
    summary: '30-second summary ready: history, meds, allergies, last visit, current notes',
    hybridRoom: 'In-person and teleconsult notes sync to one visit timeline',
  };
};

export const getAdminOps = () => ({
  noShowRisk: 31,
  depositSuggestion: 'Suggest 10% deposit for high-risk repeat no-shows',
  branchRouter: 'Route non-urgent walk-ins to West Wing: 18 min faster',
  revenueRecovered: '₹42,000',
  rushForecast: '+24% tomorrow, pediatrics and general medicine highest',
});
