import React, { useState, useRef, useEffect, Suspense } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import * as THREE from "three";
import { Mic, MicOff, Send, Volume2, VolumeX } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// GLB Doctor Model Component
function DoctorGLBModel({ isListening, isSpeaking }) {
  const meshRef = useRef();
  const mixerRef = useRef();

  // Load the GLB file
  const gltf = useLoader(GLTFLoader, "/doc.glb");

  useEffect(() => {
    if (gltf.animations && gltf.animations.length > 0) {
      mixerRef.current = new THREE.AnimationMixer(gltf.scene);
      const idleAction = mixerRef.current.clipAction(gltf.animations[0]);
      idleAction.play();
    }

    // Adjust scale and position for better visibility
    gltf.scene.scale.setScalar(1.8);
    gltf.scene.position.set(0, -0.5, 0);

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

  useFrame((state, delta) => {
    if (mixerRef.current) mixerRef.current.update(delta);

    if (meshRef.current) {
      meshRef.current.position.y =
        Math.sin(state.clock.elapsedTime * 0.5) * 0.05;
      if (isSpeaking) {
        meshRef.current.rotation.y =
          Math.sin(state.clock.elapsedTime * 2) * 0.02;
      }
    }
  });

  return (
    <group ref={meshRef}>
      <primitive object={gltf.scene} />
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

// Fallback model
function FallbackDoctor({ isListening, isSpeaking }) {
  const meshRef = useRef();
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.1;
    }
  });

  return (
    <group ref={meshRef}>
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.5, 0.5, 1.5, 8]} />
        <meshStandardMaterial color="#4A90E2" />
      </mesh>
      <mesh position={[0, 1.2, 0]}>
        <sphereGeometry args={[0.4, 16, 16]} />
        <meshStandardMaterial color="#FDBCB4" />
      </mesh>
      <mesh position={[-0.15, 1.3, 0.35]}>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshStandardMaterial color="#000" />
      </mesh>
      <mesh position={[0.15, 1.3, 0.35]}>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshStandardMaterial color="#000" />
      </mesh>
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
  const [modelError, setModelError] = useState(false);

  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} castShadow />
      <pointLight position={[-5, 3, -5]} intensity={0.3} />

      <Suspense
        fallback={
          <FallbackDoctor isListening={isListening} isSpeaking={isSpeaking} />
        }
      >
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

// Error Boundary
class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("GLB Model Error:", error, errorInfo);
    if (this.props.onError) this.props.onError();
  }

  render() {
    return this.props.children;
  }
}

