import { Card, CardContent } from "@/components/ui/card"
import { AlertCircle, ArrowUpRight } from "lucide-react"
import { formatCurrency } from "@/lib/utils"

export interface Anomaly {
  id: string
  title: string
  description: string
  amount: number
  currency: string
  severity: "low" | "medium" | "high"
}

export interface AnomalyDetectionProps {
  anomalies: Anomaly[]
}

export function AnomalyDetection({ anomalies }: AnomalyDetectionProps) {
  if (anomalies.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-8 border border-dashed border-white/10 rounded-lg">
        <span className="text-[10px] uppercase tracking-widest">No anomalies detected</span>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      {anomalies.map((anomaly) => (
        <Card key={anomaly.id} className="border border-white/10 bg-white/5 shadow-none group hover:bg-white/10 transition-colors">
          <CardContent className="p-4 flex items-start gap-4">
            <div className={`p-2 rounded-full ${
              anomaly.severity === "high" ? "bg-rose-500/20 text-rose-500" :
              anomaly.severity === "medium" ? "bg-orange-500/20 text-orange-500" :
              "bg-blue-500/20 text-blue-500"
            }`}>
              <AlertCircle className="h-4 w-4" />
            </div>
            <div className="flex flex-col gap-1 flex-1">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold uppercase tracking-tight">
                  {anomaly.title}
                </span>
                <span className="text-sm font-bold">
                  {formatCurrency(anomaly.amount, anomaly.currency)}
                </span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {anomaly.description}
              </p>
            </div>
            <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-white transition-colors" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
