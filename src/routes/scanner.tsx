import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ScanLine, ShieldCheck, ShieldAlert, ShieldX, Globe, Lock, ExternalLink,
  Cpu, Download, ArrowRight, AlertTriangle, CheckCircle2, XCircle,
} from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { mockScan, type ScanResult } from "@/lib/mock-data";

export const Route = createFileRoute("/scanner")({
  component: () => (
    <AppShell>
      <Scanner />
    </AppShell>
  ),
});

const levelStyles = {
  Safe: { color: "text-safe", ring: "ring-safe/40", bg: "bg-safe/10", icon: ShieldCheck },
  Suspicious: { color: "text-warn", ring: "ring-warn/40", bg: "bg-warn/10", icon: ShieldAlert },
  Dangerous: { color: "text-danger", ring: "ring-danger/40", bg: "bg-danger/10", icon: ShieldX },
} as const;

function Scanner() {
  const [url, setUrl] = useState("https://paypa1-secure-login.com/verify");
  const [progress, setProgress] = useState(0);
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);

  const onScan = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!url.trim()) return toast.error("Please paste a URL first");
    setScanning(true); setResult(null); setProgress(8);
    const tick = setInterval(() => setProgress((p) => Math.min(92, p + Math.random() * 14)), 220);
    try {
      const r = await mockScan(url);
      clearInterval(tick); setProgress(100);
      setTimeout(() => { setResult(r); setScanning(false); setProgress(0); }, 250);
      toast.success(`Scan complete · ${r.level}`);
    } catch {
      clearInterval(tick); setScanning(false);
      toast.error("Scan failed");
    }
  };

  const downloadReport = () => {
    if (!result) return;
    const blob = new Blob([JSON.stringify(result, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `scan-${Date.now()}.json`;
    a.click();
    toast.success("Report downloaded");
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <div className="text-xs uppercase tracking-[0.3em] text-primary">scanner</div>
        <h1 className="mt-2 font-display text-3xl font-bold">URL Risk Analysis</h1>
        <p className="mt-1 text-sm text-muted-foreground">Paste any suspicious link to compute its real-time risk score.</p>
      </div>

      <form onSubmit={onScan} className="glass rounded-xl p-4 neon-border">
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="flex flex-1 items-center gap-2 rounded-md border border-border bg-background/40 px-3">
            <Globe className="h-4 w-4 text-primary" />
            <Input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example-suspicious-link.com/verify"
              className="border-0 bg-transparent font-mono text-sm focus-visible:ring-0"
            />
          </div>
          <Button
            type="submit"
            disabled={scanning}
            className="bg-gradient-to-r from-primary to-secondary text-primary-foreground shadow-[0_0_24px_oklch(0.82_0.18_195/0.45)] hover:shadow-[0_0_36px_oklch(0.82_0.18_195/0.7)]"
          >
            <ScanLine className="mr-2 h-4 w-4" />
            {scanning ? "Scanning…" : "Scan Now"}
          </Button>
        </div>

        <AnimatePresence>
          {scanning && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4"
            >
              <div className="scanline relative h-12 overflow-hidden rounded-md border border-primary/30 bg-background/40">
                <div className="grid-bg absolute inset-0 opacity-50" />
                <div className="absolute inset-0 grid place-items-center font-mono text-xs text-primary">
                  Resolving DNS · Inspecting headers · Querying threat feeds…
                </div>
              </div>
              <Progress value={progress} className="mt-3 h-1.5 bg-muted" />
            </motion.div>
          )}
        </AnimatePresence>
      </form>

      <AnimatePresence mode="wait">
        {result && (
          <motion.div
            key={result.scannedAt}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="grid gap-5 lg:grid-cols-[1.1fr_1fr]"
          >
            <ScoreCard result={result} onDownload={downloadReport} />
            <div className="space-y-5">
              <DomainCard result={result} />
              <RedirectCard result={result} />
            </div>
            <IndicatorsCard result={result} />
            <ExplanationCard result={result} />
          </motion.div>
        )}
      </AnimatePresence>

      {result && (
        <div className="text-right">
          <Link to="/threats" className="inline-flex items-center gap-1 text-sm text-primary hover:underline">
            See full threat details <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      )}
    </div>
  );
}

function ScoreCard({ result, onDownload }: { result: ScanResult; onDownload: () => void }) {
  const s = levelStyles[result.level];
  const Icon = s.icon;
  const circ = 2 * Math.PI * 54;
  return (
    <div className="glass rounded-xl p-6 neon-border">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs uppercase tracking-[0.25em] text-muted-foreground">threat score</div>
          <div className={`mt-1 inline-flex items-center gap-2 ${s.color}`}>
            <Icon className="h-5 w-5" />
            <span className="font-display text-lg font-semibold">{result.level}</span>
          </div>
        </div>
        <Button size="sm" variant="outline" onClick={onDownload} className="border-primary/30 bg-card/40">
          <Download className="mr-2 h-3.5 w-3.5" /> Report
        </Button>
      </div>

      <div className="mt-6 grid place-items-center">
        <div className="relative h-44 w-44">
          <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
            <circle cx="60" cy="60" r="54" stroke="currentColor" strokeWidth="8" className="text-muted/40" fill="none" />
            <motion.circle
              cx="60" cy="60" r="54" strokeWidth="8" fill="none"
              stroke="url(#riskGrad)" strokeLinecap="round"
              strokeDasharray={circ}
              initial={{ strokeDashoffset: circ }}
              animate={{ strokeDashoffset: circ - (circ * result.score) / 100 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
            />
            <defs>
              <linearGradient id="riskGrad" x1="0" x2="1" y1="0" y2="1">
                <stop offset="0%" stopColor="oklch(0.82 0.18 195)" />
                <stop offset="100%" stopColor="oklch(0.6 0.25 295)" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 grid place-items-center">
            <div className="text-center">
              <div className="font-display text-5xl font-bold text-foreground">{result.score}</div>
              <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">/ 100</div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 break-all rounded-md bg-background/40 px-3 py-2 font-mono text-xs text-muted-foreground">
        {result.url}
      </div>
    </div>
  );
}

function DomainCard({ result }: { result: ScanResult }) {
  return (
    <div className="glass rounded-xl p-6">
      <div className="mb-4 flex items-center gap-2">
        <Globe className="h-4 w-4 text-primary" />
        <div className="font-display text-sm font-semibold uppercase tracking-widest">Domain</div>
      </div>
      <dl className="grid grid-cols-2 gap-y-3 text-sm">
        <Field k="Hostname" v={result.domain.name} />
        <Field k="Domain age" v={result.domain.age} />
        <Field k="Registrar" v={result.domain.registrar} />
        <Field k="Country" v={result.domain.country} />
        <Field k="IP" v={result.domain.ip} />
        <Field k="SSL" v={
          <span className={result.ssl.valid ? "text-safe" : "text-danger"}>
            <Lock className="mr-1 inline h-3.5 w-3.5" />
            {result.ssl.valid ? `${result.ssl.issuer}` : "Invalid / Self-signed"}
          </span>
        } />
      </dl>
    </div>
  );
}

function RedirectCard({ result }: { result: ScanResult }) {
  return (
    <div className="glass rounded-xl p-6">
      <div className="mb-4 flex items-center gap-2">
        <ExternalLink className="h-4 w-4 text-primary" />
        <div className="font-display text-sm font-semibold uppercase tracking-widest">Redirect chain</div>
        <Badge variant="outline" className="ml-auto border-primary/30 text-primary">
          {result.redirects.length} hop{result.redirects.length !== 1 && "s"}
        </Badge>
      </div>
      <ol className="space-y-2">
        {result.redirects.map((r, i) => (
          <li key={i} className="flex items-start gap-2 rounded-md border border-border/60 bg-background/30 px-3 py-2 font-mono text-xs">
            <span className="text-primary">#{i + 1}</span>
            <span className="break-all text-muted-foreground">{r}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

function IndicatorsCard({ result }: { result: ScanResult }) {
  return (
    <div className="glass rounded-xl p-6">
      <div className="mb-4 flex items-center gap-2">
        <AlertTriangle className="h-4 w-4 text-warn" />
        <div className="font-display text-sm font-semibold uppercase tracking-widest">Phishing indicators</div>
      </div>
      <ul className="grid gap-2 sm:grid-cols-2">
        {result.indicators.map((i) => (
          <li
            key={i.label}
            className={`flex items-center gap-2 rounded-md border px-3 py-2 text-sm ${
              i.hit ? "border-danger/40 bg-danger/5 text-foreground" : "border-border/60 bg-background/30 text-muted-foreground"
            }`}
          >
            {i.hit ? <XCircle className="h-4 w-4 text-danger" /> : <CheckCircle2 className="h-4 w-4 text-safe" />}
            <span className="flex-1">{i.label}</span>
            <Badge variant="outline" className="border-border/60 text-[10px] uppercase">
              {i.severity}
            </Badge>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ExplanationCard({ result }: { result: ScanResult }) {
  return (
    <div className="glass rounded-xl p-6 lg:col-span-2">
      <div className="mb-3 flex items-center gap-2">
        <Cpu className="h-4 w-4 text-primary" />
        <div className="font-display text-sm font-semibold uppercase tracking-widest">AI explanation</div>
      </div>
      <p className="text-sm leading-relaxed text-foreground/90">{result.explanation}</p>
    </div>
  );
}

function Field({ k, v }: { k: string; v: React.ReactNode }) {
  return (
    <>
      <dt className="text-xs uppercase tracking-widest text-muted-foreground">{k}</dt>
      <dd className="text-right font-mono text-sm">{v}</dd>
    </>
  );
}
