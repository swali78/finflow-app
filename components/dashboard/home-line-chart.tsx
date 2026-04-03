"use client"

import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts"

const data = [
  { name: "01", income: 4000, expense: 2400 },
  { name: "05", income: 3000, expense: 1398 },
  { name: "10", income: 2000, expense: 5800 },
  { name: "15", income: 2780, expense: 3908 },
  { name: "20", income: 3890, expense: 1800 },
  { name: "25", income: 2390, expense: 3800 },
  { name: "30", income: 3490, expense: 4300 },
]

export function HomeLineChart() {
  return (
    <div className="h-[200px] w-full mt-6 scale-x-105 ml-[-2.5%] opacity-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="white" stopOpacity={0.1} />
              <stop offset="95%" stopColor="white" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} stroke="#1A1A1A" strokeDasharray="3 3" />
          <XAxis 
            dataKey="name" 
            hide={false} 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#404040', fontSize: 10, fontWeight: 'bold' }}
            dy={10}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: '#000', border: '1px solid #333', color: '#fff', fontSize: '10px' }}
            itemStyle={{ color: '#fff' }}
          />
          <Line
            type="monotone"
            dataKey="income"
            stroke="white"
            strokeWidth={3}
            dot={false}
            animationDuration={2000}
          />
          <Line
            type="monotone"
            dataKey="expense"
            stroke="#404040"
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
