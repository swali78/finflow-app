import { StatsWidget } from "@/components/dashboard/stats-widget"
import { HomeView } from "@/components/dashboard/home-view"
import { getCurrentUser } from "@/lib/auth"
import config from "@/lib/config"
import { getSettings } from "@/models/settings"
import { TransactionFilters } from "@/models/transactions"
import { getDashboardStats, getTimeSeriesStats } from "@/models/stats"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Dashboard",
  description: config.app.description,
}

export default async function Dashboard({ searchParams }: { searchParams: Promise<TransactionFilters & { view?: string }> }) {
  const params = await searchParams
  const user = await getCurrentUser()
  const settings = await getSettings(user.id)
  const defaultCurrency = settings.default_currency || "USD"

  if (params.view === "charts") {
    return (
      <div className="flex flex-col gap-5 p-5 w-full max-w-7xl self-center">
        <StatsWidget filters={params} />
      </div>
    )
  }

  // Home View Stats
  const dashboardStats = await getDashboardStats(user.id)
  const timeSeries = await getTimeSeriesStats(user.id, { dateFrom: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString() }, defaultCurrency)
  
  const lastMonth = timeSeries[timeSeries.length - 1] || { income: 0, expenses: 0 }
  
  const totalBalance = dashboardStats.profitPerCurrency[defaultCurrency] || 0
  const monthlyIncome = lastMonth.income
  const monthlyExpenses = lastMonth.expenses
  const savingsRate = monthlyIncome > 0 ? Math.round(((monthlyIncome - monthlyExpenses) / monthlyIncome) * 100) : 0

  return (
    <HomeView stats={{
      totalBalance,
      monthlyIncome,
      monthlyExpenses,
      savingsRate,
      currency: defaultCurrency
    }} />
  )
}
