"use client"

import type React from "react"

import { useState } from "react"
import type { Transaction } from "@/app/page"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { X, AlertCircle, Plus, Sparkles } from "lucide-react"

const INCOME_CATEGORIES = ["Salary", "Freelance", "Allowance", "Business", "Investment", "Other"]
const EXPENSE_CATEGORIES = [
  "Feeding",
  "Transportation",
  "Data & Subscription",
  "Bills",
  "Personal Saving",
  "Savings & Investments",
  "Entertainment",
  "Others",
]

const CATEGORY_ICONS: Record<string, string> = {
  Salary: "💼",
  Freelance: "🎨",
  Allowance: "🎁",
  Business: "🏢",
  Investment: "📈",
  Other: "📌",
  Feeding: "🍽️",
  Transportation: "🚗",
  "Data & Subscription": "📱",
  Bills: "💡",
  "Personal Saving": "🏦",
  "Savings & Investments": "💰",
  Entertainment: "🎬",
  Others: "📌",
}

interface AddTransactionModalProps {
  type: "income" | "expense"
  onClose: () => void
  onAdd: (transaction: Omit<Transaction, "id">) => void
}

export default function AddTransactionModal({ type, onClose, onAdd }: AddTransactionModalProps) {
  const [amount, setAmount] = useState("")
  const [category, setCategory] = useState("")
  const [date, setDate] = useState(new Date().toISOString().split("T")[0])
  const [notes, setNotes] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [showCustomCategory, setShowCustomCategory] = useState(false)
  const [customCategoryName, setCustomCategoryName] = useState("")
  const [customCategoryIcon, setCustomCategoryIcon] = useState("📌")
  const [customCategories, setCustomCategories] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(`custom_categories_${type}`)
      return saved ? JSON.parse(saved) : []
    }
    return []
  })

  const categories = [...(type === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES), ...customCategories]

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!amount || Number.parseFloat(amount) <= 0) {
      newErrors.amount = "Please enter a valid amount greater than 0"
    }

    if (!category) {
      newErrors.category = "Please select a category"
    }

    if (!date) {
      newErrors.date = "Please select a date"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    onAdd({
      type,
      amount: Number.parseFloat(amount),
      category,
      date,
      notes: notes || undefined,
    })

    setAmount("")
    setCategory("")
    setDate(new Date().toISOString().split("T")[0])
    setNotes("")
    setErrors({})
  }

  const handleAddCustomCategory = () => {
    if (customCategoryName.trim() && !categories.includes(customCategoryName)) {
      const updated = [...customCategories, customCategoryName]
      setCustomCategories(updated)
      localStorage.setItem(`custom_categories_${type}`, JSON.stringify(updated))
      CATEGORY_ICONS[customCategoryName] = customCategoryIcon
      setCategory(customCategoryName)
      setCustomCategoryName("")
      setCustomCategoryIcon("📌")
      setShowCustomCategory(false)
    }
  }

  const quickAmounts = [1000, 5000, 10000, 50000]

  const handleQuickAmount = (quickAmount: number) => {
    setAmount((Number.parseFloat(amount || "0") + quickAmount).toString())
    setErrors({ ...errors, amount: "" })
  }

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(e.target.value)
    if (errors.amount) {
      setErrors({ ...errors, amount: "" })
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm animate-fade-in">
      <Card className="w-full max-w-md shadow-2xl border-0 card-glass">
        <div className="flex items-center justify-between border-b border-border/50 p-6 bg-gradient-to-r from-primary/10 to-accent/10">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-bold text-foreground">Add {type === "income" ? "Income" : "Expense"}</h2>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 p-6">
          <div>
            <label className="text-sm font-semibold text-foreground mb-3 block">Amount (₦)</label>
            <input
              type="number"
              value={amount}
              onChange={handleAmountChange}
              placeholder="0.00"
              step="0.01"
              min="0"
              className={`input-modern w-full px-4 py-3 text-base ${
                errors.amount ? "border-destructive focus:ring-destructive" : ""
              }`}
              required
            />
            {errors.amount && (
              <div className="flex items-center gap-2 mt-2 text-sm text-destructive">
                <AlertCircle className="h-4 w-4" />
                {errors.amount}
              </div>
            )}
            <div className="flex gap-2 mt-3 flex-wrap">
              {quickAmounts.map((quickAmount) => (
                <Button
                  key={quickAmount}
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickAmount(quickAmount)}
                  className="flex-1 min-w-fit text-xs bg-secondary/50 hover:bg-secondary border-border/50 transition-all duration-200"
                >
                  +₦{quickAmount.toLocaleString("en-NG")}
                </Button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-semibold text-foreground">Category</label>
              <button
                type="button"
                onClick={() => setShowCustomCategory(!showCustomCategory)}
                className="text-xs text-primary hover:text-primary/80 flex items-center gap-1 transition-colors font-medium"
              >
                <Plus className="h-3 w-3" />
                New
              </button>
            </div>

            {showCustomCategory && (
              <div className="mb-3 p-4 bg-secondary/50 rounded-lg border border-border/50 space-y-3">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customCategoryName}
                    onChange={(e) => setCustomCategoryName(e.target.value)}
                    placeholder="Category name"
                    className="input-modern flex-1 px-3 py-2 text-sm"
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        handleAddCustomCategory()
                      }
                    }}
                  />
                  <select
                    value={customCategoryIcon}
                    onChange={(e) => setCustomCategoryIcon(e.target.value)}
                    className="input-modern px-3 py-2 text-sm w-16"
                  >
                    <option value="📌">📌</option>
                    <option value="🎯">🎯</option>
                    <option value="🛍️">🛍️</option>
                    <option value="🏥">🏥</option>
                    <option value="✈️">✈️</option>
                    <option value="🎓">🎓</option>
                    <option value="🏠">🏠</option>
                    <option value="⚽">⚽</option>
                    <option value="🎵">🎵</option>
                    <option value="📚">📚</option>
                  </select>
                </div>
                <Button
                  type="button"
                  size="sm"
                  onClick={handleAddCustomCategory}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-200"
                >
                  Add Category
                </Button>
              </div>
            )}

            <select
              value={category}
              onChange={(e) => {
                setCategory(e.target.value)
                if (errors.category) {
                  setErrors({ ...errors, category: "" })
                }
              }}
              className={`input-modern w-full px-4 py-3 text-base ${
                errors.category ? "border-destructive focus:ring-destructive" : ""
              }`}
              required
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {CATEGORY_ICONS[cat] || "📌"} {cat}
                </option>
              ))}
            </select>
            {errors.category && (
              <div className="flex items-center gap-2 mt-2 text-sm text-destructive">
                <AlertCircle className="h-4 w-4" />
                {errors.category}
              </div>
            )}
          </div>

          <div>
            <label className="text-sm font-semibold text-foreground mb-3 block">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => {
                setDate(e.target.value)
                if (errors.date) {
                  setErrors({ ...errors, date: "" })
                }
              }}
              className={`input-modern w-full px-4 py-3 text-base ${
                errors.date ? "border-destructive focus:ring-destructive" : ""
              }`}
              required
            />
            {errors.date && (
              <div className="flex items-center gap-2 mt-2 text-sm text-destructive">
                <AlertCircle className="h-4 w-4" />
                {errors.date}
              </div>
            )}
          </div>

          <div>
            <label className="text-sm font-semibold text-foreground mb-3 block">Notes (Optional)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any notes..."
              className="input-modern w-full px-4 py-3 text-base placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
              rows={3}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 bg-transparent border-border/50 hover:bg-muted/50 transition-all duration-200"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground btn-modern shadow-md hover:shadow-lg"
            >
              Add {type === "income" ? "Income" : "Expense"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
