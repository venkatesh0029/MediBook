import { useState, useRef, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { MessageCircle, X, Send, Bot, AlertTriangle, ShieldCheck, User, Mic, MicOff, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { analyzeSymptoms } from '../utils/aiEngine';
import { Badge } from './ui/badge';

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  isEmergencyAlert?: boolean;
}

export function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'ai',
      text: "Hello! I'm your AI Healthcare Assistant. Describe your symptoms or ask a question, and I'll help you find the right care immediately."
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const startListening = () => {
    // @ts-ignore
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }
    
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      const transcript = Array.from(event.results)
        .map((result: any) => result[0])
        .map(result => result.transcript)
        .join('');
      setInput(transcript);
    };

    recognition.onerror = (event: any) => {
      console.error(event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { id: Date.now().toString(), sender: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate AI thinking
    setTimeout(() => {
      // Analyze using the AI Engine
      const aiResult = analyzeSymptoms(userMessage.text, "Unknown Cause", "30"); // Default age 30 for generic chat
      
      let aiResponseText = '';
      let isEmergencyAlert = false;

      if (aiResult.severityLevel === 'Critical') {
        isEmergencyAlert = true;
        aiResponseText = `CRITICAL ALERT: Your symptoms suggest a potentially severe condition (Risk Score: ${aiResult.priorityScore}). You must seek immediate medical attention. I recommend our Emergency Slot booking for a ${aiResult.recommendedSpecialty}.`;
      } else if (aiResult.severityLevel === 'Medium') {
        aiResponseText = `I have analyzed your symptoms. It appears to be a medium priority issue. I recommend scheduling an appointment with a ${aiResult.recommendedSpecialty}.`;
      } else {
        aiResponseText = `Based on your description, this seems like a standard condition. A general consultation with a ${aiResult.recommendedSpecialty} should be sufficient.`;
      }

      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: aiResponseText,
        isEmergencyAlert
      }]);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <>
      {/* Floating Action Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="fixed bottom-6 right-6 z-50"
          >
            <Button
              onClick={() => setIsOpen(true)}
              className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-xl shadow-blue-900/20 text-white p-0 relative"
            >
              <MessageCircle className="w-8 h-8" />
              <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chatbot Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-6 right-6 z-50 w-80 sm:w-96"
          >
            <Card className="border-0 shadow-2xl bg-white/90 backdrop-blur-xl overflow-hidden shadow-indigo-900/20">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-3 flex flex-row items-center justify-between rounded-t-xl">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md">
                    <Bot className="w-5 h-5" />
                  </div>
                  <div>
                    <CardTitle className="text-sm font-bold flex items-center gap-2">
                      Pulse AI Assistant <ShieldCheck className="w-3.5 h-3.5 text-blue-200" />
                    </CardTitle>
                    <div className="flex items-center gap-1 mt-0.5">
                      <Zap className="w-3 h-3 text-yellow-300 fill-yellow-300 animate-pulse" />
                      <p className="text-[10px] text-blue-100 font-semibold tracking-wider uppercase">Powered by Neural Engine</p>
                    </div>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)} className="text-white hover:bg-white/20 h-8 w-8 p-0 rounded-full">
                  <X className="w-5 h-5" />
                </Button>
              </CardHeader>
              
              <CardContent className="p-0">
                <div ref={scrollRef} className="h-80 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
                  {messages.map((msg) => (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      key={msg.id}
                      className={`flex gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      {msg.sender === 'ai' && (
                        <div className="w-6 h-6 rounded-full bg-blue-100 flex-shrink-0 flex items-center justify-center mt-1">
                          <Bot className="w-4 h-4 text-blue-600" />
                        </div>
                      )}
                      
                      <div className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm ${
                        msg.sender === 'user' 
                          ? 'bg-blue-600 text-white rounded-tr-none' 
                          : msg.isEmergencyAlert 
                            ? 'bg-red-50 text-red-900 border border-red-200 shadow-sm rounded-tl-none'
                            : 'bg-white text-gray-800 border shadow-sm rounded-tl-none'
                      }`}>
                        {msg.isEmergencyAlert && (
                          <div className="flex items-center gap-1 mb-1 font-bold text-red-700 text-xs uppercase tracking-wider">
                            <AlertTriangle className="w-3 h-3" /> Priority Alert
                          </div>
                        )}
                        {msg.text}
                      </div>

                      {msg.sender === 'user' && (
                        <div className="w-6 h-6 rounded-full bg-slate-200 flex-shrink-0 flex items-center justify-center mt-1">
                          <User className="w-4 h-4 text-slate-500" />
                        </div>
                      )}
                    </motion.div>
                  ))}
                  
                  {isTyping && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex gap-2 justify-start"
                    >
                      <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center mt-1">
                        <Bot className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="bg-white border rounded-2xl rounded-tl-none px-4 py-3 shadow-sm flex items-center gap-1.5">
                        <motion.span 
                          className="w-1.5 h-1.5 bg-blue-500 rounded-full"
                          animate={{ y: [0, -5, 0] }}
                          transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut" }}
                        />
                        <motion.span 
                          className="w-1.5 h-1.5 bg-blue-500 rounded-full"
                          animate={{ y: [0, -5, 0] }}
                          transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut", delay: 0.15 }}
                        />
                        <motion.span 
                          className="w-1.5 h-1.5 bg-blue-500 rounded-full"
                          animate={{ y: [0, -5, 0] }}
                          transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
                        />
                      </div>
                    </motion.div>
                  )}
                </div>

                <div className="p-3 bg-white border-t border-slate-100">
                  <div className="relative flex items-center gap-2">
                    <Button
                      size="icon"
                      variant="ghost"
                      className={`shrink-0 rounded-full ${isListening ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-slate-100 text-slate-500 hover:text-blue-600'}`}
                      onClick={() => isListening ? setIsListening(false) : startListening()}
                    >
                      {isListening ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                    </Button>
                    <div className="relative flex-1 flex items-center">
                      <Input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        placeholder={isListening ? "Listening..." : "Describe your symptoms..."}
                        className="pr-10 bg-slate-50 border-slate-200 focus-visible:ring-indigo-500 rounded-xl w-full"
                      />
                      <Button 
                        onClick={handleSend}
                        disabled={!input.trim() || isTyping}
                        size="icon"
                        className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300"
                      >
                        <Send className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
