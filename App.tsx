
import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Scanner } from './pages/Scanner';
import { Auth } from './pages/Auth';
import { Onboarding } from './pages/Onboarding';
import { Journal } from './pages/Journal';
import { Profile } from './pages/Profile';
import { Analytics } from './pages/Analytics';
import { AIChat } from './pages/AIChat';
import { View } from './types';

const AppContent: React.FC = () => {
  const { currentView } = useApp();

  switch (currentView) {
    case View.AUTH:
      return <Auth />;
    case View.ONBOARDING:
      return <Onboarding />;
    case View.SCANNER:
      return <Scanner />;
    default:
      return (
        <Layout>
          {currentView === View.DASHBOARD && <Dashboard />}
          {currentView === View.JOURNAL && <Journal />}
          {currentView === View.PROFILE && <Profile />}
          {currentView === View.ANALYTICS && <Analytics />}
          {currentView === View.AI_CHAT && <AIChat />}
        </Layout>
      );
  }
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default App;
