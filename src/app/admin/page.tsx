"use client";

import { useEffect, useState } from "react";
import { BarChart, AlertCircle, Zap } from "lucide-react";

interface HealthData {
  status: string;
  cache: { entries: number; keys: string[] };
  rateLimit: { trackedIPs: number; ips: string[] };
  uptime: number;
  memoryUsage: { heapUsed: string; heapTotal: string };
}

interface AnalyticsData {
  stats: {
    total: number;
    byType: Record<string, number>;
    generationSuccess: number;
    errors: number;
    cacheHitRate: number;
  };
}

export default function AdminPanel() {
  const [health, setHealth] = useState<HealthData | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [healthRes, analyticsRes] = await Promise.all([
          fetch("/api/health"),
          fetch("/api/analytics"),
        ]);

        if (healthRes.ok) {
          setHealth(await healthRes.json());
        }
        if (analyticsRes.ok) {
          setAnalytics(await analyticsRes.json());
        }
      } catch (error) {
        console.error("Failed to fetch admin data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-background text-gray-200 p-6">
        <div className="text-center">Carregando dados...</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background text-gray-200 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <BarChart className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold">Painel de Status</h1>
        </div>

        {/* Status Geral */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-surface border border-border rounded-lg p-4">
            <div className="text-xs text-muted uppercase mb-2">Status</div>
            <div className="text-2xl font-bold text-green-500">
              {health?.status === "ok" ? "✓ Online" : "✗ Offline"}
            </div>
          </div>

          <div className="bg-surface border border-border rounded-lg p-4">
            <div className="text-xs text-muted uppercase mb-2">Uptime</div>
            <div className="text-lg font-bold">
              {health ? `${Math.floor(health.uptime / 3600)}h ${Math.floor((health.uptime % 3600) / 60)}m` : "-"}
            </div>
          </div>

          <div className="bg-surface border border-border rounded-lg p-4">
            <div className="text-xs text-muted uppercase mb-2">Cache Entries</div>
            <div className="text-2xl font-bold text-primary">
              {health?.cache.entries || 0}
            </div>
          </div>

          <div className="bg-surface border border-border rounded-lg p-4">
            <div className="text-xs text-muted uppercase mb-2">Taxa Cache Hit</div>
            <div className="text-2xl font-bold text-accent">
              {analytics?.stats.cacheHitRate.toFixed(1)}%
            </div>
          </div>
        </div>

        {/* Analytics */}
        {analytics && (
          <div className="bg-surface border border-border rounded-xl p-6 mb-8">
            <h2 className="text-lg font-bold mb-4">Analytics (últimas 24h)</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <div className="text-xs text-muted uppercase mb-1">Total Requests</div>
                <div className="text-2xl font-bold">{analytics.stats.total}</div>
              </div>
              <div>
                <div className="text-xs text-muted uppercase mb-1">Gerações</div>
                <div className="text-2xl font-bold text-green-500">
                  {analytics.stats.generationSuccess}
                </div>
              </div>
              <div>
                <div className="text-xs text-muted uppercase mb-1">Erros</div>
                <div className="text-2xl font-bold text-red-500">
                  {analytics.stats.errors}
                </div>
              </div>
              <div>
                <div className="text-xs text-muted uppercase mb-1">Taxa Sucesso</div>
                <div className="text-2xl font-bold">
                  {analytics.stats.generationSuccess + analytics.stats.errors > 0
                    ? (
                        ((analytics.stats.generationSuccess /
                          (analytics.stats.generationSuccess +
                            analytics.stats.errors)) *
                          100) as any
                      ).toFixed(1)
                    : "0"}
                  %
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Memory */}
        <div className="bg-surface border border-border rounded-xl p-6">
          <h2 className="text-lg font-bold mb-4">Recursos</h2>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm">Memória Heap</span>
                <span className="text-sm font-bold">{health?.memoryUsage.heapUsed}</span>
              </div>
              <div className="bg-background rounded-full h-2">
                <div
                  className="bg-primary rounded-full h-2"
                  style={{
                    width: health
                      ? `${(parseInt(health.memoryUsage.heapUsed) / parseInt(health.memoryUsage.heapTotal)) * 100}%`
                      : "0%",
                  }}
                />
              </div>
            </div>
            <p className="text-xs text-muted">Total: {health?.memoryUsage.heapTotal}</p>
          </div>
        </div>
      </div>
    </main>
  );
}
