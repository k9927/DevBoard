import { useEffect, useState } from 'react';
import { CheckCircle, BookOpen, Trophy } from 'lucide-react';

const typeIcon = {
  goal: <CheckCircle className="w-4 h-4" />,
  resource: <BookOpen className="w-4 h-4" />,
  leetcode: <Trophy className="w-4 h-4" />,
};

function formatTime(ts) {
  const date = new Date(ts);
  return date.toLocaleString();
}

const ActivitySection = ({ darkMode }) => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivity = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/activity`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          setActivities(await res.json());
        }
      } catch {}
      setLoading(false);
    };
    fetchActivity();
  }, []);

  return (
    <div className="space-y-4">
      <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Recent Activity</h3>
      <div className="space-y-3">
        {loading ? (
          <div className="text-sm text-gray-400">Loading...</div>
        ) : activities.length === 0 ? (
          <div className="text-sm text-gray-400">No recent activity yet.</div>
        ) : activities.map((a) => (
          <div key={a.id} className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
            <div className="flex items-start space-x-3">
              <div className={`flex items-center justify-center w-8 h-8 mt-1 rounded-full ${a.type === 'goal' ? 'text-green-600 bg-green-100' : a.type === 'resource' ? 'text-blue-600 bg-blue-100' : 'text-purple-600 bg-purple-100'}`}>{typeIcon[a.type] || <CheckCircle className="w-4 h-4" />}</div>
              <div>
                <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {a.type === 'goal' && a.action === 'completed' && `Completed goal: "${a.detail}"`}
                  {a.type === 'goal' && a.action === 'added' && `Added goal: "${a.detail}"`}
                  {a.type === 'resource' && `Added resource: "${a.detail}"`}
                  {a.type === 'leetcode' && `Solved LeetCode problem: "${a.detail}"`}
                </p>
                <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{formatTime(a.timestamp)}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivitySection; 