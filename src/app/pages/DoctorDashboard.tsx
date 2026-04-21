import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Activity, Calendar, Clock, LogOut, User, Edit, CheckCircle, XCircle } from 'lucide-react';
import { getAppointments, updateAppointment, getCurrentUser, signOut } from '../utils/api';
import { toast } from 'sonner';

import { useLiveEvents } from '../hooks/useLiveEvents';

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
      await updateAppointment(appointmentId, newStatus);

      toast.success('Appointment status updated');
      loadData();
    } catch (error) {
      console.error('Error updating appointment:', error);
      toast.error('Failed to update appointment');
    }
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
            </CardHeader>
            <CardContent>
              {appointments.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No appointments yet</p>
              ) : (
                <div className="space-y-4 max-h-[600px] overflow-y-auto pt-2 pr-2">
                  {[...appointments].sort((a, b) => (b.priorityScore || 0) - (a.priorityScore || 0)).map((appointment) => (
                    <div
                      key={appointment.id}
                      className={`p-4 border-2 rounded-xl transition-all ${
                        appointment.isEmergency || appointment.severityLevel === 'Critical'
                          ? 'border-red-200 bg-red-50/50 shadow-sm shadow-red-100 relative overflow-hidden'
                          : 'border-slate-100 bg-white hover:border-indigo-200 hover:shadow-md'
                      }`}
                    >
                      {/* Emergency Glow Effect */}
                      {(appointment.isEmergency || appointment.severityLevel === 'Critical') && (
                        <div className="absolute top-0 left-0 w-1 h-full bg-red-500 animate-pulse" />
                      )}

                      <div className="flex items-start justify-between mb-3">
                        <div className="pl-2">
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
                            className="bg-green-600 hover:bg-green-700 text-white shadow-sm flex-1"
                            onClick={() =>
                              handleUpdateAppointmentStatus(appointment.id, 'completed')
                            }
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Mark Completed
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              handleUpdateAppointmentStatus(appointment.id, 'cancelled')
                            }
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
    </div>
  );
}
