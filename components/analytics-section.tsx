"use client"

import type { Transaction } from "@/app/page"
import MonthlyTrendsChart from "./monthly-trends-chart"
import IncomeBreakdownChart from "./income-breakdown-chart"
import TransactionChart from "./transaction-chart"

interface AnalyticsSectionProps {
  transactions: Transaction[]
}

export default function AnalyticsSection({ transactions }: AnalyticsSectionProps) {
  return (
    <div className="space-y-8">
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="animate-fade-in" style={{ animationDelay: "0.1s" }}>
          <MonthlyTrendsChart transactions={transactions} />
        </div>
        <div className="animate-fade-in" style={{ animationDelay: "0.2s" }}>
          <TransactionChart transactions={transactions} />
        </div>
      </div>
      <div className="animate-fade-in" style={{ animationDelay: "0.3s" }}>
        <IncomeBreakdownChart transactions={transactions} />
      </div>
    </div>
  )
}
