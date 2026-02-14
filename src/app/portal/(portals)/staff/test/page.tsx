'use client';

import { useState } from 'react';
import { 
  FaTachometerAlt,
  FaUsers,
  FaClipboardList,
  FaFileAlt,
  FaCog,
  FaBell,
  FaSearch,
  FaChartLine,
  FaCheckCircle,
  FaExclamationTriangle,
  FaClock,
  FaUserTie,
  FaBuilding,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaArrowUp,
  FaArrowDown,
  FaEye,
  FaEdit,
  FaTrash,
  FaPlus,
  FaDownload,
  FaFilter,
  FaChevronRight,
  FaBars,
  FaTimes,
  FaUserCircle,
  FaHardHat,
  FaTasks,
  FaDollarSign,
  FaChartBar,
  FaExclamationCircle
} from 'react-icons/fa';

interface StaffMember {
  id: string;
  name: string;
  role: string;
  activeJobs: number;
  completedThisMonth: number;
  status: 'active' | 'on-leave' | 'offline';
  location: string;
}

interface PendingApproval {
  id: string;
  type: 'report' | 'timesheet' | 'expense' | 'leave';
  title: string;
  submittedBy: string;
  submittedDate: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
}

interface RecentActivity {
  id: string;
  action: string;
  user: string;
  details: string;
  time: string;
  type: 'project' | 'report' | 'user' | 'system';
}

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('this-month');

  // Dashboard stats
  const stats = {
    totalProjects: 24,
    projectChange: '+12%',
    activeStaff: 15,
    staffChange: '+2',
    pendingReports: 8,
    reportChange: '-3',
    revenue: '₦45.2M',
    revenueChange: '+18%',
    completedJobs: 142,
    jobsChange: '+25',
    clientSatisfaction: '94%',
    satisfactionChange: '+2%',
    overdueItems: 3,
    overdueChange: '-1'
  };

  // Staff data
  const staffMembers: StaffMember[] = [
    { 
      id: 'S001', 
      name: 'Ahmed Bello', 
      role: 'Field Engineer', 
      activeJobs: 5, 
      completedThisMonth: 12,
      status: 'active',
      location: 'Port Harcourt'
    },
    { 
      id: 'S002', 
      name: 'Chioma Okafor', 
      role: 'Safety Inspector', 
      activeJobs: 3, 
      completedThisMonth: 15,
      status: 'active',
      location: 'Lagos'
    },
    { 
      id: 'S003', 
      name: 'Ibrahim Mohammed', 
      role: 'Senior Technician', 
      activeJobs: 4, 
      completedThisMonth: 10,
      status: 'on-leave',
      location: 'Warri'
    },
    { 
      id: 'S004', 
      name: 'Grace Eze', 
      role: 'Technical Lead', 
      activeJobs: 6, 
      completedThisMonth: 18,
      status: 'active',
      location: 'Benin City'
    }
  ];

  // Pending approvals
  const pendingApprovals: PendingApproval[] = [
    {
      id: 'APP-001',
      type: 'report',
      title: 'Pipeline Integrity Assessment Report',
      submittedBy: 'Ahmed Bello',
      submittedDate: '2 hours ago',
      priority: 'urgent'
    },
    {
      id: 'APP-002',
      type: 'report',
      title: 'Safety Inspection - Offshore Platform',
      submittedBy: 'Chioma Okafor',
      submittedDate: '5 hours ago',
      priority: 'high'
    },
    {
      id: 'APP-003',
      type: 'expense',
      title: 'Equipment Purchase Request',
      submittedBy: 'Ibrahim Mohammed',
      submittedDate: '1 day ago',
      priority: 'medium'
    },
    {
      id: 'APP-004',
      type: 'leave',
      title: 'Annual Leave Request',
      submittedBy: 'Grace Eze',
      submittedDate: '2 days ago',
      priority: 'low'
    }
  ];

  // Recent activity
  const recentActivity: RecentActivity[] = [
    {
      id: 'ACT-001',
      action: 'Submitted report',
      user: 'Ahmed Bello',
      details: 'Pipeline Integrity Assessment Report',
      time: '2 hours ago',
      type: 'report'
    },
    {
      id: 'ACT-002',
      action: 'Completed project',
      user: 'Chioma Okafor',
      details: 'Tank Farm Inspection & Certification',
      time: '5 hours ago',
      type: 'project'
    },
    {
      id: 'ACT-003',
      action: 'New user registered',
      user: 'System',
      details: 'Tunde Adeyemi joined as Field Engineer',
      time: '1 day ago',
      type: 'user'
    },
    {
      id: 'ACT-004',
      action: 'Updated project status',
      user: 'Grace Eze',
      details: 'Flow Station Equipment Maintenance - In Progress',
      time: '1 day ago',
      type: 'project'
    }
  ];

  const getStatusColor = (status: string) => {
    const colors = {
      'active': 'text-[#4a7c59] bg-[#4a7c59]/10',
      'on-leave': 'text-[#D95C3E] bg-[#D95C3E]/10',
      'offline': 'text-[#8a8a8a] bg-[#8a8a8a]/10'
    };
    return colors[status as keyof typeof colors] || colors.offline;
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      'urgent': 'bg-[#c53030] text-white',
      'high': 'bg-[#D95C3E] text-white',
      'medium': 'bg-[#2b6cb0] text-white',
      'low': 'bg-[#4a7c59] text-white'
    };
    return colors[priority as keyof typeof colors] || colors.low;
  };

  const getApprovalIcon = (type: string) => {
    const icons = {
      'report': FaFileAlt,
      'timesheet': FaClock,
      'expense': FaDollarSign,
      'leave': FaCalendarAlt
    };
    return icons[type as keyof typeof icons] || FaFileAlt;
  };

  const getActivityIcon = (type: string) => {
    const icons = {
      'project': FaClipboardList,
      'report': FaFileAlt,
      'user': FaUsers,
      'system': FaCog
    };
    return icons[type as keyof typeof icons] || FaCog;
  };

  return (
    <div className="min-h-screen bg-[#F6F5D9] flex">
      {/* Sidebar */}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="bg-white border-b border-[#e0ddc7] px-4 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden text-[#37574a]"
              >
                <FaBars size={24} />
              </button>
              <div>
                <h2 className="text-xl font-bold text-[#333333]">Admin Dashboard</h2>
                <p className="text-sm text-[#8a8a8a]">Tuesday, February 10, 2026</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {/* Period Selector */}
              <select 
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="px-4 py-2 bg-[#F6F5D9] border border-[#e0ddc7] rounded-lg text-sm text-[#333333] focus:outline-none focus:ring-2 focus:ring-[#37574a]"
              >
                <option value="today">Today</option>
                <option value="this-week">This Week</option>
                <option value="this-month">This Month</option>
                <option value="this-year">This Year</option>
              </select>
              <button className="relative p-2 text-[#37574a] hover:bg-[#F6F5D9] rounded-lg transition-colors">
                <FaBell size={20} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-[#D95C3E] rounded-full"></span>
              </button>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 overflow-auto p-4 lg:p-8">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              { 
                label: 'Active Projects', 
                value: stats.totalProjects, 
                change: stats.projectChange,
                trend: 'up',
                icon: FaClipboardList, 
                color: 'bg-[#37574a]'
              },
              { 
                label: 'Active Staff', 
                value: stats.activeStaff, 
                change: stats.staffChange,
                trend: 'up',
                icon: FaUserTie, 
                color: 'bg-[#2b6cb0]'
              },
              { 
                label: 'Pending Approvals', 
                value: stats.pendingReports, 
                change: stats.reportChange,
                trend: 'down',
                icon: FaExclamationCircle, 
                color: 'bg-[#D95C3E]'
              },
              { 
                label: 'Monthly Revenue', 
                value: stats.revenue, 
                change: stats.revenueChange,
                trend: 'up',
                icon: FaDollarSign, 
                color: 'bg-[#4a7c59]'
              }
            ].map((metric, index) => (
              <div key={index} className="bg-white rounded-xl border border-[#e0ddc7] p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className={`${metric.color} w-12 h-12 rounded-lg flex items-center justify-center text-white`}>
                    <metric.icon size={24} />
                  </div>
                  <div className={`flex items-center gap-1 text-xs font-semibold ${
                    metric.trend === 'up' ? 'text-[#4a7c59]' : 'text-[#c53030]'
                  }`}>
                    {metric.trend === 'up' ? <FaArrowUp size={10} /> : <FaArrowDown size={10} />}
                    {metric.change}
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-[#333333] mb-1">{metric.value}</h3>
                <p className="text-sm text-[#8a8a8a]">{metric.label}</p>
              </div>
            ))}
          </div>

          {/* Secondary Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Completed Jobs', value: stats.completedJobs, change: stats.jobsChange },
              { label: 'Client Satisfaction', value: stats.clientSatisfaction, change: stats.satisfactionChange },
              { label: 'Overdue Items', value: stats.overdueItems, change: stats.overdueChange },
              { label: 'Active Clients', value: '18', change: '+3' }
            ].map((stat, index) => (
              <div key={index} className="bg-white rounded-xl border border-[#e0ddc7] p-4 shadow-sm">
                <p className="text-sm text-[#8a8a8a] mb-1">{stat.label}</p>
                <div className="flex items-center justify-between">
                  <p className="text-2xl font-bold text-[#333333]">{stat.value}</p>
                  <span className="text-xs font-semibold text-[#4a7c59]">{stat.change}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Staff Overview - Takes 2 columns */}
            <div className="lg:col-span-2 bg-white rounded-xl border border-[#e0ddc7] shadow-sm">
              <div className="p-6 border-b border-[#e0ddc7]">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-[#333333]">Staff Overview</h3>
                  <button className="text-sm text-[#37574a] hover:text-[#2a4238] font-medium flex items-center gap-1">
                    View All
                    <FaChevronRight size={12} />
                  </button>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {staffMembers.map((staff) => (
                    <div 
                      key={staff.id}
                      className="border border-[#e0ddc7] rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 flex-1">
                          <div className="w-12 h-12 rounded-full bg-[#37574a] flex items-center justify-center text-white font-bold">
                            {staff.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-semibold text-[#333333]">{staff.name}</h4>
                              <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(staff.status)}`}>
                                {staff.status.replace('-', ' ').toUpperCase()}
                              </span>
                            </div>
                            <p className="text-sm text-[#8a8a8a]">{staff.role}</p>
                            <div className="flex items-center gap-2 mt-1 text-xs text-[#8a8a8a]">
                              <FaMapMarkerAlt size={10} />
                              {staff.location}
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-6 text-center">
                          <div>
                            <p className="text-2xl font-bold text-[#37574a]">{staff.activeJobs}</p>
                            <p className="text-xs text-[#8a8a8a]">Active</p>
                          </div>
                          <div>
                            <p className="text-2xl font-bold text-[#4a7c59]">{staff.completedThisMonth}</p>
                            <p className="text-xs text-[#8a8a8a]">Completed</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Pending Approvals */}
            <div className="lg:col-span-1 bg-white rounded-xl border border-[#e0ddc7] shadow-sm">
              <div className="p-6 border-b border-[#e0ddc7]">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-[#333333]">Pending Approvals</h3>
                  <span className="bg-[#D95C3E] text-white text-xs font-bold px-2 py-1 rounded-full">
                    {pendingApprovals.length}
                  </span>
                </div>
              </div>
              <div className="p-6 space-y-3 max-h-96 overflow-y-auto">
                {pendingApprovals.map((approval) => {
                  const Icon = getApprovalIcon(approval.type);
                  return (
                    <div 
                      key={approval.id}
                      className="border-l-4 border-[#D95C3E] bg-[#F6F5D9] p-4 rounded-r-lg hover:shadow-md transition-shadow cursor-pointer"
                    >
                      <div className="flex items-start gap-3 mb-2">
                        <div className="w-8 h-8 bg-[#D95C3E] rounded-lg flex items-center justify-center text-white flex-shrink-0">
                          <Icon size={14} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className={`text-xs px-2 py-1 rounded-full font-medium ${getPriorityColor(approval.priority)} inline-block mb-1`}>
                            {approval.priority.toUpperCase()}
                          </span>
                          <h4 className="font-semibold text-[#333333] text-sm mb-1 line-clamp-2">
                            {approval.title}
                          </h4>
                          <p className="text-xs text-[#8a8a8a]">By: {approval.submittedBy}</p>
                          <p className="text-xs text-[#8a8a8a]">{approval.submittedDate}</p>
                        </div>
                      </div>
                      <div className="flex gap-2 mt-3">
                        <button className="flex-1 px-3 py-1.5 bg-[#4a7c59] text-white rounded text-xs font-medium hover:bg-[#37574a] transition-colors">
                          Approve
                        </button>
                        <button className="flex-1 px-3 py-1.5 border border-[#e0ddc7] text-[#333333] rounded text-xs font-medium hover:bg-white transition-colors">
                          Review
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Recent Activity & Quick Stats */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Activity */}
            <div className="bg-white rounded-xl border border-[#e0ddc7] shadow-sm">
              <div className="p-6 border-b border-[#e0ddc7]">
                <h3 className="text-lg font-bold text-[#333333]">Recent Activity</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {recentActivity.map((activity) => {
                    const Icon = getActivityIcon(activity.type);
                    return (
                      <div key={activity.id} className="flex items-start gap-4 pb-4 border-b border-[#f8f8f6] last:border-0">
                        <div className="w-10 h-10 rounded-full bg-[#F6F5D9] flex items-center justify-center flex-shrink-0">
                          <Icon size={16} className="text-[#37574a]" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-[#333333]">
                            <span className="text-[#37574a]">{activity.user}</span> {activity.action}
                          </p>
                          <p className="text-sm text-[#4a4a4a] line-clamp-1">{activity.details}</p>
                          <p className="text-xs text-[#8a8a8a] mt-1">{activity.time}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Performance Chart Placeholder */}
            <div className="bg-white rounded-xl border border-[#e0ddc7] shadow-sm">
              <div className="p-6 border-b border-[#e0ddc7]">
                <h3 className="text-lg font-bold text-[#333333]">Project Completion Rate</h3>
              </div>
              <div className="p-6">
                <div className="h-64 flex items-center justify-center bg-[#F6F5D9] rounded-lg">
                  <div className="text-center">
                    <FaChartBar size={48} className="text-[#8a8a8a] mx-auto mb-3" />
                    <p className="text-[#8a8a8a]">Chart visualization</p>
                    <p className="text-sm text-[#8a8a8a] mt-1">Connect analytics library</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 mt-6">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-[#4a7c59]">87%</p>
                    <p className="text-xs text-[#8a8a8a] mt-1">On Time</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-[#2b6cb0]">10%</p>
                    <p className="text-xs text-[#8a8a8a] mt-1">Delayed</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-[#c53030]">3%</p>
                    <p className="text-xs text-[#8a8a8a] mt-1">Overdue</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}