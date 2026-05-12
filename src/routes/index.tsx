import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Shield, ScanLine, Lock, ActivitySquare, Cpu, Network, Sparkles, ArrowRight } from "lucide-react";
import { CyberBackdrop } from "@/components/CyberBackdrop";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  component: Landing,
});

function Landing() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <CyberBackdrop />

      {/* Top nav */}
      <nav className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        <Link to="/" className="flex items-center gap-2">
          <div className="grid h-9 w-9 place-items-center rounded-md bg-gradient-to-br from-primary to-secondary glow-pulse">
            <Shield className="h-5 w-5 text-primary-foreground" />
          </div>
          <div className="font-display text-sm font-bold tracking-[0.25em] text-foreground">SENTINEL</div>
        </Link>
        <div className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
          <a href="#features" className="hover:text-primary">Features</a>
          <a href="#how" className="hover:text-primary">How it works</a>
          <Link to="/dashboard" className="hover:text-primary">Dashboard</Link>
        </div>
        <Link to="/scanner">
          <Button variant="outline" className="border-primary/40 bg-card/40 text-primary hover:bg-primary/10">
            Launch console
          </Button>
        </Link>
      </nav>

      {/* Hero */}
      <section className="relative z-10 mx-auto grid max-w-7xl gap-12 px-6 pb-20 pt-12 lg:grid-cols-[1.1fr_0.9fr] lg:pt-20">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-3 py-1 text-[11px] uppercase tracking-[0.25em] text-primary"
          >
            <Sparkles className="h-3 w-3" /> ai-powered threat intelligence
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="mt-6 font-display text-4xl font-bold leading-[1.05] sm:text-6xl lg:text-7xl"
          >
            AI-Powered <br />
            <span className="text-gradient">Suspicious Link</span>
            <br /> Risk Scorer
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="mt-6 max-w-xl text-base text-muted-foreground sm:text-lg"
          >
            Analyze suspicious URLs, detect phishing attempts, and calculate real-time risk
            scores using AI. Built for analysts who live in the SOC.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="mt-8 flex flex-wrap gap-3"
          >
            <Link to="/scanner">
              <Button size="lg" className="group relative overflow-hidden bg-gradient-to-r from-primary to-secondary text-primary-foreground shadow-[0_0_30px_oklch(0.82_0.18_195/0.45)]">
                <ScanLine className="mr-2 h-4 w-4" /> Analyze URL
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button size="lg" variant="outline" className="border-primary/40 bg-card/40 backdrop-blur hover:bg-primary/10 hover:text-primary">
                <ActivitySquare className="mr-2 h-4 w-4" /> View Dashboard
              </Button>
            </Link>
          </motion.div>

          <div className="mt-12 grid grid-cols-3 gap-6 border-t border-border/40 pt-6">
            {[
              { v: "12.4M", l: "URLs analyzed" },
              { v: "99.2%", l: "Phish detection" },
              { v: "<400ms", l: "Avg scan time" },
            ].map((s) => (
              <div key={s.l}>
                <div className="font-display text-2xl font-bold text-primary">{s.v}</div>
                <div className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">{s.l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Hero visual */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="relative"
        >
          <div className="absolute inset-0 -z-10 rounded-[2rem] bg-gradient-to-br from-secondary/30 to-primary/20 blur-2xl" />
          <div className="glass relative aspect-square overflow-hidden rounded-[2rem] p-6 neon-border">
            {/* concentric rings */}
            <div className="absolute inset-0 grid place-items-center">
              {[0, 1, 2, 3].map((i) => (
                <motion.div
                  key={i}
                  className="absolute rounded-full border border-primary/30"
                  style={{ width: `${30 + i * 20}%`, aspectRatio: 1 }}
                  animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
                  transition={{ duration: 18 + i * 6, repeat: Infinity, ease: "linear" }}
                />
              ))}
              <motion.div
                className="relative grid h-32 w-32 place-items-center rounded-full bg-gradient-to-br from-primary/30 to-secondary/30 backdrop-blur"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2.4, repeat: Infinity }}
              >
                <Shield className="h-16 w-16 text-primary glow-pulse" />
              </motion.div>
            </div>

            {/* floating chips */}
            {[
              { icon: Lock, label: "SSL valid", x: "8%", y: "12%" },
              { icon: Network, label: "3 redirects", x: "70%", y: "18%" },
              { icon: Cpu, label: "AI verdict: 87", x: "10%", y: "78%" },
              { icon: ScanLine, label: "PhishTank hit", x: "65%", y: "78%" },
            ].map((c, i) => (
              <motion.div
                key={c.label}
                className="absolute flex items-center gap-2 rounded-md border border-primary/30 bg-background/60 px-3 py-1.5 text-xs backdrop-blur float-slow"
                style={{ left: c.x, top: c.y, animationDelay: `${i * 0.6}s` }}
              >
                <c.icon className="h-3.5 w-3.5 text-primary" />
                <span className="font-mono">{c.label}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section id="features" className="relative z-10 mx-auto max-w-7xl px-6 pb-24">
        <div className="mb-12 text-center">
          <div className="text-xs uppercase tracking-[0.3em] text-primary">capabilities</div>
          <h2 className="mt-3 font-display text-3xl font-bold sm:text-4xl">SOC-grade link intelligence</h2>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {[
            { icon: ScanLine, t: "Real-time scanner", d: "Paste any URL and get a verdict in milliseconds with live progress telemetry." },
            { icon: Cpu, t: "AI explanation", d: "Plain-English reasoning behind every score so analysts can triage faster." },
            { icon: Network, t: "Redirect graph", d: "Trace shorteners, intermediate hops, and final landing pages." },
            { icon: Lock, t: "SSL & WHOIS", d: "Certificate validity, registrar intel, domain age and country of origin." },
            { icon: Shield, t: "Blacklist feeds", d: "Cross-reference Google Safe Browsing, PhishTank, OpenPhish and Spamhaus." },
            { icon: ActivitySquare, t: "Trends dashboard", d: "Threat distribution, time-series, and an activity log of recent scans." },
          ].map((f) => (
            <motion.div
              key={f.t}
              whileHover={{ y: -4 }}
              className="glass group rounded-xl p-6 transition-shadow hover:neon-border"
            >
              <div className="mb-4 grid h-10 w-10 place-items-center rounded-md bg-primary/10 text-primary">
                <f.icon className="h-5 w-5" />
              </div>
              <div className="font-display text-lg font-semibold">{f.t}</div>
              <p className="mt-2 text-sm text-muted-foreground">{f.d}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section id="how" className="relative z-10 mx-auto max-w-5xl px-6 pb-24">
        <div className="glass relative overflow-hidden rounded-2xl p-10 text-center neon-border">
          <div className="grid-bg absolute inset-0 opacity-40" />
          <h3 className="relative font-display text-3xl font-bold">Ready to defuse the next phish?</h3>
          <p className="relative mx-auto mt-3 max-w-xl text-muted-foreground">
            Open the console and run your first scan. No setup, no key, just intelligence.
          </p>
          <div className="relative mt-6 flex justify-center gap-3">
            <Link to="/scanner">
              <Button size="lg" className="bg-gradient-to-r from-primary to-secondary text-primary-foreground">
                Start scanning
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button size="lg" variant="outline" className="border-primary/40 bg-card/40 hover:bg-primary/10">
                Explore dashboard
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <footer className="relative z-10 border-t border-border/40 px-6 py-8 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Sentinel · AI Suspicious Link Risk Scorer
      </footer>
    </div>
  );
}
