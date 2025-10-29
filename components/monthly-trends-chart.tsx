"use client"

import type { Transaction } from "@/app/page"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

interface MonthlyTrendsChartProps {
  transactions: Transaction[]
}

export default function MonthlyTrendsChart({ transactions }: MonthlyTrendsChartProps) {
  const monthlyData = transactions.reduce(
    (acc, t) => {
      const date = new Date(t.date)
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`
      const monthLabel = date.toLocaleDateString("en-NG", { month: "short", year: "numeric" })

      const existing = acc.find((item) => item.monthKey === monthKey)
      if (existing) {
        if (t.type === "income") {
          existing.income += t.amount
        } else {
          existing.expenses += t.amount
        }
      } else {
        acc.push({
          monthKey,
          monthLabel,
          income: t.type === "income" ? t.amount : 0,
          expenses: t.type === "expense" ? t.amount : 0,
        })
      }
      return acc
    },
    [] as Array<{ monthKey: string; monthLabel: string; income: number; expenses: number }>,
  )

  const sortedData = monthlyData.sort((a, b) => a.monthKey.localeCompare(b.monthKey))

  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Trends</CardTitle>
      </CardHeader>
      <CardContent>
        {sortedData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={sortedData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="monthLabel" stroke="var(--muted-foreground)" />
              <YAxis stroke="var(--muted-foreground)" />
              <Tooltip
                formatter={(value) => `₦${value.toLocaleString("en-NG")}`}
                contentStyle={{
                  backgroundColor: "var(--card)",
                  border: `1px solid var(--border)`,
                  borderRadius: "var(--radius)",
                }}
              />
              <Legend />
              <Bar dataKey="income" fill="var(--chart-1)" name="Income" />
              <Bar dataKey="expenses" fill="var(--chart-2)" name="Expenses" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex h-[300px] items-center justify-center text-muted-foreground">No data available yet</div>
        )}
      </CardContent>
    </Card>
  )
}
