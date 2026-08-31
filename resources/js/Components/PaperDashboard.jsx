import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function PaperDashboard({ period, setPeriod }) {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/admin/api/papers-review/metrics?period=${period}`)
      .then(res => res.json())
      .then(data => {
        setMetrics(data);
        setLoading(false);
      })
      .catch(() => {
        setMetrics(null);
        setLoading(false);
      });
  }, [period]);

  if (loading) return <div className="text-quenza-text-secondary">Loading...</div>;
  if (!metrics) return <div className="text-quenza-text-secondary">No data available</div>;

  const periodOptions = [
    { key: 'today', label: 'Hari ini' },
    { key: 'week', label: '1 Minggu' },
    { key: 'twoweeks', label: '2 Minggu' },
    { key: 'month', label: '1 Bulan' },
  ];

  return (
    <div>
      {/* Period Filter Buttons */}
      <div className="flex gap-3 mb-6">
        {periodOptions.map((option) => (
          <button
            key={option.key}
            onClick={() => setPeriod(option.key)}
            className={`px-4 py-2 rounded-quenza-md font-quenza-medium text-quenza-medium transition-colors ${
              period === option.key
                ? 'bg-quenza-primary text-white'
                : 'bg-gray-100 text-quenza-text-secondary hover:text-quenza-text-primary'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      {/* Metric Cards Grid - 3 Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Submission Trend Card */}
        <div className="quenza-card rounded-quenza-xl p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-quenza-medium font-quenza-medium text-quenza-text-secondary">Tren Submission</h3>
              <p className="text-quenza-2xlarge font-quenza-bold text-quenza-text-primary mt-1">{metrics.total_submissions}</p>
            </div>
            <span className={`text-quenza-small font-quenza-semibold px-2.5 py-0.5 rounded-full ${
              metrics.total_trend_percent >= 0 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
            }`}>
              {metrics.total_trend_percent >= 0 ? '+' : ''}{metrics.total_trend_percent}%
            </span>
          </div>
          <div className="h-40 -mx-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={metrics.submission_trend} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <Line type="monotone" dataKey="value" stroke="#20d375" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Paper Reviewed Trend Card */}
        <div className="quenza-card rounded-quenza-xl p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-quenza-medium font-quenza-medium text-quenza-text-secondary">Paper Direview</h3>
              <p className="text-quenza-2xlarge font-quenza-bold text-quenza-text-primary mt-1">{Math.round(metrics.total_reviewed)}</p>
            </div>
            <span className={`text-quenza-small font-quenza-semibold px-2.5 py-0.5 rounded-full ${
              metrics.reviewed_trend_percent >= 0 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
            }`}>
              {metrics.reviewed_trend_percent >= 0 ? '+' : ''}{metrics.reviewed_trend_percent}%
            </span>
          </div>
          <div className="h-40 -mx-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={metrics.paper_reviewed_trend} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <Line type="monotone" dataKey="value" stroke="#20d375" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Accepted Trend Card */}
        <div className="quenza-card rounded-quenza-xl p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-quenza-medium font-quenza-medium text-quenza-text-secondary">Tren Accepted</h3>
              <p className="text-quenza-2xlarge font-quenza-bold text-quenza-text-primary mt-1">{metrics.total_accepted_count}</p>
            </div>
            <span className={`text-quenza-small font-quenza-semibold px-2.5 py-0.5 rounded-full ${
              metrics.accepted_trend_percent >= 0 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
            }`}>
              {metrics.accepted_trend_percent >= 0 ? '+' : ''}{metrics.accepted_trend_percent}%
            </span>
          </div>
          <div className="h-40 -mx-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={metrics.accepted_trend} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <Line type="monotone" dataKey="value" stroke="#20d375" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Queue Summary & Top Tracks Grid - 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Queue Summary Card */}
        <div className="quenza-card rounded-quenza-xl p-6">
          <h3 className="text-quenza-large font-quenza-bold text-quenza-text-primary mb-4">Ringkasan Antrian</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-quenza-md">
              <span className="text-quenza-medium font-quenza-medium text-quenza-text-secondary">Belum Ditugaskan</span>
              <span className="text-quenza-large font-quenza-bold text-quenza-text-primary">{metrics.not_assigned}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-quenza-md">
              <span className="text-quenza-medium font-quenza-medium text-quenza-text-secondary">Sudah Ditugaskan</span>
              <span className="text-quenza-large font-quenza-bold text-quenza-text-primary">{metrics.assigned}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-quenza-md">
              <span className="text-quenza-medium font-quenza-medium text-quenza-text-secondary">Dalam Review</span>
              <span className="text-quenza-large font-quenza-bold text-quenza-text-primary">{metrics.in_review}</span>
            </div>
          </div>
        </div>

        {/* Top Tracks Card */}
        <div className="quenza-card rounded-quenza-xl p-6">
          <h3 className="text-quenza-large font-quenza-bold text-quenza-text-primary mb-4">3 Tema Paper Terbanyak</h3>
          <div className="space-y-3">
            {metrics.top_tracks && metrics.top_tracks.map((track, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-quenza-md">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-quenza-primary"></div>
                  <span className="text-quenza-medium font-quenza-medium text-quenza-text-secondary">{track.name}</span>
                </div>
                <span className="text-quenza-medium font-quenza-bold text-quenza-text-primary">{track.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
