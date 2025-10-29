"use client"

import { useState, useEffect } from "react"
import Navigation from "@/components/navigation"
import Dashboard from "@/components/dashboard"
import AddTransactionModal from "@/components/add-transaction-modal"

export interface Transaction {
  id: string
  type: "income" | "expense"
  amount: number
  category: string
  date: string
  notes?: string
}

export default function Home() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [showModal, setShowModal] = useState(false)
  const [modalType, setModalType] = useState<"income" | "expense">("expense")
  const [dateFilter, setDateFilter] = useState<{ start: string; end: string } | null>(null)
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null)
  const [typeFilter, setTypeFilter] = useState<"income" | "expense" | null>(null)

  // Load transactions from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("transactions")
    if (saved) {
      setTransactions(JSON.parse(saved))
    }
  }, [])

  // Save transactions to localStorage
  useEffect(() => {
    localStorage.setItem("transactions", JSON.stringify(transactions))
  }, [transactions])

  const addTransaction = (transaction: Omit<Transaction, "id">) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now().toString(),
    }
    setTransactions([newTransaction, ...transactions])
    setShowModal(false)
  }

  const deleteTransaction = (id: string) => {
    setTransactions(transactions.filter((t) => t.id !== id))
  }

  const openModal = (type: "income" | "expense") => {
    setModalType(type)
    setShowModal(true)
  }

  const filteredTransactions = transactions.filter((t) => {
    if (dateFilter) {
      const tDate = new Date(t.date)
      const start = new Date(dateFilter.start)
      const end = new Date(dateFilter.end)
      if (tDate < start || tDate > end) return false
    }
    if (categoryFilter && t.category !== categoryFilter) return false
    if (typeFilter && t.type !== typeFilter) return false
    return true
  })

  return (
    <main className="min-h-screen bg-background">
      <Navigation onAddIncome={() => openModal("income")} onAddExpense={() => openModal("expense")} />
      <Dashboard
        transactions={filteredTransactions}
        onDeleteTransaction={deleteTransaction}
        onDateFilterChange={setDateFilter}
        onCategoryFilterChange={setCategoryFilter}
        onTypeFilterChange={setTypeFilter}
        allTransactions={transactions}
      />
      {showModal && <AddTransactionModal type={modalType} onClose={() => setShowModal(false)} onAdd={addTransaction} />}
    </main>
  )
}
