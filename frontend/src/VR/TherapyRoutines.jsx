import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Clock, 
  Target, 
  Activity, 
  ArrowRight,
  Filter,
  Search,
  Heart,
  Zap,
  Shield,
  Play,
  Users,
  Award,
  Sparkles,
  Camera,
  ArrowLeft
} from 'lucide-react';
import { toast } from "sonner";

const API_URL = import.meta.env.VITE_API_URL;

const TherapyRoutines = () => {
  const [therapies, setTherapies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: '',
    difficulty: '',
    targetCondition: '',
    search: ''
  });
  const [categories, setCategories] = useState([]);
  const [conditions, setConditions] = useState([]);
  
  const navigate = useNavigate();

  useEffect(() => {
    fetchTherapies();
    fetchCategories();
    fetchConditions();
  }, [filters]);

  const fetchTherapies = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      
      if (filters.category) queryParams.append('category', filters.category);
      if (filters.difficulty) queryParams.append('difficulty', filters.difficulty);
      if (filters.targetCondition) queryParams.append('targetCondition', filters.targetCondition);

      const response = await fetch(`${API_URL}/api/therapies?${queryParams}`);
      const data = await response.json();
      
      if (data.success) {
        let filteredTherapies = data.therapies;
        
        if (filters.search) {
          filteredTherapies = filteredTherapies.filter(therapy =>
            therapy.routineName.toLowerCase().includes(filters.search.toLowerCase()) ||
            therapy.description.toLowerCase().includes(filters.search.toLowerCase())
          );
        }
        
        setTherapies(filteredTherapies);
      }
    } catch (error) {
      console.error('Error fetching therapies:', error);
      toast.error('Failed to load therapy routines');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_URL}/api/therapies/categories`);
      const data = await response.json();
      if (data.success) setCategories(data.categories);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchConditions = async () => {
    try {
      const response = await fetch(`${API_URL}/api/therapies/conditions`);
      const data = await response.json();
      if (data.success) setConditions(data.conditions);
    } catch (error) {
      console.error('Error fetching conditions:', error);
    }
  };

  const startTherapy = (therapy, mode = 'vr') => {
  if (mode === 'ar') {
    navigate(`/ar-therapy/${therapy._id}`);
  } else {
    navigate(`/vr-therapy/${therapy._id}`);
  }
};

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Medium': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Hard': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Rehabilitation': return <Heart className="w-5 h-5" />;
      case 'Strength': return <Zap className="w-5 h-5" />;
      case 'Balance': return <Shield className="w-5 h-5" />;
      case 'Flexibility': return <Activity className="w-5 h-5" />;
      case 'Cardio': return <Target className="w-5 h-5" />;
      default: return <Activity className="w-5 h-5" />;
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const cardVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative overflow-hidden">
      
      {/* 🌟 Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-emerald-400/20 to-cyan-600/20 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12 relative z-10">
        <Button
        onClick={() => navigate('/')}
        className="mb-8 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white px-6 py-3 rounded-full shadow-lg transition-all duration-300 flex items-center gap-2"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Landing
        </Button>
        
        {/* 🎯 HERO HEADER */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center mb-4">
            <Sparkles className="w-8 h-8 text-primary mr-3" />
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-purple-900 bg-clip-text text-transparent">
              VR Therapy Studio
            </h1>
          </div>
          <p className="text-xl text-slate-600 max-w-4xl mx-auto leading-relaxed">
            Experience the future of rehabilitation with our immersive VR therapy routines. 
            Each session is professionally designed to accelerate your recovery journey.
          </p>
          
          {/* Stats */}
          <div className="flex items-center justify-center gap-8 mt-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">{therapies.length}+</div>
              <div className="text-sm text-slate-600">Routines</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">10k+</div>
              <div className="text-sm text-slate-600">Patients</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">95%</div>
              <div className="text-sm text-slate-600">Success Rate</div>
            </div>
          </div>
        </motion.div>

        {/* 🔍 PREMIUM FILTERS */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/70 backdrop-blur-xl rounded-3xl border border-white/50 shadow-2xl p-8 mb-12"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-gradient-to-br from-primary to-primary/80 rounded-2xl">
              <Filter className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-slate-900">Find Your Perfect Routine</h3>
              <p className="text-slate-600">Filter by category, difficulty, or condition</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Search */}
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary transition-colors" />
              <input
                type="text"
                placeholder="Search routines..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                className="w-full pl-12 pr-4 py-4 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white/80 backdrop-blur-sm transition-all duration-200"
              />
            </div>
            
            {/* Category Filter */}
            <select
              value={filters.category}
              onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
              className="w-full px-4 py-4 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white/80 backdrop-blur-sm transition-all duration-200"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            
            {/* Difficulty Filter */}
            <select
              value={filters.difficulty}
              onChange={(e) => setFilters(prev => ({ ...prev, difficulty: e.target.value }))}
              className="w-full px-4 py-4 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white/80 backdrop-blur-sm transition-all duration-200"
            >
              <option value="">All Difficulties</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
            
            {/* Condition Filter */}
            <select
              value={filters.targetCondition}
              onChange={(e) => setFilters(prev => ({ ...prev, targetCondition: e.target.value }))}
              className="w-full px-4 py-4 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white/80 backdrop-blur-sm transition-all duration-200"
            >
              <option value="">All Conditions</option>
              {conditions.map(condition => (
                <option key={condition} value={condition}>{condition}</option>
              ))}
            </select>
          </div>
        </motion.div>

        {/* 🎴 THERAPY CARDS */}
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-primary border-t-transparent"></div>
            <div className="text-2xl text-slate-600 mt-6">Loading amazing routines...</div>
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {therapies.map((therapy) => (
              <motion.div key={therapy._id} variants={cardVariants}>
                <Card className="group hover:shadow-2xl transition-all duration-500 border-0 bg-white/80 backdrop-blur-xl overflow-hidden hover:scale-105">
                  <CardContent className="p-0">
                    
                    {/* 🎨 CARD HEADER with gradient */}
                    <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-8 relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      
                      <div className="flex items-start justify-between mb-6 relative z-10">
                        <div className="flex items-center gap-3">
                          <div className="p-3 bg-gradient-to-br from-primary to-primary/80 rounded-2xl text-white">
                            {getCategoryIcon(therapy.category)}
                          </div>
                          <div>
                            <Badge variant="secondary" className="text-xs font-medium mb-2">
                              {therapy.category}
                            </Badge>
                            <Badge className={`text-xs font-medium ${getDifficultyColor(therapy.difficulty)}`}>
                              {therapy.difficulty}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      
                      <h3 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-primary transition-colors">
                        {therapy.routineName}
                      </h3>
                      
                      <p className="text-slate-600 leading-relaxed">
                        {therapy.description}
                      </p>
                    </div>

                    {/* 📊 THERAPY DETAILS */}
                    <div className="p-8">
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-6 text-sm text-slate-600">
                          <div className="flex items-center gap-2">
                            <Clock className="w-5 h-5 text-primary" />
                            <span className="font-medium">{therapy.totalDuration} min</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Activity className="w-5 h-5 text-primary" />
                            <span className="font-medium">{therapy.exercises.length} exercises</span>
                          </div>
                        </div>
                      </div>

                      {/* Target Conditions */}
                      {therapy.targetConditions.length > 0 && (
                        <div className="mb-6">
                          <div className="flex items-center gap-2 mb-3">
                            <Target className="w-5 h-5 text-slate-500" />
                            <span className="text-sm font-semibold text-slate-700">Helps with:</span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {therapy.targetConditions.slice(0, 3).map((condition, index) => (
                              <Badge key={index} variant="outline" className="text-xs border-primary/30 text-primary">
                                {condition}
                              </Badge>
                            ))}
                            {therapy.targetConditions.length > 3 && (
                              <Badge variant="outline" className="text-xs border-slate-300 text-slate-600">
                                +{therapy.targetConditions.length - 3} more
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Exercise Preview */}
                      <div className="mb-8">
                        <h4 className="text-sm font-semibold text-slate-700 mb-3">Exercise sequence:</h4>
                        <div className="space-y-2">
                          {therapy.exercises.slice(0, 3).map((exercise, index) => (
                            <div key={index} className="flex items-center gap-3 text-sm text-slate-600">
                              <div className="w-6 h-6 bg-gradient-to-br from-primary/20 to-primary/10 text-primary rounded-full flex items-center justify-center font-bold text-xs">
                                {exercise.order}
                              </div>
                              <span className="font-medium">{exercise.exerciseName}</span>
                              <span className="text-xs text-slate-500">({exercise.duration}min)</span>
                            </div>
                          ))}
                          {therapy.exercises.length > 3 && (
                            <div className="text-sm text-slate-500 pl-9">
                              +{therapy.exercises.length - 3} more exercises
                            </div>
                          )}
                        </div>
                      </div>

                      {/* 🚀 PREMIUM START BUTTON */}
                      <Button
                        onClick={() => startTherapy(therapy,'vr')}
                        className="w-full group bg-gradient-to-r from-primary via-primary/90 to-primary hover:from-primary/90 hover:via-primary hover:to-primary/90 text-white py-6 px-6 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl relative overflow-hidden"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                        <div className="flex items-center justify-center relative z-10">
                          <Play className="w-6 h-6 mr-3" />
                          <span>Start VR Therapy</span>
                          <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </Button>
                      <Button
                        onClick={() => startTherapy(therapy,'ar')}
                        className="mt-2 w-full group bg-gradient-to-r from-emerald-600 via-emerald-500 to-green-600 hover:from-emerald-500 hover:via-emerald-600 hover:to-green-500 text-white py-6 px-6 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl relative overflow-hidden"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                        <div className="flex items-center justify-center relative z-10">
                          <Camera className="w-6 h-6 mr-3" />
                          <span>Start AR Therapy</span>
                          <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* No Results */}
        {!loading && therapies.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="text-6xl mb-6">🔍</div>
            <div className="text-3xl font-bold text-slate-900 mb-4">No routines found</div>
            <p className="text-xl text-slate-600">Try adjusting your filters or search terms</p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default TherapyRoutines;