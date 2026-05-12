import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { Bot, Send, Shield, Sparkles, User } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/assistant")({
  component: () => (
    <AppShell>
      <Assistant />
    </AppShell>
  ),
});

interface Msg { role: "user" | "bot"; text: string }

const tips = [
  "Always hover a link to see the real destination — display text can lie.",
  "Treat URL shorteners as suspicious by default; expand them with a sandbox.",
  "Look for homoglyphs: paypa1.com vs paypal.com — that's a 1, not an l.",
  "Verify SSL is from a reputable CA, not self-signed; expired certs are red flags.",
  "Brand keywords in the subdomain (login.paypal.example.ru) almost always mean phishing.",
  "Never enter credentials after following a link from an unsolicited message.",
];

const reply = (q: string) => {
  const k = q.toLowerCase();
  if (k.includes("phish")) return "Phishing relies on urgency and impersonation. Verify the sender via a known channel and inspect headers before clicking.";
  if (k.includes("ssl") || k.includes("https")) return "HTTPS only proves the connection is encrypted, not that the site is legitimate. Phishing kits routinely use Let's Encrypt certificates.";
  if (k.includes("score")) return "Sentinel's risk score blends reputation feeds, AI heuristics on the URL string, redirect chain depth, SSL status, and content fingerprints.";
  if (k.includes("redirect")) return "Long redirect chains through unrelated domains are a strong phishing indicator. We trace every hop and flag shorteners.";
  return tips[Math.floor(Math.random() * tips.length)];
};

function Assistant() {
  const [messages, setMessages] = useState<Msg[]>([
    { role: "bot", text: "I'm Sentinel, your security copilot. Ask me about phishing, link analysis, or paste a tactic you're seeing." },
  ]);
  const [input, setInput] = useState("");

  const send = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim()) return;
    const q = input.trim();
    setMessages((m) => [...m, { role: "user", text: q }]);
    setInput("");
    setTimeout(() => setMessages((m) => [...m, { role: "bot", text: reply(q) }]), 600);
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <div className="text-xs uppercase tracking-[0.3em] text-primary">copilot</div>
        <h1 className="mt-2 font-display text-3xl font-bold">AI Security Assistant</h1>
        <p className="mt-1 text-sm text-muted-foreground">Get instant phishing tips and tactical guidance.</p>
      </div>

      <div className="glass rounded-xl neon-border">
        <div className="flex items-center gap-2 border-b border-border/40 p-4">
          <div className="grid h-8 w-8 place-items-center rounded-md bg-gradient-to-br from-primary to-secondary">
            <Shield className="h-4 w-4 text-primary-foreground" />
          </div>
          <div>
            <div className="font-display text-sm font-semibold">Sentinel Copilot</div>
            <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-safe">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-safe shadow-[0_0_6px_currentColor]" /> online
            </div>
          </div>
        </div>

        <div className="max-h-[480px] space-y-4 overflow-y-auto p-5">
          {messages.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-3 ${m.role === "user" ? "flex-row-reverse" : ""}`}
            >
              <div className={`grid h-8 w-8 shrink-0 place-items-center rounded-md ${
                m.role === "user" ? "bg-secondary text-secondary-foreground" : "bg-primary/15 text-primary"
              }`}>
                {m.role === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
              </div>
              <div className={`max-w-[80%] rounded-lg px-4 py-2.5 text-sm ${
                m.role === "user"
                  ? "bg-secondary text-secondary-foreground"
                  : "border border-border/50 bg-background/40"
              }`}>
                {m.text}
              </div>
            </motion.div>
          ))}
        </div>

        <form onSubmit={send} className="flex items-center gap-2 border-t border-border/40 p-3">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about phishing, SSL, redirects…"
            className="border-border/60 bg-background/40"
          />
          <Button type="submit" className="bg-gradient-to-r from-primary to-secondary text-primary-foreground">
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {tips.slice(0, 4).map((t) => (
          <button
            key={t}
            onClick={() => { setInput(t); }}
            className="glass flex items-start gap-3 rounded-lg p-4 text-left text-sm transition-all hover:neon-border"
          >
            <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <span className="text-muted-foreground">{t}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
