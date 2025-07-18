import { ChevronDown, ChevronUp,AlertCircle} from 'lucide-react';

const PlatformCard = ({ 
  platform, 
  darkMode, 
  expandedPlatform, 
  setExpandedPlatform,
  children 
}) => {
  return (
    <div
      className={`rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-lg ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border ${expandedPlatform === platform.id ? 'ring-2 ring-blue-500 md:col-span-2 lg:col-span-3 shadow-xl' : ''}`}
    >
      {/* Platform Header */}
      <div 
        className={`p-5 cursor-pointer ${expandedPlatform === platform.id ? (darkMode ? 'bg-gray-700' : 'bg-gray-50') : ''}`}
        onClick={() => setExpandedPlatform(expandedPlatform === platform.id ? null : platform.id)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`p-3 rounded-lg ${platform.iconBg} ${darkMode ? 'bg-opacity-20' : ''}`}> 
              <platform.icon className={`w-5 h-5 ${darkMode ? 'text-white' : ''}`} />
            </div>
            <div>
              <h3 className="font-semibold">{platform.name}</h3>
              {platform.needsProfile && (
                <div className="flex items-center space-x-1 text-xs text-orange-500">
                  <AlertCircle className="w-3 h-3" />
                  <span>Profile needed</span>
                </div>
              )}
            </div>
          </div>
          
          {expandedPlatform === platform.id ? (
            <ChevronUp className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
          ) : (
            <ChevronDown className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
          )}
        </div>
      </div>
      
      {/* Platform Summary */}
      <div className="px-5 pb-5">
        <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}> 
          {platform.summary.count}
        </div>
        <div className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
          {platform.summary.last}
        </div>
      </div>
      
      {/* Expanded Content */}
      {expandedPlatform === platform.id && (
        <div className={`border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'} p-5`}>
          {children}
        </div>
      )}
    </div>
  );
};

export default PlatformCard; 