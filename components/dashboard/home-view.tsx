import { HomeLiquidAssets } from "./home-liquid-assets"
import { HomeMonthlyFlow } from "./home-monthly-flow"
import { HomeSavingsRate } from "./home-savings-rate"
import { HomeMilestone } from "./home-milestone"
import { Card, CardContent } from "@/components/ui/card"
import { FileText, ArrowRight, ShoppingBag, Coffee, Laptop, Receipt } from "lucide-react"
import { formatCurrency } from "@/lib/utils"

interface HomeViewProps {
  stats: {
    totalBalance: number
    monthlyIncome: number
    monthlyExpenses: number
    savingsRate: number
    currency: string
  }
}

export function HomeView({ stats }: HomeViewProps) {
  return (
    <div className="flex flex-col gap-10 p-6 md:p-10 w-full max-w-4xl mx-auto pb-24 md:pb-10">
      <header className="flex flex-col gap-1">
        <HomeLiquidAssets 
          totalBalance={stats.totalBalance} 
          currency={stats.currency} 
          changePercentage={12}
        />
      </header>

      {/* Monthly Flow Section */}
      <section className="flex flex-col gap-4">
        <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
          Monthly Flow
        </h3>
        <HomeMonthlyFlow 
          income={stats.monthlyIncome} 
          expenses={stats.monthlyExpenses} 
          currency={stats.currency} 
        />
      </section>

      {/* Efficiency & Goals Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <section className="flex flex-col gap-4">
          <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
            Efficiency
          </h3>
          <HomeSavingsRate rate={stats.savingsRate} />
        </section>

        <section className="flex flex-col gap-4">
          <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
            Goals
          </h3>
          <HomeMilestone 
            currentAmount={stats.totalBalance} 
            targetAmount={5000000} 
            currency={stats.currency} 
            label="Investment Portfolio" 
          />
        </section>
      </div>

      {/* Generate Report Section (Figma Polish) */}
      <section className="flex flex-col gap-4 mt-2">
        <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
          Generate Report
        </h3>
        <Card className="border border-white/10 bg-white/5 hover:bg-white/10 cursor-pointer transition-all group overflow-hidden relative">
          <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-white/5 to-transparent pointer-events-none" />
          <CardContent className="p-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center text-white">
                <FileText className="h-5 w-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-black uppercase tracking-widest italic tracking-tighter">
                  PDF Statement
                </span>
                <span className="text-[10px] text-muted-foreground uppercase tracking-widest mt-0.5">
                  Full Transaction Ledger
                </span>
              </div>
            </div>
            <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:translate-x-1 group-hover:text-white transition-all" />
          </CardContent>
        </Card>
      </section>

      {/* Recent Activity Section (Figma Polish) */}
      <section className="flex flex-col gap-4 mt-2">
        <div className="flex items-center justify-between">
          <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
            Recent Activity
          </h3>
          <button className="text-[9px] font-bold uppercase tracking-[0.2em] text-muted-foreground hover:text-white transition-colors">
            View All
          </button>
        </div>
        
        <div className="flex flex-col gap-1">
          <ActivityItem 
            icon={<ShoppingBag className="h-3 w-3" />} 
            label="Apple Store" 
            sub="Lifestyle · Berlin" 
            amount={-124900} 
            currency={stats.currency} 
          />
          <ActivityItem 
            icon={<Laptop className="h-3 w-3" />} 
            label="AWS Cloud" 
            sub="SaaS · Infrastructure" 
            amount={-4200} 
            currency={stats.currency} 
          />
          <ActivityItem 
            icon={<Receipt className="h-3 w-3" />} 
            label="Standard Salary" 
            sub="Revenue · Creative Ltd" 
            amount={850000} 
            currency={stats.currency} 
            isIncome 
          />
        </div>
      </section>
    </div>
  )
}

function ActivityItem({ icon, label, sub, amount, currency, isIncome }: { icon: React.ReactNode, label: string, sub: string, amount: number, currency: string, isIncome?: boolean }) {
  return (
    <div className="flex items-center justify-between p-4 border border-white/5 bg-white/[0.02] hover:bg-white/5 transition-colors group">
      <div className="flex items-center gap-4">
        <div className="h-8 w-8 rounded-full bg-white/5 flex items-center justify-center opacity-70 group-hover:opacity-100 transition-opacity">
          {icon}
        </div>
        <div className="flex flex-col">
          <span className="text-xs font-bold uppercase tracking-tight">{label}</span>
          <span className="text-[9px] text-muted-foreground uppercase tracking-widest">{sub}</span>
        </div>
      </div>
      <span className={`text-sm font-mono font-bold ${isIncome ? 'text-emerald-500' : 'text-white'}`}>
        {isIncome ? '+' : '-'}{formatCurrency(Math.abs(amount), currency)}
      </span>
    </div>
  )
}
