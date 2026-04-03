"use client"

import { createTransactionAction } from "@/app/(app)/transactions/actions"
import { FormError } from "@/components/forms/error"
import { FormSelectCategory } from "@/components/forms/select-category"
import { FormSelectCurrency } from "@/components/forms/select-currency"
import { FormSelectProject } from "@/components/forms/select-project"
import { FormSelectType } from "@/components/forms/select-type"
import { FormInput, FormTextarea } from "@/components/forms/simple"
import { Button } from "@/components/ui/button"
import { Category, Currency, Project } from "@/prisma/client"
import { format } from "date-fns"
import { Import, Loader2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useActionState, useEffect, useState } from "react"

export default function TransactionCreateForm({
  categories,
  projects,
  currencies,
  settings,
}: {
  categories: Category[]
  projects: Project[]
  currencies: Currency[]
  settings: Record<string, string>
}) {
  const router = useRouter()
  const [createState, createAction, isCreating] = useActionState(createTransactionAction, null)
  const [formData, setFormData] = useState({
    name: "",
    merchant: "",
    description: "",
    total: 0.0,
    convertedTotal: 0.0,
    currencyCode: settings.default_currency,
    convertedCurrencyCode: settings.default_currency,
    type: settings.default_type,
    categoryCode: settings.default_category,
    projectCode: settings.default_project,
    issuedAt: format(new Date(), "yyyy-MM-dd"),
    note: "",
  })

  useEffect(() => {
    if (createState?.success && createState.data) {
      router.push(`/transactions/${createState.data.id}`)
    }
  }, [createState, router])

  return (
    <form action={createAction} className="space-y-8 py-4">
      {/* Primary Amount Input */}
      <div className="flex flex-col items-center gap-2">
        <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Amount</label>
        <div className="flex items-center gap-3">
          <span className="text-4xl font-bold text-muted-foreground">{formData.currencyCode}</span>
          <input
            name="total"
            type="number"
            step="0.01"
            defaultValue={formData.total.toFixed(2)}
            className="bg-transparent text-6xl font-bold tracking-tighter outline-none w-full max-w-[250px] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            autoFocus
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormInput title="Activity Name" name="name" defaultValue={formData.name} placeholder="e.g. Starbucks" />
          <FormInput title="Merchant" name="merchant" defaultValue={formData.merchant} placeholder="e.g. Starbucks Coffee" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormSelectCategory
            title="Category"
            categories={categories}
            name="categoryCode"
            defaultValue={formData.categoryCode}
            placeholder="Select Category"
          />
          <FormSelectProject
            title="Ledger"
            projects={projects}
            name="projectCode"
            defaultValue={formData.projectCode}
            placeholder="Select Ledger"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormInput title="Issued Date" type="date" name="issuedAt" defaultValue={formData.issuedAt} />
          <FormSelectType title="Transaction Type" name="type" defaultValue={formData.type} />
        </div>

        <FormTextarea title="Additional Notes" name="note" defaultValue={formData.note} className="resize-none h-20" />
      </div>

      <div className="flex flex-col gap-3 pt-4">
        <Button 
          type="submit" 
          disabled={isCreating} 
          className="w-full h-14 text-sm font-bold uppercase tracking-widest bg-white text-black hover:bg-white/90"
        >
          {isCreating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Recording...
            </>
          ) : (
            "Record Transaction"
          )}
        </Button>
        
        <p className="text-[10px] text-center text-muted-foreground uppercase tracking-widest">
          Transactions are automatically analyzed by AI
        </p>
      </div>

      {createState?.error && <FormError>{createState.error}</FormError>}
    </form>
  )
}
