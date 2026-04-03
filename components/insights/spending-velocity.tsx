"use client"

import { formatCurrency } from "@/lib/utils"
import { TimeSeriesData } from "@/models/stats"

interface SpendingVelocityProps {
  data: TimeSeriesData[]
  currency: string
}

export function SpendingVelocity({ data, currency }: SpendingVelocityProps) {
  const maxExpense = Math.max(...data.map(d => d.expenses), 1)
  const averageExpense = data.reduce((acc, d) => acc + d.expenses, 0) / data.length

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-end justify-between gap-1 h-32 px-2">
        {data.map((item, index) => {
          const height = (item.expenses / maxExpense) * 100
          const isAboveAverage = item.expenses > averageExpense
          
          return (
            <div 
              key={item.period} 
              className="flex-1 group relative flex flex-col items-center justify-end"
            >
              <div 
                className={`w-full rounded-t-sm transition-all duration-300 ${
                  isAboveAverage ? "bg-white" : "bg-white/20"
                }`}
                style={{ height: `${Math.max(height, 2)}%` }}
              />
              {/* Tooltip */}
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white text-black text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10 font-bold">
                {formatCurrency(item.expenses, currency)}
              </div>
            </div>
          )
        })}
      </div>
      <div className="flex justify-between px-2 text-[10px] text-muted-foreground uppercase tracking-widest">
        <span>{data[0]?.period}</span>
        <span>Today</span>
      </div>
    </div>
  )
}
