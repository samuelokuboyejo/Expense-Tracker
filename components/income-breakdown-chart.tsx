"use client"

import type { Transaction } from "@/app/page"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"

interface IncomeBreakdownChartProps {
  transactions: Transaction[]
}

export default function IncomeBreakdownChart({ transactions }: IncomeBreakdownChartProps) {
  const incomeByCategory = transactions
    .filter((t) => t.type === "income")
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

  const COLORS = ["#6B9E7F", "#E8704A", "#D4A574", "#8B6F47", "#5A7C59", "#C9A961"]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Income by Category</CardTitle>
      </CardHeader>
      <CardContent>
        {incomeByCategory.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={incomeByCategory}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ₦${value.toLocaleString("en-NG")}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {incomeByCategory.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `₦${value.toLocaleString("en-NG")}`} />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex h-[300px] items-center justify-center text-muted-foreground">No income data yet</div>
        )}
      </CardContent>
    </Card>
  )
}
