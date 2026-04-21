// Demo Mode - Simulates backend functionality using localStorage
// This allows the app to work without a deployed Supabase Edge Function
import { analyzeSymptoms } from './aiEngine';

export const DEMO_MODE_KEY = 'medibook_demo_mode';
export const DEMO_DATA_KEY = 'medibook_demo_data';

interface DemoUser {
  id: string;
  email: string;
  password: string;
  name: string;
  role: 'patient' | 'doctor' | 'admin';
  specialty?: string;
  experience?: string;
  rating?: number;
  reviewCount?: number;
  available?: boolean;
}

interface DemoAppointment {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  reason?: string;
  isEmergency?: boolean;
  metadata?: {
    condition: string;
    age: string;
    gender: string;
    cause: string;
  };
  priorityScore?: number;
  severityLevel?: string;
  aiAnalysis?: string;
}

interface DemoData {
  users: DemoUser[];
  appointments: DemoAppointment[];
  currentUser: DemoUser | null;
}

// Initialize demo data with sample users
const getInitialDemoData = (): DemoData => ({
  users: [
    {
      id: 'patient-1',
      email: 'patient@demo.com',
      password: 'demo123',
      name: 'John Patient',
      role: 'patient'
    },
    {
      id: 'doctor-1',
      email: 'doctor@demo.com',
      password: 'demo123',
      name: 'Dr. Sarah Smith',
      role: 'doctor',
      specialty: 'Cardiology',
      experience: '10 years',
      rating: 4.8,
      reviewCount: 127,
      available: true
    },
    {
      id: 'doctor-2',
      email: 'doctor2@demo.com',
      password: 'demo123',
      name: 'Dr. Michael Chen',
      role: 'doctor',
      specialty: 'Pediatrics',
      experience: '8 years',
      rating: 4.9,
      reviewCount: 98,
      available: true
    },
    {
      id: 'doctor-3',
      email: 'doctor3@demo.com',
      password: 'demo123',
      name: 'Dr. Emily Johnson',
      role: 'doctor',
      specialty: 'Dermatology',
      experience: '12 years',
      rating: 4.7,
      reviewCount: 156,
      available: true
    },
    {
      id: 'doctor-4',
      email: 'doctor4@demo.com',
      password: 'demo123',
      name: 'Dr. James Wilson',
      role: 'doctor',
      specialty: 'Orthopedics',
      experience: '15 years',
      rating: 4.9,
      reviewCount: 203,
      available: true
    },
    {
      id: 'doctor-5',
      email: 'doctor5@demo.com',
      password: 'demo123',
      name: 'Dr. Lisa Anderson',
      role: 'doctor',
      specialty: 'Neurology',
      experience: '9 years',
      rating: 4.6,
      reviewCount: 74,
      available: false
    },
    {
      id: 'doctor-6',
      email: 'doctor6@demo.com',
      password: 'demo123',
      name: 'Dr. Robert Martinez',
      role: 'doctor',
      specialty: 'General Medicine',
      experience: '6 years',
      rating: 4.8,
      reviewCount: 89,
      available: true
    },
    {
      id: 'admin-1',
      email: 'admin@demo.com',
      password: 'demo123',
      name: 'Admin User',
      role: 'admin'
    }
  ],
  appointments: [
    {
      id: 'apt-1',
      patientId: 'patient-1',
      patientName: 'John Patient',
      doctorId: 'doctor-1',
      doctorName: 'Dr. Sarah Smith',
      date: new Date().toISOString().split('T')[0],
      time: '10:00 AM',
      status: 'confirmed',
      reason: 'Regular checkup'
    },
    {
      id: 'apt-2',
      patientId: 'patient-1',
      patientName: 'John Patient',
      doctorId: 'doctor-2',
      doctorName: 'Dr. Michael Chen',
      date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      time: '02:30 PM',
      status: 'confirmed',
      reason: 'Follow-up consultation'
    }
  ],
  currentUser: null
});

export const isDemoMode = (): boolean => {
  return localStorage.getItem(DEMO_MODE_KEY) === 'true';
};

export const enableDemoMode = () => {
  localStorage.setItem(DEMO_MODE_KEY, 'true');
  if (!localStorage.getItem(DEMO_DATA_KEY)) {
    localStorage.setItem(DEMO_DATA_KEY, JSON.stringify(getInitialDemoData()));
  }
};

export const disableDemoMode = () => {
  localStorage.removeItem(DEMO_MODE_KEY);
};

const getDemoData = (): DemoData => {
  const data = localStorage.getItem(DEMO_DATA_KEY);
  if (!data) {
    const initial = getInitialDemoData();
    localStorage.setItem(DEMO_DATA_KEY, JSON.stringify(initial));
    return initial;
  }
  return JSON.parse(data);
};

const saveDemoData = (data: DemoData) => {
  localStorage.setItem(DEMO_DATA_KEY, JSON.stringify(data));
};

// Demo API functions
export const demoSignUp = async (email: string, password: string, name: string, role: 'patient' | 'doctor' | 'admin') => {
  await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
  
  const data = getDemoData();
  
  // Check if user already exists
  if (data.users.find(u => u.email === email)) {
    throw new Error('User already exists');
  }
  
  const newUser: DemoUser = {
    id: `${role}-${Date.now()}`,
    email,
    password,
    name,
    role
  };
  
  data.users.push(newUser);
  data.currentUser = newUser;
  saveDemoData(data);
  
  return { user: { id: newUser.id, email: newUser.email, name: newUser.name, role: newUser.role } };
};

export const demoSignIn = async (email: string, password: string) => {
  await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
  
  const data = getDemoData();
  const user = data.users.find(u => u.email === email && u.password === password);
  
  if (!user) {
    throw new Error('Invalid credentials');
  }
  
  data.currentUser = user;
  saveDemoData(data);
  
  return { user: { id: user.id, email: user.email, name: user.name, role: user.role } };
};

