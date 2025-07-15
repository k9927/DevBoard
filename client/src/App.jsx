import React, { useState } from "react";
import DevBoardLanding from "./components/landingPage";
import DashboardPage from "./components/DashboardPage";

function App() {
  const [currentPage, setCurrentPage] = useState('landing');

  return (
    <div>
      {/* Simple navigation */}
      <div className="fixed top-4 right-4 z-50 bg-white rounded-lg shadow-lg p-2 flex space-x-2">
        <button
          onClick={() => setCurrentPage('landing')}
          className={`px-4 py-2 rounded-md text-sm font-medium ${
            currentPage === 'landing'
              ? 'bg-blue-600 text-white'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
          }`}
        >
          Landing
        </button>
        <button
          onClick={() => setCurrentPage('dashboard')}
          className={`px-4 py-2 rounded-md text-sm font-medium ${
            currentPage === 'dashboard'
              ? 'bg-blue-600 text-white'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
          }`}
        >
          Dashboard
        </button>
      </div>

      {/* Page content */}
      {currentPage === 'landing' && <DevBoardLanding />}
      {currentPage === 'dashboard' && <DashboardPage />}
    </div>
  );
}

export default App;