// Main Chatbot Component
export default function TalkingDoctorChatbot() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [textInput, setTextInput] = useState("");
  const [conversation, setConversation] = useState([]);
  const [browserSupported, setBrowserSupported] = useState(true);

  const patientData = useRef({
    symptoms: "",
    patient_history: "",
    current_medications: "",
    num_recommendations: 3,
  });

  const recognitionRef = useRef(null);
  const synthRef = useRef(null);
  const conversationEndRef = useRef(null);
  const hasAskedFirstQuestion = useRef(false);

  const questions = [
    {
      key: "symptoms",
      question:
        "Hello! I'm Dr. AI. What symptoms are you experiencing today? Please describe them in detail.",
      followUp: "Thank you for sharing your symptoms. ",
    },
    {
      key: "patient_history",
      question:
        "Do you have any medical history I should know about? Any previous conditions, surgeries, or ongoing health issues?",
      followUp: "I've noted your medical history. ",
    },
    {
      key: "current_medications",
      question:
        "Are you currently taking any medications, supplements, or treatments?",
      followUp:
        "Got it. Let me analyze your information and provide some recommendations.",
    },
  ];

  // Initialize speech recognition and synthesis
  useEffect(() => {
    // Check for browser support
    if (
      !("webkitSpeechRecognition" in window) ||
      !("speechSynthesis" in window)
    ) {
      setBrowserSupported(false);
      return;
    }

    // Speech Synthesis setup
    synthRef.current = window.speechSynthesis;

    // Speech Recognition setup
    recognitionRef.current = new window.webkitSpeechRecognition();
    recognitionRef.current.continuous = false;
    recognitionRef.current.interimResults = false;
    recognitionRef.current.lang = "en-US";

    recognitionRef.current.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      console.log("Speech recognized:", transcript);
      handleUserInput(transcript);
      setIsListening(false);
    };

    recognitionRef.current.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setIsListening(false);
      if (event.error === "not-allowed") {
        alert(
          "Microphone access was denied. Please enable microphone permissions."
        );
      }
    };

    recognitionRef.current.onend = () => {
      setIsListening(false);
    };

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);

  // Auto-scroll conversation
  useEffect(() => {
    conversationEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation]);

  // Start conversation only once
  useEffect(() => {
    if (!hasAskedFirstQuestion.current) {
      hasAskedFirstQuestion.current = true;
      setTimeout(() => askQuestion(0), 1000);
    }
    // eslint-disable-next-line
  }, []);

  // Function to clean markdown formatting from text
  const cleanMarkdownText = (text) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, "$1") // Remove **bold** formatting
      .replace(/\*(.*?)\*/g, "$1") // Remove *italic* formatting
      .replace(/__(.*?)__/g, "$1") // Remove __underline__ formatting
      .replace(/_(.*?)_/g, "$1") // Remove _italic_ formatting
      .trim();
  };

  const speak = (text) => {
    if (!voiceEnabled || !synthRef.current) return;

    // Clean the text before speaking
    const cleanText = cleanMarkdownText(text);

    setIsSpeaking(true);
    const utterance = new SpeechSynthesisUtterance(cleanText);
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
      setConversation((prev) => [
        ...prev,
        { type: "doctor", text: question.question },
      ]);
      speak(question.question);
    }
  };

  const handleUserInput = (input) => {
    if (!input.trim()) return;

    // Stop any ongoing speech when user provides input
    if (synthRef.current && isSpeaking) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }

    setConversation((prev) => [...prev, { type: "patient", text: input }]);

    if (currentStep < questions.length) {
      const currentQuestion = questions[currentStep];
      patientData.current = {
        ...patientData.current,
        [currentQuestion.key]: input,
      };

      if (currentStep < questions.length - 1) {
        const nextStep = currentStep + 1;
        setCurrentStep(nextStep);
        setTimeout(() => {
          const followUp =
            currentQuestion.followUp + questions[nextStep].question;
          setConversation((prev) => [
            ...prev,
            { type: "doctor", text: followUp },
          ]);
          speak(followUp);
        }, 1000);
      } else {
        getMedicalAdvice();
      }
    }

    setTextInput("");
  };

  const getMedicalAdvice = async () => {
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_API_URL || "http://localhost:5000"
        }/api/medical/get-medical-advice`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(patientData.current),
        }
      );

      const data = await response.json();

      let responseText =
        data.advice || "Based on your symptoms, here are my recommendations:";

      if (data.recommendations?.length > 0) {
        responseText +=
          "\n\nRecommendations:\n" +
          data.recommendations.map((rec, i) => `${i + 1}. ${rec}`).join("\n");
      }

      if (data.precautions?.length > 0) {
        responseText +=
          "\n\nPrecautions:\n" +
          data.precautions.map((prec, i) => `${i + 1}. ${prec}`).join("\n");
      }

      responseText +=
        "\n\nRemember, this is general advice. Please consult with a healthcare professional for proper diagnosis and treatment.";

      // Clean the response text before displaying and speaking
      const cleanedResponse = cleanMarkdownText(responseText);

      setConversation((prev) => [
        ...prev,
        { type: "doctor", text: cleanedResponse },
      ]);
      speak(cleanedResponse);
    } catch (error) {
      const errorMessage =
        "I'm sorry, I'm having trouble accessing my medical database right now. Please try again later or consult with a healthcare professional.";
      setConversation((prev) => [
        ...prev,
        { type: "doctor", text: errorMessage },
      ]);
      speak(errorMessage);
    }
  };

  const startListening = () => {
    if (!browserSupported) {
      alert(
        "Your browser doesn't support speech recognition. Please use Chrome or Edge."
      );
      return;
    }

    if (recognitionRef.current && !isListening && !isSpeaking) {
      setIsListening(true);
      try {
        recognitionRef.current.start();
      } catch (error) {
        console.error("Speech recognition error:", error);
        setIsListening(false);
        alert("Error accessing microphone. Please check permissions.");
      }
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
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
    patientData.current = {
      symptoms: "",
      patient_history: "",
      current_medications: "",
      num_recommendations: 3,
    };
    stopSpeaking();
    stopListening();
    setTimeout(() => {
      askQuestion(0);
    }, 500);
  };

  return (
    <div className="w-full h-[93vh] flex flex-col">
      <Card className="w-full h-full flex flex-col bg-background/80 backdrop-blur-sm border-border/50">
        <CardContent className="p-0 h-full flex flex-col">
          <div className="flex flex-col lg:flex-row h-full">
            {/* 3D Doctor */}
            <div className="w-full lg:w-1/2 h-[40vh] sm:h-[45vh] lg:h-full relative bg-muted/20 rounded-t-lg lg:rounded-l-lg lg:rounded-r-none overflow-hidden">
              <Canvas
                camera={{ position: [0, 1, 5], fov: 45 }}
                shadows
                className="w-full h-full"
              >
                <Suspense fallback={null}>
                  <Scene isListening={isListening} isSpeaking={isSpeaking} />
                </Suspense>
              </Canvas>

              <div className="absolute top-4 right-4 flex gap-2">
                <Button
                  variant={voiceEnabled ? "default" : "secondary"}
                  size="icon"
                  onClick={() => setVoiceEnabled(!voiceEnabled)}
                  disabled={!browserSupported}
                >
                  {voiceEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
                </Button>

                {isSpeaking && (
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={stopSpeaking}
                  >
                    Stop
                  </Button>
                )}
              </div>

              <div className="absolute bottom-4 left-4">
                <div className="text-sm bg-background/80 px-3 py-1.5 rounded-full flex items-center gap-2">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isListening
                        ? "bg-green-500"
                        : isSpeaking
                        ? "bg-blue-500"
                        : "bg-muted-foreground"
                    }`}
                  ></span>
                  {isListening
                    ? "Listening..."
                    : isSpeaking
                    ? "Speaking..."
                    : "Ready"}
                </div>
              </div>
            </div>

            {/* Chat Interface */}
            <div className="w-full lg:w-1/2 flex flex-col bg-background rounded-b-lg lg:rounded-r-lg lg:rounded-l-none border-t lg:border-t-0 lg:border-l border-border/50">
              <div className="bg-primary/10 p-4 border-b border-border/50">
                <h1 className="text-xl font-bold text-foreground">
                  Dr. AI Consultation
                </h1>
                <p className="text-sm text-muted-foreground">
                  Your AI Medical Assistant
                </p>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {conversation.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${
                      message.type === "patient"
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-xs sm:max-w-md px-4 py-2 rounded-lg whitespace-pre-line ${
                        message.type === "patient"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-foreground"
                      }`}
                    >
                      {message.text}
                    </div>
                  </div>
                ))}
                {isListening && (
                  <div className="flex justify-start">
                    <div className="bg-green-100 text-green-800 px-4 py-2 rounded-lg">
                      🎤 Listening... Speak now
                    </div>
                  </div>
                )}
                <div ref={conversationEndRef} />
              </div>

              <div className="border-t border-border/50 p-4">
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    onKeyPress={(e) =>
                      e.key === "Enter" && handleUserInput(textInput)
                    }
                    placeholder="Type your response or use voice..."
                    className="flex-1 px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 bg-background text-foreground"
                  />
                  <Button
                    onClick={() => handleUserInput(textInput)}
                    size="icon"
                    disabled={!textInput.trim()}
                  >
                    <Send size={20} />
                  </Button>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={isListening ? stopListening : startListening}
                    disabled={!browserSupported || isSpeaking}
                    variant={isListening ? "default" : "outline"}
                    className="flex-1"
                  >
                    {isListening ? (
                      <>
                        <MicOff size={20} className="mr-2" />
                        Stop Listening
                      </>
                    ) : (
                      <>
                        <Mic size={20} className="mr-2" />
                        Voice Input
                      </>
                    )}
                  </Button>

                  <Button onClick={resetConversation} variant="outline">
                    Reset
                  </Button>
                </div>
                {!browserSupported && (
                  <p className="text-xs text-red-500 mt-2">
                    Voice features not supported in this browser. Please use
                    Chrome or Edge.
                  </p>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
