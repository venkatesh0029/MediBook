import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Activity, Calendar, Clock, Search, Stethoscope, Star, AlertCircle, Activity as ActivityIcon, CheckCircle, Mic, MicOff, BrainCircuit } from 'lucide-react';
import { isBefore, parse, subHours } from 'date-fns';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '../components/ui/dialog';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { getDoctors, getAppointments, getCurrentUser, signOut, rescheduleAppointment, bookEmergencySlot, cancelAppointment } from '../utils/api';
import { toast } from 'sonner';

import { DashboardHeader } from '../components/DashboardHeader';
import { StatCard } from '../components/StatCard';
import { AIChatbot } from '../components/AIChatbot';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, MapPin, Zap, Activity as HeartActivity } from 'lucide-react';
import { useLiveEvents } from '../hooks/useLiveEvents';

interface Doctor {
  userId: string;
  name: string;
  specialty: string;
  experience: string;
  rating: number;
  reviewCount: number;
  available: boolean;
}

interface Appointment {
  id: string;
  doctorName: string;
  date: string;
  time: string;
  status: string;
  notes: string;
}

const TIME_SLOTS = [
  '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM',
  '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM',
  '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM',
  '04:00 PM', '04:30 PM', '05:00 PM', '05:30 PM',
];

export function PatientDashboard() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Rescheduling state
  const [showRescheduleDialog, setShowRescheduleDialog] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');
  const [isRescheduling, setIsRescheduling] = useState(false);

  // Emergency booking state
  const [showEmergencyDialog, setShowEmergencyDialog] = useState(false);
  const [emergencyCondition, setEmergencyCondition] = useState('');
  const [emergencyAge, setEmergencyAge] = useState('');
  const [emergencyGender, setEmergencyGender] = useState('');
  const [emergencyCause, setEmergencyCause] = useState('');
  const [isBookingEmergency, setIsBookingEmergency] = useState(false);

  // Triage Animation State
  const [triageStage, setTriageStage] = useState<'idle' | 'scanning' | 'scoring' | 'matched'>('idle');
  const [mockScore, setMockScore] = useState(0);

  // Live Queue State
  const [queuePositions, setQueuePositions] = useState<Record<string, { position: number, waitTime: number }>>({});
  
  // Voice input state
  const [isListening, setIsListening] = useState<'condition' | 'cause' | null>(null);

  // Initialize and update queue
  useEffect(() => {
    const initialQueue: Record<string, { position: number, waitTime: number }> = {};
    const today = new Date().toISOString().split('T')[0];
    
    appointments.forEach(apt => {
      if (apt.status === 'scheduled' && apt.date === today) {
        initialQueue[apt.id] = {
          position: Math.floor(Math.random() * 5) + 1,
          waitTime: Math.floor(Math.random() * 20) + 5
        };
      }
    });
    setQueuePositions(initialQueue);

    const interval = setInterval(() => {
      setQueuePositions(prev => {
        const newQueue = { ...prev };
        let updated = false;
        Object.keys(newQueue).forEach(id => {
          if (newQueue[id].position > 1 && Math.random() > 0.7) {
            newQueue[id].position -= 1;
            newQueue[id].waitTime = Math.max(0, newQueue[id].waitTime - Math.floor(Math.random() * 5 + 2));
            updated = true;
          }
        });
        return updated ? newQueue : prev;
      });
    }, 15000); // update every 15 seconds

    return () => clearInterval(interval);
  }, [appointments]);

  const startListening = (field: 'condition' | 'cause') => {
    // @ts-ignore
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast.error("Speech recognition is not supported in this browser.");
      return;
    }
    
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(field);
      toast.info("Listening... Speak now");
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      if (field === 'condition') setEmergencyCondition(transcript);
      if (field === 'cause') setEmergencyCause(transcript);
    };

    recognition.onerror = (event: any) => {
      console.error(event.error);
      toast.error("Failed to recognize speech. Please try again.");
      setIsListening(null);
    };

    recognition.onend = () => {
      setIsListening(null);
    };

    recognition.start();
  };

  // Trigger live AI event mocking
  useLiveEvents('patient');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Load profile
      const userProfile = getCurrentUser();
      
      if (!userProfile) {
        toast.error('Please log in');
        navigate('/auth');
        return;
      }
      
      setProfile(userProfile);

      if (userProfile.role !== 'patient') {
        toast.error('Access denied: Patients only');
        navigate('/auth');
        return;
      }

      // Load doctors
      const doctorsList = await getDoctors();
      setDoctors(doctorsList);

      // Load appointments
      const aptList = await getAppointments();
      setAppointments(aptList);
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Failed to load dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOut();
    localStorage.removeItem('access_token');
    navigate('/');
    toast.success('Logged out successfully');
  };

  const isRescheduleAllowed = (dateStr: string, timeStr: string) => {
    try {
      // Parse appointment date and time (e.g., "2026-04-17" and "10:00 AM")
      const aptDateTime = parse(`${dateStr} ${timeStr}`, 'yyyy-MM-dd hh:mm a', new Date());
      const now = new Date();
      const deadline = subHours(aptDateTime, 2); // Cannot reschedule after 2 hours before the appointment
      
      return isBefore(now, deadline);
    } catch (e) {
      console.error('Error calculating reschedule allowance:', e);
      return false;
    }
  };

  const handleRescheduleClick = (e: React.MouseEvent, appointment: Appointment) => {
    e.stopPropagation();
    if (!isRescheduleAllowed(appointment.date, appointment.time)) {
      toast.error('Rescheduling is only allowed at least 2 hours before the appointment.');
      return;
    }
    setSelectedAppointment(appointment);
    setNewDate(appointment.date);
    setNewTime(appointment.time);
    setShowRescheduleDialog(true);
  };

  const handleConfirmReschedule = async () => {
    if (!selectedAppointment || !newDate || !newTime) return;

    setIsRescheduling(true);
    try {
      await rescheduleAppointment(selectedAppointment.id, newDate, newTime);
      toast.success('Appointment rescheduled successfully!');
      setShowRescheduleDialog(false);
      // Reload appointments
      const aptList = await getAppointments();
      setAppointments(aptList);
    } catch (error: any) {
      console.error('Error rescheduling:', error);
      toast.error(error.message || 'Failed to reschedule appointment');
    } finally {
      setIsRescheduling(false);
    }
  };

  const handleCancelAppointment = async (appointmentId: string) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) return;

    try {
      await cancelAppointment(appointmentId);
      toast.success('Appointment cancelled successfully');
      // Reload appointments
      const aptList = await getAppointments();
      setAppointments(aptList);
    } catch (error: any) {
      console.error('Error cancelling appointment:', error);
      toast.error(error.message || 'Failed to cancel appointment');
    }
  };

  const handleEmergencyBooking = async () => {
    if (!emergencyCondition || !emergencyAge || !emergencyGender || !emergencyCause) {
      toast.error('Please fill in all details');
      return;
    }

    setTriageStage('scanning');
    
    // Simulate multi-stage animation
    setTimeout(() => {
      setTriageStage('scoring');
      // Animate score
      let currentScore = 0;
      const scoreInterval = setInterval(() => {
        currentScore += 5;
        if (currentScore > 85) currentScore = 85;
        setMockScore(currentScore);
        if (currentScore === 85) clearInterval(scoreInterval);
      }, 50);

      setTimeout(async () => {
        setTriageStage('matched');
        
        setIsBookingEmergency(true);
        try {
          await bookEmergencySlot(emergencyCondition, emergencyAge, emergencyGender, emergencyCause);
          setTimeout(async () => {
            toast.success('Emergency slot booked successfully!');
            setShowEmergencyDialog(false);
            setTriageStage('idle');
            setMockScore(0);
            setEmergencyCondition('');
            setEmergencyAge('');
            setEmergencyGender('');
            setEmergencyCause('');
            
            const aptList = await getAppointments();
            setAppointments(aptList);
          }, 2000); // Give time to see the matched state
        } catch (error: any) {
          console.error('Error booking emergency slot:', error);
          toast.error(error.message || 'Failed to book emergency slot');
          setTriageStage('idle');
        } finally {
          setIsBookingEmergency(false);
        }
      }, 1500);
    }, 2000);
  };

  const filteredDoctors = doctors.filter((doctor) =>
    doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doctor.specialty.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const upcomingAppointments = appointments.filter(
    (apt) => apt.status === 'scheduled'
  );

  const completedAppointments = appointments.filter(
    (apt) => apt.status === 'completed'
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50/90">
        <header className="h-20 bg-white/80 border-b border-gray-100"></header>
        <div className="container mx-auto px-4 py-8">
          <div className="h-12 w-1/3 bg-gray-200 rounded-lg animate-pulse mb-8"></div>
          
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {[1, 2, 3].map(i => (
              <Card key={i} className="border-0 shadow-sm bg-white">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse"></div>
                    <div className="space-y-2 flex-1">
                      <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse"></div>
                      <div className="h-6 w-1/3 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card className="md:col-span-2 border-0 shadow-sm bg-white min-h-[300px]">
              <CardContent className="p-6 space-y-4">
                <div className="h-6 w-1/3 bg-gray-200 rounded animate-pulse mb-6"></div>
                {[1, 2].map(i => (
                  <div key={i} className="h-20 bg-gray-100 rounded-xl animate-pulse"></div>
                ))}
              </CardContent>
            </Card>
            <Card className="border-0 shadow-sm bg-white min-h-[300px]">
              <CardContent className="p-6 space-y-4">
                <div className="h-12 w-12 bg-gray-200 rounded-full animate-pulse mx-auto mb-4"></div>
                <div className="h-6 w-2/3 bg-gray-200 rounded animate-pulse mx-auto"></div>
                <div className="h-10 w-full bg-gray-200 rounded animate-pulse mt-8"></div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen bg-gradient-to-br from-gray-50/90 via-white/90 to-blue-50/90"
      style={{ 
        backgroundImage: 'url("https://images.unsplash.com/photo-1551076805-e1869033e561?q=80&w=2000")',
        backgroundSize: 'cover',
        backgroundAttachment: 'fixed',
        backgroundPosition: 'center',
        backgroundBlendMode: 'overlay'
      }}
    >

      
      <DashboardHeader 
        userName={profile?.name}
        userRole="patient"
        subtitle="Patient Portal"
        onLogout={handleLogout}
      />

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-indigo-700 mb-2">
            Welcome, {profile?.name} 👋
          </h2>
          <div className="flex items-center justify-between">
            <p className="text-lg text-gray-600 font-medium">AI-Powered Smart Healthcare Orchestrator</p>
            <Button 
              onClick={() => setShowEmergencyDialog(true)}
              className="bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-200 animate-pulse-slow px-6 py-6 rounded-2xl flex items-center gap-2 group"
            >
              <AlertCircle className="w-6 h-6 group-hover:rotate-12 transition-transform" />
              <span className="text-lg font-bold uppercase tracking-tight">Emergency Slot</span>
            </Button>
          </div>
        </motion.div>

        {/* Stats Overview */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <StatCard
            title="Upcoming Appointments"
            value={upcomingAppointments.length}
            icon={Calendar}
            iconColor="text-blue-600"
            iconBgColor="bg-blue-100"
          />
          <StatCard
            title="Total Appointments"
            value={appointments.length}
            icon={Clock}
            iconColor="text-green-600"
            iconBgColor="bg-green-100"
          />
          <StatCard
            title="Available Doctors"
            value={doctors.filter((d) => d.available).length}
            icon={Stethoscope}
            iconColor="text-purple-600"
            iconBgColor="bg-purple-100"
            subtitle={`Out of ${doctors.length} total`}
          />
        </div>

        {/* Patient Digital Twin & Premium */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="md:col-span-2 border-2 shadow-lg overflow-hidden relative bg-gradient-to-br from-indigo-50 to-blue-50">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <HeartActivity className="w-32 h-32 text-blue-900" />
            </div>
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                  <Activity className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-gray-900">Patient Health Timeline</h3>
                  <p className="text-xs text-indigo-600 font-medium">AI monitored journey & recorded vitals</p>
                </div>
              </div>
              <div className="relative z-10 pl-4 border-l-2 border-indigo-200 space-y-4">
                <div className="relative">
                  <div className="absolute -left-[21px] top-1 w-3 h-3 bg-indigo-500 rounded-full ring-4 ring-indigo-100" />
                  <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1">Today</p>
                  <div className="bg-white/80 backdrop-blur rounded-xl p-3 border border-white shadow-sm">
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-sm font-bold text-gray-800">Routine Scan</span>
                      <Badge variant="outline" className="text-[10px] bg-green-50 text-green-700">Normal</Badge>
                    </div>
                    <p className="text-xs text-gray-500">All vitals stable. Risk score: 12/100</p>
                  </div>
                </div>
                <div className="relative">
                  <div className="absolute -left-[21px] top-1 w-3 h-3 bg-slate-300 rounded-full ring-4 ring-slate-100" />
                  <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1">Oct 2025</p>
                  <div className="bg-white/50 backdrop-blur rounded-xl p-3 border border-white/50 shadow-sm opacity-80">
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-sm font-bold text-gray-700">Dermatology Consult</span>
                      <Badge variant="outline" className="text-[10px] bg-slate-100 text-slate-600">Resolved</Badge>
                    </div>
                    <p className="text-xs text-gray-500">Minor rash. Prescription completed.</p>
                  </div>
                </div>
                <div className="mt-4 bg-gradient-to-r from-blue-900 to-indigo-900 rounded-xl p-3 shadow-inner flex items-center justify-between border border-indigo-500/30">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-semibold text-indigo-100 uppercase tracking-widest">
                      Blockchain Secured
                    </span>
                  </div>
                  <code className="text-[10px] text-emerald-300 bg-black/30 px-2 py-1 rounded font-mono truncate max-w-[120px]" title={profile?.blockchainHash || "Pending"}>
                    {profile?.blockchainHash || '0x' + Math.random().toString(16).slice(2, 10).repeat(4) + '...'}
                  </code>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-b from-slate-900 to-indigo-900 text-white relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-600" />
            <CardContent className="p-6 flex flex-col justify-center h-full">
              <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-yellow-400" />
              </div>
              <h3 className="font-bold text-xl mb-2">Priority Pass</h3>
              <p className="text-sm text-indigo-200 mb-4">Upgrade to premium for zero wait times and exclusive top-tier specialists.</p>
              <Button className="w-full bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600 text-slate-900 font-bold border-0">
                Upgrade Now
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Appointments */}
        {upcomingAppointments.length > 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="mb-8 border-2 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Calendar className="w-6 h-6 text-blue-600" />
                  Your Upcoming Appointments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {upcomingAppointments.map((appointment, index) => (
                    <motion.div
                      key={appointment.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="flex items-center justify-between p-4 border-2 rounded-xl hover:border-blue-200 hover:bg-blue-50/50 transition-all duration-200 cursor-pointer"
                    >
                      <div className="flex-1">
                        <h4 className="font-semibold text-lg text-gray-900">
                          Dr. {appointment.doctorName}
                        </h4>
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                          <span className="flex items-center gap-1.5">
                            <Calendar className="w-4 h-4" />
                            {appointment.date}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Clock className="w-4 h-4" />
                            {appointment.time}
                          </span>
                        </div>
                        {appointment.notes && (
                          <p className="text-sm text-gray-500 mt-2 bg-gray-50 p-2 rounded">
                            Note: {appointment.notes}
                          </p>
                        )}
                      </div>
                      <Badge className="bg-green-100 text-green-800 border-green-200 px-3 py-1 mx-4">
                        {appointment.status}
                      </Badge>
                      <div className="flex flex-col items-end gap-1">
                        {/* Live Queue Tracker */}
                        {appointment.date === new Date().toISOString().split('T')[0] && queuePositions[appointment.id] && (
                           <div className="flex flex-col items-end bg-blue-50 p-2 rounded-lg border border-blue-100 mb-2 w-full min-w-[140px]">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="relative flex h-3 w-3">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                  <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
                                </span>
                                <span className="text-xs font-bold text-blue-800 uppercase">Live Queue</span>
                              </div>
                              <div className="flex justify-between w-full text-sm">
                                <span className="text-gray-600 font-medium">Wait: <strong className="text-blue-700">~{queuePositions[appointment.id].waitTime}m</strong></span>
                                <span className="text-gray-600 font-medium ml-2">#<strong className="text-blue-700 text-lg">{queuePositions[appointment.id].position}</strong></span>
                              </div>
                           </div>
                        )}
                        <div className="flex items-center justify-end gap-2">
                          {!isRescheduleAllowed(appointment.date, appointment.time) && (
                            <span className="text-[10px] text-red-500 font-medium bg-red-50 px-2 py-0.5 rounded-full border border-red-100">
                              Too late to reschedule
                            </span>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-blue-200 text-blue-600 hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={!isRescheduleAllowed(appointment.date, appointment.time)}
                            onClick={(e) => handleRescheduleClick(e, appointment)}
                          >
                            Reschedule
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={!isRescheduleAllowed(appointment.date, appointment.time)}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCancelAppointment(appointment.id);
                            }}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <Card className="mb-8 border-2 border-dashed border-gray-200 bg-white/50 backdrop-blur shadow-sm">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-4 border border-blue-100">
                <Calendar className="w-10 h-10 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-700">No Upcoming Appointments</h3>
              <p className="text-gray-500 mt-2 mb-6 text-center max-w-md">You don't have any appointments scheduled right now. Book a new consultation or use our Emergency Slot for urgent care.</p>
              <Button onClick={() => {
                const searchInput = document.querySelector('input[placeholder="Search by name or specialty..."]') as HTMLInputElement;
                if (searchInput) searchInput.focus();
              }} className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 rounded-xl shadow-lg shadow-blue-200">
                Find a Doctor
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Completed Appointments */}
        {completedAppointments.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="mb-8 border-2 shadow-lg opacity-80 backdrop-blur-sm bg-white/60">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl text-gray-700">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  Your Completed Appointments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {completedAppointments.map((appointment, index) => (
                    <div
                      key={appointment.id}
                      className="flex items-center justify-between p-4 border rounded-xl bg-gray-50/80"
                    >
                      <div className="flex-1">
                        <h4 className="font-semibold text-lg text-gray-700">
                          Dr. {appointment.doctorName}
                        </h4>
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                          <span className="flex items-center gap-1.5">
                            <Calendar className="w-4 h-4" />
                            {appointment.date}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Clock className="w-4 h-4" />
                            {appointment.time}
                          </span>
                        </div>
                        {appointment.notes && (
                          <p className="text-sm text-gray-400 mt-2 bg-gray-100/50 p-2 rounded">
                            Note: {appointment.notes}
                          </p>
                        )}
                      </div>
                      <Badge className="bg-gray-200 text-gray-700 border-gray-300 px-3 py-1 font-bold">
                        Completed
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Reschedule Dialog */}
        <Dialog open={showRescheduleDialog} onOpenChange={setShowRescheduleDialog}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Reschedule Appointment</DialogTitle>
              <DialogDescription>
                Choose a new date and time for your appointment with Dr. {selectedAppointment?.doctorName}.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="date" className="text-right">
                  Date
                </Label>
                <Input
                  id="date"
                  type="date"
                  className="col-span-3"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div className="grid gap-2">
                <Label>Time Slot</Label>
                <div className="grid grid-cols-3 gap-2">
                  {TIME_SLOTS.map((time) => (
                    <Button
                      key={time}
                      variant={newTime === time ? 'default' : 'outline'}
                      size="sm"
                      className="text-xs"
                      onClick={() => setNewTime(time)}
                    >
                      {time}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setShowRescheduleDialog(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleConfirmReschedule} 
                disabled={isRescheduling || !newDate || !newTime}
              >
                {isRescheduling ? 'Saving...' : 'Confirm Reschedule'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Emergency Dialog */}
        <Dialog open={showEmergencyDialog} onOpenChange={setShowEmergencyDialog}>
          <DialogContent className="sm:max-w-[500px] border-t-8 border-t-red-600 rounded-3xl overflow-hidden">
            {triageStage !== 'idle' ? (
              <div className="py-12 flex flex-col items-center justify-center space-y-6">
                <motion.div 
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="relative w-32 h-32 flex items-center justify-center"
                >
                  <div className="absolute inset-0 border-4 border-red-100 rounded-full"></div>
                  {triageStage === 'scanning' && (
                    <motion.div 
                      className="absolute inset-0 border-4 border-t-red-600 rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                  )}
                  {triageStage === 'scoring' && (
                    <div className="text-4xl font-black text-red-600">{mockScore}</div>
                  )}
                  {triageStage === 'matched' && (
                    <motion.div 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-full h-full bg-green-500 rounded-full flex items-center justify-center text-white"
                    >
                      <CheckCircle className="w-16 h-16" />
                    </motion.div>
                  )}
                  {(triageStage === 'scanning' || triageStage === 'scoring') && (
                    <BrainCircuit className={`w-12 h-12 ${triageStage === 'scanning' ? 'text-red-500 animate-pulse' : 'text-red-100'}`} />
                  )}
                </motion.div>
                
                <div className="text-center">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {triageStage === 'scanning' && "Analyzing Symptoms..."}
                    {triageStage === 'scoring' && "Calculating Severity..."}
                    {triageStage === 'matched' && "Specialist Matched!"}
                  </h3>
                  <p className="text-gray-500">
                    {triageStage === 'scanning' && "Neural engine is processing your data"}
                    {triageStage === 'scoring' && "Assessing priority against live queue"}
                    {triageStage === 'matched' && "Routing you to the best available doctor"}
                  </p>
                </div>
              </div>
            ) : (
              <>
                <DialogHeader className="space-y-3">
                  <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center mb-2">
                    <AlertCircle className="w-7 h-7 text-red-600" />
                  </div>
                  <DialogTitle className="text-3xl font-black text-gray-900 tracking-tight lowercase">
                    Emergency <span className="text-red-600 uppercase italic">Slot</span> Booking
                  </DialogTitle>
                  <DialogDescription className="text-gray-500 text-base">
                    Provide critical details for immediate medical attention. Our system will assign the first available doctor.
                  </DialogDescription>
                </DialogHeader>

                <div className="grid gap-6 py-6">
                  <div className="grid gap-3">
                    <Label htmlFor="condition" className="text-sm font-bold text-gray-700 uppercase tracking-wider">Physical Condition</Label>
                    <div className="relative">
                      <Input
                        id="condition"
                        placeholder="e.g. Severe headache, High fever..."
                        className="h-14 border-2 focus:border-red-400 focus:ring-0 rounded-xl px-4 text-lg pr-12"
                        value={emergencyCondition}
                        onChange={(e) => setEmergencyCondition(e.target.value)}
                      />
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        className={`absolute right-2 top-2 h-10 w-10 rounded-lg ${isListening === 'condition' ? 'bg-red-100 text-red-600 animate-pulse' : 'text-gray-400 hover:text-red-500'}`}
                        onClick={() => isListening === 'condition' ? setIsListening(null) : startListening('condition')}
                      >
                        {isListening === 'condition' ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-3">
                      <Label htmlFor="age" className="text-sm font-bold text-gray-700 uppercase tracking-wider">Patient Age</Label>
                      <Input
                        id="age"
                        type="number"
                        placeholder="Years"
                        className="h-14 border-2 focus:border-red-400 focus:ring-0 rounded-xl px-4 text-lg"
                        value={emergencyAge}
                        onChange={(e) => setEmergencyAge(e.target.value)}
                      />
                    </div>
                    <div className="grid gap-3">
                      <Label htmlFor="gender" className="text-sm font-bold text-gray-700 uppercase tracking-wider">Gender</Label>
                      <Select value={emergencyGender} onValueChange={setEmergencyGender}>
                        <SelectTrigger className="h-14 border-2 focus:border-red-400 rounded-xl px-4 text-lg">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid gap-3">
                    <Label htmlFor="cause" className="text-sm font-bold text-gray-700 uppercase tracking-wider">Cause / Symptoms</Label>
                    <div className="relative">
                      <Input
                        id="cause"
                        placeholder="Briefly describe what happened..."
                        className="h-14 border-2 focus:border-red-400 focus:ring-0 rounded-xl px-4 text-lg pr-12"
                        value={emergencyCause}
                        onChange={(e) => setEmergencyCause(e.target.value)}
                      />
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        className={`absolute right-2 top-2 h-10 w-10 rounded-lg ${isListening === 'cause' ? 'bg-red-100 text-red-600 animate-pulse' : 'text-gray-400 hover:text-red-500'}`}
                        onClick={() => isListening === 'cause' ? setIsListening(null) : startListening('cause')}
                      >
                        {isListening === 'cause' ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
                      </Button>
                    </div>
                  </div>
                </div>

                <DialogFooter className="sm:justify-between gap-4 mt-2">
                  <Button 
                    variant="ghost" 
                    className="flex-1 h-14 rounded-xl text-gray-500 hover:bg-gray-100 font-bold"
                    onClick={() => setShowEmergencyDialog(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleEmergencyBooking} 
                    disabled={isBookingEmergency || !emergencyCondition || !emergencyAge || !emergencyGender || !emergencyCause}
                    className="flex-[2] h-14 bg-red-600 hover:bg-red-700 text-white rounded-xl text-lg font-black uppercase tracking-tighter shadow-lg shadow-red-200"
                  >
                    Confirm Emergency Request
                  </Button>
                </DialogFooter>
              </>
            )}
          </DialogContent>
        </Dialog>

        {/* Find Doctors */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="border-2 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl mb-4">
                <Stethoscope className="w-6 h-6 text-blue-600" />
                Find a Doctor
              </CardTitle>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search by name or specialty..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-12 border-2 focus:border-blue-300"
                />
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {filteredDoctors.length === 0 ? (
                  <div className="col-span-2 text-center py-12">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Search className="w-10 h-10 text-gray-400" />
                    </div>
                    <p className="text-gray-500 text-lg">No doctors found</p>
                    <p className="text-gray-400 text-sm mt-2">Try a different search term</p>
                  </div>
                ) : (
                  filteredDoctors.map((doctor, index) => (
                    <motion.div
                      key={doctor.userId}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      <Card
                        className="hover:shadow-xl transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-blue-200 hover:-translate-y-1"
                        onClick={() => navigate(`/doctor/${doctor.userId}`)}
                      >
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                              <h4 className="font-semibold text-lg text-gray-900">
                                Dr. {doctor.name}
                              </h4>
                              <p className="text-sm text-blue-600 font-medium mt-1">
                                {doctor.specialty}
                              </p>
                            </div>
                            {doctor.available && (
                              <div className="flex flex-col items-end gap-2">
                                <Badge className="bg-green-100 text-green-800 border-green-200">
                                  Available
                                </Badge>
                                <Badge variant="outline" className="text-xs text-gray-500 bg-gray-50 flex items-center gap-1 border-gray-200">
                                  <MapPin className="w-3 h-3 text-indigo-400" /> {(Math.random() * 5 + 0.5).toFixed(1)} km away
                                </Badge>
                              </div>
                            )}
                          </div>
                          <div className="space-y-2 text-sm text-gray-600 mb-4">
                            <p className="flex items-center gap-2">
                              <Clock className="w-4 h-4" />
                              Experience: {doctor.experience}
                            </p>
                            <div className="flex items-center gap-2">
                              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                              <span className="font-medium text-gray-900">
                                {doctor.rating.toFixed(1)}
                              </span>
                              <span className="text-gray-500">
                                ({doctor.reviewCount} reviews)
                              </span>
                            </div>
                          </div>
                          <Button 
                            className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/doctor/${doctor.userId}`);
                            }}
                          >
                            View Profile & Book
                          </Button>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
      
      {/* AI Assistant Chatbot */}
      <AIChatbot />
    </div>
  );
}
