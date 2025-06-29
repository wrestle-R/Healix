import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import {
  Menu,
  X,
  Hand,
  HandMetal,
  Camera,
  Repeat,
  HelpCircle,
  Play,
  Pause,
  SkipForward,
  ArrowLeft,
  Timer,
  Target
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const API_URL = import.meta.env.VITE_API_URL;

const ARTherapyApp = () => {
  const { therapyId } = useParams();
  const navigate = useNavigate();
  
  // AR Core States
  const videoRef = useRef();
  const canvasRef = useRef();
  const controlsRef = useRef();
  const streamRef = useRef();
  const [renderer, setRenderer] = useState(null);
  const modelGroupRef = useRef();
  const sceneRef = useRef();
  const animationMixerRef = useRef(null); // 🔧 ADD ANIMATION MIXER
  const clockRef = useRef(new THREE.Clock()); // 🔧 ADD CLOCK
  
  // Therapy States
  const [therapy, setTherapy] = useState(null);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [repsCompleted, setRepsCompleted] = useState(0);
  const [isExerciseActive, setIsExerciseActive] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [loading, setLoading] = useState(true);
  
  // UI States
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [facingMode, setFacingMode] = useState('environment');
  const [showHelp, setShowHelp] = useState(false);
  const [modelControlsActive, setModelControlsActive] = useState(false);
  const [screenSize, setScreenSize] = useState({
    isMobile: window.innerWidth < 640,
    isTablet: window.innerWidth >= 640 && window.innerWidth < 1024
  });

  // Exercise Model Mapping
  const getExerciseModelPath = (exerciseId) => {
    const modelMap = {
      'arm-stretching': '/models/Arm_Stretching.glb',
      'arms-up': '/models/Arms_Up.glb',
      'burpee': '/models/Burpee.glb',
      'front-raises': '/models/Front_Raises.glb',
      'jogging': '/models/Jogging.glb',
      'left-leg-balance': '/models/Left_Leg_Balance.glb',
      'neck-stretching': '/models/Neck Stretching.glb',
      'plank': '/models/Plank.glb',
      'push-up': '/models/Push_Up.glb',
      'right-leg-balance': '/models/Right_Leg_Balance.glb',
      'situps': '/models/Situps.glb',
      'squat': '/models/Squat.glb',
      'stair-climbing': '/models/Stair_Climbing.glb',
      'stand': '/models/Stand.glb',
      'walking': '/models/Walking.glb',
      'warming-up': '/models/Warming_Up.glb'
    };
    return modelMap[exerciseId] || '/models/Stand.glb';
  };

  // Get Rep Duration (same as VR)
  const getRepDuration = (exerciseId) => {
    const durations = {
      'arm-stretching': 15000,
      'arms-up': 10000,
      'burpee': 5000,
      'front-raises': 13000,
      'jogging': 5000,
      'left-leg-balance': 4000,
      'neck-stretching': 1500,
      'plank': 4000,
      'push-up': 3000,
      'right-leg-balance': 4000,
      'situps': 3000,
      'squat': 2000,
      'stair-climbing': 3000,
      'stand': 3000,
      'walking': 1500,
      'warming-up': 5000
    };
    return durations[exerciseId] || 4000;
  };

  // 🔧 MOVE DEBUG OUTSIDE Three.js setup
  const currentExercise = therapy?.exercises[currentExerciseIndex];

  console.log('🔍 AR DEBUG - Current Exercise:', currentExercise);
  console.log('🔍 Exercise ID:', currentExercise?.exerciseId);
  console.log('🔍 Exercise Name:', currentExercise?.exerciseName);
  console.log('🔍 Reps Target:', currentExercise?.repsTarget);

  // Fetch therapy data
  useEffect(() => {
    if (therapyId) {
      fetchTherapy();
    }
  }, [therapyId]);

  const fetchTherapy = async () => {
    try {
      const response = await fetch(`${API_URL}/api/therapies/${therapyId}`);
      const data = await response.json();
      if (data.success) {
        setTherapy(data.therapy);
      }
    } catch (error) {
      console.error('Error fetching therapy:', error);
    } finally {
      setLoading(false);
    }
  };

  // Screen size detection
  useEffect(() => {
    const handleResize = () => {
      setScreenSize({
        isMobile: window.innerWidth < 640,
        isTablet: window.innerWidth >= 640 && window.innerWidth < 1024
      });
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Camera setup
  useEffect(() => {
    async function setupCamera() {
      try {
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
        }
        
        const constraints = { 
          video: { 
            facingMode: facingMode,
            width: { ideal: window.innerWidth },
            height: { ideal: window.innerHeight }
          } 
        };
        
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        streamRef.current = stream;
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play().catch(() => {});
        }
      } catch (err) {
        console.error('Camera error:', err);
      }
    }

    setupCamera();
    
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [facingMode]);

  // Three.js AR Scene Setup
  useEffect(() => {
    if (!therapy) return;
    
    let scene, camera, rendererLocal, controls, loader;
    let modelGroup = new THREE.Group();
    modelGroupRef.current = modelGroup;
    
    const init = () => {
      scene = new THREE.Scene();
      sceneRef.current = scene;
      
      camera = new THREE.PerspectiveCamera(
        65, 
        window.innerWidth / window.innerHeight, 
        0.1, 
        1000
      );
      camera.position.set(0, 1, screenSize.isMobile ? 3 : 2.5);

      rendererLocal = new THREE.WebGLRenderer({ 
        alpha: true, 
        antialias: true,
        preserveDrawingBuffer: true,
        powerPreference: "high-performance"
      });
      rendererLocal.setSize(window.innerWidth, window.innerHeight);
      rendererLocal.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      rendererLocal.setClearColor(0x000000, 0);
      rendererLocal.outputColorSpace = THREE.SRGBColorSpace;

      if (canvasRef.current) {
        canvasRef.current.innerHTML = '';
        rendererLocal.domElement.style.position = 'absolute';
        rendererLocal.domElement.style.inset = '0';
        rendererLocal.domElement.style.width = '100%';
        rendererLocal.domElement.style.height = '100%';
        rendererLocal.domElement.style.pointerEvents = 'none';
        canvasRef.current.appendChild(rendererLocal.domElement);
      }

      setRenderer(rendererLocal);

      // AR-specific controls
      controls = new OrbitControls(camera, rendererLocal.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.15;
      controls.enableZoom = true;
      controls.enablePan = true;
      controls.enableRotate = true;
      
      controls.rotateSpeed = screenSize.isMobile ? 0.5 : 0.8;
      controls.zoomSpeed = screenSize.isMobile ? 0.6 : 0.8;
      controls.panSpeed = screenSize.isMobile ? 0.3 : 0.5;
      
      controls.minDistance = 1;
      controls.maxDistance = 6;
      controls.maxPolarAngle = Math.PI * 0.8;
      controls.minPolarAngle = Math.PI * 0.1;
      
      controls.enabled = false;
      controlsRef.current = controls;

      // AR Lighting
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
      scene.add(ambientLight);
      
      const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
      directionalLight.position.set(2, 10, 5);
      scene.add(directionalLight);
      
      const fillLight = new THREE.DirectionalLight(0xffffff, 0.5);
      fillLight.position.set(-2, -1, 3);
      scene.add(fillLight);

      loader = new GLTFLoader();
      loadCurrentExerciseModel();

      const handleResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        rendererLocal.setSize(window.innerWidth, window.innerHeight);
      };
      window.addEventListener('resize', handleResize);

      // 🔧 FIXED ANIMATION LOOP
      const animate = () => {
        requestAnimationFrame(animate);
        
        // Update animation mixer
        if (animationMixerRef.current) {
          const delta = clockRef.current.getDelta();
          animationMixerRef.current.update(delta);
        }
        
        controls.update();
        rendererLocal.render(scene, camera);
      };

      animate();
      
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    };

    // 🔧 FIXED MODEL LOADING WITH ANIMATIONS
    const loadCurrentExerciseModel = () => {
      const currentExercise = therapy?.exercises[currentExerciseIndex];
      
      if (!currentExercise) return;
      
      const modelPath = getExerciseModelPath(currentExercise.exerciseId);
      
      console.log('🔧 AR Loading Model:', modelPath, 'for exercise:', currentExercise.exerciseName);
      
      loader.load(
        modelPath,
        (gltf) => {
          modelGroup.clear();
          
          // 🔧 STOP PREVIOUS ANIMATIONS
          if (animationMixerRef.current) {
            animationMixerRef.current.stopAllAction();
            animationMixerRef.current = null;
          }
          
          const wrapper = new THREE.Group();
          
          // Auto-center and scale
          const box = new THREE.Box3().setFromObject(gltf.scene);
          const center = box.getCenter(new THREE.Vector3());
          const size = box.getSize(new THREE.Vector3());
          
          gltf.scene.position.set(-center.x, -center.y, -center.z);
          
          const maxDim = Math.max(size.x, size.y, size.z);
          const baseScale = maxDim > 0 ? 1.5 / maxDim : 1;
          const scaleFactor = screenSize.isMobile ? 0.8 : 1;
          const scale = baseScale * scaleFactor;
          
          gltf.scene.scale.set(scale, scale, scale);
          
          wrapper.add(gltf.scene);
          wrapper.position.set(0, 0, 0);
          
          modelGroup.add(wrapper);
          scene.add(modelGroup);
          
          modelGroup.position.set(0, 0, 0);
          
          // 🔧 SETUP ANIMATIONS
          if (gltf.animations && gltf.animations.length > 0) {
            console.log('🔧 AR Found', gltf.animations.length, 'animations in model');
            
            animationMixerRef.current = new THREE.AnimationMixer(gltf.scene);
            
            // Play all animations
            gltf.animations.forEach((clip, index) => {
              console.log(`🔧 AR Playing animation ${index}: ${clip.name}`);
              const action = animationMixerRef.current.clipAction(clip);
              action.setLoop(THREE.LoopRepeat);
              action.play();
            });
          } else {
            console.log('⚠️ AR No animations found in model');
          }
          
          camera.position.set(0, 1, screenSize.isMobile ? 3 : 2.5);
          camera.lookAt(0, 0, 0);
          
          setModelControlsActive(false);
          if (renderer) {
            renderer.domElement.style.pointerEvents = 'none';
          }
          if (controlsRef.current) {
            controlsRef.current.enabled = false;
            controlsRef.current.reset();
            controlsRef.current.target.set(0, 0, 0);
          }
        },
        undefined,
        (error) => {
          console.error('❌ AR Error loading exercise model:', error);
        }
      );
    };

    init();

    return () => {
      // 🔧 CLEANUP ANIMATIONS
      if (animationMixerRef.current) {
        animationMixerRef.current.stopAllAction();
        animationMixerRef.current = null;
      }
      
      rendererLocal && rendererLocal.dispose();
      if (canvasRef.current) {
        canvasRef.current.innerHTML = '';
      }
    };
  }, [therapy, currentExerciseIndex, screenSize]);

  // Time tracking
  useEffect(() => {
    let timeInterval;
    if (isExerciseActive) {
      timeInterval = setInterval(() => {
        setTimeElapsed(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timeInterval);
  }, [isExerciseActive]);

  // Rep counting
  useEffect(() => {
    let repInterval;
    if (isExerciseActive && currentExercise && repsCompleted < currentExercise.repsTarget) {
      const repDuration = getRepDuration(currentExercise.exerciseId);
      
      console.log('🔧 AR REP LOGIC:', {
        exerciseId: currentExercise.exerciseId,
        repDuration: repDuration,
        isActive: isExerciseActive,
        repsCompleted: repsCompleted,
        target: currentExercise.repsTarget
      });
      
      repInterval = setInterval(() => {
        setRepsCompleted(prev => {
          const newReps = prev + 1;
          console.log(`✅ AR Rep ${newReps}/${currentExercise.repsTarget} - ${currentExercise.exerciseName}`);
          return newReps;
        });
      }, repDuration);
    }
    return () => clearInterval(repInterval);
  }, [isExerciseActive, currentExercise, repsCompleted]);

  // Auto-advance exercises
  useEffect(() => {
    if (currentExercise && repsCompleted >= currentExercise.repsTarget) {
      console.log(`🎉 AR Exercise "${currentExercise.exerciseName}" COMPLETED!`);
      
      setIsExerciseActive(false);
      
      setTimeout(() => {
        if (currentExerciseIndex < therapy.exercises.length - 1) {
          nextExercise();
        } else {
          completeRoutine();
        }
      }, 2000);
    }
  }, [repsCompleted, currentExercise, currentExerciseIndex, therapy]);

  const startExercise = () => {
    console.log('🚀 AR STARTING:', currentExercise.exerciseName);
    setIsExerciseActive(true);
    setRepsCompleted(0);
    setTimeElapsed(0);
  };

  const nextExercise = () => {
    console.log('⏭️ NEXT AR EXERCISE');
    setCurrentExerciseIndex(prev => prev + 1);
    setRepsCompleted(0);
    setTimeElapsed(0);
    setIsExerciseActive(false);
  };

  const completeRoutine = () => {
    console.log('🏆 AR ROUTINE COMPLETED!');
    setIsExerciseActive(false);
    alert('🎉 Congratulations! You completed the entire AR therapy routine!');
  };

  const exitAR = () => {
    navigate('/therapy-routines');
  };

  // UI Functions
  const toggleModelControls = () => {
    const newState = !modelControlsActive;
    setModelControlsActive(newState);
    
    if (renderer && controlsRef.current) {
      renderer.domElement.style.pointerEvents = newState ? 'auto' : 'none';
      controlsRef.current.enabled = newState;
    }
  };

  const toggleCameraFacing = () => {
    setFacingMode(prev => prev === 'environment' ? 'user' : 'environment');
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    const captureCanvas = document.createElement('canvas');
    captureCanvas.width = videoRef.current.videoWidth;
    captureCanvas.height = videoRef.current.videoHeight;
    const ctx = captureCanvas.getContext('2d');
    
    ctx.drawImage(videoRef.current, 0, 0);
    
    if (renderer) {
      ctx.drawImage(renderer.domElement, 0, 0, captureCanvas.width, captureCanvas.height);
    }
    
    const link = document.createElement('a');
    link.download = `HEALIX_AR_${currentExercise?.exerciseName || 'Exercise'}_${new Date().toISOString().replace(/[:.]/g, '-')}.png`;
    link.href = captureCanvas.toDataURL('image/png');
    link.click();
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="text-center">
          <div className="text-2xl font-bold text-primary mb-4">Loading AR Therapy...</div>
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    );
  }

  if (!therapy) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="text-center">
          <div className="text-2xl font-bold text-destructive">AR Therapy routine not found</div>
          <button 
            onClick={() => navigate('/therapy-routines')}
            className="mt-4 bg-primary text-primary-foreground px-6 py-2 rounded-lg"
          >
            Back to Routines
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full bg-background text-foreground overflow-hidden">
      
      {/* AR Exercise UI Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed top-0 left-0 h-full w-80 bg-background/95 backdrop-blur-xl border-r border-border shadow-2xl z-[1000] flex flex-col"
          >
            <div className="bg-primary/10 border-b border-border p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${isExerciseActive ? 'bg-primary animate-pulse' : 'bg-muted'}`}></div>
                  <div>
                    <h3 className="font-bold text-foreground text-lg">
                      {currentExercise?.exerciseName || 'Loading...'}
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      Exercise {currentExerciseIndex + 1} of {therapy?.exercises.length}
                    </p>
                  </div>
                </div>
                
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="w-8 h-8 bg-muted hover:bg-muted/80 rounded-full flex items-center justify-center transition-colors"
                >
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>
            </div>

            {/* Progress Section */}
            <div className="p-6 border-b border-border">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground font-medium">Progress</span>
                  <div className="text-right">
                    <div className="text-primary font-bold text-xl">
                      {repsCompleted}
                    </div>
                    <div className="text-muted-foreground text-sm">
                      of {currentExercise?.repsTarget || 10} reps
                    </div>
                  </div>
                </div>
                
                <div className="relative">
                  <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                    <motion.div 
                      className="bg-primary h-3 rounded-full"
                      animate={{ width: `${(repsCompleted / (currentExercise?.repsTarget || 10)) * 100}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Time Section */}
            <div className="p-6 border-b border-border">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground font-medium">Time</span>
                <div className="text-right">
                  <div className="text-primary font-bold text-lg">
                    {formatTime(timeElapsed)}
                  </div>
                  <div className="text-muted-foreground text-sm">
                    AR Session
                  </div>
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="p-6 space-y-3 bg-muted/20 flex-1">
              {!isExerciseActive ? (
                <motion.button 
                  onClick={startExercise}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3 px-4 rounded-lg font-bold transition-all duration-200 flex items-center justify-center shadow-lg"
                >
                  <Play className="w-5 h-5 mr-2" />
                  Start AR Exercise
                </motion.button>
              ) : (
                <motion.button 
                  onClick={nextExercise}
                  disabled={repsCompleted < (currentExercise?.repsTarget || 10)}
                  whileHover={repsCompleted >= (currentExercise?.repsTarget || 10) ? { scale: 1.02 } : {}}
                  whileTap={repsCompleted >= (currentExercise?.repsTarget || 10) ? { scale: 0.98 } : {}}
                  className={`w-full py-3 px-4 rounded-lg font-bold transition-all duration-200 flex items-center justify-center ${
                    repsCompleted >= (currentExercise?.repsTarget || 10)
                      ? 'bg-secondary hover:bg-secondary/90 text-secondary-foreground shadow-lg' 
                      : 'bg-muted text-muted-foreground cursor-not-allowed'
                  }`}
                >
                  <SkipForward className="w-5 h-5 mr-2" />
                  {repsCompleted >= (currentExercise?.repsTarget || 10) ? 'Next Exercise' : 'Complete All Reps First'}
                </motion.button>
              )}
              
              <motion.button 
                onClick={exitAR}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-destructive/80 hover:bg-destructive text-destructive-foreground py-2 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Exit AR Session
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main AR Content */}
      <div className="flex flex-col w-full h-full relative">
        {/* Top AR Controls */}
        <div className="flex items-center justify-between px-4 py-3 bg-background/90 backdrop-blur-xl shadow-lg z-20 border-b border-border">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="bg-primary hover:bg-primary/90 p-2 rounded-lg text-primary-foreground transition"
            >
              <Menu size={20} />
            </button>
            <span className="font-bold text-xl text-primary">HEALIX AR</span>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={toggleModelControls}
              className={`px-3 py-2 rounded-lg font-semibold transition-all shadow flex items-center gap-2 text-sm ${
                modelControlsActive
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted hover:bg-muted/80 text-foreground'
              }`}
            >
              {modelControlsActive ? (
                <>
                  <HandMetal size={16} />
                  Exit 3D
                </>
              ) : (
                <>
                  <Hand size={16} />
                  Control Model
                </>
              )}
            </button>
            <button
              onClick={toggleCameraFacing}
              className="bg-muted hover:bg-muted/80 p-2 rounded-lg text-foreground transition"
            >
              <Repeat size={18} />
            </button>
            <button
              onClick={capturePhoto}
              className="bg-muted hover:bg-muted/80 p-2 rounded-lg text-foreground transition"
            >
              <Camera size={18} />
            </button>
            <button
              onClick={() => setShowHelp(!showHelp)}
              className="bg-muted hover:bg-muted/80 p-2 rounded-lg text-foreground transition"
            >
              <HelpCircle size={18} />
            </button>
          </div>
        </div>

        {/* AR Viewport */}
        <div className="relative flex-grow overflow-hidden">
          {/* Camera background */}
          <video
            ref={videoRef}
            className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 min-w-full min-h-full object-cover z-0"
            playsInline
            muted
          />

          {/* 3D Exercise Model Canvas */}
          <div ref={canvasRef} className="absolute inset-0 w-full h-full z-10" />

          {/* AR Status Overlays */}
          {modelControlsActive && (
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-primary px-4 py-2 rounded-lg text-primary-foreground shadow-lg z-20">
              3D Controls Active
            </div>
          )}

          {/* Exercise Info Overlay */}
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-background/90 backdrop-blur-xl text-foreground px-6 py-4 rounded-xl z-20 shadow-2xl border border-border max-w-sm text-center">
            <div className="flex items-center justify-center gap-4 mb-2">
              <Timer className="w-5 h-5 text-primary" />
              <span className="font-bold text-lg">{formatTime(timeElapsed)}</span>
              <Target className="w-5 h-5 text-primary" />
              <span className="font-bold text-lg">{repsCompleted}/{currentExercise?.repsTarget || 10}</span>
            </div>
            <div className="text-sm text-muted-foreground">
              {isExerciseActive ? (
                <span className="text-primary font-medium">🔴 Recording Exercise</span>
              ) : (
                <span>Tap sidebar menu to start</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Help Modal */}
      {showHelp && (
        <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-background p-6 rounded-xl max-w-md w-full shadow-2xl border border-border">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-primary text-xl">AR Therapy Controls</h3>
              <button
                onClick={() => setShowHelp(false)}
                className="text-muted-foreground hover:text-foreground transition"
              >
                <X size={24} />
              </button>
            </div>
            <div className="space-y-4 text-sm">
              <div>
                <h4 className="font-bold mb-2 text-primary">Exercise Controls:</h4>
                <ul className="ml-4 space-y-1 text-muted-foreground">
                  <li>• Use sidebar menu to start/stop exercises</li>
                  <li>• Follow the AR model for proper form</li>
                  <li>• Complete all reps to advance</li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold mb-2 text-primary">3D Model Controls:</h4>
                <ul className="ml-4 space-y-1 text-muted-foreground">
                  <li>• Click "Control Model" to interact</li>
                  <li>• Touch/drag to rotate model</li>
                  <li>• Pinch to zoom in/out</li>
                  <li>• Two finger pan to move</li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold mb-2 text-primary">Camera:</h4>
                <ul className="ml-4 space-y-1 text-muted-foreground">
                  <li>• Switch between front/back camera</li>
                  <li>• Capture photos with AR overlay</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ARTherapyApp;