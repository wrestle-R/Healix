import React, { useState, useRef, useEffect, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Mic, MicOff, Send, Volume2, VolumeX } from 'lucide-react';

// 3D Doctor Model Component
function DoctorModel({ isListening, isSpeaking }) {
  const meshRef = useRef();
  const headRef = useRef();
  
  useFrame((state) => {
    if (meshRef.current) {
      // Gentle floating animation
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.1;
    }
    
    if (headRef.current) {
      // Head bobbing when speaking
      if (isSpeaking) {
        headRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 8) * 0.1;
      }
    }
  });

  return (
    <group ref={meshRef}>
      {/* Body */}
      <mesh position={[0, -0.5, 0]}>
        <cylinderGeometry args={[0.8, 1, 2, 8]} />
        <meshStandardMaterial color="#4A90E2" />
      </mesh>
      
      {/* Head */}
      <group ref={headRef}>
        <mesh position={[0, 1, 0]}>
          <sphereGeometry args={[0.6, 16, 16]} />
          <meshStandardMaterial color="#FDBCB4" />
        </mesh>
        
        {/* Eyes */}
        <mesh position={[-0.2, 1.1, 0.5]}>
          <sphereGeometry args={[0.08, 8, 8]} />
          <meshStandardMaterial color="#000" />
        </mesh>
        <mesh position={[0.2, 1.1, 0.5]}>
          <sphereGeometry args={[0.08, 8, 8]} />
          <meshStandardMaterial color="#000" />
        </mesh>
        
        {/* Mouth - changes based on speaking */}
        <mesh position={[0, 0.8, 0.5]} scale={isSpeaking ? [1.2, 0.8, 1] : [1, 1, 1]}>
          <sphereGeometry args={[0.1, 8, 8]} />
          <meshStandardMaterial color="#FF6B6B" />
        </mesh>
      </group>
      
      {/* Stethoscope */}
      <mesh position={[0.3, 0.2, 0.8]} rotation={[0, 0, 0.3]}>
        <torusGeometry args={[0.15, 0.02, 8, 16]} />
        <meshStandardMaterial color="#333" />
      </mesh>
      
      {/* White coat */}
      <mesh position={[0, -0.3, 0.1]}>
        <boxGeometry args={[1.6, 1.4, 0.2]} />
        <meshStandardMaterial color="#FFFFFF" />
      </mesh>
      
      {/* Listening indicator */}
      {isListening && (
        <mesh position={[0, 2.5, 0]}>
          <sphereGeometry args={[0.1, 8, 8]} />
          <meshStandardMaterial 
            color="#00FF00" 
            emissive="#00AA00"
            emissiveIntensity={0.5}
          />
        </mesh>
      )}
    </group>
  );
}

// Scene component
function Scene({ isListening, isSpeaking }) {
  return (
    <>
      <ambientLight intensity={0.6} />
      <pointLight position={[10, 10, 10]} intensity={0.8} />
      <pointLight position={[-10, -10, -5]} intensity={0.3} />
      <DoctorModel isListening={isListening} isSpeaking={isSpeaking} />
    </>
  );
}

