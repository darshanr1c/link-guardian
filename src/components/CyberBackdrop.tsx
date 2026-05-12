import { motion } from "framer-motion";

export function CyberBackdrop() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-60" />
      {/* glowing orbs */}
      <motion.div
        className="absolute -top-40 -left-32 h-[480px] w-[480px] rounded-full"
        style={{ background: "radial-gradient(circle, oklch(0.6 0.25 295 / 0.45), transparent 60%)" }}
        animate={{ x: [0, 40, 0], y: [0, 20, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -bottom-40 -right-32 h-[520px] w-[520px] rounded-full"
        style={{ background: "radial-gradient(circle, oklch(0.82 0.18 195 / 0.35), transparent 60%)" }}
        animate={{ x: [0, -30, 0], y: [0, -20, 0] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* particles */}
      {Array.from({ length: 28 }).map((_, i) => (
        <motion.span
          key={i}
          className="absolute h-1 w-1 rounded-full bg-primary/70"
          style={{
            left: `${(i * 37) % 100}%`,
            top: `${(i * 53) % 100}%`,
            boxShadow: "0 0 10px oklch(0.82 0.18 195 / 0.9)",
          }}
          animate={{ y: [0, -30, 0], opacity: [0.2, 1, 0.2] }}
          transition={{ duration: 4 + (i % 5), repeat: Infinity, delay: i * 0.15 }}
        />
      ))}
    </div>
  );
}
