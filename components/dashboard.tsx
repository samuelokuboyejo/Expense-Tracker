"use client"

import { useState } from "react"
import type { Transaction } from "@/app/page"
import SummaryCards from "./summary-cards"
import AnalyticsSection from "./analytics-section"
import TransactionList from "./transaction-list"
import FilterPanel from "./filter-panel"
import { exportTransactionsToCSV } from "@/lib/export-utils"

interface DashboardProps {
  transactions: Transaction[]
  onDeleteTransaction: (id: string) => void
  onDateFilterChange: (filter: { start: string; end: string } | null) => void
  onCategoryFilterChange: (category: string | null) => void
  onTypeFilterChange?: (type: "income" | "expense" | null) => void
  allTransactions?: Transaction[]
}

export default function Dashboard({
  transactions,
  onDeleteTransaction,
  onDateFilterChange,
  onCategoryFilterChange,
  onTypeFilterChange,
  allTransactions = [],
}: DashboardProps) {
  const [showFilters, setShowFilters] = useState(false)

  const statsTransactions = allTransactions.length > 0 ? allTransactions : transactions

  const totalIncome = statsTransactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0)

  const totalExpenses = statsTransactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0)

  const balance = totalIncome - totalExpenses

  const handleExport = () => {
    const filename = `naira-tracker-${new Date().toISOString().split("T")[0]}.csv`
    exportTransactionsToCSV(statsTransactions, filename)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-12">
          <SummaryCards
            income={totalIncome}
            expenses={totalExpenses}
            balance={balance}
            transactions={statsTransactions}
          />
        </div>

        {/* Main content grid with better organization */}
        <div className="grid gap-8 lg:grid-cols-4 mb-12">
          {/* Analytics takes up 3 columns on large screens */}
          <div className="lg:col-span-3">
            <AnalyticsSection transactions={statsTransactions} />
          </div>

          {/* Filter panel on the right */}
          <div className="lg:col-span-1">
            <FilterPanel
              onDateFilterChange={onDateFilterChange}
              onCategoryFilterChange={onCategoryFilterChange}
              onTypeFilterChange={onTypeFilterChange}
              showFilters={showFilters}
              onToggleFilters={() => setShowFilters(!showFilters)}
              onExport={handleExport}
            />
          </div>
        </div>

        {/* Transaction list with full width */}
        <div className="mb-8">
          <TransactionList transactions={transactions} onDelete={onDeleteTransaction} />
        </div>
      </div>
    </div>
  )
}
