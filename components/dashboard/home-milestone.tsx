import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency } from "@/lib/utils"

interface HomeMilestoneProps {
  currentAmount: number
  targetAmount: number
  currency: string
  label: string
}

export function HomeMilestone({ currentAmount, targetAmount, currency, label }: HomeMilestoneProps) {
  const progress = Math.min((currentAmount / targetAmount) * 100, 100)

  return (
    <Card className="border border-white/10 bg-white/5 shadow-none group transition-all duration-300 hover:border-white/20">
      <CardHeader className="pb-2">
        <CardTitle className="text-xs font-medium uppercase tracking-wider text-muted-foreground group-hover:text-foreground">
          Next Milestone: {label}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-3">
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-bold tracking-tighter">
              {formatCurrency(targetAmount, currency)}
            </span>
            <span className="text-sm font-medium text-muted-foreground">
              {progress.toFixed(0)}%
            </span>
          </div>
          <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
            <div 
              className="h-full bg-white transition-all duration-1000 ease-out" 
              style={{ width: `${progress}%` }} 
            />
          </div>
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest">
            {formatCurrency(targetAmount - currentAmount, currency)} remaining
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
