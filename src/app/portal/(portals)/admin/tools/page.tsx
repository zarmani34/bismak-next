'use client';

import { useMemo, useState } from 'react';
import {
  FaArrowRight,
  FaCalendarAlt,
  FaCheckCircle,
  FaClock,
  FaExclamationTriangle,
  FaFilter,
  FaHardHat,
  FaSearch,
  FaTools,
  FaUser,
  FaWarehouse,
  FaWrench,
} from 'react-icons/fa';

type AssetStatus = 'available' | 'checked-out';
type MaintenanceStatus = 'ok' | 'due-soon' | 'due-now' | 'overdue';
type ConditionStatus = 'good' | 'fair' | 'damaged';

interface ToolAsset {
  id: string;
  name: string;
  category: 'Machine' | 'Tool';
  serialNumber: string;
  status: AssetStatus;
  checkedOutBy?: string;
  project?: string;
  location?: string;
  checkedOutAt?: string;
  dueBackAt?: string;
  issueCondition?: ConditionStatus;
  returnCondition?: ConditionStatus;
  lastMaintenance: string;
  nextMaintenance: string;
  maintenanceStatus: MaintenanceStatus;
}

const assets: ToolAsset[] = [
  {
    id: 'AST-001',
    name: 'Hydraulic Pressure Tester 5K PSI',
    category: 'Machine',
    serialNumber: 'HPT-5K-2281',
    status: 'checked-out',
    checkedOutBy: 'Ahmed Bello',
    project: 'Pipeline Integrity Assessment - Zone A',
    location: 'Warri Site',
    checkedOutAt: 'Feb 11, 2026 - 07:40',
    dueBackAt: 'Feb 11, 2026 - 18:00',
    issueCondition: 'good',
    lastMaintenance: 'Jan 25, 2026',
    nextMaintenance: 'Feb 18, 2026',
    maintenanceStatus: 'due-soon',
  },
  {
    id: 'AST-002',
    name: 'Ultrasonic Thickness Gauge',
    category: 'Tool',
    serialNumber: 'UTG-9920',
    status: 'checked-out',
    checkedOutBy: 'Ngozi Okafor',
    project: 'Tank Farm Inspection',
    location: 'Escravos Terminal',
    checkedOutAt: 'Feb 10, 2026 - 09:10',
    dueBackAt: 'Feb 10, 2026 - 17:00',
    issueCondition: 'good',
    lastMaintenance: 'Jan 10, 2026',
    nextMaintenance: 'Feb 10, 2026',
    maintenanceStatus: 'due-now',
  },
  {
    id: 'AST-003',
    name: 'Portable Generator 7.5kVA',
    category: 'Machine',
    serialNumber: 'GEN-75-3340',
    status: 'available',
    location: 'Main Workshop',
    returnCondition: 'fair',
    lastMaintenance: 'Jan 05, 2026',
    nextMaintenance: 'Feb 06, 2026',
    maintenanceStatus: 'overdue',
  },
  {
    id: 'AST-004',
    name: 'Torque Wrench Set',
    category: 'Tool',
    serialNumber: 'TWS-1044',
    status: 'available',
    location: 'Main Workshop',
    returnCondition: 'good',
    lastMaintenance: 'Jan 29, 2026',
    nextMaintenance: 'Mar 01, 2026',
    maintenanceStatus: 'ok',
  },
  {
    id: 'AST-005',
    name: 'Gas Leak Detector',
    category: 'Machine',
    serialNumber: 'GLD-5531',
    status: 'checked-out',
    checkedOutBy: 'Chidi Eze',
    project: 'Wellhead Integrity Testing',
    location: 'Benin Site',
    checkedOutAt: 'Feb 11, 2026 - 06:50',
    dueBackAt: 'Feb 12, 2026 - 08:00',
    issueCondition: 'good',
    lastMaintenance: 'Jan 30, 2026',
    nextMaintenance: 'Mar 03, 2026',
    maintenanceStatus: 'ok',
  },
  {
    id: 'AST-006',
    name: 'Welding Machine 220V',
    category: 'Machine',
    serialNumber: 'WLD-220-007',
    status: 'checked-out',
    checkedOutBy: 'Tunde Adeyemi',
    project: 'Fire Safety System Upgrade',
    location: 'Lagos Site',
    checkedOutAt: 'Feb 09, 2026 - 11:00',
    dueBackAt: 'Feb 11, 2026 - 08:00',
    issueCondition: 'fair',
    lastMaintenance: 'Jan 03, 2026',
    nextMaintenance: 'Feb 02, 2026',
    maintenanceStatus: 'overdue',
  },
];

