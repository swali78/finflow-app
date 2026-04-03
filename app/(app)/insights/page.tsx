import { SpendingVelocity } from "@/components/insights/spending-velocity"
import { AnomalyDetection, Anomaly } from "@/components/insights/anomaly-detection"
import { SpendingAllocation } from "@/components/insights/spending-allocation"
import { InsightsGauge } from "@/components/insights/insights-gauge"
import { getCurrentUser } from "@/lib/auth"
import { getSettings } from "@/models/settings"
import { getTransactions } from "@/models/transactions"
import { getTimeSeriesStats, getDetailedTimeSeriesStats } from "@/models/stats"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Insights",
}

export default async function InsightsPage() {
  const user = await getCurrentUser()
  const settings = await getSettings(user.id)
  const defaultCurrency = settings.default_currency || "USD"

  // Fetch data for velocity (last 30 days daily)
  const dateFrom = new Date()
  dateFrom.setDate(dateFrom.getDate() - 30)
  
  const [velocityData, allocationData, { transactions }] = await Promise.all([
    getTimeSeriesStats(user.id, { dateFrom: dateFrom.toISOString() }, defaultCurrency),
    getDetailedTimeSeriesStats(user.id, { dateFrom: dateFrom.toISOString() }, defaultCurrency),
    getTransactions(user.id, { dateFrom: dateFrom.toISOString() })
  ])

  // Process Allocation Data
  const lastMonthAllocation = allocationData[allocationData.length - 1]?.categories || []
  const allocationItems = lastMonthAllocation.map(cat => ({
    id: cat.code,
    label: cat.name,
    amount: cat.expenses,
    color: cat.color || "#FFFFFF"
  })).filter(item => item.amount > 0)

  // Simple Anomaly Detection Logic
  const allTransactions = transactions.filter(t => t.type === "expense" && t.total)
  const avgAmount = allTransactions.reduce((acc, t) => acc + (t.total || 0), 0) / (allTransactions.length || 1)
  
  const anomalies: Anomaly[] = allTransactions
    .filter(t => (t.total || 0) > avgAmount * 3)
    .map(t => ({
      id: t.id,
      title: `High Spending: ${t.merchant || t.name || "Unknown"}`,
      description: `This transaction is significantly higher than your average spend of $${(avgAmount / 100).toFixed(2)}.`,
      amount: t.total || 0,
      currency: t.currencyCode || defaultCurrency,
      severity: ((t.total || 0) > avgAmount * 5 ? "high" : "medium") as "high" | "medium" | "low"
    }))

  return (
    <div className="flex flex-col gap-12 p-6 md:p-10 w-full max-w-4xl mx-auto pb-24 md:pb-10">
      <header className="flex flex-col gap-1">
        <h1 className="text-4xl font-bold tracking-tighter uppercase italic tracking-widest">Insights</h1>
        <p className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] font-bold">
          Advanced Financial Analytics & Anomaly Detection
        </p>
      </header>

      {/* Spending Velocity */}
      <section className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
            Spending Velocity
          </h3>
          <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">
            +8.2% vs Last Month
          </span>
        </div>
        <SpendingVelocity data={velocityData} currency={defaultCurrency} />
      </section>

      {/* Allocation & Anomalies Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 sm:gap-20">
        <section className="flex flex-col gap-6">
          <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
            Allocation
          </h3>
          <SpendingAllocation items={allocationItems} currency={defaultCurrency} />
        </section>

        <section className="flex flex-col gap-6">
          <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
            Anomalies
          </h3>
          <AnomalyDetection anomalies={anomalies} />
        </section>
      </div>

      {/* Q4 Target (Figma Polish) */}
      <section className="flex flex-col gap-6">
        <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
          Current Goals
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <InsightsGauge label="Q4" subLabel="Target" percent={68} />
          <div className="flex flex-col gap-4">
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tighter uppercase">Quarterly Objective</span>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest leading-relaxed">
                You are currently performing 12% ahead of your target savings for the final quarter.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
