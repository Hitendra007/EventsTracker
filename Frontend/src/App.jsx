import React, { useState, useEffect } from 'react';
import { BarChart3, MousePointerClick, Activity, Calendar, Loader } from 'lucide-react';
import axios from 'axios';

const API_URL = 'http://localhost:8000/api/v1/events';

const App = () => {
  const [view, setView] = useState('sessions');
  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [sessionEvents, setSessionEvents] = useState([]);
  const [pages, setPages] = useState([]);
  const [selectedPage, setSelectedPage] = useState('');
  const [heatmapData, setHeatmapData] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch all sessions
  useEffect(() => {
    fetchSessions();
    fetchPages();
  }, []);

  const fetchSessions = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/sessions`);
      setSessions(response.data.data);
    } catch (error) {
      console.error('Error fetching sessions:', error);
    }
    setLoading(false);
  };

  const fetchPages = async () => {
    try {
      const response = await axios.get(`${API_URL}/pages`);
      setPages(response.data.data);
      if (response.data.data.length > 0) {
        setSelectedPage(response.data.data[0]);
      }
    } catch (error) {
      console.error('Error fetching pages:', error);
    }
  };

  const fetchSessionEvents = async (sessionId) => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/sessions/${sessionId}`);
      setSessionEvents(response.data.data);
      setSelectedSession(sessionId);
    } catch (error) {
      console.error('Error fetching session events:', error);
    }
    setLoading(false);
  };

  const fetchHeatmapData = async (pageUrl) => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/heatmap?page_url=${encodeURIComponent(pageUrl)}`);
      setHeatmapData(response.data.data);
    } catch (error) {
      console.error('Error fetching heatmap:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (selectedPage && view === 'heatmap') {
      fetchHeatmapData(selectedPage);
    }
  }, [selectedPage, view]);

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
            <Activity className="w-10 h-10 text-purple-400" />
            User Analytics Dashboard
          </h1>
          <p className="text-purple-200">Track user sessions and visualize interaction patterns</p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setView('sessions')}
            className={`px-6 py-3 rounded-lg font-medium transition-all flex items-center gap-2 ${
              view === 'sessions'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/50'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <BarChart3 className="w-5 h-5" />
            Sessions View
          </button>
          <button
            onClick={() => setView('heatmap')}
            className={`px-6 py-3 rounded-lg font-medium transition-all flex items-center gap-2 ${
              view === 'heatmap'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/50'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <MousePointerClick className="w-5 h-5" />
            Heatmap View
          </button>
        </div>

        {/* Sessions View */}
        {view === 'sessions' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Sessions List */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <Calendar className="w-6 h-6 text-purple-400" />
                Active Sessions ({sessions.length})
              </h2>
              
              {loading ? (
                <div className="flex justify-center py-12">
                  <Loader className="w-8 h-8 text-purple-400 animate-spin" />
                </div>
              ) : sessions.length === 0 ? (
                <div className="text-slate-400 text-center py-12">
                  No sessions found. Visit the demo page to generate data.
                </div>
              ) : (
                <div className="space-y-3 max-h-[600px] overflow-y-auto">
                  {sessions.map((session) => (
                    <div
                      key={session.session_id}
                      onClick={() => fetchSessionEvents(session.session_id)}
                      className={`p-4 rounded-lg cursor-pointer transition-all ${
                        selectedSession === session.session_id
                          ? 'bg-purple-600 shadow-lg shadow-purple-500/50'
                          : 'bg-slate-700 hover:bg-slate-600'
                      }`}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-white font-mono text-sm">
                          {session.session_id.substring(0, 25)}...
                        </span>
                        <span className="bg-purple-500 text-white text-xs px-2 py-1 rounded-full">
                          {session.event_count} events
                        </span>
                      </div>
                      <div className="text-slate-300 text-xs">
                        Started: {formatTimestamp(session.first_seen)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Session Events */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
              <h2 className="text-2xl font-bold text-white mb-4">User Journey</h2>
              {selectedSession ? (
                loading ? (
                  <div className="flex justify-center py-12">
                    <Loader className="w-8 h-8 text-purple-400 animate-spin" />
                  </div>
                ) : (
                  <div className="space-y-2 max-h-[600px] overflow-y-auto">
                    {sessionEvents.map((event, idx) => (
                      <div
                        key={event._id}
                        className="bg-slate-700 p-3 rounded-lg border-l-4 border-purple-500"
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span className="bg-purple-500 text-white text-xs px-2 py-1 rounded font-bold">
                            {idx + 1}
                          </span>
                          <span className={`text-xs px-2 py-1 rounded ${
                            event.event_type === 'click'
                              ? 'bg-green-500 text-white'
                              : 'bg-blue-500 text-white'
                          }`}>
                            {event.event_type}
                          </span>
                        </div>
                        <div className="text-white text-sm font-medium">{event.page_url}</div>
                        <div className="text-slate-400 text-xs mt-1">
                          {formatTimestamp(event.timestamp)}
                        </div>
                        {event.event_type === 'click' && (
                          <div className="text-slate-400 text-xs">
                            Position: ({event.click_x}, {event.click_y})
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )
              ) : (
                <div className="text-slate-400 text-center py-12">
                  Select a session to view the user journey
                </div>
              )}
            </div>
          </div>
        )}

        {/* Heatmap View */}
        {view === 'heatmap' && (
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <div className="mb-6">
              <label className="text-white font-medium mb-2 block">Select Page URL:</label>
              <select
                value={selectedPage}
                onChange={(e) => setSelectedPage(e.target.value)}
                className="w-full max-w-md px-4 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                {pages.map(page => (
                  <option key={page} value={page}>{page}</option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <h3 className="text-xl font-bold text-white mb-2">Click Heatmap</h3>
              <p className="text-slate-400 text-sm">
                Total clicks on {selectedPage}: {heatmapData.length}
              </p>
            </div>

            {/* Heatmap Canvas */}
            {loading ? (
              <div className="flex justify-center py-12">
                <Loader className="w-8 h-8 text-purple-400 animate-spin" />
              </div>
            ) : (
              <div className="relative bg-slate-900 rounded-lg overflow-hidden" style={{ height: '600px' }}>
                <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900">
                  {heatmapData.map((click, idx) => {
                    const x = (click.click_x / 1200) * 100;
                    const y = (click.click_y / 800) * 100;
                    return (
                      <div
                        key={idx}
                        className="absolute w-6 h-6 -ml-3 -mt-3 rounded-full animate-pulse"
                        style={{
                          left: `${x}%`,
                          top: `${y}%`,
                          backgroundColor: `rgba(168, 85, 247, ${0.3 + Math.random() * 0.4})`,
                          boxShadow: '0 0 20px rgba(168, 85, 247, 0.6)'
                        }}
                        title={`Click at (${click.click_x}, ${click.click_y})`}
                      />
                    );
                  })}
                </div>
                
                {/* Grid overlay */}
                <div className="absolute inset-0 pointer-events-none">
                  <div className="w-full h-full" style={{
                    backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)',
                    backgroundSize: '50px 50px'
                  }} />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default App;