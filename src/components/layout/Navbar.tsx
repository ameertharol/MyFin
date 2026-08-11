import React, { useState, useRef, useEffect } from 'react';
import { useFinance } from '../../context/FinanceContext';
import {
  Search,
  Plus,
  Bell,
  Sun,
  Moon,
  Menu,
  Heart,
  ChevronDown,
  User as UserIcon,
  Settings as SettingsIcon,
  LogOut,
  X,
  CreditCard,
  DollarSign,
  ArrowRightLeft,
  CheckCircle,
  PiggyBank,
  Clock,
  Key,
} from 'lucide-react';
import { ChangePasswordModal } from '../modals/ChangePasswordModal';

interface NavbarProps {
  currentPageTitle: string;
  onToggleSidebar: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPageTitle, onToggleSidebar }) => {
  const {
    currentUser,
    users,
    switchUser,
    settings,
    theme,
    toggleTheme,
    filters,
    setFilters,
    notifications,
    openQuickAdd,
    addToast,
    logout,
  } = useFinance();

  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [quickAddDropdownOpen, setQuickAddDropdownOpen] = useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [imgError, setImgError] = useState(false);

  const notificationRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const quickAddRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setImgError(false);
  }, [currentUser?.UserID, currentUser?.AvatarUrl]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
      if (quickAddRef.current && !quickAddRef.current.contains(event.target as Node)) {
        setQuickAddDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const unreadCount = notifications.filter((n) => !n.IsRead).length;

  // Helper for initials
  const getInitials = (name: string) => {
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <header className="sticky top-0 z-40 flex items-center justify-between px-3 sm:px-6 h-16 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-2xs transition-colors">
      {/* Left section: Mobile menu + Logo & Name */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 md:hidden transition-colors"
          aria-label="Toggle navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          {settings.LogoUrl ? (
            <img src={settings.LogoUrl} alt="Logo" className="w-8 h-8 rounded-xl object-contain bg-slate-100 dark:bg-slate-800 p-1 border border-slate-200 dark:border-slate-700" />
          ) : (
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-teal-600 to-emerald-500 flex items-center justify-center text-white shadow-md shadow-teal-500/20 shrink-0">
              <Heart className="w-4 h-4 sm:w-5 sm:h-5 fill-white/20" />
            </div>
          )}
          <span className="font-bold text-base sm:text-lg text-slate-900 dark:text-white tracking-tight hidden sm:inline-block truncate max-w-[140px] md:max-w-none">
            {settings.AppName}
          </span>
        </div>

        <div className="h-4 w-px bg-slate-300 dark:bg-slate-700 mx-1 hidden sm:block" />

        <h1 className="text-xs sm:text-base font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[100px] sm:max-w-xs">
          {currentPageTitle}
        </h1>
      </div>

      {/* Center: Global Search Bar (Desktop) */}
      <div className="hidden md:flex items-center flex-1 max-w-xs mx-4 lg:mx-6">
        <div className="relative w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search transactions, accounts..."
            value={filters.searchQuery}
            onChange={(e) => setFilters((prev) => ({ ...prev, searchQuery: e.target.value }))}
            className="w-full pl-9 pr-8 py-1.5 text-xs sm:text-sm bg-slate-100 dark:bg-slate-800/80 border border-transparent focus:border-teal-500 dark:focus:border-teal-500 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 outline-none transition-all"
          />
          {filters.searchQuery && (
            <button
              onClick={() => setFilters((prev) => ({ ...prev, searchQuery: '' }))}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Mobile Search Overlay / Toggle */}
      {mobileSearchOpen && (
        <div className="absolute inset-x-0 top-0 h-16 bg-white dark:bg-slate-900 px-4 flex items-center gap-2 z-50 md:hidden border-b border-slate-200 dark:border-slate-800">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            type="text"
            autoFocus
            placeholder="Search transactions, accounts..."
            value={filters.searchQuery}
            onChange={(e) => setFilters((prev) => ({ ...prev, searchQuery: e.target.value }))}
            className="flex-1 py-2 text-sm bg-transparent text-slate-900 dark:text-slate-100 outline-none placeholder-slate-400"
          />
          <button
            onClick={() => {
              setMobileSearchOpen(false);
              setFilters((prev) => ({ ...prev, searchQuery: '' }));
            }}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Right section: Actions */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Mobile Search Button */}
        <button
          onClick={() => setMobileSearchOpen(true)}
          className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 md:hidden transition-colors"
          title="Search"
        >
          <Search className="w-4 h-4" />
        </button>

        {/* Quick Add Dropdown */}
        <div className="relative" ref={quickAddRef}>
          <button
            onClick={() => setQuickAddDropdownOpen(!quickAddDropdownOpen)}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white font-medium text-xs sm:text-sm shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Quick Add</span>
          </button>

          {quickAddDropdownOpen && (
            <div
              className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl py-1.5 z-50 text-xs font-medium"
              onClick={() => setQuickAddDropdownOpen(false)}
            >
              <button
                onClick={() => openQuickAdd('Expense')}
                className="w-full flex items-center gap-2 px-3.5 py-2 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
              >
                <CreditCard className="w-4 h-4" /> New Expense
              </button>
              <button
                onClick={() => openQuickAdd('Income')}
                className="w-full flex items-center gap-2 px-3.5 py-2 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 transition-colors"
              >
                <DollarSign className="w-4 h-4" /> New Income
              </button>
              <button
                onClick={() => openQuickAdd('Transfer')}
                className="w-full flex items-center gap-2 px-3.5 py-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-colors"
              >
                <ArrowRightLeft className="w-4 h-4" /> Internal Transfer
              </button>
              <div className="my-1 border-t border-slate-200 dark:border-slate-800" />
              <button
                onClick={() => openQuickAdd('Account')}
                className="w-full flex items-center gap-2 px-3.5 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                New Account
              </button>
              <button
                onClick={() => openQuickAdd('Budget')}
                className="w-full flex items-center gap-2 px-3.5 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                New Budget
              </button>
              <button
                onClick={() => openQuickAdd('Goal')}
                className="w-full flex items-center gap-2 px-3.5 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <PiggyBank className="w-4 h-4" /> New Savings Goal
              </button>
              <button
                onClick={() => openQuickAdd('Reminder')}
                className="w-full flex items-center gap-2 px-3.5 py-2 text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/30 transition-colors"
              >
                <Clock className="w-4 h-4" /> New Reminder
              </button>
            </div>
          )}
        </div>

        {/* Theme Toggle (Light / Dark) */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative"
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-amber-400 transition-transform hover:rotate-45" />
          ) : (
            <Moon className="w-4 h-4 text-slate-700 transition-transform hover:-rotate-12" />
          )}
        </button>

        {/* Notification Bell */}
        <div className="relative" ref={notificationRef}>
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            )}
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl z-50 overflow-hidden">
              <div className="px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <span className="font-semibold text-xs text-slate-900 dark:text-white uppercase tracking-wider">
                  Notifications ({unreadCount} new)
                </span>
                <button
                  onClick={() => setNotificationsOpen(false)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-xs text-slate-400">
                    No new notifications
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.NotificationID}
                      className={`p-3 text-xs transition-colors ${
                        n.IsRead ? 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400' : 'bg-teal-50/50 dark:bg-teal-950/20 text-slate-900 dark:text-slate-100 font-medium'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-slate-900 dark:text-white">{n.Title}</span>
                        <span className="text-[10px] text-slate-400">{n.Date.split(' ')[0]}</span>
                      </div>
                      <p className="text-slate-600 dark:text-slate-300">{n.Message}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Profile / Switcher Dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2 p-1.5 sm:px-2 sm:py-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-800 transition-all group"
            title="User Profile & Settings"
          >
            {currentUser?.AvatarUrl && !imgError ? (
              <img
                src={currentUser.AvatarUrl}
                alt={currentUser.FullName}
                onError={() => setImgError(true)}
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover border border-teal-500/60 shrink-0"
              />
            ) : (
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-tr from-teal-600 to-emerald-500 text-white font-bold text-xs flex items-center justify-center border border-teal-400/50 shrink-0 shadow-xs">
                {getInitials(currentUser?.FullName || 'Admin')}
              </div>
            )}

            <div className="hidden sm:flex flex-col text-left leading-tight pr-0.5">
              <span className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate max-w-[100px] lg:max-w-[130px]">
                {currentUser?.FullName || 'User'}
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium capitalize">
                {currentUser?.RoleID === 'ROLE-ADMIN' ? 'Admin' : 'Partner'}
              </span>
            </div>

            <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200 transition-colors" />
          </button>

          {profileOpen && (
            <div
              className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl py-2 z-50 text-xs"
              onClick={() => setProfileOpen(false)}
            >
              {/* Profile Card Header */}
              <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
                <div className="flex items-center gap-3">
                  {currentUser?.AvatarUrl && !imgError ? (
                    <img
                      src={currentUser.AvatarUrl}
                      alt={currentUser.FullName}
                      className="w-10 h-10 rounded-full object-cover border-2 border-teal-500"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-teal-600 to-emerald-500 text-white font-bold text-sm flex items-center justify-center border-2 border-teal-400 shadow-sm">
                      {getInitials(currentUser?.FullName || 'Admin')}
                    </div>
                  )}
                  <div className="overflow-hidden">
                    <p className="font-bold text-slate-900 dark:text-white text-sm truncate">{currentUser?.FullName}</p>
                    <p className="text-slate-500 text-[11px] truncate">@{currentUser?.Username}</p>
                    {currentUser?.Email && (
                      <p className="text-slate-400 text-[10px] truncate">{currentUser.Email}</p>
                    )}
                  </div>
                </div>

                <div className="mt-2.5 flex items-center justify-between pt-2 border-t border-slate-200/60 dark:border-slate-800">
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300">
                    {currentUser?.RoleID === 'ROLE-ADMIN' ? 'Primary Admin' : 'Partner Profile'}
                  </span>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" /> Active
                  </span>
                </div>
              </div>

              {/* Partner User Switcher */}
              {users.length > 1 && (
                <div className="p-2 border-b border-slate-100 dark:border-slate-800">
                  <p className="px-2 text-[10px] uppercase font-bold text-slate-400 mb-1">Switch User Session</p>
                  {users.map((u) => (
                    <button
                      key={u.UserID}
                      onClick={(e) => {
                        e.stopPropagation();
                        switchUser(u.UserID);
                        setProfileOpen(false);
                      }}
                      className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition-colors ${
                        u.UserID === currentUser?.UserID
                          ? 'bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 font-bold'
                          : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <span className="truncate">{u.FullName}</span>
                      {u.UserID === currentUser?.UserID && <CheckCircle className="w-3.5 h-3.5 text-teal-600" />}
                    </button>
                  ))}
                </div>
              )}

              <div className="py-1">
                <button
                  onClick={() => setIsChangePasswordOpen(true)}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium transition-colors"
                >
                  <Key className="w-4 h-4 text-teal-600" /> Change Password
                </button>
                <button
                  onClick={() => logout()}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 font-medium transition-colors"
                >
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <ChangePasswordModal
        isOpen={isChangePasswordOpen}
        onClose={() => setIsChangePasswordOpen(false)}
      />
    </header>
  );
};
