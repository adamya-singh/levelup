import React, { useEffect, useState } from 'react';
import { Activity, Clock, Database, Zap } from 'lucide-react';
import { todoService } from '../services/todoService';

interface PerformanceMetrics {
  apiLatency: number;
  createLatency: number;
  updateLatency: number;
  deleteLatency: number;
  cacheHitRate: number;
}

export function PerformanceMetrics() {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    apiLatency: 0,
    createLatency: 0,
    updateLatency: 0,
    deleteLatency: 0,
    cacheHitRate: 0
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(todoService.getPerformanceMetrics());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatLatency = (ms: number) => {
    return ms.toFixed(2) + 'ms';
  };

  const formatPercentage = (value: number) => {
    return (value * 100).toFixed(1) + '%';
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Metrics</h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center space-x-2">
          <Clock className="text-blue-500" size={20} />
          <div>
            <p className="text-sm text-gray-500">API Latency</p>
            <p className="text-lg font-medium">{formatLatency(metrics.apiLatency)}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Activity className="text-green-500" size={20} />
          <div>
            <p className="text-sm text-gray-500">Cache Hit Rate</p>
            <p className="text-lg font-medium">{formatPercentage(metrics.cacheHitRate)}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Zap className="text-yellow-500" size={20} />
          <div>
            <p className="text-sm text-gray-500">Write Latency</p>
            <p className="text-lg font-medium">{formatLatency(metrics.createLatency)}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Database className="text-purple-500" size={20} />
          <div>
            <p className="text-sm text-gray-500">Update Latency</p>
            <p className="text-lg font-medium">{formatLatency(metrics.updateLatency)}</p>
          </div>
        </div>
      </div>
    </div>
  );
} 