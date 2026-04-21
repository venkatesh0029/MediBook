import { 
  isDemoMode, 
  demoSignUp, 
  demoSignIn, 
  demoSignOut,
  demoGetCurrentUser,
  demoGetDoctors,
  demoGetDoctorById,
  demoBookAppointment,
  demoBookEmergencySlot,
  demoGetAppointments,
  demoUpdateAppointment,
  demoRescheduleAppointment,
  demoGetAllUsers,
  demoGetStats
} from './demoMode';

export const API_BASE = 'http://localhost:3001/api';

export const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${API_BASE}${endpoint}`;
  
  // Get token from local storage
  const token = localStorage.getItem('access_token');
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...options.headers,
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      console.error(`API request failed for ${endpoint}:`, {
        status: response.status,
        statusText: response.statusText,
        errorData,
        url
      });
      throw new Error(errorData.error || `Request failed: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`API request error for ${endpoint}:`, error);
    throw error;
  }
};

// Auth functions with demo mode support
export const signUp = async (email: string, password: string, name: string, role: 'patient' | 'doctor' | 'admin') => {
  if (isDemoMode()) {
    return await demoSignUp(email, password, name, role);
  }
  const data = await apiRequest('/auth/signup', {
    method: 'POST',
    body: JSON.stringify({ email, password, name, role }),
  });
  if (data.token) {
    localStorage.setItem('access_token', data.token);
    setCurrentUser(data.user);
  }
  return data;
};

export const signIn = async (email: string, password: string) => {
  if (isDemoMode()) {
    return await demoSignIn(email, password);
  }
  const data = await apiRequest('/auth/signin', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  if (data.token) {
    localStorage.setItem('access_token', data.token);
    setCurrentUser(data.user);
  }
  return data;
};

export const signOut = async () => {
  if (isDemoMode()) {
    return await demoSignOut();
  }
  clearCurrentUser();
  localStorage.removeItem('access_token');
  return await apiRequest('/auth/signout', {
    method: 'POST',
  });
};

export const getCurrentUser = () => {
  if (isDemoMode()) {
    return demoGetCurrentUser();
  }
  const userStr = localStorage.getItem('medibook_current_user');
  return userStr ? JSON.parse(userStr) : null;
};

export const setCurrentUser = (user: any) => {
  if (!isDemoMode()) {
    localStorage.setItem('medibook_current_user', JSON.stringify(user));
  }
};

export const clearCurrentUser = () => {
  if (!isDemoMode()) {
    localStorage.removeItem('medibook_current_user');
  }
};

// Doctor functions
export const getDoctors = async () => {
  if (isDemoMode()) {
    return await demoGetDoctors();
  }
  return await apiRequest('/doctors', { method: 'GET' });
};

export const getDoctorById = async (id: string) => {
  if (isDemoMode()) {
    return await demoGetDoctorById(id);
  }
  return await apiRequest(`/doctors/${id}`, { method: 'GET' });
};

// Appointment functions
export const bookAppointment = async (doctorId: string, date: string, time: string, reason: string) => {
  if (isDemoMode()) {
    return await demoBookAppointment(doctorId, date, time, reason);
  }
  return await apiRequest('/appointments', {
    method: 'POST',
    body: JSON.stringify({ doctorId, date, time, reason }),
  });
};

export const bookEmergencySlot = async (condition: string, age: string, gender: string, cause: string) => {
  if (isDemoMode()) {
    return await demoBookEmergencySlot(condition, age, gender, cause);
  }
  return await apiRequest('/appointments/emergency', {
    method: 'POST',
    body: JSON.stringify({ condition, age, gender, cause }),
  });
};

export const getAppointments = async () => {
  if (isDemoMode()) {
    return await demoGetAppointments();
  }
  return await apiRequest('/appointments', { method: 'GET' });
};

export const updateAppointment = async (id: string, status: string) => {
  if (isDemoMode()) {
    return await demoUpdateAppointment(id, status as any);
  }
  return await apiRequest(`/appointments/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ status }),
  });
};

export const cancelAppointment = async (id: string) => {
  return await updateAppointment(id, 'cancelled');
};

export const rescheduleAppointment = async (id: string, date: string, time: string) => {
  if (isDemoMode()) {
    return await demoRescheduleAppointment(id, date, time);
  }
  return await apiRequest(`/appointments/${id}/reschedule`, {
    method: 'PUT',
    body: JSON.stringify({ date, time }),
  });
};

// Admin functions
export const getAllUsers = async () => {
  if (isDemoMode()) {
    return await demoGetAllUsers();
  }
  return await apiRequest('/users', { method: 'GET' });
};

export const getStats = async () => {
  if (isDemoMode()) {
    return await demoGetStats();
  }
  // Optional dummy stats since we didn't implement a backend route for it
  return {
    totalPatients: 0,
    totalDoctors: 0,
    totalAppointments: 0,
    pendingAppointments: 0,
    confirmedAppointments: 0,
    completedAppointments: 0
  };
};
