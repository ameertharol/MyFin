import React, { useState } from 'react';
import { FinanceProvider, useFinance } from './context/FinanceContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar, NavTab } from './components/layout/Sidebar';
import { Footer } from './components/layout/Footer';
import { ToastContainer } from './components/ui/ToastContainer';
import { QuickAddModal } from './components/modals/QuickAddModal';

// Pages
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { TransactionsPage } from './pages/TransactionsPage';
import { TransfersPage } from './pages/TransfersPage';
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
  const { isAuthenticated } = useFinance();
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [isOpenMobile, setIsOpenMobile] = useState<boolean>(false);
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

  if (!isAuthenticated) {
    return (
      <>
        <ToastContainer />
        <LoginPage />
      </>
    );
  }

  const getPageTitle = (tab: NavTab) => {
    switch (tab) {
      case 'dashboard':
        return 'Executive Overview';
      case 'transactions':
        return 'Ledger Transactions';
      case 'transfers':
        return 'Inter-Account Transfers';
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
      case 'transfers':
        return <TransfersPage />;
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
    <div className="h-screen w-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200 overflow-hidden">
      <ToastContainer />
      <QuickAddModal />

      <div className="flex flex-1 h-full overflow-hidden">
        {/* Sidebar */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isOpenMobile={isOpenMobile}
          onCloseMobile={() => setIsOpenMobile(false)}
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
        />

        {/* Main Content Shell with Sticky Header & Independent Scroll */}
        <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
          {/* Top Header - Fixed & Non-scrollable */}
          <Navbar
            currentPageTitle={getPageTitle(activeTab)}
            onToggleSidebar={() => setIsOpenMobile(!isOpenMobile)}
          />

          {/* Scrollable Page View Body */}
          <div className="flex-1 overflow-y-auto flex flex-col">
            <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-7xl w-full mx-auto">
              {renderActivePage()}
            </main>

            <Footer />
          </div>
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
