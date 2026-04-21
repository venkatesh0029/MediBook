import { isDemoMode } from '../utils/demoMode';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Zap, Info } from 'lucide-react';

export function DemoModeBanner() {
  if (!isDemoMode()) {
    return null;
  }

  return (
    <Alert className="border-none bg-gradient-to-r from-purple-500 via-purple-600 to-purple-500 text-white shadow-lg rounded-none">
      <Zap className="h-5 w-5 text-white" />
      <AlertTitle className="text-white font-semibold flex items-center gap-2">
        Demo Mode Active
      </AlertTitle>
      <AlertDescription className="text-purple-100">
        The app is running in demo mode with local storage. All data is saved in your browser. 
        <span className="font-semibold"> Test credentials:</span> patient@demo.com / demo123
      </AlertDescription>
    </Alert>
  );
}
