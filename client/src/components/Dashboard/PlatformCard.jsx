import { ChevronDown, ChevronUp,AlertCircle} from 'lucide-react';

const PlatformCard = ({ 
  platform, 
  darkMode, 
  expandedPlatform, 
  setExpandedPlatform,
  children, 
  sectionId 
}) => {
  return (
    <div
      className={`PlatformCard rounded-2xl overflow-hidden transition-all duration-500 ease-out transform hover:scale-105 hover:shadow-2xl ${darkMode ? 'border-gray-700 bg-gray-800 hover:border-blue-500 hover:bg-gray-750' : 'border-gray-200 bg-white hover:border-blue-300 hover:bg-gray-50'} border ${expandedPlatform === platform.id ? 'ring-2 ring-blue-500 md:col-span-2 lg:col-span-3 shadow-xl' : ''} group cursor-pointer`}
      data-section={sectionId}
      style={{
        background: darkMode 
          ? 'linear-gradient(135deg, rgba(31, 41, 55, 0.8), rgba(55, 65, 81, 0.8))' 
          : 'linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(249, 250, 251, 0.9))',
        backdropFilter: 'blur(10px)',
        boxShadow: darkMode 
          ? '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)' 
          : '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
      }}
    >
      {/* Platform Header */}
      <div 
        className={`p-5 transition-all duration-300 ${expandedPlatform === platform.id ? (darkMode ? 'bg-gray-700' : 'bg-gray-50') : ''} group-hover:bg-opacity-80`}
        onClick={() => setExpandedPlatform(expandedPlatform === platform.id ? null : platform.id)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`p-3 rounded-lg ${platform.iconBg} ${darkMode ? 'bg-opacity-20' : ''} transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg`}> 
              <platform.icon className={`w-5 h-5 ${darkMode ? 'text-white' : ''} transition-all duration-300 group-hover:rotate-12`} />
            </div>
            <div>
              <h3 className="font-semibold transition-all duration-300 group-hover:text-blue-500">{platform.name}</h3>
              {platform.needsProfile && (
                <div className="flex items-center space-x-1 text-xs text-orange-500 transition-all duration-300 group-hover:text-orange-400">
                  <AlertCircle className="w-3 h-3" />
                  <span>Profile needed</span>
                </div>
              )}
            </div>
          </div>
          
          {expandedPlatform === platform.id ? (
            <ChevronUp className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'} transition-all duration-300 group-hover:text-blue-500 group-hover:scale-110`} />
          ) : (
            <ChevronDown className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'} transition-all duration-300 group-hover:text-blue-500 group-hover:scale-110`} />
          )}
        </div>
      </div>
      
      {/* Platform Summary */}
      <div className="px-5 pb-5 transition-all duration-300 group-hover:bg-opacity-50">
        <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'} transition-all duration-300 group-hover:text-blue-400`}> 
          {platform.summary.count}
        </div>
        <div className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'} transition-all duration-300 group-hover:text-gray-300`}>
          {platform.summary.last}
        </div>
      </div>
      
      {/* Expanded Content */}
      {expandedPlatform === platform.id && (
        <div className={`border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'} p-5 transition-all duration-300`}>
          {children}
        </div>
      )}
      
      {/* Hover Overlay Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-blue-500 opacity-0 group-hover:opacity-5 transition-opacity duration-500 pointer-events-none rounded-2xl"></div>
    </div>
  );
};

export default PlatformCard; 