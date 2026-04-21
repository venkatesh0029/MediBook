import { useEffect, useState } from 'react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Activity, CheckCircle, XCircle, RefreshCw, AlertCircle, Zap } from 'lucide-react';
import { API_BASE } from '../utils/api';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { enableDemoMode, disableDemoMode, isDemoMode } from '../utils/demoMode';

export function SystemStatus() {
  const [status, setStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showTroubleshooting, setShowTroubleshooting] = useState(false);
  const [demoMode, setDemoMode] = useState(isDemoMode());

  useEffect(() => {
    if (!demoMode) {
      checkHealth();
    } else {
      setStatus('online');
    }
  }, [demoMode]);

  const checkHealth = async () => {
    setIsRefreshing(true);
    try {
      const response = await fetch(`${API_BASE}/health`, { 
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        // Don't send Authorization header for health check
      });
      
      if (response.ok) {
        setStatus('online');
        setShowTroubleshooting(false);
      } else {
        console.error('Health check failed with status:', response.status);
        setStatus('offline');
        setShowTroubleshooting(true);
      }
    } catch (error) {
      console.error('Health check error:', error);
      setStatus('offline');
      setShowTroubleshooting(true);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleEnableDemoMode = () => {
    enableDemoMode();
    setDemoMode(true);
    setStatus('online');
    setShowTroubleshooting(false);
    window.location.reload(); 
  };

  const handleDisableDemoMode = () => {
    disableDemoMode();
    setDemoMode(false);
    setShowTroubleshooting(false);
    window.location.reload();
  };

  if (status === 'checking') {
    return (
      <Badge variant="outline" className="gap-2">
        <Activity className="w-3 h-3 animate-pulse" />
        <span className="text-xs">Checking server...</span>
      </Badge>
    );
  }

  if (status === 'online' && demoMode) {
    return (
      <div className="w-full">
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-4 text-white shadow-lg">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg mb-1">Demo Mode Active ⚡</h3>
              <p className="text-purple-100 text-sm mb-3">
                The app is running in demo mode with local storage. All data is saved in your browser.
              </p>
              <div className="bg-white/10 rounded-md p-3 backdrop-blur-sm">
                <p className="text-xs font-semibold mb-1.5 text-purple-100">Test Credentials:</p>
                <div className="space-y-1 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-purple-200">Patient:</span>
                    <code className="bg-white/20 px-2 py-0.5 rounded text-white">patient@demo.com</code>
                    <span className="text-purple-200">/</span>
                    <code className="bg-white/20 px-2 py-0.5 rounded text-white">demo123</code>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-purple-200">Doctor:</span>
                    <code className="bg-white/20 px-2 py-0.5 rounded text-white">doctor@demo.com</code>
                    <span className="text-purple-200">/</span>
                    <code className="bg-white/20 px-2 py-0.5 rounded text-white">demo123</code>
                  </div>
                </div>
              </div>
              <Button 
                onClick={handleDisableDemoMode}
                variant="secondary"
                className="w-full mt-4 font-bold uppercase tracking-wider"
              >
                Turn Off Demo Mode & Connect to MongoDB
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'online') {
    return (
      <div className="flex items-center gap-2">
        <Badge className="gap-2 bg-green-100 text-green-800 hover:bg-green-100">
          <CheckCircle className="w-3 h-3" />
          <span className="text-xs">Server Online</span>
        </Badge>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={checkHealth}
          disabled={isRefreshing}
          className="h-6 px-2"
        >
          <RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin' : ''}`} />
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full space-y-2">
      <div className="flex items-center gap-2">
        <Badge variant="destructive" className="gap-2">
          <XCircle className="w-3 h-3" />
          <span className="text-xs">Server Offline</span>
        </Badge>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={checkHealth}
          disabled={isRefreshing}
          className="h-6 px-2"
        >
          <RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin' : ''}`} />
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setShowTroubleshooting(!showTroubleshooting)}
          className="h-6 px-2 text-xs"
        >
          {showTroubleshooting ? 'Hide' : 'Help'}
        </Button>
      </div>

      {showTroubleshooting && (
        <div className="space-y-2">
          {/* Demo Mode Option */}
          <Alert className="bg-purple-50 border-purple-200">
            <Zap className="h-4 w-4 text-purple-600" />
            <AlertTitle className="text-purple-900">Quick Start: Try Demo Mode</AlertTitle>
            <AlertDescription className="text-purple-800 text-sm space-y-2">
              <p>Use the app immediately without backend setup!</p>
              <Button 
                onClick={handleEnableDemoMode}
                className="bg-purple-600 hover:bg-purple-700 text-white"
                size="sm"
              >
                <Zap className="w-4 h-4 mr-2" />
                Enable Demo Mode
              </Button>
              <p className="text-xs mt-2">Demo mode stores data locally. Perfect for testing!</p>
            </AlertDescription>
          </Alert>

          {/* Backend Deployment Instructions */}
          <Alert className="bg-amber-50 border-amber-200">
            <AlertCircle className="h-4 w-4 text-amber-600" />
            <AlertTitle className="text-amber-900">Or: Deploy Backend Server</AlertTitle>
            <AlertDescription className="text-amber-800 text-sm space-y-2">
              <p className="font-semibold">The Supabase Edge Function must be deployed to use this app.</p>
              <p>Follow these steps:</p>
              <ol className="list-decimal ml-4 space-y-1">
                <li>Go to <a href="https://supabase.com/dashboard" target="_blank" rel="noopener noreferrer" className="underline font-medium">Supabase Dashboard</a></li>
                <li>Select your project: <code className="bg-amber-100 px-1 rounded font-mono text-xs">qrqtehbnvuirpfxmtngr</code></li>
                <li>Navigate to <strong>Edge Functions</strong> in the left sidebar</li>
                <li>Click <strong>Deploy new function</strong> or find the "server" function</li>
                <li>Deploy the function from <code className="bg-amber-100 px-1 rounded font-mono text-xs">/supabase/functions/server/</code></li>
                <li>Wait for deployment to complete (usually 30-60 seconds)</li>
                <li>Check the function logs for any errors</li>
                <li>Click the refresh button above to verify the connection</li>
              </ol>
              <div className="mt-3 pt-3 border-t border-amber-300">
                <p className="text-xs font-medium mb-1">Expected server URL:</p>
                <code className="bg-amber-100 px-2 py-1 rounded block break-all text-xs">{API_BASE}/health</code>
              </div>
              <div className="mt-2 pt-2 border-t border-amber-300">
                <p className="text-xs">💡 <strong>Tip:</strong> After deployment, check the Edge Function logs in Supabase to ensure it started successfully. Look for the message "🚀 MediBook server starting..."</p>
              </div>
            </AlertDescription>
          </Alert>
        </div>
      )}
    </div>
  );
}
