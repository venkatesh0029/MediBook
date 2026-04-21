export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  experience: number;
  rating: number;
  patients: number;
  avatar: string;
  education: string;
  languages: string[];
  about: string;
  availability: {
    [key: string]: string[];
  };
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  specialty: string;
  date: string;
  time: string;
  status: "scheduled" | "completed" | "cancelled" | "waiting";
  type: "consultation" | "follow-up" | "emergency";
}

export const mockDoctors: Doctor[] = [
  {
    id: "d1",
    name: "Sarah Smith",
    specialty: "Cardiology",
    experience: 12,
    rating: 4.8,
    patients: 1250,
    avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop",
    education: "MD, Harvard Medical School",
    languages: ["English", "Spanish"],
    about: "Dr. Smith is a board-certified cardiologist with over 12 years of experience in treating heart conditions.",
    availability: {
      "2026-02-18": ["09:00", "10:00", "11:00", "14:00", "15:00"],
      "2026-02-19": ["09:00", "10:00", "13:00", "14:00", "16:00"],
      "2026-02-20": ["08:00", "09:00", "10:00", "11:00", "15:00"],
    },
  },
  {
    id: "d2",
    name: "Dr. Michael Chen",
    specialty: "Neurology",
    experience: 15,
    rating: 4.9,
    patients: 980,
    avatar: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop",
    education: "MD, Johns Hopkins University",
    languages: ["English", "Mandarin"],
    about: "Specialized in treating neurological disorders with a focus on stroke prevention and migraine management.",
    availability: {
      "2026-02-18": ["10:00", "11:00", "14:00", "15:00", "16:00"],
      "2026-02-19": ["09:00", "10:00", "11:00", "14:00", "15:00"],
      "2026-02-20": ["09:00", "10:00", "13:00", "14:00", "16:00"],
    },
  },
  {
    id: "d3",
    name: "Dr. Emily Johnson",
    specialty: "Pediatrics",
    experience: 8,
    rating: 4.7,
    patients: 1500,
    avatar: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&h=400&fit=crop",
    education: "MD, Stanford University",
    languages: ["English", "French"],
    about: "Compassionate pediatrician dedicated to providing comprehensive care for children from infancy through adolescence.",
    availability: {
      "2026-02-18": ["08:00", "09:00", "10:00", "13:00", "14:00"],
      "2026-02-19": ["08:00", "09:00", "11:00", "13:00", "14:00"],
      "2026-02-20": ["08:00", "10:00", "11:00", "14:00", "15:00"],
    },
  },
  {
    id: "d4",
    name: "Dr. David Williams",
    specialty: "Orthopedics",
    experience: 20,
    rating: 4.9,
    patients: 2100,
    avatar: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&h=400&fit=crop",
    education: "MD, Mayo Clinic",
    languages: ["English"],
    about: "Expert orthopedic surgeon specializing in joint replacement and sports medicine injuries.",
    availability: {
      "2026-02-18": ["09:00", "10:00", "11:00", "15:00", "16:00"],
      "2026-02-19": ["08:00", "09:00", "10:00", "14:00", "15:00"],
      "2026-02-20": ["09:00", "11:00", "13:00", "14:00", "15:00"],
    },
  },
  {
    id: "d5",
    name: "Dr. Lisa Anderson",
    specialty: "Dermatology",
    experience: 10,
    rating: 4.6,
    patients: 890,
    avatar: "https://images.unsplash.com/photo-1527613426441-4da17471b66d?w=400&h=400&fit=crop",
    education: "MD, UCLA Medical Center",
    languages: ["English", "German"],
    about: "Board-certified dermatologist with expertise in medical and cosmetic dermatology.",
    availability: {
      "2026-02-18": ["09:00", "10:00", "13:00", "14:00", "15:00"],
      "2026-02-19": ["09:00", "11:00", "13:00", "15:00", "16:00"],
      "2026-02-20": ["08:00", "09:00", "10:00", "14:00", "16:00"],
    },
  },
  {
    id: "d6",
    name: "Dr. James Brown",
    specialty: "General Practice",
    experience: 18,
    rating: 4.8,
    patients: 3200,
    avatar: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400&h=400&fit=crop",
    education: "MD, Columbia University",
    languages: ["English", "Italian"],
    about: "Experienced family medicine physician providing comprehensive primary care for all ages.",
    availability: {
      "2026-02-18": ["08:00", "09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00"],
      "2026-02-19": ["08:00", "09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00"],
      "2026-02-20": ["08:00", "09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00"],
    },
  },
];

export const mockAppointments: Appointment[] = [
  {
    id: "a1",
    patientId: "1",
    patientName: "John Doe",
    doctorId: "d1",
    doctorName: "Dr. Sarah Smith",
    specialty: "Cardiology",
    date: "2026-02-18",
    time: "10:00",
    status: "scheduled",
    type: "consultation",
  },
  {
    id: "a2",
    patientId: "1",
    patientName: "John Doe",
    doctorId: "d3",
    doctorName: "Dr. Emily Johnson",
    specialty: "Pediatrics",
    date: "2026-02-20",
    time: "14:00",
    status: "scheduled",
    type: "follow-up",
  },
  {
    id: "a3",
    patientId: "2",
    patientName: "Jane Smith",
    doctorId: "d2",
    doctorName: "Dr. Michael Chen",
    specialty: "Neurology",
    date: "2026-02-10",
    time: "09:00",
    status: "completed",
    type: "consultation",
  },
];

// Store appointments in localStorage
if (!localStorage.getItem("appointments")) {
  localStorage.setItem("appointments", JSON.stringify(mockAppointments));
}

export function getAppointments(): Appointment[] {
  const stored = localStorage.getItem("appointments");
  return stored ? JSON.parse(stored) : mockAppointments;
}

export function addAppointment(appointment: Appointment) {
  const appointments = getAppointments();
  appointments.push(appointment);
  localStorage.setItem("appointments", JSON.stringify(appointments));
}

export function updateAppointment(id: string, updates: Partial<Appointment>) {
  const appointments = getAppointments();
  const index = appointments.findIndex((a) => a.id === id);
  if (index !== -1) {
    appointments[index] = { ...appointments[index], ...updates };
    localStorage.setItem("appointments", JSON.stringify(appointments));
  }
}
