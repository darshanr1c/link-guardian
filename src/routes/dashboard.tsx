import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  Activity, ShieldAlert, ShieldCheck, Search, TrendingUp, Globe2,
} from "lucide-react";
import {
  AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid,
  PieChart, Pie, Cell, Legend,
} from "recharts";
import { AppShell } from "@/components/AppShell";
import { Badge } from "@/components/ui/badge";
import { recentScans, trendData } from "@/lib/mock-data";

export const Route = createFileRoute("/dashboard")({
  component: () => (
    <AppShell>
      <Dashboard />
    </AppShell>
  ),
});

const pieData = [
  { name: "Safe", value: 62, color: "oklch(0.78 0.18 155)" },
  { name: "Suspicious", value: 26, color: "oklch(0.82 0.17 80)" },
  { name: "Dangerous", value: 12, color: "oklch(0.65 0.25 20)" },
];

function Dashboard() {
  const stats = [
    { label: "URLs scanned", value: "48,217", icon: Search, accent: "text-primary" },
    { label: "Threats detected", value: "3,914", icon: ShieldAlert, accent: "text-danger" },
    { label: "High-risk blocked", value: "1,287", icon: ShieldCheck, accent: "text-warn" },
    { label: "Avg risk score", value: "34.6", icon: TrendingUp, accent: "text-secondary" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="text-xs uppercase tracking-[0.3em] text-primary">command center</div>
          <h1 className="mt-2 font-display text-3xl font-bold">Threat Operations Dashboard</h1>
        </div>
        <Link
          to="/scanner"
          className="rounded-md border border-primary/40 bg-card/40 px-4 py-2 text-sm text-primary hover:bg-primary/10"
        >
          + New scan
        </Link>
      </div>

      {/* KPIs */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="glass rounded-xl p-5 transition-shadow hover:neon-border"
          >
            <div className="flex items-center justify-between">
              <div className="text-xs uppercase tracking-widest text-muted-foreground">{s.label}</div>
              <s.icon className={`h-4 w-4 ${s.accent}`} />
            </div>
            <div className="mt-3 font-display text-3xl font-bold">{s.value}</div>
            <div className="mt-1 text-xs text-muted-foreground">last 24h</div>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid gap-5 xl:grid-cols-[2fr_1fr]">
        <div className="glass rounded-xl p-5">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <div className="font-display text-sm font-semibold uppercase tracking-widest">Threat trend</div>
              <div className="text-xs text-muted-foreground">14-day window</div>
            </div>
            <Activity className="h-4 w-4 text-primary" />
          </div>
          <div className="h-72">
            <ResponsiveContainer>
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.82 0.18 195)" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="oklch(0.82 0.18 195)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.65 0.25 20)" stopOpacity={0.55} />
                    <stop offset="100%" stopColor="oklch(0.65 0.25 20)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.82 0.18 195 / 0.12)" />
                <XAxis dataKey="day" tick={{ fill: "oklch(0.7 0.04 240)", fontSize: 11 }} stroke="oklch(0.82 0.18 195 / 0.2)" />
                <YAxis tick={{ fill: "oklch(0.7 0.04 240)", fontSize: 11 }} stroke="oklch(0.82 0.18 195 / 0.2)" />
                <Tooltip
                  contentStyle={{
                    background: "oklch(0.18 0.04 270 / 0.95)",
                    border: "1px solid oklch(0.82 0.18 195 / 0.3)",
                    borderRadius: 8,
                    color: "white",
                  }}
                />
                <Area type="monotone" dataKey="scans" stroke="oklch(0.82 0.18 195)" fill="url(#g1)" strokeWidth={2} />
                <Area type="monotone" dataKey="threats" stroke="oklch(0.65 0.25 20)" fill="url(#g2)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass rounded-xl p-5">
          <div className="mb-3 flex items-center justify-between">
            <div className="font-display text-sm font-semibold uppercase tracking-widest">Risk distribution</div>
            <Globe2 className="h-4 w-4 text-primary" />
          </div>
          <div className="h-72">
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={pieData}
                  innerRadius={60}
                  outerRadius={95}
                  paddingAngle={4}
                  dataKey="value"
                  stroke="oklch(0.14 0.03 270)"
                  strokeWidth={3}
                >
                  {pieData.map((d) => (
                    <Cell key={d.name} fill={d.color} />
                  ))}
                </Pie>
                <Legend wrapperStyle={{ fontSize: 12, color: "oklch(0.72 0.04 240)" }} />
                <Tooltip
                  contentStyle={{
                    background: "oklch(0.18 0.04 270 / 0.95)",
                    border: "1px solid oklch(0.82 0.18 195 / 0.3)",
                    borderRadius: 8,
                    color: "white",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Activity + Recent table */}
      <div className="grid gap-5 xl:grid-cols-[1fr_2fr]">
        <div className="glass rounded-xl p-5">
          <div className="mb-3 font-display text-sm font-semibold uppercase tracking-widest">Live activity</div>
          <ul className="space-y-3">
            {recentScans.slice(0, 6).map((s, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
                className="flex items-center gap-3 border-b border-border/40 pb-3 last:border-0"
              >
                <span
                  className={`h-2 w-2 rounded-full ${
                    s.level === "Safe" ? "bg-safe" : s.level === "Suspicious" ? "bg-warn" : "bg-danger"
                  } shadow-[0_0_8px_currentColor]`}
                />
                <div className="min-w-0 flex-1">
                  <div className="truncate font-mono text-xs">{s.url}</div>
                  <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
                    {s.level} · {s.score}/100
                  </div>
                </div>
              </motion.li>
            ))}
          </ul>
        </div>

        <div className="glass overflow-hidden rounded-xl">
          <div className="flex items-center justify-between border-b border-border/40 p-5">
            <div className="font-display text-sm font-semibold uppercase tracking-widest">Recent scans</div>
            <Link to="/threats" className="text-xs text-primary hover:underline">View details →</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-[10px] uppercase tracking-widest text-muted-foreground">
                <tr className="border-b border-border/40">
                  <th className="px-5 py-3">URL</th>
                  <th className="px-5 py-3">Score</th>
                  <th className="px-5 py-3">Risk</th>
                  <th className="px-5 py-3">Domain age</th>
                </tr>
              </thead>
              <tbody>
                {recentScans.map((s, i) => (
                  <tr key={i} className="border-b border-border/30 hover:bg-primary/5">
                    <td className="max-w-[280px] truncate px-5 py-3 font-mono text-xs">{s.url}</td>
                    <td className="px-5 py-3 font-mono">{s.score}</td>
                    <td className="px-5 py-3">
                      <Badge
                        variant="outline"
                        className={
                          s.level === "Safe"
                            ? "border-safe/40 text-safe"
                            : s.level === "Suspicious"
                            ? "border-warn/40 text-warn"
                            : "border-danger/40 text-danger"
                        }
                      >
                        {s.level}
                      </Badge>
                    </td>
                    <td className="px-5 py-3 text-muted-foreground">{s.domain.age}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
