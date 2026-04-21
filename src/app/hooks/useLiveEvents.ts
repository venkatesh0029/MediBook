import { useEffect } from 'react';
import { toast } from 'sonner';

const PATIENT_EVENTS = [
  "Dr. Sarah Smith just became available. System re-allocating priorities...",
  "AI Triage detected anomaly in local area. Re-routing closest ambulences.",
  "Your Digital Twin has finished syncing latest vitals."
];

const DOCTOR_EVENTS = [
  "🚨 CRITICAL: High-risk patient incoming. Auto-assigned to your queue.",
  "Dr. Chen went offline. Re-balancing your patient load.",
  "AI Analysis complete on Patient ID #8843. Recommend immediate attention."
];

export function useLiveEvents(role: 'patient' | 'doctor' | 'admin') {
  useEffect(() => {
    // Pop ups disabled
  }, [role]);
}
