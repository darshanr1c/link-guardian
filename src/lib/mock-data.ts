export type RiskLevel = "Safe" | "Suspicious" | "Dangerous";

export interface ScanResult {
  url: string;
  score: number;
  level: RiskLevel;
  explanation: string;
  domain: {
    name: string;
    age: string;
    registrar: string;
    country: string;
    ip: string;
  };
  ssl: { valid: boolean; issuer: string; expires: string };
  redirects: string[];
  indicators: { label: string; severity: "low" | "med" | "high"; hit: boolean }[];
  blacklist: { source: string; listed: boolean }[];
  scannedAt: string;
}

const sample = (url: string): ScanResult => {
  const seed = url.length + url.charCodeAt(0);
  const score = Math.min(100, Math.max(2, (seed * 7) % 100));
  const level: RiskLevel = score < 35 ? "Safe" : score < 70 ? "Suspicious" : "Dangerous";
  return {
    url,
    score,
    level,
    explanation:
      level === "Safe"
        ? "No phishing patterns detected. Domain has established reputation, valid SSL, and clean blacklist record."
        : level === "Suspicious"
        ? "Domain shows several risk signals: recent registration, lookalike characters in the hostname, and one redirect through an unverified host."
        : "High likelihood of phishing. Detected brand impersonation, obfuscated path, expired SSL, and blacklist hits across multiple feeds.",
    domain: {
      name: (() => {
        try { return new URL(url).hostname; } catch { return "unknown.host"; }
      })(),
      age: level === "Safe" ? "8 years" : level === "Suspicious" ? "47 days" : "3 days",
      registrar: level === "Dangerous" ? "NameShield LLC (offshore)" : "GoDaddy.com, LLC",
      country: level === "Dangerous" ? "RU" : "US",
      ip: `${(seed * 11) % 255}.${(seed * 13) % 255}.${(seed * 17) % 255}.${(seed * 19) % 255}`,
    },
    ssl: {
      valid: level !== "Dangerous",
      issuer: level === "Dangerous" ? "Self-signed" : "Let's Encrypt",
      expires: level === "Dangerous" ? "Expired 2024-11-02" : "2026-08-14",
    },
    redirects:
      level === "Safe"
        ? [url]
        : level === "Suspicious"
        ? [url, "https://tracker.cdn-redirect.io/abc"]
        : [url, "http://bit.ly/3xPh1sH", "http://login-verify-update.example/x?a=1"],
    indicators: [
      { label: "Lookalike domain (homoglyph)", severity: "high", hit: level !== "Safe" },
      { label: "Brand keyword in subdomain", severity: "med", hit: level === "Dangerous" },
      { label: "Suspicious TLD", severity: "med", hit: level === "Dangerous" },
      { label: "URL shortener in chain", severity: "low", hit: level !== "Safe" },
      { label: "Obfuscated query string", severity: "med", hit: level === "Dangerous" },
      { label: "Credential form on page", severity: "high", hit: level === "Dangerous" },
    ],
    blacklist: [
      { source: "Google Safe Browsing", listed: level === "Dangerous" },
      { source: "PhishTank", listed: level === "Dangerous" },
      { source: "OpenPhish", listed: level !== "Safe" && Math.random() > 0.4 },
      { source: "Spamhaus", listed: level === "Dangerous" },
    ],
    scannedAt: new Date().toISOString(),
  };
};

export const mockScan = (url: string): Promise<ScanResult> =>
  new Promise((res) => setTimeout(() => res(sample(url)), 1800));

export const recentScans: ScanResult[] = [
  "https://paypa1-secure-login.com/verify",
  "https://github.com/lovable",
  "http://bit.ly/3xPh1sH",
  "https://stripe.com/pricing",
  "https://amaz0n-account-update.help/login",
  "https://docs.google.com/document/d/abc",
  "https://drlve-share-files.io/file?id=22",
].map(sample);

export const trendData = Array.from({ length: 14 }).map((_, i) => ({
  day: `D${i + 1}`,
  scans: 40 + Math.round(Math.sin(i / 2) * 18 + i * 3),
  threats: 5 + Math.round(Math.cos(i / 1.7) * 4 + i / 1.5),
}));
