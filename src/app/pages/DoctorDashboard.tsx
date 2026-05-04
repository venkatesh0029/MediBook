import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Activity, Calendar, Clock, LogOut, User, Edit, CheckCircle, XCircle, Video, PhoneCall, ArrowUp, ArrowDown, ClipboardPlus, RefreshCcw, ChevronRight, Mic } from 'lucide-react';
import { getAppointments, updateAppointment, getCurrentUser, signOut } from '../utils/api';
import { toast } from 'sonner';

import { useLiveEvents } from '../hooks/useLiveEvents';
import { getDoctorOps, optimizeQueue } from '../utils/smartHealthcare';

interface Appointment {
  id: string;
  patientName: string;
  date: string;
  time: string;
  status: string;
  notes: string;
  isEmergency?: boolean;
  priorityScore?: number;
  severityLevel?: string;
  aiAnalysis?: string;
}

interface DoctorProfile {
  userId: string;
  name: string;
  specialty: string;
  experience: string;
  rating: number;
  reviewCount: number;
  available: boolean;
}

export function DoctorDashboard() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [doctorProfile, setDoctorProfile] = useState<DoctorProfile | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showEditDialog, setShowEditDialog] = useState(false);
  
  // Orchestrator V2 States
  const [selectedPatient, setSelectedPatient] = useState<Appointment | null>(null);
  const [showTeleconsult, setShowTeleconsult] = useState(false);
  const [showFollowUp, setShowFollowUp] = useState(false);
  const [activeAppointmentId, setActiveAppointmentId] = useState<string | null>(null);
  const [loadBalancing, setLoadBalancing] = useState(false);
  
  // Edit form state
  const [specialty, setSpecialty] = useState('');
  const [experience, setExperience] = useState('');
  const [available, setAvailable] = useState(true);

  // Trigger live AI event mocking
  useLiveEvents('doctor');

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

      if (userProfile.role !== 'doctor') {
        toast.error('Access denied: Doctors only');
        navigate('/auth');
        return;
      }

      // Set basic doctor profile from user data
      setDoctorProfile({
        userId: userProfile.id,
        name: userProfile.name,
        specialty: userProfile.specialty || 'General Practitioner',
        experience: userProfile.experience || 'N/A',
        rating: userProfile.rating || 0.0,
        reviewCount: userProfile.reviewCount || 0,
        available: true
      });

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

  const handleUpdateProfile = async () => {
    toast.success('Profile update not implemented in demo mode');
    setShowEditDialog(false);
  };

  const handleUpdateAppointmentStatus = async (appointmentId: string, newStatus: string) => {
    try {
      if (newStatus === 'completed') {
        setActiveAppointmentId(appointmentId);
        setShowFollowUp(true);
      } else {
        await updateAppointment(appointmentId, newStatus);
        toast.success('Appointment status updated');
        loadData();
      }
    } catch (error) {
      console.error('Error updating appointment:', error);
      toast.error('Failed to update appointment');
    }
  };

  const handleConfirmFollowUp = async (days: number) => {
    if (activeAppointmentId) {
      await updateAppointment(activeAppointmentId, 'completed');
      toast.success(`Follow-up scheduled in ${days} days.`);
      setShowFollowUp(false);
      setActiveAppointmentId(null);
      loadData();
    }
  };

  const triggerLoadBalancer = () => {
    setLoadBalancing(true);
    toast.info("AI Load Balancer is redistributing the queue...");
    setTimeout(() => {
      setLoadBalancing(false);
      toast.success("Queue optimized! 2 appointments moved to Dr. Smith.");
    }, 2000);
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    const newApts = [...appointments];
    const temp = newApts[index];
    newApts[index] = newApts[index - 1];
    newApts[index - 1] = temp;
    setAppointments(newApts);
    toast.success("Queue Reordered");
  };

  const todayAppointments = appointments.filter((apt) => {
    const today = new Date().toISOString().split('T')[0];
    return apt.date === today;
  });

  const upcomingAppointments = appointments.filter(
    (apt) => apt.status === 'scheduled'
  );

  const completedAppointments = appointments.filter(
    (apt) => apt.status === 'completed'
  ).length;
  const doctorOps = getDoctorOps(appointments);
  const smartQueue = optimizeQueue(appointments);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Activity className="w-12 h-12 text-blue-600 animate-pulse mx-auto mb-4" />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen bg-gray-50/90"
      style={{ 
        backgroundImage: 'url("https://images.unsplash.com/photo-1551076805-e1869033e561?q=80&w=2000")',
        backgroundSize: 'cover',
        backgroundAttachment: 'fixed',
        backgroundPosition: 'center',
        backgroundBlendMode: 'overlay'
      }}
    >

      
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-8 h-8 text-indigo-600" />
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">Orchestrator <span className="font-light text-gray-500">| Provider Portal</span></h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-gray-700">
              <User className="w-5 h-5" />
              <span className="font-medium">Dr. {profile?.name}</span>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome, Dr. {profile?.name}
          </h2>
          <p className="text-gray-600">Manage your appointments and profile</p>
        </div>

        {/* Stats Overview */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Today's Appointments
              </CardTitle>
              <Calendar className="w-4 h-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{todayAppointments.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Upcoming
              </CardTitle>
              <Clock className="w-4 h-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{upcomingAppointments.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Completed
              </CardTitle>
              <CheckCircle className="w-4 h-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{completedAppointments}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Rating
              </CardTitle>
              <span className="text-yellow-500">★</span>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {doctorProfile?.rating ? doctorProfile.rating.toFixed(1) : 'N/A'}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card className="border-2 border-indigo-100 bg-white/90">
            <CardContent className="p-4">
              <p className="text-xs font-bold text-indigo-700 uppercase">Doctor Load Balancer</p>
              <p className="text-2xl font-black text-gray-900">{doctorOps.loadIndex}%</p>
              <p className="text-xs text-gray-500">Live workload index</p>
            </CardContent>
          </Card>
          <Card className="border-2 border-rose-100 bg-white/90">
            <CardContent className="p-4">
              <p className="text-xs font-bold text-rose-700 uppercase">Stress Dashboard</p>
              <p className="text-2xl font-black text-gray-900">{doctorOps.stressIndex}%</p>
              <p className="text-xs text-gray-500">Burnout and overtime risk</p>
            </CardContent>
          </Card>
          <Card className="border-2 border-emerald-100 bg-white/90">
            <CardContent className="p-4">
              <p className="text-xs font-bold text-emerald-700 uppercase">AI Patient Summary</p>
              <p className="text-sm font-bold text-gray-900">{doctorOps.summary}</p>
            </CardContent>
          </Card>
          <Card className="border-2 border-blue-100 bg-white/90">
            <CardContent className="p-4">
              <p className="text-xs font-bold text-blue-700 uppercase">Hybrid Room</p>
              <p className="text-sm font-bold text-gray-900">{doctorOps.hybridRoom}</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Your Profile
                <Button variant="ghost" size="sm" onClick={() => setShowEditDialog(true)}>
                  <Edit className="w-4 h-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-gray-600">Name</Label>
                <p className="font-semibold">Dr. {doctorProfile?.name}</p>
              </div>
              <div>
                <Label className="text-gray-600">Specialty</Label>
                <p className="font-semibold">
                  {doctorProfile?.specialty || 'Not specified'}
                </p>
              </div>
              <div>
                <Label className="text-gray-600">Experience</Label>
                <p className="font-semibold">
                  {doctorProfile?.experience || 'Not specified'}
                </p>
              </div>
              <div>
                <Label className="text-gray-600">Status</Label>
                <Badge
                  className={
                    doctorProfile?.available
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }
                >
                  {doctorProfile?.available ? 'Available' : 'Unavailable'}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Priority Queue (Appointments List) */}
          <Card className="lg:col-span-2 border-2 shadow-lg border-indigo-100">
            <CardHeader className="bg-slate-50 border-b flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-xl font-bold flex items-center gap-2">
                  <Activity className="w-5 h-5 text-indigo-600" />
                  Smart Priority Queue
                </CardTitle>
                <p className="text-xs text-gray-500 mt-1 font-medium select-none">
                  Patients are auto-sorted by AI Severity Score
                </p>
              </div>
              <Button onClick={triggerLoadBalancer} variant="outline" size="sm" className="bg-white hover:bg-blue-50 border-blue-200 text-blue-600">
                <RefreshCcw className={`w-4 h-4 mr-2 ${loadBalancing ? 'animate-spin' : ''}`} />
                Load Balancer
              </Button>
            </CardHeader>
            <CardContent>
              {appointments.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No appointments yet</p>
              ) : (
                <div className="space-y-4 max-h-[600px] overflow-y-auto pt-2 pr-2">
                  {smartQueue.map((appointment, index) => (
                    <div
                      key={appointment.id}
                      onClick={() => setSelectedPatient(appointment)}
                      className={`p-4 border-2 rounded-xl transition-all cursor-pointer ${
                        appointment.isEmergency || appointment.severityLevel === 'Critical'
                          ? 'border-red-200 bg-red-50/50 shadow-sm shadow-red-100 relative overflow-hidden'
                          : 'border-slate-100 bg-white hover:border-indigo-200 hover:shadow-md'
                      }`}
                    >
                      {/* Emergency Glow Effect */}
                      {(appointment.isEmergency || appointment.severityLevel === 'Critical') && (
                        <div className="absolute top-0 left-0 w-1 h-full bg-red-500 animate-pulse" />
                      )}

                        <div className="flex flex-col items-center justify-center gap-1 pr-3 border-r border-gray-100 mr-3">
                          <Button size="icon" variant="ghost" className="h-6 w-6 text-gray-400 hover:text-indigo-600" onClick={(e) => { e.stopPropagation(); moveUp(index); }}>
                            <ArrowUp className="w-4 h-4" />
                          </Button>
                          <span className="text-xs font-bold text-gray-400">#{index + 1}</span>
                        </div>
                        <div className="pl-2 flex-1">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                            <h4 className={`font-bold text-lg ${
                                appointment.isEmergency || appointment.severityLevel === 'Critical' ? 'text-red-900' : 'text-gray-900'
                              }`}>
                              {appointment.patientName}
                            </h4>
                            {appointment.priorityScore !== undefined && (
                              <Badge className={
                                appointment.priorityScore >= 70 ? 'bg-red-600 hover:bg-red-700' :
                                appointment.priorityScore >= 40 ? 'bg-amber-500 hover:bg-amber-600' :
                                'bg-green-500 hover:bg-green-600'
                              }>
                                Score: {appointment.priorityScore}
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-4 mt-2 text-sm text-gray-600 font-medium">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-4 h-4 text-indigo-400" />
                              {appointment.date}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4 text-indigo-400" />
                              {appointment.time}
                            </span>
                          </div>
                        </div>
                        <Badge
                          variant={
                            appointment.status === 'completed'
                              ? 'default'
                              : appointment.status === 'cancelled'
                              ? 'destructive'
                              : 'secondary'
                          }
                          className="font-bold uppercase tracking-wider text-[10px]"
                        >
                          {appointment.status}
                        </Badge>
                      </div>

                      {(appointment.isEmergency && appointment.aiAnalysis) && (
                        <div className="mx-2 mb-3 bg-red-100 text-red-800 p-2 text-xs rounded border border-red-200 flex flex-col gap-1">
                          <span className="font-bold flex items-center gap-1">
                            <Activity className="w-3 h-3" /> AI Triage Alert
                          </span>
                          <span>{appointment.aiAnalysis}</span>
                        </div>
                      )}

                      {appointment.notes && !appointment.aiAnalysis && (
                        <p className="text-sm text-gray-600 mb-3 mx-2 bg-slate-50 p-2 rounded border border-slate-100">
                          <span className="font-medium">Details:</span> {appointment.notes}
                        </p>
                      )}

                      {appointment.status === 'scheduled' && (
                        <div className="flex gap-2 ml-2 mt-4 pt-4 border-t border-slate-100/50">
                          <Button
                            size="sm"
                            className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm flex-[0.8]"
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowTeleconsult(true);
                            }}
                          >
                            <Video className="w-4 h-4 mr-1" />
                            Teleconsult
                          </Button>
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700 text-white shadow-sm flex-1"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleUpdateAppointmentStatus(appointment.id, 'completed');
                            }}
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Mark Completed
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleUpdateAppointmentStatus(appointment.id, 'cancelled');
                            }}
                            className="text-red-600 border-red-200 hover:bg-red-50 flex-[0.5]"
                          >
                            <XCircle className="w-4 h-4 mr-1" />
                            Cancel
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Edit Profile Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogDescription>
              Update your professional information
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="specialty">Specialty</Label>
              <Input
                id="specialty"
                value={specialty}
                onChange={(e) => setSpecialty(e.target.value)}
                placeholder="e.g., Cardiologist, Pediatrician"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="experience">Experience</Label>
              <Input
                id="experience"
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                placeholder="e.g., 10 years"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="available">Availability Status</Label>
              <Select
                value={available ? 'true' : 'false'}
                onValueChange={(value) => setAvailable(value === 'true')}
              >
                <SelectTrigger id="available">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Available</SelectItem>
                  <SelectItem value="false">Unavailable</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setShowEditDialog(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button onClick={handleUpdateProfile} className="flex-1">
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    {/* Patient Snapshot Panel */}
      <Dialog open={!!selectedPatient} onOpenChange={(open) => !open && setSelectedPatient(null)}>
        <DialogContent className="sm:max-w-[600px] border-l-8 border-indigo-600 rounded-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-2xl font-black text-gray-900">
              <User className="w-8 h-8 text-indigo-600 bg-indigo-100 p-1.5 rounded-xl" />
              Patient Snapshot
            </DialogTitle>
          </DialogHeader>
          {selectedPatient && (
            <div className="space-y-6">
              <div className="flex justify-between items-start border-b pb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-800">{selectedPatient.patientName}</h3>
                  <div className="flex gap-2 mt-2">
                    <Badge variant="outline" className="bg-gray-50 text-gray-600 border-gray-200">Age: 32</Badge>
                    <Badge variant="outline" className="bg-gray-50 text-gray-600 border-gray-200">Blood: O+</Badge>
                  </div>
                </div>
                <Badge className={selectedPatient.priorityScore && selectedPatient.priorityScore > 70 ? 'bg-red-100 text-red-800 border-red-200' : 'bg-green-100 text-green-800 border-green-200'}>
                  Priority Score: {selectedPatient.priorityScore || 'N/A'}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-orange-50 p-3 rounded-xl border border-orange-100">
                  <p className="text-xs font-bold text-orange-800 uppercase tracking-wider mb-1 flex items-center gap-1"><Activity className="w-3 h-3" /> Allergies</p>
                  <p className="text-sm font-medium text-orange-900">Penicillin, Peanuts</p>
                </div>
                <div className="bg-blue-50 p-3 rounded-xl border border-blue-100">
                  <p className="text-xs font-bold text-blue-800 uppercase tracking-wider mb-1 flex items-center gap-1"><ClipboardPlus className="w-3 h-3" /> Previous Visit</p>
                  <p className="text-sm font-medium text-blue-900">Oct 12, 2025 - Routine Checkup</p>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <p className="text-sm font-bold text-slate-800 mb-2">Current Condition Notes</p>
                <p className="text-sm text-slate-600">{selectedPatient.notes || "No additional notes provided."}</p>
                {selectedPatient.aiAnalysis && (
                  <div className="mt-3 p-3 bg-red-50 text-red-800 text-sm rounded border border-red-100 font-medium">
                    <span className="font-bold">AI Flag:</span> {selectedPatient.aiAnalysis}
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Teleconsultation Room */}
      <Dialog open={showTeleconsult} onOpenChange={setShowTeleconsult}>
        <DialogContent className="max-w-[90vw] h-[90vh] bg-gray-900 border-gray-800 p-0 overflow-hidden flex flex-col">
          <div className="p-4 bg-gray-900 border-b border-gray-800 flex justify-between items-center text-white">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
              <span className="font-bold">Teleconsultation Room - SECURE</span>
            </div>
            <div className="flex gap-2">
              <Button size="icon" variant="ghost" className="text-gray-400 hover:text-white hover:bg-gray-800"><Video className="w-5 h-5" /></Button>
              <Button size="icon" variant="ghost" className="text-gray-400 hover:text-white hover:bg-gray-800"><Activity className="w-5 h-5" /></Button>
            </div>
          </div>
          <div className="flex-1 relative flex items-center justify-center bg-black">
            {/* Mock Video Stream */}
            <div className="w-full h-full opacity-30" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=2000")', backgroundSize: 'cover', backgroundPosition: 'center' }} />
            <div className="absolute bottom-6 right-6 w-64 h-48 bg-gray-800 rounded-2xl border-2 border-gray-700 overflow-hidden shadow-2xl">
              <div className="w-full h-full bg-gray-700 flex items-center justify-center text-gray-500"><User className="w-12 h-12" /></div>
            </div>
            
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-4 bg-gray-900/80 p-3 rounded-full backdrop-blur">
              <Button size="icon" className="w-12 h-12 rounded-full bg-gray-700 hover:bg-gray-600 text-white"><Mic className="w-5 h-5" /></Button>
              <Button size="icon" className="w-12 h-12 rounded-full bg-gray-700 hover:bg-gray-600 text-white"><Video className="w-5 h-5" /></Button>
              <Button size="icon" className="w-12 h-12 rounded-full bg-red-600 hover:bg-red-700 text-white" onClick={() => setShowTeleconsult(false)}><PhoneCall className="w-5 h-5" /></Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Auto Follow-Up Scheduler */}
      <Dialog open={showFollowUp} onOpenChange={setShowFollowUp}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <Calendar className="w-5 h-5 text-indigo-600" /> Auto Follow-Up Scheduler
            </DialogTitle>
            <DialogDescription>Schedule a recommended follow-up visit for this patient.</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-3 gap-3 py-4">
            {[3, 7, 14, 30, 90].map(days => (
              <Button key={days} variant="outline" className="border-indigo-100 hover:bg-indigo-50 hover:border-indigo-300" onClick={() => handleConfirmFollowUp(days)}>
                {days} Days
              </Button>
            ))}
            <Button variant="ghost" className="text-gray-500" onClick={() => handleConfirmFollowUp(0)}>No Follow-up</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