const getAssetStatusStyle = (status: AssetStatus) => {
  if (status === 'checked-out') {
    return 'bg-[#2b6cb0]/10 text-[#2b6cb0]';
  }
  return 'bg-[#4a7c59]/10 text-[#4a7c59]';
};

const getMaintenanceStyle = (status: MaintenanceStatus) => {
  switch (status) {
    case 'ok':
      return 'bg-[#4a7c59]/10 text-[#4a7c59]';
    case 'due-soon':
      return 'bg-[#D95C3E]/10 text-[#D95C3E]';
    case 'due-now':
      return 'bg-[#c53030]/10 text-[#c53030]';
    case 'overdue':
      return 'bg-[#c53030] text-white';
    default:
      return 'bg-[#8a8a8a]/10 text-[#8a8a8a]';
  }
};

const getConditionStyle = (condition?: ConditionStatus) => {
  if (!condition) {
    return 'bg-[#8a8a8a]/10 text-[#8a8a8a]';
  }

  switch (condition) {
    case 'good':
      return 'bg-[#4a7c59]/10 text-[#4a7c59]';
    case 'fair':
      return 'bg-[#D95C3E]/10 text-[#D95C3E]';
    case 'damaged':
      return 'bg-[#c53030]/10 text-[#c53030]';
    default:
      return 'bg-[#8a8a8a]/10 text-[#8a8a8a]';
  }
};

const maintenanceLabel: Record<MaintenanceStatus, string> = {
  ok: 'OK',
  'due-soon': 'Due Soon',
  'due-now': 'Due Now',
  overdue: 'Overdue',
};