export const demoSignOut = async () => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const data = getDemoData();
  data.currentUser = null;
  saveDemoData(data);
};

export const demoGetCurrentUser = () => {
  const data = getDemoData();
  if (!data.currentUser) return null;
  
  const { password, ...userWithoutPassword } = data.currentUser;
  return userWithoutPassword;
};

export const demoGetDoctors = async () => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const data = getDemoData();
  return data.users.filter(u => u.role === 'doctor').map(({ password, id, ...user }) => ({
    userId: id,
    ...user,
    specialty: user.specialty || 'General Medicine',
    experience: user.experience || '5 years',
    rating: user.rating || 4.5,
    reviewCount: user.reviewCount || 0,
    available: user.available ?? true
  }));
};

export const demoGetDoctorById = async (id: string) => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const data = getDemoData();
  const user = data.users.find(u => u.id === id && u.role === 'doctor');
  
  if (!user) {
    throw new Error('Doctor not found');
  }

  return {
    doctor: {
      userId: user.id,
      name: user.name,
      specialty: user.specialty || 'General Medicine',
      experience: user.experience || '5 years',
      rating: user.rating || 4.5,
      reviewCount: user.reviewCount || 0,
      available: user.available ?? true
    }
  };
};

export const demoBookAppointment = async (doctorId: string, date: string, time: string, reason: string) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const data = getDemoData();
  if (!data.currentUser) throw new Error('Not authenticated');
  
  const doctor = data.users.find(u => u.id === doctorId);
  if (!doctor) throw new Error('Doctor not found');
  
  const appointment: DemoAppointment = {
    id: `apt-${Date.now()}`,
    patientId: data.currentUser.id,
    patientName: data.currentUser.name,
    doctorId,
    doctorName: doctor.name,
    date,
    time,
    status: 'confirmed',
    reason
  };
  
  data.appointments.push(appointment);
  saveDemoData(data);
  
  return appointment;
};

export const demoBookEmergencySlot = async (condition: string, age: string, gender: string, cause: string) => {
  await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate AI processing delay
  
  const data = getDemoData();
  if (!data.currentUser) throw new Error('Not authenticated');
  
  // 1. Run AI Triage Engine
  const aiResult = analyzeSymptoms(condition, cause, age);

  // 2. Find best matched doctor
  let doctor = data.users.find(u => u.role === 'doctor' && u.available && u.specialty === aiResult.recommendedSpecialty);
  
  // Fallback if specialist not available
  if (!doctor) {
    doctor = data.users.find(u => u.role === 'doctor' && u.available);
  }
  if (!doctor) throw new Error('No available doctors for emergency slot');
  
  const appointment: DemoAppointment = {
    id: `emergency-${Date.now()}`,
    patientId: data.currentUser.id,
    patientName: data.currentUser.name,
    doctorId: doctor.id,
    doctorName: doctor.name,
    date: new Date().toISOString().split('T')[0],
    time: 'Immediate',
    status: 'confirmed',
    isEmergency: true,
    metadata: { condition, age, gender, cause },
    priorityScore: aiResult.priorityScore,
    severityLevel: aiResult.severityLevel,
    aiAnalysis: aiResult.analysis,
    reason: `EMERGENCY: ${condition} - ${cause}`
  };
  
  data.appointments.push(appointment);
  saveDemoData(data);
  
  return appointment;
};

export const demoGetAppointments = async () => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const data = getDemoData();
  if (!data.currentUser) return [];
  
  let appointments = [];
  if (data.currentUser.role === 'patient') {
    appointments = data.appointments.filter(a => a.patientId === data.currentUser!.id);
  } else if (data.currentUser.role === 'doctor') {
    appointments = data.appointments.filter(a => a.doctorId === data.currentUser!.id);
  } else if (data.currentUser.role === 'admin') {
    appointments = data.appointments;
  }
  
  // Map to expected format
  return appointments.map(apt => (({
    id: apt.id,
    patientName: apt.patientName,
    doctorName: apt.doctorName.replace('Dr. ', ''),
    date: apt.date,
    time: apt.time,
    status: (apt.status === 'confirmed' || apt.status === 'pending') ? 'scheduled' : apt.status,
    notes: apt.reason || ''
  })));
};

export const demoUpdateAppointment = async (id: string, status: DemoAppointment['status']) => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const data = getDemoData();
  const appointment = data.appointments.find(a => a.id === id);
  
  if (!appointment) throw new Error('Appointment not found');
  
  appointment.status = status;
  saveDemoData(data);
  
  return appointment;
};

export const demoRescheduleAppointment = async (id: string, date: string, time: string) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const data = getDemoData();
  const appointment = data.appointments.find(a => a.id === id);
  
  if (!appointment) throw new Error('Appointment not found');
  
  appointment.date = date;
  appointment.time = time;
  appointment.status = 'confirmed';
  
  saveDemoData(data);
  return appointment;
};

export const demoGetAllUsers = async () => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const data = getDemoData();
  return data.users.map(({ password, ...user }) => user);
};

export const demoGetStats = async () => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const data = getDemoData();
  
  return {
    totalPatients: data.users.filter(u => u.role === 'patient').length,
    totalDoctors: data.users.filter(u => u.role === 'doctor').length,
    totalAppointments: data.appointments.length,
    pendingAppointments: data.appointments.filter(a => a.status === 'pending').length,
    confirmedAppointments: data.appointments.filter(a => a.status === 'confirmed').length,
    completedAppointments: data.appointments.filter(a => a.status === 'completed').length
  };
};