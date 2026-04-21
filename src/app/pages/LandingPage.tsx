import { useNavigate } from 'react-router';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Calendar, Clock, Users, Activity, Star, TrendingUp, Shield, Zap, Brain, AlertTriangle, Video, MessageSquare, FileText, PieChart, Mic, CreditCard, CalendarDays } from 'lucide-react';
import { motion } from 'motion/react';

export function LandingPage() {
  const navigate = useNavigate();

  return (
    <div 
      className="min-h-screen bg-gradient-to-br from-blue-50/90 via-white/90 to-cyan-50/90"
      style={{ 
        backgroundImage: 'url("https://images.unsplash.com/photo-1551076805-e1869033e561?q=80&w=2000")',
        backgroundSize: 'cover',
        backgroundAttachment: 'fixed',
        backgroundPosition: 'center',
        backgroundBlendMode: 'overlay'
      }}
    >
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <motion.div 
            className="flex items-center gap-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-lg flex items-center justify-center">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              MediBook
            </h1>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Button 
              onClick={() => navigate('/auth')} 
              variant="default"
              className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
            >
              Login / Sign Up
            </Button>
          </motion.div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-6">
              <Zap className="w-4 h-4" />
              Smart Healthcare Platform
            </div>
            <h2 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Healthcare Scheduling
              <span className="block bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                Made Simple
              </span>
            </h2>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Say goodbye to long wait times and manual appointment booking. 
              Our intelligent queue management system connects patients with healthcare providers seamlessly.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button 
                onClick={() => navigate('/auth')} 
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 shadow-lg hover:shadow-xl transition-shadow"
              >
                Get Started Free
              </Button>
              <Button 
                onClick={() => {
                  document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
                }} 
                size="lg"
                variant="outline"
              >
                Learn More
              </Button>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 mt-12 pt-12 border-t">
              <div>
                <div className="text-3xl font-bold text-gray-900">10K+</div>
                <div className="text-sm text-gray-600">Active Users</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900">500+</div>
                <div className="text-sm text-gray-600">Doctors</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900">98%</div>
                <div className="text-sm text-gray-600">Satisfaction</div>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            className="relative"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-3xl blur-3xl opacity-20"></div>
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border-8 border-white">
              <img
                src="https://images.unsplash.com/photo-1720180244462-648c13ee01e5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBob3NwaXRhbCUyMGRvY3RvciUyMHBhdGllbnR8ZW58MXx8fHwxNzcxMjU4NzcxfDA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Modern healthcare"
                className="w-full h-auto"
              />
            </div>
            
            {/* Floating cards */}
            <motion.div
              className="absolute -top-6 -left-6 bg-white rounded-xl shadow-xl p-4"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-900">Appointment Booked</div>
                  <div className="text-xs text-gray-500">Dr. Sarah Smith</div>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              className="absolute -bottom-6 -right-6 bg-white rounded-xl shadow-xl p-4"
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 3, repeat: Infinity, delay: 1.5 }}
            >
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                <div>
                  <div className="text-sm font-semibold text-gray-900">4.9/5</div>
                  <div className="text-xs text-gray-500">Patient Rating</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-medium mb-4">
              Features
            </div>
            <h3 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose MediBook?
            </h3>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to manage healthcare appointments efficiently
            </p>
          </div>
        </motion.div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[
            {
              icon: Brain,
              title: '1. AI Symptom-Based Doctor Recommendation',
              description: 'Patient enters symptoms → system suggests the right specialist doctor.',
              bgClass: 'bg-blue-100',
              textClass: 'text-blue-600',
              delay: 0
            },
            {
              icon: Clock,
              title: '2. Smart Queue & Live Wait Tracker',
              description: 'Shows real-time queue number and estimated waiting time.',
              bgClass: 'bg-green-100',
              textClass: 'text-green-600',
              delay: 0.1
            },
            {
              icon: AlertTriangle,
              title: '3. Emergency Priority Booking',
              description: 'Allows urgent cases to get fast-track appointments based on severity.',
              bgClass: 'bg-red-100',
              textClass: 'text-red-600',
              delay: 0.2
            },
            {
              icon: Video,
              title: '4. Telemedicine Video Consultation',
              description: 'Patients can consult doctors online through secure video calls.',
              bgClass: 'bg-purple-100',
              textClass: 'text-purple-600',
              delay: 0.3
            },
            {
              icon: MessageSquare,
              title: '5. Auto Reminders',
              description: 'Appointment reminders via SMS/Email/WhatsApp reduce missed bookings.',
              bgClass: 'bg-orange-100',
              textClass: 'text-orange-600',
              delay: 0.4
            },
            {
              icon: FileText,
              title: '6. Digital Reports Vault',
              description: 'Doctors upload prescriptions and patients can download anytime.',
              bgClass: 'bg-teal-100',
              textClass: 'text-teal-600',
              delay: 0.5
            },
            {
              icon: PieChart,
              title: '7. Admin Analytics Dashboard',
              description: 'Shows peak hours, patient trends, no-show rate, revenue, doctor performance.',
              bgClass: 'bg-indigo-100',
              textClass: 'text-indigo-600',
              delay: 0.6
            },
            {
              icon: Mic,
              title: '8. Multi-language + Voice',
              description: 'Supports regional languages and voice navigation for elderly users.',
              bgClass: 'bg-pink-100',
              textClass: 'text-pink-600',
              delay: 0.7
            },
            {
              icon: CreditCard,
              title: '9. Payment + Insurance',
              description: 'Pay consultation fees online and check insurance eligibility.',
              bgClass: 'bg-cyan-100',
              textClass: 'text-cyan-600',
              delay: 0.8
            },
            {
              icon: CalendarDays,
              title: '10. Predictive Scheduling',
              description: 'System suggests best time slots based on crowd data and doctor patterns.',
              bgClass: 'bg-violet-100',
              textClass: 'text-violet-600',
              delay: 0.9
            }
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: feature.delay }}
            >
              <Card className="p-6 h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 border-transparent hover:border-blue-100 bg-white/80 backdrop-blur-sm">
                <div className={`w-14 h-14 ${feature.bgClass} rounded-xl flex items-center justify-center mb-4`}>
                  <feature.icon className={`w-7 h-7 ${feature.textClass}`} />
                </div>
                <h4 className="text-xl font-semibold mb-3">{feature.title}</h4>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-gradient-to-br from-gray-50 to-blue-50 py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-100 text-cyan-700 rounded-full text-sm font-medium mb-4">
              Simple Process
            </div>
            <h3 className="text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h3>
            <p className="text-xl text-gray-600">
              Get started in three simple steps
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                number: '1',
                title: 'Sign Up',
                description: 'Create your account as a patient, doctor, or admin in minutes.',
                icon: Users
              },
              {
                number: '2',
                title: 'Book or Manage',
                description: 'Patients book appointments, doctors manage schedules, admins oversee operations.',
                icon: Calendar
              },
              {
                number: '3',
                title: 'Get Care',
                description: 'Receive timely healthcare with minimal wait times and maximum efficiency.',
                icon: Activity
              }
            ].map((step, index) => (
              <motion.div
                key={index}
                className="text-center relative"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                {index < 2 && (
                  <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-blue-300 to-cyan-300"></div>
                )}
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-cyan-600 text-white rounded-2xl flex items-center justify-center text-2xl font-bold mx-auto mb-4 shadow-lg">
                    {step.number}
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <step.icon className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
                <h4 className="text-xl font-semibold mb-3">{step.title}</h4>
                <p className="text-gray-600 leading-relaxed">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: Shield,
              title: 'HIPAA Compliant',
              description: 'Your data is encrypted and secure'
            },
            {
              icon: Star,
              title: '24/7 Support',
              description: 'Always here when you need us'
            },
            {
              icon: Zap,
              title: 'Lightning Fast',
              description: 'Book appointments in seconds'
            }
          ].map((item, index) => (
            <motion.div
              key={index}
              className="text-center"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <item.icon className="w-8 h-8 text-blue-600" />
              </div>
              <h4 className="text-lg font-semibold mb-2">{item.title}</h4>
              <p className="text-gray-600">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <motion.div 
          className="relative bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-600 rounded-3xl p-12 md:p-16 text-center text-white overflow-hidden"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00em0wLTEyYzAtMi4yMS0xLjc5LTQtNC00cy00IDEuNzktNCA0IDEuNzkgNCA0IDQgNC0xLjc5IDQtNHptMC0xMmMwLTIuMjEtMS43OS00LTQtNHMtNCAxLjc5LTQgNCAxLjc5IDQgNCA0IDQtMS43OSA0LTR6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-50"></div>
          
          <div className="relative z-10">
            <h3 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Transform Your Healthcare Experience?
            </h3>
            <p className="text-xl mb-10 text-blue-50 max-w-2xl mx-auto">
              Join thousands of patients and healthcare providers already using MediBook
            </p>
            <Button 
              onClick={() => navigate('/auth')}
              size="lg"
              variant="secondary"
              className="bg-white text-blue-600 hover:bg-gray-100 shadow-2xl text-lg px-8 py-6 h-auto"
            >
              Get Started Today
            </Button>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center text-center">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-lg flex items-center justify-center">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold">MediBook</span>
            </div>
            <p className="text-gray-400 mb-4 max-w-md">
              Transforming healthcare scheduling with intelligent appointment management and queue optimization.
            </p>
            <p className="text-gray-500 text-sm mb-2">
              © 2026 MediBook. All rights reserved.
            </p>
            <p className="text-xs text-gray-600">
              Demo application • Not for production medical use
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Helper component for checkmark (used in floating card)
function CheckCircle({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}
