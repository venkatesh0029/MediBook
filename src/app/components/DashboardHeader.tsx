import { useNavigate } from 'react-router';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Activity, LogOut, User, Bell, Globe, Moon, Sun } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'next-themes';
import { useState } from 'react';

interface DashboardHeaderProps {
  userName: string;
  userRole?: 'patient' | 'doctor' | 'admin';
  subtitle?: string;
  onLogout: () => void;
}

export function DashboardHeader({ userName, userRole, subtitle, onLogout }: DashboardHeaderProps) {
  const navigate = useNavigate();

  const { t, i18n } = useTranslation();
  const { theme, setTheme } = useTheme();
  const [showNotifications, setShowNotifications] = useState(false);

  const getRoleBadge = () => {
    if (userRole === 'admin') {
      return <Badge variant="secondary" className="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">{t('Admin') || 'Admin'}</Badge>;
    }
    if (userRole === 'doctor') {
      return <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300">{t('Doctor') || 'Doctor'}</Badge>;
    }
    return <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">{t('Patient') || 'Patient'}</Badge>;
  };

  return (
    <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-gray-100">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <motion.div 
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => navigate('/')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-lg flex items-center justify-center shadow-md">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                MediBook
              </h1>
              {subtitle && (
                <p className="text-xs text-gray-500 dark:text-gray-400">{t(subtitle) || subtitle}</p>
              )}
            </div>
          </motion.div>
          
          <div className="flex items-center gap-3">
            {/* Language Toggle */}
            <Button variant="ghost" size="icon" onClick={() => i18n.changeLanguage(i18n.language === 'en' ? 'hi' : 'en')} className="rounded-full">
              <Globe className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              <span className="sr-only">Toggle Language</span>
              <span className="absolute -bottom-2 text-[10px] font-bold text-blue-600">{i18n.language.toUpperCase()}</span>
            </Button>

            {/* Dark Mode Toggle */}
            <Button variant="ghost" size="icon" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="rounded-full">
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-gray-600" />
              <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-gray-300" />
              <span className="sr-only">Toggle theme</span>
            </Button>

            {/* Notification Bell */}
            <div className="relative">
              <Button variant="ghost" size="icon" onClick={() => setShowNotifications(!showNotifications)} className="rounded-full">
                <Bell className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-gray-900 animate-pulse"></span>
              </Button>
              <AnimatePresence>
                {showNotifications && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-72 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden"
                  >
                    <div className="p-3 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
                      <h4 className="font-bold text-sm text-gray-800 dark:text-gray-200">Notifications</h4>
                    </div>
                    <div className="divide-y divide-gray-100 dark:divide-gray-700 max-h-64 overflow-y-auto">
                      <div className="p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer">
                        <p className="text-sm font-medium text-gray-800 dark:text-gray-200">System update complete</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">AI Triage engine is now online.</p>
                        <p className="text-[10px] text-blue-500 mt-1">2 mins ago</p>
                      </div>
                      <div className="p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer">
                        <p className="text-sm font-medium text-gray-800 dark:text-gray-200">New Login detected</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Your account was accessed from a new device.</p>
                        <p className="text-[10px] text-blue-500 mt-1">1 hour ago</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="h-6 w-px bg-gray-200 dark:bg-gray-700 mx-1"></div>

            <div className="flex items-center gap-3 px-3 py-1.5 bg-gray-50 dark:bg-gray-800 rounded-full border border-gray-200 dark:border-gray-700">
              <User className="w-4 h-4 text-gray-600 dark:text-gray-300" />
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm text-gray-900 dark:text-gray-100">{userName}</span>
                {getRoleBadge()}
              </div>
            </div>
            <Button 
              variant="outline" 
              onClick={onLogout}
              size="sm"
              className="rounded-full hover:bg-red-50 hover:text-red-600 hover:border-red-200 dark:hover:bg-red-900/20 dark:hover:text-red-400"
            >
              <LogOut className="w-3.5 h-3.5 mr-1.5" />
              {t('Logout') || 'Logout'}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
