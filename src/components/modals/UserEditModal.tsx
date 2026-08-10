import React, { useState, useEffect } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { User } from '../../types/finance';
import { X, Save, Trash2, User as UserIcon, Lock, Eye, EyeOff, Key } from 'lucide-react';

interface UserEditModalProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
}

export const UserEditModal: React.FC<UserEditModalProps> = ({ user, isOpen, onClose }) => {
  const { addUser, updateUser, deleteUser, roleGroups, addToast, currencies } = useFinance();

  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [roleId, setRoleId] = useState('ROLE-PARTNER');
  const [defaultCurrency, setDefaultCurrency] = useState('AED');
  const [status, setStatus] = useState<'Active' | 'Inactive' | 'Suspended'>('Active');
  const [avatarUrl, setAvatarUrl] = useState('');

  useEffect(() => {
    if (user) {
      setFullName(user.FullName);
      setUsername(user.Username || '');
      setPassword(user.Password || '123456');
      setEmail(user.Email);
      setPhone(user.Phone || '');
      setRoleId(user.RoleID);
      setDefaultCurrency(user.DefaultCurrency || 'AED');
      setStatus(user.Status);
      setAvatarUrl(user.AvatarUrl || '');
    } else {
      setFullName('');
      setUsername('');
      setPassword('123456');
      setEmail('');
      setPhone('');
      setRoleId('ROLE-PARTNER');
      setDefaultCurrency('AED');
      setStatus('Active');
      setAvatarUrl('https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150');
    }
  }, [user, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim()) {
      addToast('error', 'Validation Error', 'Full Name and Email are required.');
      return;
    }

    const finalUsername = username.trim() || fullName.toLowerCase().replace(/\s+/g, '');
    const finalPassword = password.trim() || '123456';

    if (user) {
      updateUser({
        ...user,
        FullName: fullName.trim(),
        Username: finalUsername,
        Password: finalPassword,
        Email: email.trim(),
        Phone: phone.trim(),
        RoleID: roleId,
        DefaultCurrency: defaultCurrency,
        Status: status,
        AvatarUrl: avatarUrl.trim(),
        UpdatedDate: new Date().toISOString().substring(0, 10),
      });
    } else {
      addUser({
        FullName: fullName.trim(),
        Username: finalUsername,
        Password: finalPassword,
        Email: email.trim(),
        Phone: phone.trim(),
        RoleID: roleId,
        DefaultCurrency: defaultCurrency,
        Status: status,
        AvatarUrl: avatarUrl.trim() || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      });
    }
    onClose();
  };

  const handleDelete = () => {
    if (user && confirm(`Are you sure you want to remove user "${user.FullName}"?`)) {
      deleteUser(user.UserID);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 max-w-lg w-full space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto text-xs sm:text-sm">
        <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <UserIcon className="w-5 h-5 text-teal-600 dark:text-teal-400" />
            <h3 className="font-bold text-slate-900 dark:text-white text-base">
              {user ? 'Edit User Profile & Credentials' : 'Add Family / Partner Account'}
            </h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
              Full Name *
            </label>
            <input
              type="text"
              placeholder="e.g. Alex Morgan"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-bold outline-none"
              required
            />
          </div>

          {/* Login Credentials Section */}
          <div className="p-3 bg-teal-50/50 dark:bg-teal-950/20 border border-teal-200 dark:border-teal-900/40 rounded-xl space-y-2.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-teal-800 dark:text-teal-300">
              <Key className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
              <span>Login Account Credentials</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Username *
                </label>
                <input
                  type="text"
                  placeholder="e.g. alex"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-bold outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Password *
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Set account password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-3 pr-8 py-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-mono outline-none"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Email Address *
              </label>
              <input
                type="email"
                placeholder="e.g. alex@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Phone Number
              </label>
              <input
                type="text"
                placeholder="+971 50 000 0000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2.5">
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Role Group
              </label>
              <select
                value={roleId}
                onChange={(e) => setRoleId(e.target.value)}
                className="w-full px-2.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none font-medium text-xs"
              >
                {roleGroups.map((rg) => (
                  <option key={rg.GroupID} value={rg.GroupID}>
                    {rg.GroupName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Default Currency
              </label>
              <select
                value={defaultCurrency}
                onChange={(e) => setDefaultCurrency(e.target.value)}
                className="w-full px-2.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none font-medium text-xs"
              >
                {currencies.map((c) => (
                  <option key={c.Code} value={c.Code}>
                    {c.Code} ({c.Symbol})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Account Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full px-2.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none font-medium text-xs"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Suspended">Suspended</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
              Avatar Image URL
            </label>
            <input
              type="text"
              placeholder="https://images.unsplash.com/..."
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-xs outline-none"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
            {user && (
              <button
                type="button"
                onClick={handleDelete}
                className="flex items-center gap-1 px-3 py-2 bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 hover:bg-rose-100 rounded-xl font-bold text-xs"
              >
                <Trash2 className="w-3.5 h-3.5" /> Remove User
              </button>
            )}

            <div className="flex items-center gap-2 ml-auto">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-xl text-xs hover:bg-slate-200 dark:hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center gap-1.5 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-xs shadow-md shadow-teal-600/20"
              >
                <Save className="w-3.5 h-3.5" /> Save User Profile
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
