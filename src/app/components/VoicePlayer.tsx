import { useState, useRef, useMemo } from "react";
import { Play, Pause } from "lucide-react";
import { motion } from "motion/react";

interface Props {
  url: string;
  duration: number;
  msgId: string;
}

// Seeded pseudo-random bars consistent per message ID
function seededBars(seed: string, count: number): number[] {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = (Math.imul(31, h) + seed.charCodeAt(i)) | 0;
  }
  const bars: number[] = [];
  for (let i = 0; i < count; i++) {
    h = (Math.imul(1664525, h) + 1013904223) | 0;
    bars.push(0.18 + ((h >>> 0) / 4294967296) * 0.82);
  }
  return bars;
}

function fmtDuration(s: number): string {
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

export function VoicePlayer({ url, duration, msgId }: Props) {
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const bars = useMemo(() => seededBars(msgId, 32), [msgId]);

  const toggle = () => {
    const a = audioRef.current;
    if (!a) return;
    if (playing) a.pause();
    else a.play().catch(() => {});
  };

  const barCount = bars.length;
  const passedIdx = Math.round(progress * barCount);

  return (
    <div
      style={{
        display: "inline-flex", alignItems: "center", gap: 10,
        background: "linear-gradient(135deg, rgba(28,28,48,0.98) 0%, rgba(18,18,36,0.95) 100%)",
        border: "0.5px solid rgba(255,255,255,0.09)",
        borderRadius: 18, padding: "10px 14px",
        minWidth: 220, maxWidth: 280,
        userSelect: "none",
      }}
    >
      <audio
        ref={audioRef}
        src={url}
        preload="metadata"
        onTimeUpdate={() => {
          const a = audioRef.current;
          if (!a) return;
          setCurrentTime(a.currentTime);
          setProgress(a.duration ? a.currentTime / a.duration : 0);
        }}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => { setPlaying(false); setProgress(0); setCurrentTime(0); }}
      />

      {/* Play / Pause */}
      <motion.button
        onClick={toggle}
        whileTap={{ scale: 0.88 }}
        style={{
          width: 34, height: 34, borderRadius: "50%", flexShrink: 0,
          background: "rgba(99,102,241,0.18)",
          border: "0.5px solid rgba(99,102,241,0.35)",
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer",
        }}
      >
        {playing
          ? <Pause style={{ width: 14, height: 14, color: "#a5b4fc", fill: "#a5b4fc" }} />
          : <Play style={{ width: 14, height: 14, color: "#a5b4fc", fill: "#a5b4fc", marginLeft: 1 }} />
        }
      </motion.button>

      {/* Waveform bars */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 2, height: 30, overflow: "hidden" }}>
        {bars.map((h, i) => (
          <div
            key={i}
            style={{
              width: 3, borderRadius: 2, flexShrink: 0,
              height: `${Math.round(h * 100)}%`,
              background: i < passedIdx
                ? "rgba(165,180,252,0.80)"
                : "rgba(255,255,255,0.18)",
              transition: "background 0.08s",
            }}
          />
        ))}
      </div>

      {/* Duration / current time */}
      <span style={{
        fontSize: 11, fontVariantNumeric: "tabular-nums",
        color: "rgba(255,255,255,0.38)", flexShrink: 0,
        fontWeight: 500,
      }}>
        {playing ? fmtDuration(currentTime) : fmtDuration(duration)}
      </span>
    </div>
  );
}
