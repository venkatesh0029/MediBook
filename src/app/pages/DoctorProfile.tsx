import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Label } from '../components/ui/label';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Badge } from '../components/ui/badge';
import { Activity, ArrowLeft, Calendar, Clock, CheckCircle2 } from 'lucide-react';
import { getDoctorById, bookAppointment, getCurrentUser } from '../utils/api';
import { toast } from 'sonner';

interface Doctor {
  userId: string;
  name: string;
  specialty: string;
  experience: string;
  rating: number;
  reviewCount: number;
  available: boolean;
}

const TIME_SLOTS = [
  '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM',
  '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM',
  '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM',
  '04:00 PM', '04:30 PM', '05:00 PM', '05:30 PM',
];

export function DoctorProfile() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Booking state
  const [showBookingDialog, setShowBookingDialog] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [notes, setNotes] = useState('');
  const [isBooking, setIsBooking] = useState(false);
  
  // Confirmation state
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmedAppointment, setConfirmedAppointment] = useState<any>(null);

  useEffect(() => {
    loadDoctor();
  }, [id]);

  const loadDoctor = async () => {
    try {
      const user = getCurrentUser();
      if (!user) {
        navigate('/auth');
        return;
      }

      const { doctor: doctorData } = await getDoctorById(id!);
      setDoctor(doctorData);
    } catch (error) {
      console.error('Error loading doctor:', error);
      toast.error('Failed to load doctor profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBookAppointment = () => {
    setShowBookingDialog(true);
    // Set default date to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setSelectedDate(tomorrow.toISOString().split('T')[0]);
  };

  const handleConfirmBooking = async () => {
    if (!selectedDate || !selectedTime) {
      toast.error('Please select a date and time');
      return;
    }

    setIsBooking(true);
    try {
      const appointment = await bookAppointment(
        id!,
        selectedDate,
        selectedTime,
        notes
      );

      setConfirmedAppointment(appointment);
      setShowBookingDialog(false);
      setShowConfirmation(true);
      toast.success('Appointment booked successfully!');
    } catch (error: any) {
      console.error('Error booking appointment:', error);
      toast.error(error.message || 'Failed to book appointment');
    } finally {
      setIsBooking(false);
    }
  };

  const handleCloseConfirmation = () => {
    setShowConfirmation(false);
    navigate('/patient/dashboard');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Activity className="w-12 h-12 text-blue-600 animate-pulse mx-auto mb-4" />
          <p className="text-gray-600">Loading doctor profile...</p>
        </div>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Doctor not found</p>
          <Button onClick={() => navigate('/patient/dashboard')}>
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" onClick={() => navigate('/patient/dashboard')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Doctor Info Card */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Dr. {doctor.name}
                </h1>
                <p className="text-xl text-gray-600">{doctor.specialty}</p>
              </div>
              {doctor.available && (
                <Badge className="bg-green-100 text-green-800 text-sm px-4 py-2">
                  Available
                </Badge>
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div>
                <h3 className="font-semibold text-gray-700 mb-2">Experience</h3>
                <p className="text-gray-600">{doctor.experience}</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-700 mb-2">Rating</h3>
                <div className="flex items-center gap-2">
                  <span className="text-2xl text-yellow-500">★</span>
                  <span className="text-xl font-semibold">
                    {doctor.rating.toFixed(1)}
                  </span>
                  <span className="text-gray-600">
                    ({doctor.reviewCount} reviews)
                  </span>
                </div>
              </div>
            </div>

            <Button
              onClick={handleBookAppointment}
              size="lg"
              className="w-full md:w-auto"
              disabled={!doctor.available}
            >
              <Calendar className="w-5 h-5 mr-2" />
              Book Appointment
            </Button>
          </CardContent>
        </Card>

        {/* Additional Info */}
        <Card>
          <CardHeader>
            <CardTitle>About Dr. {doctor.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Dr. {doctor.name} is a highly experienced {doctor.specialty} with {doctor.experience} 
              of dedicated service. Known for providing compassionate and comprehensive care, 
              Dr. {doctor.name} uses the latest medical techniques and technologies to ensure 
              the best outcomes for patients.
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                <span className="text-gray-700">Accepting new patients</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                <span className="text-gray-700">Available for consultations</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                <span className="text-gray-700">Online appointment booking</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Booking Dialog */}
      <Dialog open={showBookingDialog} onOpenChange={setShowBookingDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Book Appointment with Dr. {doctor.name}</DialogTitle>
            <DialogDescription>
              Select your preferred date and time slot
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <Label htmlFor="date">Select Date</Label>
              <Input
                id="date"
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            <div className="space-y-2">
              <Label>Select Time Slot</Label>
              <div className="grid grid-cols-4 gap-2">
                {TIME_SLOTS.map((time) => (
                  <Button
                    key={time}
                    variant={selectedTime === time ? 'default' : 'outline'}
                    className="w-full"
                    onClick={() => setSelectedTime(time)}
                  >
                    {time}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Additional Notes (Optional)</Label>
              <Textarea
                id="notes"
                placeholder="Describe your symptoms or reason for visit..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
              />
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setShowBookingDialog(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmBooking}
              disabled={isBooking || !selectedDate || !selectedTime}
              className="flex-1"
            >
              {isBooking ? 'Booking...' : 'Confirm Booking'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent>
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-10 h-10 text-green-600" />
            </div>
            <DialogTitle className="text-2xl mb-2">Appointment Confirmed!</DialogTitle>
            <DialogDescription className="text-base mb-6">
              Your appointment has been successfully booked
            </DialogDescription>

            {confirmedAppointment && (
              <Card className="text-left">
                <CardContent className="p-6 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Doctor:</span>
                    <span className="font-semibold">Dr. {confirmedAppointment.doctorName}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Date:</span>
                    <span className="font-semibold">{confirmedAppointment.date}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Time:</span>
                    <span className="font-semibold">{confirmedAppointment.time}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Status:</span>
                    <Badge className="bg-green-100 text-green-800">
                      {confirmedAppointment.status}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            )}

            <Button onClick={handleCloseConfirmation} className="w-full mt-6">
              Go to Dashboard
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
