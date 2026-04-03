import { Card, CardContent } from "@/components/ui/card"
import { formatCurrency } from "@/lib/utils"

interface AllocationItem {
  id: string
  label: string
  amount: number
  color: string
}

interface SpendingAllocationProps {
  items: AllocationItem[]
  currency: string
}

export function SpendingAllocation({ items, currency }: SpendingAllocationProps) {
  const totalAmount = items.reduce((acc, item) => acc + item.amount, 0)

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <div className="h-4 w-full flex rounded-full overflow-hidden">
          {items.map((item) => (
            <div 
              key={item.id} 
              className="h-full transition-all duration-500 hover:scale-[1.05]" 
              style={{ 
                width: `${(item.amount / totalAmount) * 100}%`,
                backgroundColor: item.color 
              }}
            />
          ))}
        </div>
        <div className="flex justify-between items-center px-1">
          <span className="text-[10px] text-muted-foreground uppercase tracking-widest">
            Spending Allocation
          </span>
          <span className="text-sm font-bold">
            {formatCurrency(totalAmount, currency)}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {items.map((item) => (
          <div key={item.id} className="flex items-center gap-2 group cursor-default">
            <div 
              className="h-2 w-2 rounded-full group-hover:scale-125 transition-transform" 
              style={{ backgroundColor: item.color }} 
            />
            <div className="flex flex-col flex-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors uppercase tracking-tight">
                  {item.label}
                </span>
                <span className="text-xs font-bold">
                  {((item.amount / totalAmount) * 100).toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
