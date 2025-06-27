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
  Shield
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
        
        // Client-side search filter
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

  const startTherapy = (therapy) => {
    navigate(`/vr-therapy/${therapy._id}`);
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-700 border-green-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Hard': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Rehabilitation': return <Heart className="w-4 h-4" />;
      case 'Strength': return <Zap className="w-4 h-4" />;
      case 'Balance': return <Shield className="w-4 h-4" />;
      case 'Flexibility': return <Activity className="w-4 h-4" />;
      case 'Cardio': return <Target className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
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
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 p-4">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            VR Therapy Routines
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Experience personalized rehabilitation with our professional therapy routines. 
            Each routine is designed by experts to help you achieve your recovery goals.
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-background/50 backdrop-blur-sm rounded-2xl border border-border/50 p-6 mb-8"
        >
          <div className="flex items-center gap-4 mb-4">
            <Filter className="w-5 h-5 text-muted-foreground" />
            <h3 className="font-semibold text-foreground">Filter Routines</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search routines..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 bg-background"
              />
            </div>
            
            {/* Category Filter */}
            <select
              value={filters.category}
              onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 bg-background"
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
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 bg-background"
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
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 bg-background"
            >
              <option value="">All Conditions</option>
              {conditions.map(condition => (
                <option key={condition} value={condition}>{condition}</option>
              ))}
            </select>
          </div>
        </motion.div>

        {/* Therapy Cards Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="text-2xl text-muted-foreground">Loading therapy routines...</div>
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
                <Card className="group hover:shadow-xl transition-all duration-300 border-border/50 bg-background/50 backdrop-blur-sm overflow-hidden">
                  <CardContent className="p-0">
                    {/* Therapy Image/Header */}
                    <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-6 border-b border-border/30">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-2">
                          {getCategoryIcon(therapy.category)}
                          <Badge variant="secondary" className="text-xs">
                            {therapy.category}
                          </Badge>
                        </div>
                        <Badge className={`text-xs ${getDifficultyColor(therapy.difficulty)}`}>
                          {therapy.difficulty}
                        </Badge>
                      </div>
                      
                      <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                        {therapy.routineName}
                      </h3>
                      
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {therapy.description}
                      </p>
                    </div>

                    {/* Therapy Details */}
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>{therapy.totalDuration} min</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Activity className="w-4 h-4" />
                            <span>{therapy.exercises.length} exercises</span>
                          </div>
                        </div>
                      </div>

                      {/* Target Conditions */}
                      {therapy.targetConditions.length > 0 && (
                        <div className="mb-4">
                          <div className="flex items-center gap-2 mb-2">
                            <Target className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm font-medium">Helps with:</span>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {therapy.targetConditions.slice(0, 3).map((condition, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {condition}
                              </Badge>
                            ))}
                            {therapy.targetConditions.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{therapy.targetConditions.length - 3} more
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Exercise Preview */}
                      <div className="mb-6">
                        <h4 className="text-sm font-medium mb-2 text-muted-foreground">Exercise sequence:</h4>
                        <div className="space-y-1">
                          {therapy.exercises.slice(0, 3).map((exercise, index) => (
                            <div key={index} className="flex items-center gap-2 text-xs text-muted-foreground">
                              <span className="w-4 h-4 bg-primary/10 text-primary rounded-full flex items-center justify-center font-bold text-[10px]">
                                {exercise.order}
                              </span>
                              <span>{exercise.exerciseName}</span>
                              <span className="text-[10px]">({exercise.duration}min)</span>
                            </div>
                          ))}
                          {therapy.exercises.length > 3 && (
                            <div className="text-xs text-muted-foreground pl-6">
                              +{therapy.exercises.length - 3} more exercises
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Start Button */}
                      <Button
                        onClick={() => startTherapy(therapy)}
                        className="w-full group-hover:scale-105 transition-all duration-300 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary text-primary-foreground"
                      >
                        Start VR Therapy
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
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
            className="text-center py-12"
          >
            <div className="text-2xl text-muted-foreground mb-4">No therapy routines found</div>
            <p className="text-muted-foreground">Try adjusting your filters or search terms</p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default TherapyRoutines;