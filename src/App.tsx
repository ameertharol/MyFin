import React, { useState } from 'react';
import { FinanceProvider, useFinance } from './context/FinanceContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar, NavTab } from './components/layout/Sidebar';
import { Footer } from './components/layout/Footer';
import { ToastContainer } from './components/ui/ToastContainer';
import { QuickAddModal } from './components/modals/QuickAddModal';

// Pages
import { DashboardPage } from './pages/DashboardPage';
import { TransactionsPage } from './pages/TransactionsPage';
import { AccountsPage } from './pages/AccountsPage';
import { BudgetsPage } from './pages/BudgetsPage';
import { GoalsPage } from './pages/GoalsPage';
import { AssetsPage } from './pages/AssetsPage';
import { LiabilitiesPage } from './pages/LiabilitiesPage';
import { InvestmentsPage } from './pages/InvestmentsPage';
import { ReportsPage } from './pages/ReportsPage';
import { RemindersPage } from './pages/RemindersPage';
import { RecurringPage } from './pages/RecurringPage';
import { SettingsPage } from './pages/SettingsPage';

const AppContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [isOpenMobile, setIsOpenMobile] = useState<boolean>(false);
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

  const getPageTitle = (tab: NavTab) => {
    switch (tab) {
      case 'dashboard':
        return 'Executive Overview';
      case 'transactions':
        return 'Ledger Transactions';
      case 'accounts':
        return 'Accounts & Balances';
      case 'budgets':
        return 'Category Budgets';
      case 'goals':
        return 'Savings Goals';
      case 'assets':
        return 'Assets & Property';
      case 'liabilities':
        return 'Liabilities & Loans';
      case 'investments':
        return 'Investments Portfolio';
      case 'reports':
        return 'Financial Reports';
      case 'reminders':
        return 'Bill Reminders';
      case 'recurring':
        return 'Recurring Automation';
      case 'settings':
        return 'Settings & Governance';
      default:
        return 'Dashboard';
    }
  };

  const renderActivePage = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardPage />;
      case 'transactions':
        return <TransactionsPage />;
      case 'accounts':
        return <AccountsPage />;
      case 'budgets':
        return <BudgetsPage />;
      case 'goals':
        return <GoalsPage />;
      case 'assets':
        return <AssetsPage />;
      case 'liabilities':
        return <LiabilitiesPage />;
      case 'investments':
        return <InvestmentsPage />;
      case 'reports':
        return <ReportsPage />;
      case 'reminders':
        return <RemindersPage />;
      case 'recurring':
        return <RecurringPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      <ToastContainer />
      <QuickAddModal />

      <div className="flex flex-1 min-h-screen overflow-hidden">
        {/* Sidebar */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isOpenMobile={isOpenMobile}
          onCloseMobile={() => setIsOpenMobile(false)}
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
        />

        {/* Main Content Shell */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          <Navbar
            currentPageTitle={getPageTitle(activeTab)}
            onToggleSidebar={() => setIsOpenMobile(!isOpenMobile)}
          />

          <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-7xl w-full mx-auto">
            {renderActivePage()}
          </main>

          <Footer />
        </div>
      </div>
    </div>
  );
};

export function App() {
  return (
    <FinanceProvider>
      <AppContent />
    </FinanceProvider>
  );
}

export default App;
