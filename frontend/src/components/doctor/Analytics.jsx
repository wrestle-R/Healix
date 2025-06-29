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
  FaDollarSign,
  FaEye,
  FaArrowUp,
  FaArrowDown,
  FaChartBar,
  FaStethoscope,
  FaClipboardList
} from 'react-icons/fa';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import axios from 'axios';
import { toast } from 'sonner';

const DoctorAnalytics = () => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30d');

  // Professional color palette
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
    '#4F46E5', '#06B6D4', '#10B981', '#F59E0B', 
    '#EF4444', '#8B5CF6', '#EC4899', '#6B7280'
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
        `${import.meta.env.VITE_API_URL}/api/doctors/analytics?${params}`,
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-300 border-t-transparent mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">Loading Your Analytics...</p>
        </div>
      </div>
    );
  }

  if (!analyticsData || analyticsData.totalAppointments === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
        <div className="max-w-4xl mx-auto text-center mt-20">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-12 shadow-lg">
            <FaStethoscope className="mx-auto text-6xl text-gray-400 mb-6" />
            <h2 className="text-3xl font-bold text-gray-800 mb-4">No Analytics Data Yet</h2>
            <p className="text-lg text-gray-600 mb-8">
              Start seeing patients to view your practice analytics and performance metrics.
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-800 mb-2">Practice Analytics</h1>
              <p className="text-lg text-gray-600">Monitor your practice performance and patient insights</p>
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
            icon={FaStethoscope}
            color={colors.success}
          />
          <StatCard
            title="Unique Patients"
            value={analyticsData?.uniquePatients || 0}
            icon={FaUsers}
            color={colors.info}
          />
          <StatCard
            title="Total Revenue"
            value={`₹${analyticsData?.totalRevenue || 0}`}
            icon={FaDollarSign}
            color={colors.warning}
          />
        </motion.div>

        {/* Performance Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <StatCard
            title="Pending Appointments"
            value={analyticsData?.pendingAppointments || 0}
            icon={FaClock}
            color={colors.warning}
          />
          <StatCard
            title="Completion Rate"
            value={`${analyticsData?.summary?.completionRate || 0}%`}
            icon={FaChartLine}
            color={colors.secondary}
          />
          <StatCard
            title="Average Revenue"
            value={`₹${analyticsData?.summary?.averageRevenue || 0}`}
            icon={FaDollarSign}
            color={colors.accent}
          />
          <StatCard
            title="Cancelled"
            value={analyticsData?.cancelledAppointments || 0}
            icon={FaEye}
            color={colors.error}
          />
        </motion.div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Appointments Trend */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-gray-800 flex items-center">
                  <FaChartLine className="w-5 h-5 mr-2 text-blue-500" />
                  Appointments Trend
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={analyticsData?.appointmentsTrend || []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis dataKey="date" stroke="#6B7280" />
                    <YAxis stroke="#6B7280" />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="appointments"
                      stroke="#4F46E5"
                      fill="#4F46E5"
                      fillOpacity={0.3}
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>

          {/* Revenue Trend */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-gray-800 flex items-center">
                  <FaDollarSign className="w-5 h-5 mr-2 text-green-500" />
                  Revenue Trend
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={analyticsData?.revenueTrend || []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis dataKey="date" stroke="#6B7280" />
                    <YAxis stroke="#6B7280" />
                    <Tooltip formatter={(value) => [`₹${value}`, 'Revenue']} />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke="#10B981"
                      fill="#10B981"
                      fillOpacity={0.3}
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Second Row Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Appointment Status */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-gray-800 flex items-center">
                  <FaClipboardList className="w-5 h-5 mr-2 text-purple-500" />
                  Appointment Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={analyticsData?.appointmentsByStatus || []}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={120}
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

          {/* Patient Demographics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-gray-800 flex items-center">
                  <FaUsers className="w-5 h-5 mr-2 text-indigo-500" />
                  Patient Demographics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={analyticsData?.patientsByGender || []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis dataKey="gender" stroke="#6B7280" />
                    <YAxis stroke="#6B7280" />
                    <Tooltip />
                    <Bar dataKey="count" fill="#06B6D4" name="Patients" />
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
          transition={{ delay: 0.5 }}
        >
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-gray-800 flex items-center">
                <FaStethoscope className="w-5 h-5 mr-2 text-red-500" />
                Recent Activities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {(analyticsData?.recentActivities || []).map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-4 rounded-lg" style={{ backgroundColor: colors.neutral }}>
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center mr-4" style={{ backgroundColor: chartColors[index % chartColors.length] }}>
                        <FaStethoscope className="w-4 h-4 text-white" />
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

export default DoctorAnalytics;