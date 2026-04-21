import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { apiRequest } from '../utils/api';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import { SystemStatus } from './SystemStatus';

const SAMPLE_DOCTORS = [
  {
    email: 'dr.smith@medibook.com',
    password: 'doctor123',
    name: 'Sarah Smith',
    role: 'doctor',
    specialty: 'Cardiologist',
    experience: '15 years',
  },
  {
    email: 'dr.johnson@medibook.com',
    password: 'doctor123',
    name: 'Michael Johnson',
    role: 'doctor',
    specialty: 'Pediatrician',
    experience: '10 years',
  },
  {
    email: 'dr.williams@medibook.com',
    password: 'doctor123',
    name: 'Emily Williams',
    role: 'doctor',
    specialty: 'Orthopedic Surgeon',
    experience: '12 years',
  },
  {
    email: 'dr.brown@medibook.com',
    password: 'doctor123',
    name: 'David Brown',
    role: 'doctor',
    specialty: 'Dermatologist',
    experience: '8 years',
  },
];

const SAMPLE_ADMIN = {
  email: 'admin@medibook.com',
  password: 'admin123',
  name: 'Admin User',
  role: 'admin',
};

export function SeedDataHelper() {
  const [isSeeding, setIsSeeding] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const seedData = async () => {
    setIsSeeding(true);
    setStatus('idle');
    setMessage('');

    try {
      // Create sample doctors
      for (const doctor of SAMPLE_DOCTORS) {
        try {
          await apiRequest('/signup', {
            method: 'POST',
            body: JSON.stringify(doctor),
          });
        } catch (error) {
          // Ignore if user already exists
          console.log('Doctor may already exist:', doctor.email);
        }
      }

      // Create admin user
      try {
        await apiRequest('/signup', {
          method: 'POST',
          body: JSON.stringify(SAMPLE_ADMIN),
        });
      } catch (error) {
        console.log('Admin may already exist');
      }

      setStatus('success');
      setMessage('Sample data created successfully! You can now use these test accounts.');
    } catch (error: any) {
      console.error('Error seeding data:', error);
      setStatus('error');
      setMessage(error.message || 'Failed to create sample data');
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <Card className="mb-6 border-blue-200 bg-blue-50">
      <CardHeader>
        <CardTitle className="text-blue-900">Quick Start - Sample Data</CardTitle>
        <CardDescription className="text-blue-700">
          Initialize the system with sample doctors and admin accounts for testing
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm space-y-2">
          <p className="font-semibold text-blue-900">Sample Accounts:</p>
          <div className="space-y-1 text-blue-800">
            <p>• Admin: admin@medibook.com / admin123</p>
            <p>• Doctors: dr.smith@medibook.com / doctor123 (and 3 more)</p>
            <p>• Create your own patient account from the Sign Up page</p>
          </div>
        </div>

        <Button 
          onClick={seedData} 
          disabled={isSeeding || status === 'success'}
          className="w-full"
        >
          {isSeeding ? 'Creating Sample Data...' : status === 'success' ? 'Sample Data Created ✓' : 'Create Sample Data'}
        </Button>

        {status === 'success' && (
          <div className="flex items-center gap-2 text-green-700 bg-green-50 p-3 rounded-md">
            <CheckCircle2 className="w-5 h-5" />
            <div className="text-sm space-y-1">
              <p className="font-semibold">{message}</p>
              <p className="text-xs">Try logging in with any of the demo accounts listed above!</p>
            </div>
          </div>
        )}

        {status === 'error' && (
          <div className="flex items-center gap-2 text-red-700 bg-red-50 p-3 rounded-md">
            <AlertCircle className="w-5 h-5" />
            <span className="text-sm">{message}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
