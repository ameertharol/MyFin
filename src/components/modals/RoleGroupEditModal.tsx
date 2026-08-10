import React, { useState, useEffect } from 'react';
import { RoleGroup } from '../../types/finance';
import { Shield, Check, X, ShieldAlert } from 'lucide-react';

interface RoleGroupEditModalProps {
  roleGroup: RoleGroup | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (group: RoleGroup) => void;
}

export const RoleGroupEditModal: React.FC<RoleGroupEditModalProps> = ({
  roleGroup,
  isOpen,
  onClose,
  onSave,
}) => {
  const [groupName, setGroupName] = useState('');
  const [description, setDescription] = useState('');
  const [permissions, setPermissions] = useState({
    canCreate: true,
    canEdit: true,
    canDelete: false,
    canCancel: true,
    canViewReports: true,
    canManageSettings: false,
  });

  useEffect(() => {
    if (roleGroup) {
      setGroupName(roleGroup.GroupName);
      setDescription(roleGroup.Description);
      setPermissions({ ...roleGroup.Permissions });
    } else {
      setGroupName('');
      setDescription('');
      setPermissions({
        canCreate: true,
        canEdit: true,
        canDelete: false,
        canCancel: true,
        canViewReports: true,
        canManageSettings: false,
      });
    }
  }, [roleGroup, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!groupName.trim()) return;

    const newGroup: RoleGroup = {
      GroupID: roleGroup ? roleGroup.GroupID : `ROLE-GRP-${Date.now().toString().slice(-6)}`,
      GroupName: groupName.trim(),
      Description: description.trim() || 'Custom user role group',
      Permissions: permissions,
      IsSystem: roleGroup?.IsSystem || false,
    };

    onSave(newGroup);
    onClose();
  };

  const permissionList = [
    { key: 'canCreate', label: 'Create & Add Records', desc: 'Allow logging new transactions, accounts, budgets & assets' },
    { key: 'canEdit', label: 'Edit & Update Records', desc: 'Allow editing existing transaction details and account fields' },
    { key: 'canCancel', label: 'Cancel Transactions', desc: 'Allow marking financial records as cancelled' },
    { key: 'canDelete', label: 'Delete Records', desc: 'Allow permanent removal of financial accounts & entries' },
    { key: 'canViewReports', label: 'View Reports & Analytics', desc: 'Allow viewing financial statements, charts & summaries' },
    { key: 'canManageSettings', label: 'Manage Settings & Governance', desc: 'Allow changing app parameters, currencies & user access' },
  ] as const;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-teal-100 dark:bg-teal-950 text-teal-600 dark:text-teal-400 rounded-xl">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                {roleGroup ? 'Edit Role Group' : 'Create Custom Role Group'}
              </h3>
              <p className="text-xs text-slate-500">Configure role permissions and access control rules</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Role Group Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Accountant, Auditor, Partner"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none focus:border-teal-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Description
            </label>
            <input
              type="text"
              placeholder="Brief summary of responsibilities"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none focus:border-teal-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Granular Role Permissions
            </label>
            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {permissionList.map((item) => (
                <label
                  key={item.key}
                  className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 rounded-xl cursor-pointer transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={permissions[item.key]}
                    onChange={(e) =>
                      setPermissions((prev) => ({ ...prev, [item.key]: e.target.checked }))
                    }
                    className="mt-0.5 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                  />
                  <div className="text-xs">
                    <span className="font-bold text-slate-900 dark:text-white block">
                      {item.label}
                    </span>
                    <span className="text-slate-500 text-[11px] block">{item.desc}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-md shadow-teal-600/20"
            >
              Save Role Group
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
