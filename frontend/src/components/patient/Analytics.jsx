import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import {
  FaCalendarCheck,
  FaUserMd,
  FaChartLine,
  FaClock,
  FaUsers,
  FaDownload,
  FaFilter,
  FaEye,
  FaArrowUp,
  FaArrowDown,
  FaChartBar
} from 'react-icons/fa';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import axios from 'axios';
import { toast } from 'sonner';

const Analytics = () => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30d');

  // Pastel color palette
  const colors = {
    primary: '#E8F4F8',
    secondary: '#F0E8FF',
    success: '#E8F8F5',
    warning: '#FFF8E1',
    error: '#FFE8E8',
    info: '#E3F2FD',
    accent: '#F3E5F5',
    neutral: '#F5F5F5'
  };

  const chartColors = [
    '#FF9AA2', '#FFB3BA', '#FFDFBA', '#FFFFBA', 
    '#BAFFC9', '#BAE1FF', '#E8BBE8', '#C7CEEA'
  ];

  useEffect(() => {
    fetchAnalyticsData();
  }, [timeRange]);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const params = new URLSearchParams({ timeRange });

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/patients/analytics?${params}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setAnalyticsData(response.data.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      toast.error('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, change, icon: Icon, color, trend }) => (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
            <p className="text-3xl font-bold text-gray-800">{value}</p>
            {change && (
              <div className={`flex items-center mt-2 text-sm ${
                trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-gray-600'
              }`}>
                {trend === 'up' && <FaArrowUp className="w-3 h-3 mr-1" />}
                {trend === 'down' && <FaArrowDown className="w-3 h-3 mr-1" />}
                <span>{change}</span>
              </div>
            )}
          </div>
          <div className={`p-4 rounded-full`} style={{ backgroundColor: color }}>
            <Icon className="w-6 h-6 text-gray-700" />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-300 border-t-transparent mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">Loading Your Analytics...</p>
        </div>
      </div>
    );
  }
  if (!analyticsData || analyticsData.totalAppointments === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-6">
        <div className="max-w-4xl mx-auto text-center mt-20">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-12 shadow-lg">
            <FaChartBar className="mx-auto text-6xl text-gray-400 mb-6" />
            <h2 className="text-3xl font-bold text-gray-800 mb-4">No Analytics Data Yet</h2>
            <p className="text-lg text-gray-600 mb-8">
              Start booking appointments to see your health analytics and progress tracking.
            </p>
            <Button 
              onClick={() => window.location.reload()} 
              className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-lg"
            >
              Refresh Data
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-800 mb-2">My Health Analytics</h1>
              <p className="text-lg text-gray-600">Track your appointments and medical journey</p>
            </div>
            
            <div className="flex items-center gap-4 mt-4 md:mt-0">
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-32 bg-white/80 backdrop-blur-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">Last 7 Days</SelectItem>
                  <SelectItem value="30d">Last 30 Days</SelectItem>
                  <SelectItem value="90d">Last 90 Days</SelectItem>
                  <SelectItem value="1y">Last Year</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </motion.div>

        {/* Key Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <StatCard
            title="Total Appointments"
            value={analyticsData?.totalAppointments || 0}
            icon={FaCalendarCheck}
            color={colors.primary}
          />
          <StatCard
            title="Completed Sessions"
            value={analyticsData?.completedAppointments || 0}
            icon={FaUserMd}
            color={colors.success}
          />
          <StatCard
            title="Upcoming Visits"
            value={analyticsData?.upcomingAppointments || 0}
            icon={FaClock}
            color={colors.warning}
          />
          <StatCard
            title="Completion Rate"
            value={`${analyticsData?.summary?.completionRate || 0}%`}
            icon={FaChartLine}
            color={colors.secondary}
          />
        </motion.div>

        {/* Charts Grid */}
        {/* Full Width Appointments Trend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-gray-800 flex items-center">
                <FaChartLine className="w-5 h-5 mr-2 text-blue-500" />
                My Appointments Trend
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={analyticsData?.appointmentsTrend || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="date" stroke="#6B7280" />
                  <YAxis stroke="#6B7280" />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="appointments"
                    stroke="#FF9AA2"
                    fill="#FF9AA2"
                    fillOpacity={0.3}
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Second Row - Two Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Appointment Status */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-gray-800 flex items-center">
                  <FaUsers className="w-5 h-5 mr-2 text-green-500" />
                  Appointment Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <PieChart>
                    <Pie
                      data={analyticsData?.appointmentsByStatus || []}
                      cx="50%"
                      cy="50%"
                      innerRadius={70}
                      outerRadius={140}
                      paddingAngle={5}
                      dataKey="count"
                    >
                      {(analyticsData?.appointmentsByStatus || []).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>

          {/* Doctors Visited */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-gray-800 flex items-center">
                  <FaUserMd className="w-5 h-5 mr-2 text-purple-500" />
                  Doctors Visited
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={analyticsData?.doctorsVisited || []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis dataKey="name" stroke="#6B7280" />
                    <YAxis stroke="#6B7280" />
                    <Tooltip />
                    <Bar dataKey="visits" fill="#BAFFC9" name="Visits" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Recent Activities */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-gray-800 flex items-center">
                <FaCalendarCheck className="w-5 h-5 mr-2 text-red-500" />
                Recent Activities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {(analyticsData?.recentActivities || []).map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-4 rounded-lg" style={{ backgroundColor: colors.neutral }}>
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center mr-4" style={{ backgroundColor: chartColors[index % chartColors.length] }}>
                        <FaUserMd className="w-4 h-4 text-gray-700" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">{activity.action}</p>
                        <p className="text-sm text-gray-600">{activity.description}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="secondary" className="mb-1">
                        {activity.type}
                      </Badge>
                      <p className="text-xs text-gray-500">{activity.timestamp}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Analytics;