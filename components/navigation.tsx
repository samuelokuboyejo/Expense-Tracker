"use client"

import { Button } from "@/components/ui/button"
import { Plus, TrendingUp } from "lucide-react"

interface NavigationProps {
  onAddIncome: () => void
  onAddExpense: () => void
}

export default function Navigation({ onAddIncome, onAddExpense }: NavigationProps) {
  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-md shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/70 text-primary-foreground font-bold shadow-md">
              <TrendingUp className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Naira Tracker</h1>
              <p className="text-xs text-muted-foreground">Smart Finance</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={onAddIncome}
              className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground shadow-md hover:shadow-lg transition-all duration-300"
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Add Income</span>
            </Button>
            <Button
              onClick={onAddExpense}
              variant="outline"
              className="gap-2 bg-accent/10 hover:bg-accent/20 border-accent/30 text-accent hover:text-accent transition-all duration-300"
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Add Expense</span>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}