export default function AdminToolsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | AssetStatus>('all');
  const [maintenanceFilter, setMaintenanceFilter] = useState<'all' | MaintenanceStatus>('all');
  const [showFilters, setShowFilters] = useState(false);

  const filteredAssets = useMemo(() => {
    return assets.filter((asset) => {
      const matchesSearch =
        asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        asset.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        asset.serialNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (asset.checkedOutBy || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (asset.project || '').toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === 'all' || asset.status === statusFilter;
      const matchesMaintenance = maintenanceFilter === 'all' || asset.maintenanceStatus === maintenanceFilter;

      return matchesSearch && matchesStatus && matchesMaintenance;
    });
  }, [searchQuery, statusFilter, maintenanceFilter]);

  const stats = useMemo(() => {
    return {
      total: assets.length,
      checkedOut: assets.filter((asset) => asset.status === 'checked-out').length,
      maintenanceRisk: assets.filter(
        (asset) => asset.maintenanceStatus === 'due-now' || asset.maintenanceStatus === 'overdue'
      ).length,
      overdueReturns: assets.filter(
        (asset) => asset.status === 'checked-out' && asset.id === 'AST-002'
      ).length,
    };
  }, []);

  const urgentMaintenance = assets.filter(
    (asset) => asset.maintenanceStatus === 'due-now' || asset.maintenanceStatus === 'overdue'
  );

  return (
    <div className="min-h-screen bg-[#F6F5D9]">
      <div className="bg-white border-b border-[#e0ddc7] px-4 lg:px-8 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-[#333333]">Tools and Machines</h1>
              <p className="text-[#8a8a8a] mt-1">
                Track every checkout, condition state, and maintenance due date for accountability.
              </p>
            </div>
            <button className="bg-[#37574a] text-white px-6 py-3 rounded-lg hover:bg-[#2a4238] transition-colors font-medium">
              + Record Checkout
            </button>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-[#F6F5D9] border border-[#e0ddc7] rounded-lg p-4">
              <p className="text-sm text-[#8a8a8a]">Total Assets</p>
              <p className="text-2xl font-bold text-[#333333]">{stats.total}</p>
            </div>
            <div className="bg-[#F6F5D9] border border-[#e0ddc7] rounded-lg p-4">
              <p className="text-sm text-[#8a8a8a]">Currently Checked Out</p>
              <p className="text-2xl font-bold text-[#2b6cb0]">{stats.checkedOut}</p>
            </div>
            <div className="bg-[#F6F5D9] border border-[#e0ddc7] rounded-lg p-4">
              <p className="text-sm text-[#8a8a8a]">Maintenance Attention</p>
              <p className="text-2xl font-bold text-[#c53030]">{stats.maintenanceRisk}</p>
            </div>
            <div className="bg-[#F6F5D9] border border-[#e0ddc7] rounded-lg p-4">
              <p className="text-sm text-[#8a8a8a]">Overdue Returns</p>
              <p className="text-2xl font-bold text-[#D95C3E]">{stats.overdueReturns}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="bg-white rounded-xl border border-[#e0ddc7] p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <FaWrench className="text-[#c53030]" />
              <h2 className="text-lg font-bold text-[#333333]">Urgent Maintenance Queue</h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {urgentMaintenance.map((asset) => (
                <div key={asset.id} className="bg-[#F6F5D9] rounded-lg border border-[#e0ddc7] p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-bold text-[#8a8a8a] mb-1">{asset.id}</p>
                      <p className="font-semibold text-[#333333]">{asset.name}</p>
                      <p className="text-sm text-[#8a8a8a] mt-1">Next maintenance: {asset.nextMaintenance}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full font-semibold ${getMaintenanceStyle(asset.maintenanceStatus)}`}>
                      {maintenanceLabel[asset.maintenanceStatus]}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-[#e0ddc7] shadow-sm">
            <div className="p-4 border-b border-[#e0ddc7]">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="relative flex-1">
                  <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8a8a8a]" size={15} />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    placeholder="Search by tool name, serial, project, or staff"
                    className="w-full pl-11 pr-4 py-3 bg-[#F6F5D9] border border-[#e0ddc7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#37574a]"
                  />
                </div>

                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="px-5 py-3 border border-[#e0ddc7] rounded-lg text-[#333333] hover:bg-[#F6F5D9] transition-colors flex items-center justify-center gap-2"
                >
                  <FaFilter size={14} />
                  Filters
                </button>
              </div>

              {showFilters && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-[#e0ddc7]">
                  <div>
                    <label className="block text-sm font-semibold text-[#333333] mb-2">Asset Status</label>
                    <select
                      value={statusFilter}
                      onChange={(event) => setStatusFilter(event.target.value as 'all' | AssetStatus)}
                      className="w-full px-4 py-2 bg-[#F6F5D9] border border-[#e0ddc7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#37574a]"
                    >
                      <option value="all">All Status</option>
                      <option value="checked-out">Checked Out</option>
                      <option value="available">Available</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-[#333333] mb-2">Maintenance</label>
                    <select
                      value={maintenanceFilter}
                      onChange={(event) => setMaintenanceFilter(event.target.value as 'all' | MaintenanceStatus)}
                      className="w-full px-4 py-2 bg-[#F6F5D9] border border-[#e0ddc7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#37574a]"
                    >
                      <option value="all">All Maintenance States</option>
                      <option value="ok">OK</option>
                      <option value="due-soon">Due Soon</option>
                      <option value="due-now">Due Now</option>
                      <option value="overdue">Overdue</option>
                    </select>
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 border-b border-[#e0ddc7] bg-[#F6F5D9]">
              <p className="text-sm text-[#4a4a4a]">
                Showing <span className="font-semibold text-[#333333]">{filteredAssets.length}</span> of {assets.length} assets
              </p>
            </div>

            <div className="divide-y divide-[#e0ddc7]">
              {filteredAssets.map((asset) => {
                const isOverdueReturn = asset.id === 'AST-002';

                return (
                  <div key={asset.id} className="p-5 hover:bg-[#F6F5D9] transition-colors">
                    <div className="flex flex-col xl:flex-row xl:items-start gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <span className="text-xs font-bold text-[#8a8a8a]">{asset.id}</span>
                          <span className="text-xs bg-[#37574a]/10 text-[#37574a] px-2 py-1 rounded-full font-semibold">
                            {asset.category}
                          </span>
                          <span className={`text-xs px-2 py-1 rounded-full font-semibold ${getAssetStatusStyle(asset.status)}`}>
                            {asset.status === 'checked-out' ? 'Checked Out' : 'Available'}
                          </span>
                          <span className={`text-xs px-2 py-1 rounded-full font-semibold ${getMaintenanceStyle(asset.maintenanceStatus)}`}>
                            Maintenance {maintenanceLabel[asset.maintenanceStatus]}
                          </span>
                          {isOverdueReturn && (
                            <span className="text-xs px-2 py-1 rounded-full font-semibold bg-[#c53030] text-white">
                              Return Overdue
                            </span>
                          )}
                        </div>

                        <h3 className="text-lg font-bold text-[#333333]">{asset.name}</h3>
                        <p className="text-sm text-[#8a8a8a] mt-1">Serial: {asset.serialNumber}</p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-4 text-sm text-[#4a4a4a]">
                          <div className="flex items-center gap-2">
                            <FaUser size={13} className="text-[#8a8a8a]" />
                            <span>{asset.checkedOutBy || 'Unassigned'}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <FaHardHat size={13} className="text-[#8a8a8a]" />
                            <span>{asset.project || 'No active project'}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <FaWarehouse size={13} className="text-[#8a8a8a]" />
                            <span>{asset.location || 'No location set'}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <FaCalendarAlt size={13} className="text-[#8a8a8a]" />
                            <span>Next service: {asset.nextMaintenance}</span>
                          </div>
                        </div>
                      </div>

                      <div className="xl:w-80 bg-[#F6F5D9] border border-[#e0ddc7] rounded-lg p-4">
                        <h4 className="text-sm font-semibold text-[#333333] mb-3">Accountability Log</h4>

                        <div className="space-y-2 text-sm">
                          <div className="flex items-center justify-between">
                            <span className="text-[#8a8a8a]">Checked out</span>
                            <span className="text-[#333333] font-medium">{asset.checkedOutAt || '-'}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-[#8a8a8a]">Due back</span>
                            <span className="text-[#333333] font-medium">{asset.dueBackAt || '-'}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-[#8a8a8a]">Issue condition</span>
                            <span className={`text-xs px-2 py-1 rounded-full font-semibold ${getConditionStyle(asset.issueCondition)}`}>
                              {(asset.issueCondition || 'n/a').toUpperCase()}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-[#8a8a8a]">Return condition</span>
                            <span className={`text-xs px-2 py-1 rounded-full font-semibold ${getConditionStyle(asset.returnCondition)}`}>
                              {(asset.returnCondition || 'pending').toUpperCase()}
                            </span>
                          </div>
                        </div>

                        <div className="mt-4 flex gap-2">
                          <button className="flex-1 px-3 py-2 bg-[#37574a] text-white rounded-lg text-sm hover:bg-[#2a4238] transition-colors flex items-center justify-center gap-2">
                            <FaCheckCircle size={13} />
                            Return
                          </button>
                          <button className="flex-1 px-3 py-2 border border-[#e0ddc7] rounded-lg text-sm text-[#333333] hover:bg-white transition-colors flex items-center justify-center gap-2">
                            <FaClock size={13} />
                            Extend
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {filteredAssets.length === 0 && (
              <div className="p-10 text-center">
                <div className="w-14 h-14 rounded-full bg-[#F6F5D9] mx-auto flex items-center justify-center mb-3">
                  <FaTools className="text-[#8a8a8a]" size={20} />
                </div>
                <p className="font-semibold text-[#333333]">No tool records found</p>
                <p className="text-[#8a8a8a] text-sm mt-1">Change filters or search with another keyword.</p>
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl border border-[#e0ddc7] p-6 shadow-sm flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-[#333333] flex items-center gap-2">
                <FaExclamationTriangle className="text-[#D95C3E]" />
                Accountability Policy Reminder
              </h3>
              <p className="text-[#8a8a8a] mt-1">
                Every checkout requires staff name, condition at issue, due-back time, and return condition to close.
              </p>
            </div>
            <button className="px-5 py-3 bg-[#D95C3E] text-white rounded-lg hover:bg-[#c4512a] transition-colors font-medium flex items-center justify-center gap-2">
              View Full SOP
              <FaArrowRight size={12} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
