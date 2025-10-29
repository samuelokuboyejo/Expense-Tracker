"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronDown, Download } from "lucide-react"
import type { Transaction } from "@/app/page"

interface FilterPanelProps {
  onDateFilterChange: (filter: { start: string; end: string } | null) => void
  onCategoryFilterChange: (category: string | null) => void
  onTypeFilterChange?: (type: "income" | "expense" | null) => void
  showFilters: boolean
  onToggleFilters: () => void
  onExport?: () => void
  allTransactions?: Transaction[]
}

export default function FilterPanel({
  onDateFilterChange,
  onCategoryFilterChange,
  onTypeFilterChange,
  showFilters,
  onToggleFilters,
  onExport,
  allTransactions = [],
}: FilterPanelProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedType, setSelectedType] = useState<"income" | "expense" | null>(null)
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")

  const getUsedCategories = () => {
    const categories = new Set<string>()
    allTransactions.forEach((t) => {
      categories.add(t.category)
    })
    return Array.from(categories).sort()
  }

  const usedCategories = getUsedCategories()

  const handleCategoryChange = (category: string) => {
    const newCategory = selectedCategory === category ? null : category
    setSelectedCategory(newCategory)
    onCategoryFilterChange(newCategory)
  }

  const handleTypeChange = (type: "income" | "expense") => {
    const newType = selectedType === type ? null : type
    setSelectedType(newType)
    onTypeFilterChange?.(newType)
  }

  const handleDateFilter = () => {
    if (startDate && endDate) {
      onDateFilterChange({ start: startDate, end: endDate })
    }
  }

  const handleClearFilters = () => {
    setSelectedCategory(null)
    setSelectedType(null)
    setStartDate("")
    setEndDate("")
    onDateFilterChange(null)
    onCategoryFilterChange(null)
    onTypeFilterChange?.(null)
  }

  return (
    <Card className="card-modern border-0 sticky top-8 animate-fade-in">
      <CardHeader className="pb-3 bg-gradient-to-r from-primary/5 to-accent/5">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-bold">Filters & Export</CardTitle>
          <Button variant="ghost" size="sm" onClick={onToggleFilters} className="gap-2 h-8 w-8 p-0">
            <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${showFilters ? "rotate-180" : ""}`} />
          </Button>
        </div>
      </CardHeader>
      {showFilters && (
        <CardContent className="space-y-4 pt-4">
          <div>
            <label className="text-sm font-semibold text-foreground mb-3 block">Transaction Type</label>
            <div className="flex gap-2">
              <Button
                type="button"
                onClick={() => handleTypeChange("income")}
                className={`flex-1 transition-all duration-200 ${selectedType === "income"
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "bg-secondary/50 text-foreground hover:bg-secondary border border-border/50"
                  }`}
                size="sm"
              >
                Income
              </Button>
              <Button
                type="button"
                onClick={() => handleTypeChange("expense")}
                className={`flex-1 transition-all duration-200 ${selectedType === "expense"
                    ? "bg-accent text-accent-foreground shadow-md"
                    : "bg-secondary/50 text-foreground hover:bg-secondary border border-border/50"
                  }`}
                size="sm"
              >
                Expense
              </Button>
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold text-foreground mb-3 block">Date Range</label>
            <div className="space-y-2">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="input-modern w-full px-3 py-2 text-sm"
              />
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="input-modern w-full px-3 py-2 text-sm"
              />
              <Button
                onClick={handleDateFilter}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-200"
                size="sm"
              >
                Apply Date Filter
              </Button>
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold text-foreground mb-3 block">
              Category {usedCategories.length > 0 && `(${usedCategories.length})`}
            </label>
            {usedCategories.length > 0 ? (
              <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                {usedCategories.map((category) => (
                  <button
                    key={category}
                    onClick={() => handleCategoryChange(category)}
                    className={`w-full rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 text-left ${selectedCategory === category
                        ? "bg-primary text-primary-foreground shadow-md"
                        : "bg-secondary/50 text-foreground hover:bg-secondary border border-border/50"
                      }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-sm text-muted-foreground py-4 text-center">No categories yet</div>
            )}
          </div>

          <div className="flex gap-2 pt-4 border-t border-border/50">
            <Button
              onClick={handleClearFilters}
              variant="outline"
              className="flex-1 bg-transparent border-border/50 hover:bg-muted/50 transition-all duration-200"
              size="sm"
            >
              Clear
            </Button>
            {onExport && (
              <Button
                onClick={onExport}
                className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground gap-2 transition-all duration-200"
                size="sm"
              >
                <Download className="h-4 w-4" />
                Export
              </Button>
            )}
          </div>
        </CardContent>
      )}
    </Card>
  )
}
