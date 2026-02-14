import { FaBell, FaBuilding, FaCamera, FaCheckCircle, FaEnvelope, FaMapMarkerAlt, FaPhone, FaShieldAlt, FaUserCog } from "react-icons/fa";
import { FaArrowRightFromBracket, FaCalendarDays, FaChartSimple, FaPenToSquare } from "react-icons/fa6";

const activityFeed = [
  {
    title: "Approved service request SR-1202",
    time: "2 hours ago",
  },
  {
    title: "Generated invoice INV-2026-1032",
    time: "Yesterday",
  },
  {
    title: "Uploaded compliance certificate DOC-1033",
    time: "2 days ago",
  },
  {
    title: "Reviewed monthly analytics summary",
    time: "3 days ago",
  },
];

const quickStats = [
  {
    label: "Projects Overseen",
    value: "27",
    icon: <FaChartSimple className="w-4 h-4" />,
  },
  {
    label: "Approvals This Month",
    value: "43",
    icon: <FaCheckCircle className="w-4 h-4" />,
  },
  {
    label: "Account Status",
    value: "Verified",
    icon: <FaShieldAlt className="w-4 h-4" />,
  },
];

export default function AdminProfilePage() {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-border bg-linear-to-r from-primary/15 via-primary-light/30 to-secondary/10 p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="relative">
              <div className="w-20 h-20 rounded-2xl bg-primary text-white flex items-center justify-center text-2xl font-semibold shadow-md">
                BI
              </div>
              <button className="absolute -bottom-2 -right-2 bg-white text-primary-dark border border-border p-2 rounded-lg hover:bg-primary-light/30 transition-colors">
                <FaCamera className="w-3 h-3" />
              </button>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-primary-dark">Bayo Ismail</h1>
              <p className="text-secondary-text">Admin Lead, Operations & Compliance</p>
              <div className="mt-2 inline-flex items-center gap-2 rounded-full bg-primary/20 px-3 py-1 text-xs font-medium text-primary">
                <FaShieldAlt className="w-3 h-3" />
                Super Admin Access
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="inline-flex items-center gap-2 px-4 py-3 rounded-xl border border-border text-primary-dark text-sm hover:bg-primary-light/20 transition-colors">
              <FaPenToSquare className="w-4 h-4" />
              Edit Profile
            </button>
            <button className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-primary text-white text-sm hover:bg-primary-dark transition-colors">
              <FaArrowRightFromBracket className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {quickStats.map((stat) => (
          <div key={stat.label} className="rounded-xl border border-border bg-primary-light/20 p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm text-secondary-text">{stat.label}</p>
              <span className="text-primary">{stat.icon}</span>
            </div>
            <p className="text-2xl font-bold text-primary-dark mt-2">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          <div className="rounded-xl border border-border shadow-sm overflow-hidden">
            <div className="bg-primary-light/40 px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-primary-dark">Personal Information</h2>
            </div>
            <div className="p-6 bg-primary-light/10 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-lg border border-border bg-white/70 p-4">
                <p className="text-xs text-secondary-text">Full Name</p>
                <p className="text-sm font-medium text-primary-dark">Bayo Ismail</p>
              </div>
              <div className="rounded-lg border border-border bg-white/70 p-4">
                <p className="text-xs text-secondary-text">Role</p>
                <p className="text-sm font-medium text-primary-dark">Admin Lead</p>
              </div>
              <div className="rounded-lg border border-border bg-white/70 p-4 flex items-start gap-3">
                <FaEnvelope className="w-4 h-4 text-secondary-text mt-0.5" />
                <div>
                  <p className="text-xs text-secondary-text">Email</p>
                  <p className="text-sm font-medium text-primary-dark">bayo.ismail@bismak.com</p>
                </div>
              </div>
              <div className="rounded-lg border border-border bg-white/70 p-4 flex items-start gap-3">
                <FaPhone className="w-4 h-4 text-secondary-text mt-0.5" />
                <div>
                  <p className="text-xs text-secondary-text">Phone</p>
                  <p className="text-sm font-medium text-primary-dark">+234 801 234 5678</p>
                </div>
              </div>
              <div className="rounded-lg border border-border bg-white/70 p-4 flex items-start gap-3 md:col-span-2">
                <FaMapMarkerAlt className="w-4 h-4 text-secondary-text mt-0.5" />
                <div>
                  <p className="text-xs text-secondary-text">Location</p>
                  <p className="text-sm font-medium text-primary-dark">Lagos, Nigeria</p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-border shadow-sm overflow-hidden">
            <div className="bg-primary-light/40 px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-primary-dark">Organization & Access</h2>
            </div>
            <div className="p-6 bg-primary-light/10 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-lg border border-border bg-white/70 p-4 flex items-start gap-3">
                <FaBuilding className="w-4 h-4 text-secondary-text mt-0.5" />
                <div>
                  <p className="text-xs text-secondary-text">Company</p>
                  <p className="text-sm font-medium text-primary-dark">Bismak Energy Services</p>
                </div>
              </div>
              <div className="rounded-lg border border-border bg-white/70 p-4 flex items-start gap-3">
                <FaCalendarDays className="w-4 h-4 text-secondary-text mt-0.5" />
                <div>
                  <p className="text-xs text-secondary-text">Joined</p>
                  <p className="text-sm font-medium text-primary-dark">January 2023</p>
                </div>
              </div>
              <div className="rounded-lg border border-border bg-white/70 p-4 md:col-span-2">
                <p className="text-xs text-secondary-text">Access Scope</p>
                <p className="text-sm font-medium text-primary-dark">Projects, Billing, Documents, Reports, Tools, User Management</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* <div className="rounded-xl border border-border shadow-sm overflow-hidden">
            <div className="bg-primary-light/40 px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-primary-dark">Preferences</h2>
            </div>
            <div className="p-4 bg-primary-light/10 space-y-3">
              <label className="flex items-center justify-between rounded-lg border border-primary-light/30 p-3 bg-white/70">
                <div className="flex items-center gap-2 text-sm text-primary-dark">
                  <FaBell className="w-4 h-4" />
                  Email alerts
                </div>
                <input type="checkbox" defaultChecked className="w-4 h-4" />
              </label>
              <label className="flex items-center justify-between rounded-lg border border-primary-light/30 p-3 bg-white/70">
                <div className="flex items-center gap-2 text-sm text-primary-dark">
                  <FaUserCog className="w-4 h-4" />
                  Weekly summary
                </div>
                <input type="checkbox" defaultChecked className="w-4 h-4" />
              </label>
              <label className="flex items-center justify-between rounded-lg border border-primary-light/30 p-3 bg-white/70">
                <div className="flex items-center gap-2 text-sm text-primary-dark">
                  <FaShieldAlt className="w-4 h-4" />
                  Security prompts
                </div>
                <input type="checkbox" defaultChecked className="w-4 h-4" />
              </label>
            </div>
          </div> */}

          <div className="rounded-xl border border-border shadow-sm overflow-hidden">
            <div className="bg-primary-light/40 px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-primary-dark">Recent Activity</h2>
            </div>
            <div className="p-4 bg-primary-light/10 space-y-3">
              {activityFeed.map((item) => (
                <div key={item.title} className="rounded-lg border border-primary-light/30 p-3 bg-white/70">
                  <p className="text-sm text-primary-dark font-medium">{item.title}</p>
                  <p className="text-xs text-secondary-text mt-1">{item.time}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
