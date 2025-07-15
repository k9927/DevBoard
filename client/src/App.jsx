import React, { useState, useEffect } from "react";
import DevBoardLanding from "./components/landingPage";
import Dashboard from "./components/Dashboard";

function App(){
  const [currentPage, setCurrentPage] = useState('dashboard'); // 'landing' or 'dashboard' - Change to 'landing' to see the original landing page

  // Add keyboard shortcut to toggle between pages (Ctrl/Cmd + K)
  useEffect(() => {
    const handleKeyDown = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
        event.preventDefault();
        setCurrentPage(prev => prev === 'landing' ? 'dashboard' : 'landing');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return(
    <div>
      {currentPage === 'landing' ? (
        <DevBoardLanding onNavigateToDashboard={() => setCurrentPage('dashboard')} />
      ) : (
        <Dashboard onNavigateToLanding={() => setCurrentPage('landing')} />
      )}
      
      {/* Development Navigation Helper */}
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setCurrentPage(prev => prev === 'landing' ? 'dashboard' : 'landing')}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-lg transition-colors text-sm font-medium"
          title="Press Ctrl/Cmd + K to toggle"
        >
          Switch to {currentPage === 'landing' ? 'Dashboard' : 'Landing'}
        </button>
      </div>
    </div>
  );
}

export default App;