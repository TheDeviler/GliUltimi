"use client";

interface ESGScoreRingProps {
  score: number;
  size?: number;
  strokeWidth?: number;
}

export default function ESGScoreRing({ score, size = 120, strokeWidth = 10 }: ESGScoreRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const center = size / 2;

  const color =
    score >= 70 ? "#059669" : score >= 50 ? "#eab308" : "#dc2626";

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="#f1f5f9"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-2xl font-bold text-slate-900">{score}</span>
        <span className="text-xs text-slate-500">/100</span>
      </div>
    </div>
  );
}
