"use client"

import { saveSettingsAction } from "@/app/(app)/settings/actions"
import { FormError } from "@/components/forms/error"
import { FormSelectCategory } from "@/components/forms/select-category"
import { FormSelectCurrency } from "@/components/forms/select-currency"
import { FormSelectType } from "@/components/forms/select-type"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Category, Currency } from "@/prisma/client"
import { CircleCheckBig } from "lucide-react"
import { useActionState } from "react"

export default function GlobalSettingsForm({
  settings,
  currencies,
  categories,
}: {
  settings: Record<string, string>
  currencies: Currency[]
  categories: Category[]
}) {
  const [saveState, saveAction, pending] = useActionState(saveSettingsAction, null)

  return (
    <div className="space-y-10 py-6">
      <section className="space-y-4">
        <h3 className="text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground">Verification</h3>
        <div className="flex items-center gap-4 p-4 border border-white/10 bg-white/5 rounded-lg">
          <div className="h-10 w-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
            <CircleCheckBig className="h-5 w-5 text-emerald-500" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold uppercase tracking-tight">Level 2 Verified</span>
            <span className="text-xs text-muted-foreground">Your identity and business details are confirmed.</span>
          </div>
        </div>
      </section>

      <form action={saveAction} className="space-y-8">
        <section className="space-y-6">
          <h3 className="text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground">Financial Standards</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormSelectCurrency
              title="Primary Currency"
              name="default_currency"
              defaultValue={settings.default_currency}
              currencies={currencies}
            />
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Jurisdiction</label>
              <div className="h-10 px-3 flex items-center border border-white/10 bg-white/5 rounded-md text-sm text-muted-foreground cursor-not-allowed">
                United States (California)
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <h3 className="text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground">Default Parameters</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormSelectType title="Main Activity Type" name="default_type" defaultValue={settings.default_type} />
            <FormSelectCategory
              title="Primary Category"
              name="default_category"
              defaultValue={settings.default_category}
              categories={categories}
            />
          </div>
        </section>

        <div className="flex items-center gap-4 pt-4">
          <Button 
            type="submit" 
            disabled={pending} 
            className="h-12 px-8 text-sm font-bold uppercase tracking-widest bg-white text-black hover:bg-white/90"
          >
            {pending ? "Applying..." : "Apply Changes"}
          </Button>
          {saveState?.success && (
            <p className="text-emerald-500 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
              <CircleCheckBig className="h-4 w-4" />
              Settings Applied
            </p>
          )}
        </div>

        {saveState?.error && <FormError>{saveState.error}</FormError>}
      </form>

      <section className="space-y-4">
        <h3 className="text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground">Interface</h3>
        <div className="flex flex-col gap-2 p-4 border border-white/10 bg-white/5 rounded-lg">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">Haptic Feedback</span>
            <div className="h-5 w-10 bg-emerald-500 rounded-full flex items-center justify-end px-1">
              <div className="h-3 w-3 bg-white rounded-full" />
            </div>
          </div>
          <Separator className="bg-white/5" />
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">Biometric Authentication</span>
            <div className="h-5 w-10 bg-white/10 rounded-full flex items-center justify-start px-1">
              <div className="h-3 w-3 bg-white/40 rounded-full" />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
