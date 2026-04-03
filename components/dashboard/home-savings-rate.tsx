import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface HomeSavingsRateProps {
  rate: number
}

export function HomeSavingsRate({ rate }: HomeSavingsRateProps) {
  return (
    <Card className="border border-white/10 bg-white/5 shadow-none">
      <CardHeader className="pb-2">
        <CardTitle className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Savings Rate
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-2">
          <span className="text-3xl font-bold tracking-tighter">{rate}%</span>
          <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${rate}%` }} />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
