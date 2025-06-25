import React, { useState, useRef, useEffect, Suspense } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import * as THREE from 'three';
import { Mic, MicOff, Send, Volume2, VolumeX } from 'lucide-react';

// GLB Doctor Model Component
function DoctorGLBModel({ isListening, isSpeaking }) {
  const meshRef = useRef();
  const mixerRef = useRef();
  
  // Load the GLB file - you'll need to put your GLB file in the public folder
  const gltf = useLoader(GLTFLoader, '/doc.glb');
  
  // Set up animations if they exist in the GLB file
  useEffect(() => {
    if (gltf.animations && gltf.animations.length > 0) {
      mixerRef.current = new THREE.AnimationMixer(gltf.scene);
      
      // Play idle animation if available
      const idleAction = mixerRef.current.clipAction(gltf.animations[0]);
      idleAction.play();
    }
    
    // Scale and position the model appropriately
    gltf.scene.scale.setScalar(2); // Made bigger
    gltf.scene.position.set(0, -0.5, 0); // Adjusted position
    
    // Ensure materials are properly set up
    gltf.scene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        if (child.material) {
          child.material.needsUpdate = true;
        }
      }
    });
  }, [gltf]);
  
  // Animation loop
  useFrame((state, delta) => {
    if (mixerRef.current) {
      mixerRef.current.update(delta);
    }
    
    if (meshRef.current) {
      // Gentle floating animation
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.05;
      
      // Slight rotation when speaking
      if (isSpeaking) {
        meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 2) * 0.02;
      }
    }
  });
  
  return (
    <group ref={meshRef}>
      <primitive object={gltf.scene} />
      
      {/* Listening indicator - floating sphere above the model */}
      {isListening && (
        <mesh position={[0, 3, 0]}>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshStandardMaterial 
            color="#00FF00" 
            emissive="#00AA00"
            emissiveIntensity={0.8}
          />
        </mesh>
      )}
      
      {/* Speaking indicator - pulsing ring around the model */}
      {isSpeaking && (
        <mesh position={[0, 1, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.5, 1.8, 32]} />
          <meshStandardMaterial 
            color="#0066FF" 
            emissive="#0044BB"
            emissiveIntensity={0.6}
            transparent
            opacity={0.7}
          />
        </mesh>
      )}
    </group>
  );
}

// Fallback model in case GLB fails to load
function FallbackDoctor({ isListening, isSpeaking }) {
  const meshRef = useRef();
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.1;
    }
  });

  return (
    <group ref={meshRef}>
      {/* Simple fallback doctor */}
      <mesh position={[0, 0, 0]}>
        <capsuleGeometry args={[0.5, 1.5, 4, 8]} />
        <meshStandardMaterial color="#4A90E2" />
      </mesh>
      
      {/* Head */}
      <mesh position={[0, 1.2, 0]}>
        <sphereGeometry args={[0.4, 16, 16]} />
        <meshStandardMaterial color="#FDBCB4" />
      </mesh>
      
      {/* Simple face */}
      <mesh position={[-0.15, 1.3, 0.35]}>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshStandardMaterial color="#000" />
      </mesh>
      <mesh position={[0.15, 1.3, 0.35]}>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshStandardMaterial color="#000" />
      </mesh>
      
      {/* Status indicators */}
      {isListening && (
        <mesh position={[0, 2.5, 0]}>
          <sphereGeometry args={[0.1, 8, 8]} />
          <meshStandardMaterial color="#00FF00" emissive="#00AA00" emissiveIntensity={0.5} />
        </mesh>
      )}
    </group>
  );
}

// Scene component with error boundary
function Scene({ isListening, isSpeaking }) {
  const [modelError, setModelError] = useState(false);
  
  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight 
        position={[5, 5, 5]} 
        intensity={0.8}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <pointLight position={[-5, 3, -5]} intensity={0.3} />
      
      <Suspense fallback={<FallbackDoctor isListening={isListening} isSpeaking={isSpeaking} />}>
        {!modelError ? (
          <ErrorBoundary onError={() => setModelError(true)}>
            <DoctorGLBModel isListening={isListening} isSpeaking={isSpeaking} />
          </ErrorBoundary>
        ) : (
          <FallbackDoctor isListening={isListening} isSpeaking={isSpeaking} />
        )}
      </Suspense>
    </>
  );
}

// Simple Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.log('GLB Model Error:', error, errorInfo);
    if (this.props.onError) {
      this.props.onError();
    }
  }

  render() {
    if (this.state.hasError) {
      return this.props.children;
    }

    return this.props.children;
  }
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
        console.log('Speech recognized:', transcript);
        handleUserInput(transcript);
        setIsListening(false);
      };
      
      recognitionRef.current.onerror = (event) => {
        console.log('Speech recognition error:', event.error);
        setIsListening(false);
      };
      
      recognitionRef.current.onend = () => {
        console.log('Speech recognition ended');
        setIsListening(false);
      };
    }
  }, []);

  // Start the conversation
  useEffect(() => {
    if (currentStep === 0) {
      setTimeout(() => {
        askQuestion(0);
      }, 1000); // Delay to ensure everything is loaded
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
    if (recognitionRef.current && !isListening && !isSpeaking) {
      setIsListening(true);
      try {
        recognitionRef.current.start();
      } catch (error) {
        console.log('Speech recognition error:', error);
        setIsListening(false);
      }
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
        <Canvas 
          camera={{ position: [0, 1, 4], fov: 45 }}
          shadows
          style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
        >
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
        
        {/* Loading indicator */}
        <div className="absolute bottom-4 left-4 text-white text-sm bg-black bg-opacity-50 px-3 py-2 rounded">
          {isListening ? '🎤 Listening...' : isSpeaking ? '🗣️ Speaking...' : '👨‍⚕️ Ready'}
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