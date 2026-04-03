"use client"

import { BulkActionsMenu } from "@/components/transactions/bulk-actions"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { calcNetTotalPerCurrency, calcTotalPerCurrency, isTransactionIncomplete } from "@/lib/stats"
import { cn, formatCurrency } from "@/lib/utils"
import { Category, Field, Project, Transaction } from "@/prisma/client"
import { formatDate, isToday, isYesterday, startOfDay } from "date-fns"
import { ArrowDownIcon, ArrowUpIcon, File } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useMemo, useState } from "react"

type FieldRenderer = {
  name: string
  code: string
  classes?: string
  sortable: boolean
  formatValue?: (transaction: Transaction & any) => React.ReactNode
  footerValue?: (transactions: Transaction[]) => React.ReactNode
}

type FieldWithRenderer = Field & {
  renderer: FieldRenderer
}

export const standardFieldRenderers: Record<string, FieldRenderer> = {
  name: {
    name: "Activity",
    code: "name",
    classes: "font-black min-w-[200px] max-w-[400px] overflow-hidden uppercase italic tracking-tighter text-xs",
    sortable: true,
    formatValue: (transaction: Transaction & { category?: Category }) => (
      <div className="flex items-center gap-3">
        <div 
          className="h-8 w-8 rounded-full flex items-center justify-center shrink-0" 
          style={{ backgroundColor: transaction.category?.color ? `${transaction.category.color}20` : 'rgba(255,255,255,0.1)' }}
        >
          <div className="h-2 w-2 rounded-full" style={{ backgroundColor: transaction.category?.color || '#FFFFFF' }} />
        </div>
        <div className="flex flex-col">
          <span className="truncate">{transaction.merchant || transaction.name || "Untitled Activity"}</span>
          <span className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest leading-none mt-0.5">{transaction.category?.name || "General"}</span>
        </div>
      </div>
    )
  },
  issuedAt: {
    name: "Date",
    code: "issuedAt",
    classes: "min-w-[100px] text-[10px] uppercase font-bold tracking-[0.2em] text-muted-foreground",
    sortable: true,
    formatValue: (transaction: Transaction) =>
      transaction.issuedAt ? formatDate(transaction.issuedAt, "MMM dd, yyyy") : "",
  },
  projectCode: {
    name: "Project",
    code: "projectCode",
    sortable: true,
    formatValue: (transaction: Transaction & { project: Project }) =>
      transaction.projectCode ? (
        <Badge className="whitespace-nowrap rounded-none border-white/10 uppercase text-[9px] tracking-widest font-bold bg-white/5 text-white" style={{ borderLeft: `2px solid ${transaction.project?.color || '#FFF'}` }}>
          {transaction.project?.name || ""}
        </Badge>
      ) : (
        "-"
      ),
  },
  total: {
    name: "Total",
    code: "total",
    classes: "text-right",
    sortable: true,
    formatValue: (transaction: Transaction) => (
      <div className="text-right">
        <div
          className={cn(
            { income: "text-emerald-500", expense: "text-white", other: "text-white" }[transaction.type || "other"],
            "flex flex-col justify-end font-mono text-sm leading-none"
          )}
        >
          <span className="font-bold">
            {transaction.total && transaction.currencyCode
              ? formatCurrency(transaction.total, transaction.currencyCode)
              : transaction.total}
          </span>
          {transaction.convertedTotal &&
            transaction.convertedCurrencyCode &&
            transaction.convertedCurrencyCode !== transaction.currencyCode && (
              <span className="text-[9px] opacity-40 uppercase tracking-tighter mt-0.5">
                {formatCurrency(transaction.convertedTotal, transaction.convertedCurrencyCode)}
              </span>
            )}
        </div>
      </div>
    ),
    footerValue: (transactions: Transaction[]) => {
      const netTotalPerCurrency = calcNetTotalPerCurrency(transactions)
      return (
        <div className="flex flex-col gap-1 text-right">
          {Object.entries(netTotalPerCurrency).map(([currency, total]) => (
            <div key={`net-${currency}`} className="flex flex-col">
              <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Net Flow</span>
              <span className={cn("text-sm font-mono font-bold", total >= 0 ? "text-emerald-500" : "text-white")}>
                {formatCurrency(total, currency)}
              </span>
            </div>
          ))}
        </div>
      )
    },
  }
}

const getFieldRenderer = (field: Field): FieldRenderer => {
  if (standardFieldRenderers[field.code as keyof typeof standardFieldRenderers]) {
    return standardFieldRenderers[field.code as keyof typeof standardFieldRenderers]
  } else {
    return {
      name: field.name,
      code: field.code,
      classes: "",
      sortable: false,
    }
  }
}

