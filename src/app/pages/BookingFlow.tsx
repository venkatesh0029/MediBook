import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Badge } from "../components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../components/ui/dialog";
import { 
  ArrowLeft, 
  Calendar as CalendarIcon, 
  Clock,
  CheckCircle,
  Activity,
  Shield,
  Download,
  MapPin,
  Mic,
  MicOff,
  Stethoscope
} from "lucide-react";
import confetti from "canvas-confetti";
import html2canvas from "html2canvas";
import { useRef } from "react";
import { mockDoctors, addAppointment, type Doctor, type Appointment } from "../data/mockData";
import { toast } from "sonner";
import { calculateDynamicSlot, getWaitlistFill, predictWaitTime } from "../utils/smartHealthcare";

export default function BookingFlow() {
  const { doctorId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [selectedBranch, setSelectedBranch] = useState<string>("Main Hospital");
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [caseComplexity, setCaseComplexity] = useState("Routine consultation");
  const receiptRef = useRef<HTMLDivElement>(null);

  const branches = ["Main Hospital (City Center)", "North Clinic (Suburbs)", "West Wing (Emergency)"];

  const toggleListening = () => {
    if (isListening) {
      setIsListening(false);
      toast.info("Voice booking stopped. Processing...");
      setTimeout(() => {
        setTranscript("Booking for tomorrow at 10 AM");
        setSelectedDate(Object.keys(doctor?.availability || {})[0] || "");
        setSelectedTime("10:00 AM");
        toast.success("Voice command processed!");
      }, 1000);
    } else {
      setIsListening(true);
      toast.success("Listening... Speak your preferred date and time.");
    }
  };

  useEffect(() => {
    if (showConfirmation) {
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444']
      });
    }
  }, [showConfirmation]);

  useEffect(() => {
    if (!user || user.role !== "patient") {
      navigate("/login");
      return;
    }

    const foundDoctor = mockDoctors.find((d) => d.id === doctorId);
    if (foundDoctor) {
      setDoctor(foundDoctor);
    } else {
      navigate("/patient/dashboard");
    }
  }, [doctorId, user, navigate]);

  const handleBookAppointment = () => {
    if (!selectedDate || !selectedTime || !doctor || !user) return;

    const newAppointment: Appointment = {
      id: `apt_${Date.now()}`,
      patientId: user.id,
      patientName: user.name,
      doctorId: doctor.id,
      doctorName: doctor.name,
      specialty: doctor.specialty,
      date: selectedDate,
      time: selectedTime,
      status: "scheduled",
      type: "consultation",
    };

    addAppointment(newAppointment);
    setShowConfirmation(true);
  };

  const handleCloseConfirmation = () => {
    setShowConfirmation(false);
    navigate("/patient/dashboard");
    toast.success("Appointment booked successfully!");
  };

  const downloadReceipt = async () => {
    if (receiptRef.current) {
      const canvas = await html2canvas(receiptRef.current, { scale: 2, backgroundColor: '#ffffff' });
      const image = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = image;
      link.download = `MediBook_Receipt_${doctor?.name.replace(' ', '_')}.png`;
      link.click();
      toast.success("Receipt downloaded!");
    }
  };

  if (!doctor) {
    return <div>Loading...</div>;
  }

  const availableDates = Object.keys(doctor.availability);
  const priorityScore = caseComplexity.toLowerCase().includes("pain") || caseComplexity.toLowerCase().includes("urgent") ? 58 : 22;
  const smartSlot = calculateDynamicSlot(doctor.specialty, priorityScore, doctor.experience > 12 ? 1.12 : 0.95);
  const liveWait = predictWaitTime(selectedDate ? Math.max(1, doctor.availability[selectedDate].indexOf(selectedTime) + 1) : 2, smartSlot.duration, doctor.experience > 12 ? 1.1 : 0.95, selectedBranch.includes("Main") ? 8 : 2);
  const waitlistFill = getWaitlistFill(selectedTime || "Earliest cancellation");
  const fasterBranch = selectedBranch.includes("Main") ? "West Wing (Emergency) is 14 min faster right now" : "Selected branch is currently the faster route";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link to="/patient/dashboard" className="flex items-center gap-2">
              <Activity className="w-8 h-8 text-blue-600" />
              <span className="text-2xl font-bold text-blue-600">MediBook</span>
            </Link>
            <Button variant="outline" onClick={() => navigate(-1)}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Book Appointment</h1>
          <p className="text-gray-600 mb-8">Select your preferred date and time</p>

          {/* Doctor Info */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <Avatar className="w-16 h-16">
                  <AvatarImage src={doctor.avatar} />
                  <AvatarFallback>{doctor.name.substring(0, 2)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h2 className="text-xl font-semibold">{doctor.name}</h2>
                  <p className="text-gray-600">{doctor.specialty}</p>
                  <Badge variant="secondary" className="mt-2">
                    {doctor.experience} years experience
                  </Badge>
                </div>
                <div className="flex flex-col gap-2 border-l pl-6 py-2">
                  <div className="flex flex-col gap-1">
                    <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">Branch Location</span>
                    <select 
                      value={selectedBranch} 
                      onChange={(e) => setSelectedBranch(e.target.value)}
                      className="bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 outline-none font-medium"
                    >
                      {branches.map(b => <option key={b} value={b}>{b}</option>)}
                    </select>
                  </div>
                  <Button 
                    variant={isListening ? "destructive" : "outline"}
                    className={`w-full flex gap-2 ${isListening ? 'animate-pulse' : 'hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200'}`}
                    onClick={toggleListening}
                  >
                    {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                    {isListening ? "Listening..." : "Voice Booking"}
                  </Button>
                </div>
              </div>
              <div className="mt-5 grid md:grid-cols-3 gap-3">
                <div className="md:col-span-2">
                  <label className="text-xs text-gray-500 font-bold uppercase tracking-wider">Case complexity</label>
                  <input
                    value={caseComplexity}
                    onChange={(e) => setCaseComplexity(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-400"
                    placeholder="e.g. chest pain, fever, routine follow-up"
                  />
                </div>
                <div className="rounded-lg border border-indigo-100 bg-indigo-50 p-3">
                  <p className="text-xs font-bold text-indigo-800 uppercase">AI Dynamic Slot</p>
                  <p className="text-lg font-black text-indigo-950">{smartSlot.label}</p>
                  <p className="text-xs text-indigo-700">{smartSlot.reason}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Date Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarIcon className="w-5 h-5" />
                  Select Date
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                  {availableDates.map((date) => {
                    const dateObj = new Date(date);
                    const isSelected = selectedDate === date;
                    const slots = doctor.availability[date].length;
                    
                    let heatColor = 'bg-red-50 border-red-200 text-red-700'; // 0 slots
                    if (slots > 5) heatColor = 'bg-green-50 border-green-200 text-green-700';
                    else if (slots > 0) heatColor = 'bg-yellow-50 border-yellow-200 text-yellow-700';

                    return (
                      <button
                        key={date}
                        onClick={() => {
                          if (slots > 0) {
                            setSelectedDate(date);
                            setSelectedTime("");
                          }
                        }}
                        disabled={slots === 0}
                        className={`flex flex-col items-center p-3 border-2 rounded-xl transition-all ${
                          isSelected
                            ? "border-blue-600 bg-blue-600 text-white shadow-md transform scale-105"
                            : `${heatColor} hover:shadow-md ${slots > 0 ? 'hover:scale-105 cursor-pointer' : 'opacity-50 cursor-not-allowed'}`
                        }`}
                      >
                        <span className={`text-xs font-bold uppercase ${isSelected ? 'text-blue-100' : 'opacity-70'}`}>
                          {dateObj.toLocaleDateString("en-US", { weekday: "short" })}
                        </span>
                        <span className="text-xl font-black my-1">
                          {dateObj.getDate()}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isSelected ? 'bg-white/20 text-white' : 'bg-white/50'
                        }`}>
                          {slots} slots
                        </span>
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Time Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Select Time
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!selectedDate ? (
                  <div className="text-center py-12 text-gray-500">
                    Please select a date first
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-2">
                    {doctor.availability[selectedDate].map((time) => {
                      const isSelected = selectedTime === time;
                      const slotWait = predictWaitTime(Math.max(1, doctor.availability[selectedDate].indexOf(time) + 1), smartSlot.duration, doctor.experience > 12 ? 1.1 : 0.95, selectedBranch.includes("Main") ? 8 : 2);
                      return (
                        <button
                          key={time}
                          onClick={() => setSelectedTime(time)}
                          className={`p-3 text-center border-2 rounded-lg transition-all ${
                            isSelected
                              ? "border-blue-600 bg-blue-50 font-semibold"
                              : "border-gray-200 hover:border-blue-300"
                          }`}
                        >
                          <span className="block font-semibold">{time}</span>
                          <span className="block text-[10px] text-gray-500">{slotWait.label}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Booking Summary */}
          {selectedDate && selectedTime && (
            <Card className="mt-6 border-2 border-blue-200 bg-blue-50">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Booking Summary</h3>
                <div className="space-y-2 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Doctor:</span>
                    <span className="font-semibold">{doctor.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Specialty:</span>
                    <span className="font-semibold">{doctor.specialty}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date:</span>
                    <span className="font-semibold">
                      {new Date(selectedDate).toLocaleDateString("en-US", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Time:</span>
                    <span className="font-semibold">{selectedTime}</span>
                  </div>
                  <div className="grid md:grid-cols-3 gap-3 pt-3">
                    <div className="rounded-lg bg-white/70 border border-blue-100 p-3">
                      <p className="text-xs font-bold text-blue-700 uppercase">Live wait-time</p>
                      <p className="text-lg font-black text-blue-950">{liveWait.label}</p>
                      <p className="text-xs text-blue-700">{liveWait.confidence}% confidence</p>
                    </div>
                    <div className="rounded-lg bg-white/70 border border-emerald-100 p-3">
                      <p className="text-xs font-bold text-emerald-700 uppercase">Waitlist fill</p>
                      <p className="text-sm font-black text-emerald-950">{waitlistFill.candidate}</p>
                      <p className="text-xs text-emerald-700">{waitlistFill.channel}, {waitlistFill.responseWindow}</p>
                    </div>
                    <div className="rounded-lg bg-white/70 border border-amber-100 p-3">
                      <p className="text-xs font-bold text-amber-700 uppercase">Branch router</p>
                      <p className="text-xs font-bold text-amber-950">{fasterBranch}</p>
                    </div>
                  </div>
                </div>
                <Button className="w-full" size="lg" onClick={handleBookAppointment}>
                  1-Click Smart Confirm
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent className="sm:max-w-md border-0 bg-transparent shadow-none">
          <div className="bg-white rounded-2xl overflow-hidden shadow-2xl">
            <div ref={receiptRef} className="bg-white">
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-6 py-8 text-center text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-20">
                  <Activity className="w-24 h-24" />
                </div>
                <div className="flex justify-center mb-4 relative z-10">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg">
                    <CheckCircle className="w-10 h-10 text-green-500" />
                  </div>
                </div>
                <DialogTitle className="text-3xl font-black tracking-tight mb-2 relative z-10 text-white">Booking Confirmed!</DialogTitle>
                <DialogDescription className="text-green-50 text-sm font-medium relative z-10">
                  Your priority medical appointment is secured.
                </DialogDescription>
              </div>
              
              <div className="p-6 pb-2">
                <div className="border-2 border-dashed border-gray-200 rounded-xl p-5 mb-4 relative">
                  <div className="absolute -left-3 -top-3 w-6 h-6 bg-white rounded-full border-r-2 border-b-2 border-dashed border-gray-200 rotate-45"></div>
                  <div className="absolute -right-3 -top-3 w-6 h-6 bg-white rounded-full border-l-2 border-b-2 border-dashed border-gray-200 -rotate-45"></div>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                      <div>
                        <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Doctor</p>
                        <p className="text-lg font-black text-gray-800">{doctor.name}</p>
                        <p className="text-sm text-gray-500 font-medium">{doctor.specialty}</p>
                      </div>
                      <Avatar className="w-12 h-12 border-2 border-blue-100">
                        <AvatarImage src={doctor.avatar} />
                        <AvatarFallback>{doctor.name.substring(0, 2)}</AvatarFallback>
                      </Avatar>
                    </div>
                    
                    <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                      <div>
                        <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Date</p>
                        <p className="text-base font-bold text-gray-800">
                          {new Date(selectedDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Time</p>
                        <p className="text-base font-bold text-gray-800">{selectedTime}</p>
                      </div>
                    </div>

                    <div className="bg-slate-50 p-3 rounded-lg flex items-center justify-between border border-slate-100">
                      <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4 text-emerald-500" />
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Verified Booking</span>
                      </div>
                      <code className="text-[10px] text-slate-400 font-mono">
                        TX: {Math.random().toString(36).substring(2, 10).toUpperCase()}
                      </code>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-6 pt-0 space-y-3">
              <Button onClick={downloadReceipt} variant="outline" className="w-full h-12 font-bold text-indigo-600 border-indigo-200 hover:bg-indigo-50">
                <Download className="w-4 h-4 mr-2" /> Download Receipt Pass
              </Button>
              <Button onClick={handleCloseConfirmation} className="w-full h-12 font-bold bg-gray-900 hover:bg-gray-800">
                Return to Dashboard
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
