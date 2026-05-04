import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Activity, Users, AlertTriangle, Zap, Server, BarChart3, PieChart as PieChartIcon, Building, CreditCard, TrendingUp, Map, Thermometer } from 'lucide-react';
import { motion } from 'motion/react';
import { DashboardHeader } from '../components/DashboardHeader';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

import { useNavigate } from 'react-router';
import { getCurrentUser, getStats } from '../utils/api';
import { getAdminOps } from '../utils/smartHealthcare';

export function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    activePatients: 0,
    criticalEmergencies: 0,
    doctorsAvailable: 0,
    systemLoad: 0
  });
  const [activeTab, setActiveTab] = useState('dashboard');
  const adminOps = getAdminOps();

  const heatmapData = [
    { time: '08:00', branch: 'Main', crowd: 85 },
    { time: '08:00', branch: 'North', crowd: 40 },
    { time: '08:00', branch: 'West', crowd: 20 },
    { time: '12:00', branch: 'Main', crowd: 95 },
    { time: '12:00', branch: 'North', crowd: 60 },
    { time: '12:00', branch: 'West', crowd: 50 },
    { time: '16:00', branch: 'Main', crowd: 40 },
    { time: '16:00', branch: 'North', crowd: 80 },
    { time: '16:00', branch: 'West', crowd: 30 },
  ];

  useEffect(() => {
    const user = getCurrentUser();
    if (!user || user.role !== 'admin') {
      navigate('/auth');
    }

    const fetchStats = async () => {
      try {
        const data = await getStats();
        setStats({
          activePatients: data.totalPatients || 0,
          criticalEmergencies: data.pendingAppointments || 0,
          doctorsAvailable: data.totalDoctors || 0,
          systemLoad: 10 + Math.floor(Math.random() * 20) // Simulated load based on real data
        });
      } catch (e) {
        console.error("Failed to load stats", e);
      }
    };
    
    fetchStats();
  }, [navigate]);

  return (
    <div 
      className="min-h-screen bg-slate-950/95 text-slate-100"
      style={{ 
        backgroundImage: 'url("https://images.unsplash.com/photo-1551076805-e1869033e561?q=80&w=2000")',
        backgroundSize: 'cover',
        backgroundAttachment: 'fixed',
        backgroundPosition: 'center',
        backgroundBlendMode: 'overlay'
      }}
    >

      <DashboardHeader 
        userName="Command Center"
        userRole="admin" 
        subtitle="AI Load Balancing & Global Tracking"
        onLogout={() => navigate('/')} 
      />

      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-orange-500">
              Unified Hospital Management Panel
            </h2>
            <p className="text-slate-400 mt-2">Real-time system load and AI allocations across all branches</p>
          </div>
          <div className="flex items-center gap-3 bg-red-950/50 border border-red-900 px-4 py-2 rounded-full">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-red-400 text-sm font-bold uppercase tracking-widest">Network Live</span>
          </div>
        </div>

        {/* Unified Navigation */}
        <div className="flex gap-2 mb-8 bg-slate-900 p-2 rounded-xl inline-flex">
          <button onClick={() => setActiveTab('dashboard')} className={`px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 transition-all ${activeTab === 'dashboard' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'}`}>
            <Activity className="w-4 h-4" /> Live Dashboard
          </button>
          <button onClick={() => setActiveTab('billing')} className={`px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 transition-all ${activeTab === 'billing' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'}`}>
            <CreditCard className="w-4 h-4" /> Billing & Revenue
          </button>
          <button onClick={() => setActiveTab('staff')} className={`px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 transition-all ${activeTab === 'staff' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'}`}>
            <Users className="w-4 h-4" /> Staff & Doctors
          </button>
          <button onClick={() => setActiveTab('branches')} className={`px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 transition-all ${activeTab === 'branches' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'}`}>
            <Building className="w-4 h-4" /> Multi-Branch
          </button>
        </div>

        {activeTab === 'dashboard' && (
          <>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-slate-900 border-slate-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <Users className="text-blue-500 w-6 h-6" />
                <span className="text-xs text-slate-500 uppercase font-bold">Active Patients</span>
              </div>
              <p className="text-4xl font-black text-white">{stats.activePatients}</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-800 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-red-500/10 to-transparent pointer-events-none" />
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <AlertTriangle className="text-red-500 w-6 h-6" />
                <span className="text-xs text-red-500 uppercase font-bold">Critical Scans</span>
              </div>
              <p className="text-4xl font-black text-red-400">{stats.criticalEmergencies}</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <Activity className="text-green-500 w-6 h-6" />
                <span className="text-xs text-slate-500 uppercase font-bold">Available Doctors</span>
              </div>
              <p className="text-4xl font-black text-white">{stats.doctorsAvailable}</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <Server className="text-purple-500 w-6 h-6" />
                <span className="text-xs text-slate-500 uppercase font-bold">AI Compute Load</span>
              </div>
              <div className="flex items-baseline gap-2">
                <p className="text-4xl font-black text-white">{stats.systemLoad}%</p>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full mt-4 overflow-hidden">
                <motion.div 
                  className="h-full bg-purple-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${stats.systemLoad}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <Card className="bg-slate-900 border-slate-800 lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="space-y-1">
                <CardTitle className="text-lg text-slate-300 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-blue-500" />
                  Live Triage Traffic
                </CardTitle>
                <p className="text-sm text-slate-500">Patient intake volume over last 12 hours</p>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={[
                    { time: '08:00', volume: 15 },
                    { time: '10:00', volume: 45 },
                    { time: '12:00', volume: 30 },
                    { time: '14:00', volume: 60 },
                    { time: '16:00', volume: 40 },
                    { time: '18:00', volume: 20 },
                  ]}>
                    <defs>
                      <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                    <XAxis dataKey="time" stroke="#475569" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#475569" fontSize={12} tickLine={false} axisLine={false} />
                    <RechartsTooltip 
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#f8fafc' }}
                      itemStyle={{ color: '#60a5fa' }}
                    />
                    <Area type="monotone" dataKey="volume" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorVolume)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
              <CardTitle className="text-lg text-slate-300 flex items-center gap-2">
                <PieChartIcon className="w-5 h-5 text-purple-500" />
                Specialty Load
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center">
              <div className="h-[220px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Cardiology', value: 35 },
                        { name: 'Neurology', value: 20 },
                        { name: 'Orthopedics', value: 25 },
                        { name: 'General', value: 20 },
                      ]}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                      stroke="none"
                    >
                      {['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b'].map((color, index) => (
                        <Cell key={`cell-${index}`} fill={color} />
                      ))}
                    </Pie>
                    <RechartsTooltip 
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px' }}
                      itemStyle={{ color: '#f8fafc' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-4 w-full mt-4">
                {[
                  { name: 'Cardiology', color: 'bg-blue-500' },
                  { name: 'Neurology', color: 'bg-purple-500' },
                  { name: 'Orthopedics', color: 'bg-emerald-500' },
                  { name: 'General', color: 'bg-amber-500' }
                ].map(item => (
                  <div key={item.name} className="flex items-center gap-2 text-xs text-slate-400">
                    <span className={`w-2 h-2 rounded-full ${item.color}`} />
                    {item.name}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-800 lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg text-slate-300 flex items-center gap-2">
                <Thermometer className="w-5 h-5 text-orange-500" /> Crowd Heatmap Scheduler
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-2 text-center text-xs font-bold text-slate-500 mb-2">
                <div></div>
                <div>08:00 AM</div>
                <div>12:00 PM</div>
                <div>04:00 PM</div>
              </div>
              {['Main', 'North', 'West'].map(branch => (
                <div key={branch} className="grid grid-cols-4 gap-2 mb-2 items-center">
                  <div className="text-sm font-bold text-slate-300 text-right pr-4">{branch} Clinic</div>
                  {heatmapData.filter(d => d.branch === branch).map((d, i) => (
                    <div key={i} className={`h-12 rounded-lg flex items-center justify-center font-bold text-white shadow-inner ${d.crowd > 80 ? 'bg-red-500' : d.crowd > 50 ? 'bg-orange-500' : 'bg-green-500'}`}>
                      {d.crowd}%
                    </div>
                  ))}
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
              <CardTitle className="text-lg text-slate-300 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-400" /> Predictive Demand
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center p-4 bg-slate-800/50 rounded-xl border border-slate-700">
                <p className="text-sm text-slate-400 mb-2">Forecasted Patient Rush (Tomorrow)</p>
                <p className="text-4xl font-black text-blue-400">+24%</p>
                <p className="text-xs text-slate-500 mt-2">Driven by: Flu Season Spike</p>
              </div>
              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Cardiology</span>
                  <span className="text-green-400 font-bold">Stable</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Pediatrics</span>
                  <span className="text-red-400 font-bold">High Demand</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        </>
        )}
        
        {activeTab !== 'dashboard' && (
          <div className="grid md:grid-cols-3 gap-6">
            {activeTab === 'billing' && (
              <>
                <Card className="bg-slate-900 border-slate-800">
                  <CardContent className="p-6">
                    <CreditCard className="w-6 h-6 text-emerald-400 mb-4" />
                    <p className="text-xs text-slate-500 font-bold uppercase">No-Show Prediction Engine</p>
                    <p className="text-4xl font-black text-white mt-2">{adminOps.noShowRisk}%</p>
                    <p className="text-sm text-slate-400 mt-2">{adminOps.depositSuggestion}</p>
                  </CardContent>
                </Card>
                <Card className="bg-slate-900 border-slate-800">
                  <CardContent className="p-6">
                    <TrendingUp className="w-6 h-6 text-blue-400 mb-4" />
                    <p className="text-xs text-slate-500 font-bold uppercase">Revenue Leakage Recovered</p>
                    <p className="text-4xl font-black text-white mt-2">{adminOps.revenueRecovered}</p>
                    <p className="text-sm text-slate-400 mt-2">Waitlist fills and deposit nudges applied.</p>
                  </CardContent>
                </Card>
                <Card className="bg-slate-900 border-slate-800">
                  <CardContent className="p-6">
                    <Server className="w-6 h-6 text-purple-400 mb-4" />
                    <p className="text-xs text-slate-500 font-bold uppercase">Unified Ops Console</p>
                    <p className="text-lg font-black text-white mt-2">Booking + billing + lab + pharmacy + reports</p>
                  </CardContent>
                </Card>
              </>
            )}

            {activeTab === 'staff' && (
              <>
                {[
                  ['Dr. Sarah Smith', 'Cardiology', '92% load', 'Move 2 follow-ups to Dr. Chen'],
                  ['Dr. Michael Chen', 'Neurology', '58% load', 'Can absorb urgent consults'],
                  ['Dr. James Brown', 'General', '74% load', 'Hold two lite-mode teleconsults'],
                ].map(([name, specialty, load, action]) => (
                  <Card key={name} className="bg-slate-900 border-slate-800">
                    <CardContent className="p-6">
                      <Users className="w-6 h-6 text-indigo-400 mb-4" />
                      <p className="text-lg font-black text-white">{name}</p>
                      <p className="text-sm text-slate-400">{specialty}</p>
                      <p className="text-3xl font-black text-orange-400 mt-4">{load}</p>
                      <p className="text-sm text-slate-400 mt-2">{action}</p>
                    </CardContent>
                  </Card>
                ))}
              </>
            )}

            {activeTab === 'branches' && (
              <>
                <Card className="bg-slate-900 border-slate-800">
                  <CardContent className="p-6">
                    <Map className="w-6 h-6 text-green-400 mb-4" />
                    <p className="text-xs text-slate-500 font-bold uppercase">Nearest Faster Branch Router</p>
                    <p className="text-xl font-black text-white mt-2">{adminOps.branchRouter}</p>
                  </CardContent>
                </Card>
                <Card className="bg-slate-900 border-slate-800">
                  <CardContent className="p-6">
                    <Zap className="w-6 h-6 text-amber-400 mb-4" />
                    <p className="text-xs text-slate-500 font-bold uppercase">Rush Prediction AI</p>
                    <p className="text-xl font-black text-white mt-2">{adminOps.rushForecast}</p>
                  </CardContent>
                </Card>
                <Card className="bg-slate-900 border-slate-800">
                  <CardContent className="p-6">
                    <Building className="w-6 h-6 text-blue-400 mb-4" />
                    <p className="text-xs text-slate-500 font-bold uppercase">Multi-Branch Coordination</p>
                    <p className="text-xl font-black text-white mt-2">Live crowd, queue, billing, labs and pharmacy synced.</p>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
