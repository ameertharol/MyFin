import React, { useState, useEffect } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { Category, CategoryType } from '../../types/finance';
import { X, Save, Trash2, Tag, Plus, FolderPlus } from 'lucide-react';

interface CategoryEditModalProps {
  category: Category | null;
  isOpen: boolean;
  onClose: () => void;
}

export const CategoryEditModal: React.FC<CategoryEditModalProps> = ({ category, isOpen, onClose }) => {
  const { addCategory, updateCategory, deleteCategory, addSubCategory, addToast } = useFinance();

  const [categoryName, setCategoryName] = useState('');
  const [categoryType, setCategoryType] = useState<CategoryType>('Expense');
  const [color, setColor] = useState('#3b82f6');
  const [icon, setIcon] = useState('Tag');
  const [newSubCategory, setNewSubCategory] = useState('');

  useEffect(() => {
    if (category) {
      setCategoryName(category.CategoryName);
      setCategoryType(category.CategoryType);
      setColor(category.Color || '#3b82f6');
      setIcon(category.Icon || 'Tag');
    } else {
      setCategoryName('');
      setCategoryType('Expense');
      setColor('#3b82f6');
      setIcon('Tag');
    }
    setNewSubCategory('');
  }, [category, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryName.trim()) {
      addToast('error', 'Validation Error', 'Category name is required.');
      return;
    }

    if (category) {
      updateCategory({
        ...category,
        CategoryName: categoryName,
        CategoryType: categoryType,
        Color: color,
        Icon: icon,
      });
    } else {
      addCategory({
        CategoryName: categoryName,
        CategoryType: categoryType,
        Color: color,
        Icon: icon,
        Status: 'Active',
      });
    }
    onClose();
  };

  const handleAddSub = (e: React.FormEvent) => {
    e.preventDefault();
    if (!category) return;
    if (!newSubCategory.trim()) return;
    addSubCategory(category.CategoryID, newSubCategory.trim());
    setNewSubCategory('');
  };

  const handleDelete = () => {
    if (category && confirm(`Are you sure you want to delete category "${category.CategoryName}"?`)) {
      deleteCategory(category.CategoryID);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 max-w-lg w-full space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto text-xs sm:text-sm">
        <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Tag className="w-5 h-5 text-teal-600 dark:text-teal-400" />
            <h3 className="font-bold text-slate-900 dark:text-white text-base">
              {category ? 'Edit Category' : 'New Category Setup'}
            </h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
              Category Name *
            </label>
            <input
              type="text"
              placeholder="e.g. Dining & Restaurants"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-bold outline-none"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Type
              </label>
              <select
                value={categoryType}
                onChange={(e) => setCategoryType(e.target.value as CategoryType)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none"
              >
                <option value="Expense">Expense</option>
                <option value="Income">Income</option>
                <option value="Asset">Asset</option>
                <option value="Liability">Liability</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Theme Accent Color
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-10 h-9 p-0 border-0 rounded-lg cursor-pointer bg-transparent"
                />
                <span className="font-mono text-xs uppercase text-slate-500">{color}</span>
              </div>
            </div>
          </div>

          {/* Existing Subcategories List & Addition */}
          {category && (
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400">
                Subcategories ({category.SubCategories?.length || 0})
              </label>

              <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto p-2 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                {category.SubCategories && category.SubCategories.length > 0 ? (
                  category.SubCategories.map((sub) => (
                    <span
                      key={sub.SubCategoryID}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200 font-medium"
                    >
                      {sub.SubCategoryName}
                    </span>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 italic">No subcategories created yet.</p>
                )}
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="text"
                  placeholder="Add new subcategory..."
                  value={newSubCategory}
                  onChange={(e) => setNewSubCategory(e.target.value)}
                  className="flex-1 px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddSub}
                  className="flex items-center gap-1 px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-xs"
                >
                  <Plus className="w-3.5 h-3.5" /> Add
                </button>
              </div>
            </div>
          )}

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
            {category && (
              <button
                type="button"
                onClick={handleDelete}
                className="flex items-center gap-1 px-3 py-2 bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 hover:bg-rose-100 rounded-xl font-bold text-xs"
              >
                <Trash2 className="w-3.5 h-3.5" /> Delete
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
                <Save className="w-3.5 h-3.5" /> Save Category
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
