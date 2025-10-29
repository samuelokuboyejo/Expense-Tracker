"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, Wallet, Activity, Target, PieChart } from "lucide-react"
import type { Transaction } from "@/app/page"

interface SummaryCardsProps {
  income: number
  expenses: number
  balance: number
  transactions?: Transaction[]
}

export default function SummaryCards({ income, expenses, balance, transactions = [] }: SummaryCardsProps) {
  const transactionCount = transactions.length
  const incomeCount = transactions.filter((t) => t.type === "income").length
  const expenseCount = transactions.filter((t) => t.type === "expense").length
  const averageTransaction = transactionCount > 0 ? (income + expenses) / transactionCount : 0
  const savingsRate = income > 0 ? ((balance / income) * 100).toFixed(1) : 0

  const expensesByCategory = transactions
    .filter((t) => t.type === "expense")
    .reduce(
      (acc, t) => {
        const existing = acc.find((item) => item.name === t.category)
        if (existing) {
          existing.value += t.amount
        } else {
          acc.push({ name: t.category, value: t.amount })
        }
        return acc
      },
      [] as Array<{ name: string; value: number }>,
    )

  const topCategory =
    expensesByCategory.length > 0 ? expensesByCategory.reduce((max, cat) => (cat.value > max.value ? cat : max)) : null

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 animate-fade-in">
      <Card className="card-modern border-0 bg-gradient-to-br from-primary/5 to-primary/10 hover:shadow-xl">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-semibold text-muted-foreground">Total Income</CardTitle>
          <div className="p-2 bg-primary/20 rounded-lg">
            <TrendingUp className="h-4 w-4 text-primary" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-primary">₦{income.toLocaleString("en-NG")}</div>
          <p className="text-xs text-muted-foreground mt-2">{incomeCount} transactions</p>
        </CardContent>
      </Card>

      <Card className="card-modern border-0 bg-gradient-to-br from-accent/5 to-accent/10 hover:shadow-xl">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-semibold text-muted-foreground">Total Expenses</CardTitle>
          <div className="p-2 bg-accent/20 rounded-lg">
            <TrendingDown className="h-4 w-4 text-accent" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-accent">₦{expenses.toLocaleString("en-NG")}</div>
          <p className="text-xs text-muted-foreground mt-2">{expenseCount} transactions</p>
        </CardContent>
      </Card>

      <Card className="card-modern border-0 bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950/20 dark:to-blue-900/20 hover:shadow-xl">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-semibold text-muted-foreground">Balance</CardTitle>
          <div className="p-2 bg-blue-200/50 dark:bg-blue-900/50 rounded-lg">
            <Wallet className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </div>
        </CardHeader>
        <CardContent>
          <div className={`text-3xl font-bold ${balance >= 0 ? "text-blue-600 dark:text-blue-400" : "text-accent"}`}>
            ₦{balance.toLocaleString("en-NG")}
          </div>
          <p className="text-xs text-muted-foreground mt-2">Income minus expenses</p>
        </CardContent>
      </Card>

      <Card className="card-modern border-0 bg-gradient-to-br from-amber-50 to-amber-100/50 dark:from-amber-950/20 dark:to-amber-900/20 hover:shadow-xl">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-semibold text-muted-foreground">Savings Rate</CardTitle>
          <div className="p-2 bg-amber-200/50 dark:bg-amber-900/50 rounded-lg">
            <Target className="h-4 w-4 text-amber-600 dark:text-amber-400" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-amber-600 dark:text-amber-400">{savingsRate}%</div>
          <p className="text-xs text-muted-foreground mt-2">Of income saved</p>
        </CardContent>
      </Card>

      {topCategory && (
        <Card className="card-modern border-0 bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-950/20 dark:to-purple-900/20 hover:shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-muted-foreground">Top Category</CardTitle>
            <div className="p-2 bg-purple-200/50 dark:bg-purple-900/50 rounded-lg">
              <PieChart className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">{topCategory.name}</div>
            <p className="text-xs text-muted-foreground mt-2">₦{topCategory.value.toLocaleString("en-NG")}</p>
          </CardContent>
        </Card>
      )}

      <Card className="card-modern border-0 bg-gradient-to-br from-indigo-50 to-indigo-100/50 dark:from-indigo-950/20 dark:to-indigo-900/20 hover:shadow-xl">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-semibold text-muted-foreground">Avg Transaction</CardTitle>
          <div className="p-2 bg-indigo-200/50 dark:bg-indigo-900/50 rounded-lg">
            <Activity className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
            ₦{averageTransaction.toLocaleString("en-NG", { maximumFractionDigits: 0 })}
          </div>
          <p className="text-xs text-muted-foreground mt-2">{transactionCount} total</p>
        </CardContent>
      </Card>
    </div>
  )
}