export function TransactionList({ transactions, fields = [] }: { transactions: Transaction[]; fields?: Field[] }) {
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const router = useRouter()
  const searchParams = useSearchParams()

  const [sorting, setSorting] = useState<{ field: string | null; direction: "asc" | "desc" | null }>(() => {
    const ordering = searchParams.get("ordering")
    if (!ordering) return { field: null, direction: null }
    const isDesc = ordering.startsWith("-")
    return {
      field: isDesc ? ordering.slice(1) : ordering,
      direction: isDesc ? "desc" : "asc",
    }
  })

  const visibleFields = useMemo(
    (): FieldWithRenderer[] =>
      fields
        .filter((field) => field.isVisibleInList)
        .map((field) => ({
          ...field,
          renderer: getFieldRenderer(field),
        })),
    [fields]
  )

  const toggleAllRows = () => {
    if (selectedIds.length === transactions.length) {
      setSelectedIds([])
    } else {
      setSelectedIds(transactions.map((transaction) => transaction.id))
    }
  }

  const toggleOneRow = (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id))
    } else {
      setSelectedIds([...selectedIds, id])
    }
  }

  const handleRowClick = (id: string) => {
    router.push(`/transactions/${id}`)
  }

  const handleSort = (field: string) => {
    let newDirection: "asc" | "desc" | null = "asc"
    if (sorting.field === field) {
      if (sorting.direction === "asc") newDirection = "desc"
      else if (sorting.direction === "desc") newDirection = null
    }
    setSorting({ field: newDirection ? field : null, direction: newDirection })
  }

  const renderFieldInTable = (transaction: Transaction, field: FieldWithRenderer): string | React.ReactNode => {
    if (field.isExtra) {
      return transaction.extra?.[field.code as keyof typeof transaction.extra] ?? ""
    } else if (field.renderer.formatValue) {
      return field.renderer.formatValue(transaction)
    } else {
      return String(transaction[field.code as keyof Transaction])
    }
  }

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString())
    if (sorting.field && sorting.direction) {
      const ordering = sorting.direction === "desc" ? `-${sorting.field}` : sorting.field
      params.set("ordering", ordering)
    } else {
      params.delete("ordering")
    }
    router.push(`/transactions?${params.toString()}`)
  }, [sorting])

  const getSortIcon = (field: string) => {
    if (sorting.field !== field) return null
    return sorting.direction === "asc" ? (
      <ArrowUpIcon className="w-3 h-3 ml-1 inline opacity-50" />
    ) : sorting.direction === "desc" ? (
      <ArrowDownIcon className="w-3 h-3 ml-1 inline opacity-50" />
    ) : null
  }

  // Grouping Logic for "Live" Figma Design
  const groupedTransactions = useMemo(() => {
    const groups: { label: string; transactions: Transaction[] }[] = []
    let currentLabel = ""

    transactions.forEach((t) => {
      let label = "Earlier"
      if (t.issuedAt) {
        if (isToday(t.issuedAt)) label = "Today"
        else if (isYesterday(t.issuedAt)) label = "Yesterday"
        else label = formatDate(t.issuedAt, "MMMM yyyy")
      }

      if (label !== currentLabel) {
        groups.push({ label, transactions: [t] })
        currentLabel = label
      } else {
        groups[groups.length - 1].transactions.push(t)
      }
    })
    return groups
  }, [transactions])

  return (
    <div className="rounded-none border border-white/5 bg-transparent overflow-hidden">
      <Table>
        <TableHeader className="bg-white/[0.02]">
          <TableRow className="border-b border-white/10 hover:bg-transparent">
            <TableHead className="w-[40px] select-none text-center">
              <Checkbox checked={selectedIds.length === transactions.length} onCheckedChange={toggleAllRows} />
            </TableHead>
            {visibleFields.map((field) => (
              <TableHead
                key={field.code}
                className={cn(
                  field.renderer.classes,
                  "text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground",
                  field.renderer.sortable && "hover:cursor-pointer hover:text-white transition-colors select-none"
                )}
                onClick={() => field.renderer.sortable && handleSort(field.code)}
              >
                {field.name || field.renderer.name}
                {field.renderer.sortable && getSortIcon(field.code)}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {groupedTransactions.map((group) => (
            <React.Fragment key={group.label}>
              <TableRow className="bg-white/[0.03] hover:bg-white/[0.03] border-none">
                <TableCell colSpan={visibleFields.length + 1} className="py-2 px-4">
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground opacity-50">
                    {group.label}
                  </span>
                </TableCell>
              </TableRow>
              {group.transactions.map((transaction) => (
                <TableRow
                  key={transaction.id}
                  className={cn(
                    isTransactionIncomplete(fields, transaction) && "border-l-2 border-l-emerald-500/50",
                    selectedIds.includes(transaction.id) && "bg-white/10",
                    "cursor-pointer hover:bg-white/[0.02] border-b border-white/5 transition-all group"
                  )}
                  onClick={() => handleRowClick(transaction.id)}
                >
                  <TableCell onClick={(e) => e.stopPropagation()} className="text-center">
                    <Checkbox
                      checked={selectedIds.includes(transaction.id)}
                      onCheckedChange={(checked) => {
                        if (checked !== "indeterminate") {
                          toggleOneRow({ stopPropagation: () => {} } as React.MouseEvent, transaction.id)
                        }
                      }}
                    />
                  </TableCell>
                  {visibleFields.map((field) => (
                    <TableCell key={field.code} className={cn(field.renderer.classes, "py-4")}>
                      {renderFieldInTable(transaction, field)}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </React.Fragment>
          ))}
        </TableBody>
        <TableFooter className="bg-background border-t border-white/10">
          <TableRow>
            <TableCell></TableCell>
            {visibleFields.map((field) => (
              <TableCell key={field.code} className={field.renderer.classes}>
                {field.renderer.footerValue ? field.renderer.footerValue(transactions) : ""}
              </TableCell>
            ))}
          </TableRow>
        </TableFooter>
      </Table>
      {selectedIds.length > 0 && (
        <BulkActionsMenu selectedIds={selectedIds} onActionComplete={() => setSelectedIds([])} />
      )}
    </div>
  )
}

import React from "react"
