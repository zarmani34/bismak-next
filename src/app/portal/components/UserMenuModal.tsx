type Props = {
    currentUser: {
        name: string;
        role: string;
        avatar: string;
        company: string;
    };
    showUserMenu: boolean;
    setShowUserMenu: any;
}
export default function UserMenuModal({ currentUser, showUserMenu, setShowUserMenu }: Props) {
    return <>
      {showUserMenu && <div
        className="fixed inset-0 bg-linear-to-r from-primary-light/10 to-primary-light/20 backdrop-blur-sm z-20 transition-opacity duration-300"
        onClick={() => setShowUserMenu(false)}
      />}
      <div onClick={e => e.stopPropagation()} className="absolute right-0 top-full mt-4 w-64 bg-tetiary rounded-xl shadow-lg border border-primary/20 py-2 z-30">
        <div className="px-4 py-3 border-b border-primary-light/20">
          <div className="font-medium text-primary-dark">{currentUser.name}</div>
          <div className="text-sm text-secondary-text">{currentUser.company}</div>
          <div className="text-xs text-secondary capitalize">
            {currentUser.role}
          </div>
        </div>
        <div className="py-2 text-primary-dark">
          <button className="w-full text-left px-4 py-2 text-sm hover:bg-primary-light/20">
            Profile Settings
          </button>
          <button className="w-full text-left px-4 py-2 text-sm hover:bg-primary-light/20">
            Support
          </button>
          <button className="w-full text-left px-4 py-2 text-sm hover:bg-primary-light/20 text-secondary">
            Sign Out
          </button>
        </div>
      </div>
    </>;
}