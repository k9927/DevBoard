import { Plus, X, ExternalLink, Trash2 } from 'lucide-react';

const ResourcesSection = ({ darkMode, resources, showAddResource, setShowAddResource, newResource, setNewResource, handleAddResource, resourceErrors, handleDeleteResource }) => (
  <div className="space-y-4">
    <div className="flex items-center justify-between">
      <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Saved Resources</h3>
      <button onClick={() => setShowAddResource(true)} className="flex items-center space-x-2 px-3 py-1.5 text-sm bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-all"><Plus className="w-4 h-4" /><span>Add Resource</span></button>
    </div>
    {showAddResource && (
      <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} mb-4`}>
        <div className="flex items-center justify-between mb-3">
          <h4 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>New Resource</h4>
          <button onClick={() => setShowAddResource(false)} className="text-gray-500 hover:text-gray-700"><X className="w-5 h-5" /></button>
        </div>
        <div className="space-y-3">
          <div>
            <input type="text" value={newResource.title} onChange={e => setNewResource({ ...newResource, title: e.target.value })} placeholder="Resource title" className={`w-full p-2 rounded border ${darkMode ? 'bg-gray-600 border-gray-500 text-white' : 'bg-white border-gray-300'} ${resourceErrors.title ? 'border-red-500' : ''}`} />
            {resourceErrors.title && (<div className="mt-1 text-sm text-red-500">{resourceErrors.title}</div>)}
          </div>
          <div>
            <input type="url" value={newResource.url} onChange={e => setNewResource({ ...newResource, url: e.target.value })} placeholder="URL" className={`w-full p-2 rounded border ${darkMode ? 'bg-gray-600 border-gray-500 text-white' : 'bg-white border-gray-300'} ${resourceErrors.url ? 'border-red-500' : ''}`} />
            {resourceErrors.url && (<div className="mt-1 text-sm text-red-500">{resourceErrors.url}</div>)}
          </div>
          <div>
            <label className={`block text-sm mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Tags (comma separated)</label>
            <input type="text" value={newResource.tags.join(', ')} onChange={e => setNewResource({ ...newResource, tags: e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag) })} placeholder="React, Performance, JavaScript" className={`w-full p-2 rounded border ${darkMode ? 'bg-gray-600 border-gray-500 text-white' : 'bg-white border-gray-300'}`} />
          </div>
          <select value={newResource.type} onChange={e => setNewResource({ ...newResource, type: e.target.value })} className={`w-full p-2 rounded border ${darkMode ? 'bg-gray-600 border-gray-500 text-white' : 'bg-white border-gray-300'}`}>
            <option value="article">Article</option>
            <option value="video">Video</option>
            <option value="course">Course</option>
            <option value="tool">Tool</option>
            <option value="book">Book</option>
            <option value="podcast">Podcast</option>
            <option value="cheatsheet">Cheatsheet</option>
            <option value="project">Project</option>
            <option value="note">Note</option>
          </select>
          <div className="flex space-x-2">
            <button onClick={handleAddResource} className="flex-1 px-4 py-2 text-white rounded bg-emerald-600 hover:bg-emerald-700">Add</button>
            <button onClick={() => setShowAddResource(false)} className="flex-1 px-4 py-2 text-gray-700 border rounded hover:bg-gray-100">Cancel</button>
          </div>
        </div>
      </div>
    )}
    <div className="space-y-3 overflow-y-auto max-h-64">
      {resources.map(resource => (
        <div key={resource.id} className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h4 className={`font-medium mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{resource.title}</h4>
              <div className="flex flex-wrap items-center gap-1 mb-2">
                {resource.tags && resource.tags.map(tag => (<span key={tag} className={`px-2 py-1 text-xs rounded-full ${darkMode ? 'bg-gray-600 text-gray-300' : 'bg-gray-200 text-gray-700'}`}>{tag}</span>))}
                {resource.type && (<span className={`ml-2 px-2 py-1 text-xs rounded-full font-semibold ${darkMode ? 'bg-emerald-700 text-white' : 'bg-emerald-100 text-emerald-700'}`}>{resource.type.charAt(0).toUpperCase() + resource.type.slice(1)}</span>)}
              </div>
              {resource.created_at && (<p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Added on {new Date(resource.created_at).toLocaleDateString()}</p>)}
            </div>
            <div className="flex items-center ml-2 space-x-2">
              <a href={resource.url} target="_blank" rel="noopener noreferrer" className="p-1 transition-colors rounded hover:bg-gray-600"><ExternalLink className="w-4 h-4" /></a>
              <button onClick={() => handleDeleteResource(resource.id)} className="p-1 text-red-500 hover:text-red-700"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default ResourcesSection; 