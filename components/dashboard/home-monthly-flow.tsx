import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency } from "@/lib/utils"
import { ArrowDown, ArrowUp } from "lucide-react"

interface HomeMonthlyFlowProps {
  income: number
  expenses: number
  currency: string
}

export function HomeMonthlyFlow({ income, expenses, currency }: HomeMonthlyFlowProps) {
  const net = income - expenses
  const isPositive = net >= 0

  return (
    <div className="grid grid-cols-2 gap-4">
      <Card className="border border-white/10 bg-white/5 shadow-none">
        <CardHeader className="pb-2">
          <CardTitle className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Monthly Income
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <ArrowUp className="h-4 w-4 text-emerald-500" />
            <span className="text-2xl font-bold">{formatCurrency(income, currency)}</span>
          </div>
        </CardContent>
      </Card>
      <Card className="border border-white/10 bg-white/5 shadow-none">
        <CardHeader className="pb-2">
          <CardTitle className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Monthly Expenses
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <ArrowDown className="h-4 w-4 text-rose-500" />
            <span className="text-2xl font-bold">{formatCurrency(expenses, currency)}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
