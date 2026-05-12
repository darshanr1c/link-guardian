import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Download, FileBarChart2, Filter } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { recentScans } from "@/lib/mock-data";
import { toast } from "sonner";

export const Route = createFileRoute("/reports")({
  component: () => (
    <AppShell>
      <Reports />
    </AppShell>
  ),
});

function Reports() {
  const [q, setQ] = useState("");
  const [lvl, setLvl] = useState<string>("All");
  const filtered = recentScans.filter(
    (r) =>
      (lvl === "All" || r.level === lvl) &&
      (r.url.toLowerCase().includes(q.toLowerCase()) || r.domain.name.includes(q.toLowerCase()))
  );

  const downloadAll = () => {
    const blob = new Blob([JSON.stringify(filtered, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `sentinel-reports-${Date.now()}.json`;
    a.click();
    toast.success("Bundle downloaded");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="text-xs uppercase tracking-[0.3em] text-primary">archive</div>
          <h1 className="mt-2 font-display text-3xl font-bold">Scan Reports</h1>
        </div>
        <Button onClick={downloadAll} className="bg-gradient-to-r from-primary to-secondary text-primary-foreground">
          <Download className="mr-2 h-4 w-4" /> Export bundle
        </Button>
      </div>

      <div className="glass flex flex-wrap items-center gap-3 rounded-xl p-4">
        <div className="flex flex-1 items-center gap-2 rounded-md border border-border bg-background/40 px-3">
          <Filter className="h-4 w-4 text-primary" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by URL or domain…" className="border-0 bg-transparent focus-visible:ring-0" />
        </div>
        <div className="flex gap-1 rounded-md border border-border bg-background/40 p-1">
          {["All", "Safe", "Suspicious", "Dangerous"].map((l) => (
            <button
              key={l}
              onClick={() => setLvl(l)}
              className={`rounded px-3 py-1.5 text-xs uppercase tracking-widest transition ${
                lvl === l ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-primary"
              }`}
            >
              {l}
            </button>
          ))}
        </div>
      </div>

      <div className="glass overflow-hidden rounded-xl">
        <table className="w-full text-sm">
          <thead className="text-left text-[10px] uppercase tracking-widest text-muted-foreground">
            <tr className="border-b border-border/40">
              <th className="px-5 py-3"><FileBarChart2 className="mr-1 inline h-3 w-3" /> URL</th>
              <th className="px-5 py-3">Score</th>
              <th className="px-5 py-3">Risk</th>
              <th className="px-5 py-3">Domain</th>
              <th className="px-5 py-3">SSL</th>
              <th className="px-5 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((s, i) => (
              <tr key={i} className="border-b border-border/30 hover:bg-primary/5">
                <td className="max-w-[280px] truncate px-5 py-3 font-mono text-xs">{s.url}</td>
                <td className="px-5 py-3 font-mono">{s.score}</td>
                <td className="px-5 py-3">
                  <Badge variant="outline" className={
                    s.level === "Safe" ? "border-safe/40 text-safe" :
                    s.level === "Suspicious" ? "border-warn/40 text-warn" : "border-danger/40 text-danger"
                  }>{s.level}</Badge>
                </td>
                <td className="px-5 py-3 text-muted-foreground">{s.domain.name}</td>
                <td className={`px-5 py-3 ${s.ssl.valid ? "text-safe" : "text-danger"}`}>
                  {s.ssl.valid ? "Valid" : "Invalid"}
                </td>
                <td className="px-5 py-3">
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-primary/30 bg-card/40"
                    onClick={() => {
                      const blob = new Blob([JSON.stringify(s, null, 2)], { type: "application/json" });
                      const a = document.createElement("a");
                      a.href = URL.createObjectURL(blob);
                      a.download = `${s.domain.name}-report.json`;
                      a.click();
                    }}
                  >
                    <Download className="h-3.5 w-3.5" />
                  </Button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={6} className="px-5 py-10 text-center text-sm text-muted-foreground">No matching reports.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
