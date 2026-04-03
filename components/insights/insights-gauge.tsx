"use client"

import { Card, CardContent } from "@/components/ui/card"

interface InsightsGaugeProps {
  label: string
  subLabel: string
  percent: number
}

export function InsightsGauge({ label, subLabel, percent }: InsightsGaugeProps) {
  const size = 120
  const strokeWidth = 8
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const strokeDashoffset = circumference - (percent / 100) * circumference

  return (
    <Card className="border border-white/10 bg-white/5 flex flex-col items-center justify-center p-6 gap-4">
      <div className="relative" style={{ width: size, height: size }}>
        {/* Background Circle */}
        <svg className="w-full h-full -rotate-90">
          <circle
            className="text-white/10"
            strokeWidth={strokeWidth}
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx={size / 2}
            cy={size / 2}
          />
          {/* Progress Circle */}
          <circle
            className="text-white transition-all duration-1000 ease-in-out"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx={size / 2}
            cy={size / 2}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xl font-black italic tracking-tighter uppercase">{label}</span>
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{subLabel}</span>
        </div>
      </div>
      <div className="flex flex-col items-center gap-1">
        <span className="text-sm font-bold uppercase tracking-widest">{percent}%</span>
        <span className="text-[9px] text-muted-foreground uppercase tracking-[0.2em]">Current Progression</span>
      </div>
    </Card>
  )
}