// Main Chatbot Component
export default function TalkingDoctorChatbot() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [textInput, setTextInput] = useState('');
  const [conversation, setConversation] = useState([]);
  
  // Patient data
  const [patientData, setPatientData] = useState({
    symptoms: '',
    patient_history: '',
    current_medications: '',
    num_recommendations: 3
  });
  
  const recognitionRef = useRef(null);
  const synthRef = useRef(null);
  
  const questions = [
    {
      key: 'symptoms',
      question: "Hello! I'm Dr. AI. What symptoms are you experiencing today? Please describe them in detail.",
      followUp: "Thank you for sharing your symptoms. "
    },
    {
      key: 'patient_history',
      question: "Do you have any medical history I should know about? Any previous conditions, surgeries, or ongoing health issues?",
      followUp: "I've noted your medical history. "
    },
    {
      key: 'current_medications',
      question: "Are you currently taking any medications, supplements, or treatments?",
      followUp: "Got it. Let me analyze your information and provide some recommendations."
    }
  ];

  // Initialize speech synthesis
  useEffect(() => {
    if ('speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
    }
    
    if ('webkitSpeechRecognition' in window) {
      recognitionRef.current = new window.webkitSpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';
      
      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        handleUserInput(transcript);
        setIsListening(false);
      };
      
      recognitionRef.current.onerror = () => {
        setIsListening(false);
      };
      
      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  // Start the conversation
  useEffect(() => {
    if (currentStep === 0) {
      askQuestion(0);
    }
  }, []);

  const speak = (text) => {
    if (!voiceEnabled || !synthRef.current) return;
    
    setIsSpeaking(true);
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 0.8;
    
    utterance.onend = () => {
      setIsSpeaking(false);
    };
    
    synthRef.current.speak(utterance);
  };

  const askQuestion = (stepIndex) => {
    const question = questions[stepIndex];
    if (question) {
      setConversation(prev => [...prev, { type: 'doctor', text: question.question }]);
      speak(question.question);
    }
  };

  const handleUserInput = (input) => {
    if (!input.trim()) return;
    
    setConversation(prev => [...prev, { type: 'patient', text: input }]);
    
    if (currentStep < questions.length) {
      const currentQuestion = questions[currentStep];
      setPatientData(prev => ({
        ...prev,
        [currentQuestion.key]: input
      }));
      
      // Move to next question or get recommendations
      if (currentStep < questions.length - 1) {
        const nextStep = currentStep + 1;
        setCurrentStep(nextStep);
        setTimeout(() => {
          const followUp = currentQuestion.followUp + questions[nextStep].question;
          setConversation(prev => [...prev, { type: 'doctor', text: followUp }]);
          speak(followUp);
        }, 1000);
      } else {
        // All questions answered, get recommendations
        getMedicalAdvice();
      }
    }
    
    setTextInput('');
  };

  const getMedicalAdvice = async () => {
    try {
      const response = await fetch('http://localhost:8000/get_medical_advice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(patientData)
      });
      
      const data = await response.json();
      
      let responseText = data.advice || "Based on your symptoms, here are my recommendations:";
      
      if (data.recommendations && data.recommendations.length > 0) {
        responseText += "\n\nRecommendations:\n" + data.recommendations.map((rec, i) => `${i + 1}. ${rec}`).join('\n');
      }
      
      if (data.precautions && data.precautions.length > 0) {
        responseText += "\n\nPrecautions:\n" + data.precautions.map((prec, i) => `${i + 1}. ${prec}`).join('\n');
      }
      
      responseText += "\n\nRemember, this is general advice. Please consult with a healthcare professional for proper diagnosis and treatment.";
      
      setConversation(prev => [...prev, { type: 'doctor', text: responseText }]);
      speak(responseText);
      
    } catch (error) {
      const errorMessage = "I'm sorry, I'm having trouble accessing my medical database right now. Please try again later or consult with a healthcare professional.";
      setConversation(prev => [...prev, { type: 'doctor', text: errorMessage }]);
      speak(errorMessage);
    }
  };

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  const stopSpeaking = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }
  };

  const resetConversation = () => {
    setCurrentStep(0);
    setConversation([]);
    setPatientData({
      symptoms: '',
      patient_history: '',
      current_medications: '',
      num_recommendations: 3
    });
    stopSpeaking();
    setTimeout(() => askQuestion(0), 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex">
      {/* 3D Doctor */}
      <div className="w-1/2 relative">
        <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
          <Suspense fallback={null}>
            <Scene isListening={isListening} isSpeaking={isSpeaking} />
          </Suspense>
        </Canvas>
        
        {/* Voice controls overlay */}
        <div className="absolute top-4 right-4 flex gap-2">
          <button
            onClick={() => setVoiceEnabled(!voiceEnabled)}
            className={`p-2 rounded-full ${voiceEnabled ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'}`}
          >
            {voiceEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
          </button>
          
          {isSpeaking && (
            <button
              onClick={stopSpeaking}
              className="p-2 rounded-full bg-red-500 text-white"
            >
              Stop
            </button>
          )}
        </div>
      </div>

      {/* Chat Interface */}
      <div className="w-1/2 flex flex-col bg-white shadow-lg">
        {/* Header */}
        <div className="bg-blue-600 text-white p-4">
          <h1 className="text-xl font-bold">Dr. AI Consultation</h1>
          <p className="text-sm opacity-90">Your AI Medical Assistant</p>
        </div>

        {/* Conversation */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {conversation.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.type === 'patient' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg whitespace-pre-line ${
                  message.type === 'patient'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {message.text}
              </div>
            </div>
          ))}
          
          {isListening && (
            <div className="flex justify-start">
              <div className="bg-green-100 text-green-800 px-4 py-2 rounded-lg">
                🎤 Listening...
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="border-t p-4">
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleUserInput(textInput)}
              placeholder="Type your response or use voice..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={() => handleUserInput(textInput)}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              <Send size={20} />
            </button>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={startListening}
              disabled={isListening || !recognitionRef.current}
              className={`flex-1 py-2 px-4 rounded-lg font-medium ${
                isListening
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {isListening ? <MicOff size={20} className="mx-auto" /> : <Mic size={20} className="mx-auto" />}
              {isListening ? 'Listening...' : 'Voice Input'}
            </button>
            
            <button
              onClick={resetConversation}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              Reset
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}