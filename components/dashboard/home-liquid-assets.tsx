import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency } from "@/lib/utils"
import { TrendingUp } from "lucide-react"

interface HomeLiquidAssetsProps {
  totalBalance: number
  currency: string
  changePercentage: number
}

export function HomeLiquidAssets({ totalBalance, currency, changePercentage }: HomeLiquidAssetsProps) {
  return (
    <Card className="border-none bg-transparent shadow-none p-0">
      <CardHeader className="p-0 pb-2">
        <CardTitle className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
          Liquid Assets
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="flex items-baseline gap-2">
          <span className="text-5xl font-bold tracking-tighter">
            {formatCurrency(totalBalance, currency)}
          </span>
          <div className="flex items-center gap-1 text-sm font-medium text-emerald-500">
            <TrendingUp className="h-4 w-4" />
            <span>+{changePercentage}%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
