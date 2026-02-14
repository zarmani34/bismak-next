'use client';

import { useState } from 'react';
import { 
  FaPlus,
  FaSearch,
  FaFilter,
  FaCalendarAlt,
  FaFileAlt,
  FaDownload,
  FaEye,
  FaEdit,
  FaTrash,
  FaCheckCircle,
  FaClock,
  FaExclamationTriangle,
  FaTimes,
  FaChevronDown,
  FaUpload,
  FaCamera,
  FaFilePdf,
  FaFileWord,
  FaFileImage,
  FaClipboardList,
  FaChartBar,
  FaUser,
  FaMapMarkerAlt,
  FaBuilding,
  FaPaperPlane
} from 'react-icons/fa';

interface Report {
  id: string;
  title: string;
  type: string;
  project: string;
  client: string;
  location: string;
  status: 'draft' | 'submitted' | 'approved' | 'rejected' | 'pending-review';
  submittedBy: string;
  submittedDate: string;
  attachments: number;
  priority: 'low' | 'medium' | 'high' | 'urgent';
}

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState<'all' | 'drafts' | 'submitted'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [showNewReportModal, setShowNewReportModal] = useState(false);

  // Sample reports data
  const reports: Report[] = [
    {
      id: 'RPT-001',
      title: 'Safety Inspection Report - Platform 5',
      type: 'Safety Inspection',
      project: 'Offshore Platform Safety Inspection',
      client: 'NNPC Limited',
      location: 'Escravos Terminal',
      status: 'submitted',
      submittedBy: 'Ahmed Bello',
      submittedDate: 'Feb 10, 2026',
      attachments: 12,
      priority: 'high'
    },
    {
      id: 'RPT-002',
      title: 'Pipeline Corrosion Assessment',
      type: 'Technical Assessment',
      project: 'Pipeline Integrity Assessment',
      client: 'Shell Nigeria',
      location: 'Port Harcourt',
      status: 'approved',
      submittedBy: 'Ahmed Bello',
      submittedDate: 'Feb 8, 2026',
      attachments: 8,
      priority: 'urgent'
    },
    {
      id: 'RPT-003',
      title: 'Equipment Maintenance Log - Draft',
      type: 'Maintenance',
      project: 'Flow Station Equipment Maintenance',
      client: 'Chevron Nigeria',
      location: 'Warri',
      status: 'draft',
      submittedBy: 'Ahmed Bello',
      submittedDate: 'Feb 10, 2026',
      attachments: 3,
      priority: 'medium'
    },
    {
      id: 'RPT-004',
      title: 'Tank Farm Safety Certification',
      type: 'Certification',
      project: 'Tank Farm Inspection',
      client: 'TotalEnergies',
      location: 'Lagos',
      status: 'approved',
      submittedBy: 'Ahmed Bello',
      submittedDate: 'Feb 5, 2026',
      attachments: 15,
      priority: 'high'
    },
    {
      id: 'RPT-005',
      title: 'Wellhead Pressure Test Results',
      type: 'Testing & Commissioning',
      project: 'Wellhead Pressure Testing',
      client: 'Seplat Energy',
      location: 'Benin City',
      status: 'pending-review',
      submittedBy: 'Ahmed Bello',
      submittedDate: 'Feb 9, 2026',
      attachments: 6,
      priority: 'urgent'
    },
    {
      id: 'RPT-006',
      title: 'Incident Report - Minor Spill',
      type: 'Incident Report',
      project: 'Pipeline Integrity Assessment',
      client: 'Shell Nigeria',
      location: 'Port Harcourt',
      status: 'submitted',
      submittedBy: 'Ahmed Bello',
      submittedDate: 'Feb 7, 2026',
      attachments: 10,
      priority: 'urgent'
    }
  ];

  const getStatusConfig = (status: string) => {
    const configs = {
      'approved': { 
        label: 'Approved', 
        color: 'text-[#4a7c59] bg-[#4a7c59]/10',
        icon: FaCheckCircle 
      },
      'submitted': { 
        label: 'Submitted', 
        color: 'text-[#2b6cb0] bg-[#2b6cb0]/10',
        icon: FaPaperPlane 
      },
      'draft': { 
        label: 'Draft', 
        color: 'text-[#8a8a8a] bg-[#8a8a8a]/10',
        icon: FaEdit 
      },
      'pending-review': { 
        label: 'Pending Review', 
        color: 'text-[#D95C3E] bg-[#D95C3E]/10',
        icon: FaClock 
      },
      'rejected': { 
        label: 'Rejected', 
        color: 'text-[#c53030] bg-[#c53030]/10',
        icon: FaExclamationTriangle 
      }
    };
    return configs[status as keyof typeof configs] || configs['draft'];
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

  // Filter reports
  const filteredReports = reports.filter(report => {
    const matchesSearch = report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         report.project.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         report.client.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || report.type === filterType;
    const matchesStatus = filterStatus === 'all' || report.status === filterStatus;
    const matchesTab = activeTab === 'all' || 
                      (activeTab === 'drafts' && report.status === 'draft') ||
                      (activeTab === 'submitted' && report.status !== 'draft');
    return matchesSearch && matchesType && matchesStatus && matchesTab;
  });

  // Stats
  const stats = {
    total: reports.length,
    drafts: reports.filter(r => r.status === 'draft').length,
    submitted: reports.filter(r => r.status === 'submitted' || r.status === 'pending-review').length,
    approved: reports.filter(r => r.status === 'approved').length
  };

  const reportTemplates = [
    { name: 'Safety Inspection', icon: FaClipboardList, color: 'bg-[#37574a]' },
    { name: 'Incident Report', icon: FaExclamationTriangle, color: 'bg-[#c53030]' },
    { name: 'Maintenance Log', icon: FaEdit, color: 'bg-[#2b6cb0]' },
    { name: 'Technical Assessment', icon: FaChartBar, color: 'bg-[#D95C3E]' }
  ];

  return (
    <div className="min-h-screen bg-[#F6F5D9]">
      {/* Header */}
      <div className="bg-white border-b border-[#e0ddc7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-[#333333]">Reports</h1>
              <p className="text-[#8a8a8a] mt-1">Create, manage, and submit field reports</p>
            </div>
            <button 
              onClick={() => setShowNewReportModal(true)}
              className="bg-[#D95C3E] text-white px-6 py-3 rounded-lg hover:bg-[#c4512a] transition-colors font-medium flex items-center gap-2 justify-center sm:w-auto shadow-lg"
            >
              <FaPlus size={16} />
              New Report
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Total Reports', value: stats.total, color: 'bg-[#37574a]', icon: FaFileAlt },
            { label: 'Drafts', value: stats.drafts, color: 'bg-[#8a8a8a]', icon: FaEdit },
            { label: 'Submitted', value: stats.submitted, color: 'bg-[#2b6cb0]', icon: FaPaperPlane },
            { label: 'Approved', value: stats.approved, color: 'bg-[#4a7c59]', icon: FaCheckCircle }
          ].map((stat, index) => (
            <div key={index} className="bg-white rounded-xl border border-[#e0ddc7] p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className={`${stat.color} w-10 h-10 rounded-lg flex items-center justify-center text-white`}>
                  <stat.icon size={20} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-[#333333]">{stat.value}</p>
                  <p className="text-xs text-[#8a8a8a]">{stat.label}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Templates */}
        <div className="bg-white rounded-xl border border-[#e0ddc7] p-6 mb-6 shadow-sm">
          <h3 className="text-lg font-bold text-[#333333] mb-4">Quick Start Templates</h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {reportTemplates.map((template, index) => (
              <button
                key={index}
                onClick={() => setShowNewReportModal(true)}
                className={`${template.color} text-white p-4 rounded-lg hover:opacity-90 transition-opacity flex flex-col items-center gap-2`}
              >
                <template.icon size={24} />
                <span className="text-sm font-medium text-center">{template.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-t-xl border border-b-0 border-[#e0ddc7] shadow-sm">
          <div className="flex border-b border-[#e0ddc7]">
            {[
              { id: 'all', label: 'All Reports', count: reports.length },
              { id: 'drafts', label: 'Drafts', count: stats.drafts },
              { id: 'submitted', label: 'Submitted', count: reports.length - stats.drafts }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-6 py-4 font-medium transition-all relative ${
                  activeTab === tab.id 
                    ? 'text-[#37574a] border-b-2 border-[#37574a] bg-[#F6F5D9]' 
                    : 'text-[#8a8a8a] hover:text-[#4a4a4a] hover:bg-[#f8f8f6]'
                }`}
              >
                {tab.label}
                <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                  activeTab === tab.id 
                    ? 'bg-[#37574a] text-white' 
                    : 'bg-[#e0ddc7] text-[#8a8a8a]'
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white border-x border-[#e0ddc7] p-4 shadow-sm">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#8a8a8a]" size={16} />
              <input
                type="text"
                placeholder="Search reports by title, project, or client..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-[#F6F5D9] border border-[#e0ddc7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#37574a] text-[#333333]"
              />
            </div>

            {/* Filter Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-6 py-3 border border-[#e0ddc7] rounded-lg hover:bg-[#F6F5D9] transition-colors flex items-center gap-2 justify-center text-[#333333] font-medium"
            >
              <FaFilter size={16} />
              Filters
              <FaChevronDown className={`transform transition-transform ${showFilters ? 'rotate-180' : ''}`} size={14} />
            </button>
          </div>

          {/* Filter Options */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-[#e0ddc7] grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold text-[#333333] mb-2">Report Type</label>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="w-full px-4 py-2 bg-[#F6F5D9] border border-[#e0ddc7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#37574a] text-[#333333]"
                >
                  <option value="all">All Types</option>
                  <option value="Safety Inspection">Safety Inspection</option>
                  <option value="Technical Assessment">Technical Assessment</option>
                  <option value="Maintenance">Maintenance</option>
                  <option value="Certification">Certification</option>
                  <option value="Incident Report">Incident Report</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#333333] mb-2">Status</label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full px-4 py-2 bg-[#F6F5D9] border border-[#e0ddc7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#37574a] text-[#333333]"
                >
                  <option value="all">All Status</option>
                  <option value="draft">Draft</option>
                  <option value="submitted">Submitted</option>
                  <option value="pending-review">Pending Review</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              <div className="flex items-end">
                <button
                  onClick={() => {
                    setFilterType('all');
                    setFilterStatus('all');
                    setSearchQuery('');
                  }}
                  className="w-full px-4 py-2 border border-[#e0ddc7] rounded-lg hover:bg-[#F6F5D9] transition-colors text-[#333333] font-medium flex items-center gap-2 justify-center"
                >
                  <FaTimes size={14} />
                  Clear Filters
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="bg-white border-x border-[#e0ddc7] px-4 py-3 shadow-sm">
          <p className="text-sm text-[#8a8a8a]">
            Showing <span className="font-semibold text-[#333333]">{filteredReports.length}</span> of {reports.length} reports
          </p>
        </div>

        {/* Reports List */}
        <div className="bg-white rounded-b-xl border border-[#e0ddc7] shadow-sm">
          <div className="divide-y divide-[#e0ddc7]">
            {filteredReports.map((report) => {
              const statusConfig = getStatusConfig(report.status);
              const StatusIcon = statusConfig.icon;
              
              return (
                <div 
                  key={report.id}
                  className="p-6 hover:bg-[#F6F5D9] transition-colors cursor-pointer"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                    {/* Left: Report Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start gap-3 mb-2">
                        <span className="text-xs font-bold text-[#8a8a8a]">{report.id}</span>
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${getPriorityColor(report.priority)}`}>
                          {report.priority.toUpperCase()}
                        </span>
                        <div className={`inline-flex items-center gap-2 text-xs px-3 py-1 rounded-full font-medium ${statusConfig.color}`}>
                          <StatusIcon size={12} />
                          {statusConfig.label}
                        </div>
                      </div>
                      <h3 className="font-bold text-[#333333] mb-2 text-lg">{report.title}</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-sm text-[#4a4a4a]">
                        <div className="flex items-center gap-2">
                          <FaClipboardList size={14} className="text-[#8a8a8a]" />
                          <span className="truncate">{report.type}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FaBuilding size={14} className="text-[#8a8a8a]" />
                          <span className="truncate">{report.client}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FaMapMarkerAlt size={14} className="text-[#8a8a8a]" />
                          <span className="truncate">{report.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FaCalendarAlt size={14} className="text-[#8a8a8a]" />
                          <span>{report.submittedDate}</span>
                        </div>
                      </div>
                      <p className="text-sm text-[#8a8a8a] mt-2">
                        Project: <span className="text-[#4a4a4a] font-medium">{report.project}</span>
                      </p>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex flex-col sm:flex-row lg:flex-col gap-3 lg:w-48">
                      <div className="flex items-center gap-2 text-sm text-[#8a8a8a]">
                        <FaCamera size={14} />
                        <span>{report.attachments} attachments</span>
                      </div>
                      <div className="flex gap-2">
                        <button className="flex-1 lg:w-full px-4 py-2 bg-[#37574a] text-white rounded-lg hover:bg-[#2a4238] transition-colors text-sm font-medium flex items-center justify-center gap-2">
                          <FaEye size={14} />
                          View
                        </button>
                        {report.status === 'draft' && (
                          <button className="flex-1 lg:w-full px-4 py-2 border border-[#e0ddc7] text-[#333333] rounded-lg hover:bg-[#f8f8f6] transition-colors text-sm font-medium flex items-center justify-center gap-2">
                            <FaEdit size={14} />
                            Edit
                          </button>
                        )}
                        {report.status !== 'draft' && (
                          <button className="flex-1 lg:w-full px-4 py-2 border border-[#e0ddc7] text-[#333333] rounded-lg hover:bg-[#f8f8f6] transition-colors text-sm font-medium flex items-center justify-center gap-2">
                            <FaDownload size={14} />
                            Download
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Empty State */}
        {filteredReports.length === 0 && (
          <div className="bg-white rounded-xl border border-[#e0ddc7] p-12 text-center shadow-sm">
            <div className="w-16 h-16 bg-[#F6F5D9] rounded-full flex items-center justify-center mx-auto mb-4">
              <FaFileAlt size={32} className="text-[#8a8a8a]" />
            </div>
            <h3 className="text-xl font-bold text-[#333333] mb-2">No Reports Found</h3>
            <p className="text-[#8a8a8a] mb-6">
              Try adjusting your filters or create a new report
            </p>
            <button
              onClick={() => setShowNewReportModal(true)}
              className="px-6 py-3 bg-[#D95C3E] text-white rounded-lg hover:bg-[#c4512a] transition-colors font-medium inline-flex items-center gap-2"
            >
              <FaPlus size={16} />
              Create New Report
            </button>
          </div>
        )}
      </div>

      {/* New Report Modal */}
      {showNewReportModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-[#e0ddc7] flex items-center justify-between sticky top-0 bg-white">
              <h2 className="text-2xl font-bold text-[#333333]">Create New Report</h2>
              <button 
                onClick={() => setShowNewReportModal(false)}
                className="text-[#8a8a8a] hover:text-[#333333] transition-colors"
              >
                <FaTimes size={24} />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Report Type */}
              <div>
                <label className="block text-sm font-semibold text-[#333333] mb-2">Report Type *</label>
                <select className="w-full px-4 py-3 bg-[#F6F5D9] border border-[#e0ddc7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#37574a] text-[#333333]">
                  <option>Select report type</option>
                  <option>Safety Inspection</option>
                  <option>Incident Report</option>
                  <option>Maintenance Log</option>
                  <option>Technical Assessment</option>
                  <option>Certification Report</option>
                </select>
              </div>

              {/* Report Title */}
              <div>
                <label className="block text-sm font-semibold text-[#333333] mb-2">Report Title *</label>
                <input
                  type="text"
                  placeholder="Enter report title"
                  className="w-full px-4 py-3 bg-[#F6F5D9] border border-[#e0ddc7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#37574a] text-[#333333]"
                />
              </div>

              {/* Project Selection */}
              <div>
                <label className="block text-sm font-semibold text-[#333333] mb-2">Associated Project *</label>
                <select className="w-full px-4 py-3 bg-[#F6F5D9] border border-[#e0ddc7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#37574a] text-[#333333]">
                  <option>Select project</option>
                  <option>Offshore Platform Safety Inspection</option>
                  <option>Pipeline Integrity Assessment</option>
                  <option>Flow Station Equipment Maintenance</option>
                </select>
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-semibold text-[#333333] mb-2">Location *</label>
                <input
                  type="text"
                  placeholder="Enter location"
                  className="w-full px-4 py-3 bg-[#F6F5D9] border border-[#e0ddc7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#37574a] text-[#333333]"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-[#333333] mb-2">Description</label>
                <textarea
                  rows={4}
                  placeholder="Provide report details and findings..."
                  className="w-full px-4 py-3 bg-[#F6F5D9] border border-[#e0ddc7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#37574a] text-[#333333] resize-none"
                />
              </div>

              {/* File Upload */}
              <div>
                <label className="block text-sm font-semibold text-[#333333] mb-2">Attachments</label>
                <div className="border-2 border-dashed border-[#e0ddc7] rounded-lg p-8 text-center hover:border-[#37574a] transition-colors cursor-pointer">
                  <FaUpload size={32} className="text-[#8a8a8a] mx-auto mb-3" />
                  <p className="text-[#4a4a4a] font-medium mb-1">Click to upload or drag and drop</p>
                  <p className="text-sm text-[#8a8a8a]">PDF, Word, Images (Max 10MB each)</p>
                </div>
              </div>

              {/* Priority */}
              <div>
                <label className="block text-sm font-semibold text-[#333333] mb-2">Priority</label>
                <div className="grid grid-cols-4 gap-2">
                  {['low', 'medium', 'high', 'urgent'].map((priority) => (
                    <button
                      key={priority}
                      className={`px-4 py-2 rounded-lg font-medium text-sm capitalize border-2 transition-all ${
                        priority === 'medium'
                          ? 'border-[#37574a] bg-[#37574a] text-white'
                          : 'border-[#e0ddc7] text-[#333333] hover:border-[#37574a]'
                      }`}
                    >
                      {priority}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-[#e0ddc7] flex gap-3 sticky bottom-0 bg-white">
              <button 
                onClick={() => setShowNewReportModal(false)}
                className="flex-1 px-6 py-3 border border-[#e0ddc7] text-[#333333] rounded-lg hover:bg-[#f8f8f6] transition-colors font-medium"
              >
                Save as Draft
              </button>
              <button className="flex-1 px-6 py-3 bg-[#D95C3E] text-white rounded-lg hover:bg-[#c4512a] transition-colors font-medium flex items-center justify-center gap-2">
                <FaPaperPlane size={16} />
                Submit Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}