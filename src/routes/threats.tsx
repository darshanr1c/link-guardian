import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Search } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { recentScans, type ScanResult } from "@/lib/mock-data";
import {
  Globe, Lock, Shield, AlertTriangle, MapPin, Clock, FileWarning, CheckCircle2, XCircle,
} from "lucide-react";

export const Route = createFileRoute("/threats")({
  component: () => (
    <AppShell>
      <Threats />
    </AppShell>
  ),
});

function Threats() {
  const [filter, setFilter] = useState("");
  const [active, setActive] = useState<ScanResult>(recentScans.find((r) => r.level === "Dangerous") ?? recentScans[0]);

  const filtered = recentScans.filter(
    (r) => r.url.toLowerCase().includes(filter.toLowerCase()) || r.level.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <div className="text-xs uppercase tracking-[0.3em] text-primary">threat intel</div>
        <h1 className="mt-2 font-display text-3xl font-bold">Threat Details</h1>
        <p className="mt-1 text-sm text-muted-foreground">Deep-dive forensic profile per scanned URL.</p>
      </div>

      <div className="grid gap-5 xl:grid-cols-[320px_1fr]">
        {/* List */}
        <aside className="glass space-y-3 rounded-xl p-4">
          <div className="flex items-center gap-2 rounded-md border border-border bg-background/40 px-3">
            <Search className="h-4 w-4 text-primary" />
            <Input
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder="Search history…"
              className="border-0 bg-transparent text-sm focus-visible:ring-0"
            />
          </div>
          <ul className="max-h-[640px] space-y-2 overflow-y-auto pr-1">
            {filtered.map((s, i) => {
              const isActive = active.url === s.url;
              return (
                <li key={i}>
                  <button
                    onClick={() => setActive(s)}
                    className={`w-full rounded-md border p-3 text-left transition-all ${
                      isActive
                        ? "border-primary/60 bg-primary/10 shadow-[0_0_16px_oklch(0.82_0.18_195/0.3)]"
                        : "border-border/50 bg-background/30 hover:border-primary/30"
                    }`}
                  >
                    <div className="truncate font-mono text-xs">{s.url}</div>
                    <div className="mt-1 flex items-center justify-between">
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
                      <span className="font-mono text-xs text-muted-foreground">{s.score}/100</span>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        </aside>

        {/* Detail */}
        <div className="space-y-5">
          <div className="glass overflow-hidden rounded-xl neon-border">
            {/* Screenshot mock */}
            <div className="relative h-56 w-full overflow-hidden border-b border-border/40 bg-gradient-to-br from-secondary/20 to-primary/10">
              <div className="grid-bg absolute inset-0 opacity-50" />
              <div className="relative flex h-full flex-col items-center justify-center gap-2 text-center">
                <FileWarning className="h-10 w-10 text-warn" />
                <div className="font-mono text-xs text-muted-foreground">Sandboxed preview</div>
                <div className="max-w-md break-all px-4 text-sm">{active.url}</div>
              </div>
              <div className="absolute right-3 top-3 rounded-md border border-border/60 bg-background/70 px-2 py-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                screenshot · 1280×720
              </div>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3 p-5">
              <div>
                <div className="text-xs uppercase tracking-widest text-muted-foreground">Verdict</div>
                <div className={`font-display text-2xl font-bold ${
                  active.level === "Safe" ? "text-safe" : active.level === "Suspicious" ? "text-warn" : "text-danger"
                }`}>
                  {active.level} · {active.score}/100
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="border-primary/30 bg-card/40">Re-scan</Button>
                <Button className="bg-gradient-to-r from-primary to-secondary text-primary-foreground">Block domain</Button>
              </div>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <Section title="WHOIS / Domain" icon={Globe}>
              <Row k="Hostname" v={active.domain.name} />
              <Row k="Registrar" v={active.domain.registrar} />
              <Row k="Country" v={<span><MapPin className="mr-1 inline h-3 w-3" />{active.domain.country}</span>} />
              <Row k="Domain age" v={<span><Clock className="mr-1 inline h-3 w-3" />{active.domain.age}</span>} />
              <Row k="IP address" v={active.domain.ip} />
            </Section>

            <Section title="SSL certificate" icon={Lock}>
              <Row k="Status" v={
                <span className={active.ssl.valid ? "text-safe" : "text-danger"}>
                  {active.ssl.valid ? "Valid" : "Invalid"}
                </span>
              } />
              <Row k="Issuer" v={active.ssl.issuer} />
              <Row k="Expires" v={active.ssl.expires} />
            </Section>

            <Section title="Blacklist feeds" icon={Shield} className="md:col-span-2">
              <div className="grid gap-2 sm:grid-cols-2">
                {active.blacklist.map((b) => (
                  <div
                    key={b.source}
                    className={`flex items-center justify-between rounded-md border px-3 py-2 text-sm ${
                      b.listed ? "border-danger/40 bg-danger/5" : "border-safe/30 bg-safe/5"
                    }`}
                  >
                    <span>{b.source}</span>
                    {b.listed ? (
                      <span className="inline-flex items-center gap-1 text-danger"><XCircle className="h-3.5 w-3.5" /> Listed</span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-safe"><CheckCircle2 className="h-3.5 w-3.5" /> Clean</span>
                    )}
                  </div>
                ))}
              </div>
            </Section>

            <Section title="AI threat summary" icon={AlertTriangle} className="md:col-span-2">
              <p className="text-sm leading-relaxed text-foreground/90">{active.explanation}</p>
            </Section>

            <Section title="Recommended actions" icon={Shield} className="md:col-span-2">
              <ul className="space-y-2 text-sm">
                {(active.level === "Dangerous"
                  ? [
                      "Block this domain at the firewall and email gateway.",
                      "Notify the user reporting the link; preserve email headers.",
                      "Search SIEM for prior visits to this host in the last 30 days.",
                      "Submit IOC to threat-intel feeds (PhishTank, OpenPhish).",
                    ]
                  : active.level === "Suspicious"
                  ? [
                      "Quarantine the link until manual review completes.",
                      "Detonate in sandbox and capture network traffic.",
                      "Alert the user with a warning banner before navigation.",
                    ]
                  : ["No action required. Domain reputation is clean."]
                ).map((a) => (
                  <li key={a} className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span>{a}</span>
                  </li>
                ))}
              </ul>
            </Section>
          </div>
        </div>
      </div>
    </div>
  );
}

function Section({
  title, icon: Icon, children, className = "",
}: { title: string; icon: React.ComponentType<{ className?: string }>; children: React.ReactNode; className?: string }) {
  return (
    <div className={`glass rounded-xl p-5 ${className}`}>
      <div className="mb-3 flex items-center gap-2">
        <Icon className="h-4 w-4 text-primary" />
        <div className="font-display text-sm font-semibold uppercase tracking-widest">{title}</div>
      </div>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function Row({ k, v }: { k: string; v: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between border-b border-border/30 py-1.5 text-sm last:border-0">
      <span className="text-xs uppercase tracking-widest text-muted-foreground">{k}</span>
      <span className="font-mono">{v}</span>
    </div>
  );
}
