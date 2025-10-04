import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const RatingChart = ({ distribution }) => {
  const data = [
    { rating: '1 Star', count: distribution[1] || 0 },
    { rating: '2 Stars', count: distribution[2] || 0 },
    { rating: '3 Stars', count: distribution[3] || 0 },
    { rating: '4 Stars', count: distribution[4] || 0 },
    { rating: '5 Stars', count: distribution[5] || 0 },
  ];

  const totalReviews = Object.values(distribution).reduce((sum, count) => sum + count, 0);

  if (totalReviews === 0) {
    return (
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Rating Distribution
        </h3>
        <div className="text-center text-gray-500 dark:text-gray-400 py-8">
          No reviews yet
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Rating Distribution
      </h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis 
              dataKey="rating" 
              stroke="#6B7280"
              fontSize={12}
            />
            <YAxis 
              stroke="#6B7280"
              fontSize={12}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: '#1F2937',
                border: '1px solid #374151',
                borderRadius: '8px',
                color: '#F9FAFB'
              }}
            />
            <Bar 
              dataKey="count" 
              fill="#3B82F6"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
        Total Reviews: {totalReviews}
      </div>
    </div>
  );
};

export default RatingChart;
