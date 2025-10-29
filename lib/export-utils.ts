import type { Transaction } from "@/app/page"

export function exportTransactionsToCSV(transactions: Transaction[], filename = "transactions.csv") {
  if (transactions.length === 0) {
    alert("No transactions to export")
    return
  }

  const headers = ["Date", "Type", "Category", "Amount (₦)", "Notes"]
  const csvContent = [
    headers.join(","),
    ...transactions.map((t) =>
      [
        new Date(t.date).toLocaleDateString("en-NG"),
        t.type.charAt(0).toUpperCase() + t.type.slice(1),
        t.category,
        t.amount.toLocaleString("en-NG"),
        t.notes ? `"${t.notes.replace(/"/g, '""')}"` : "",
      ].join(","),
    ),
  ].join("\n")

  const totalIncome = transactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0)
  const totalExpenses = transactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0)
  const balance = totalIncome - totalExpenses

  const summaryCSV = `\n\nSummary\nTotal Income,₦${totalIncome.toLocaleString("en-NG")}\nTotal Expenses,₦${totalExpenses.toLocaleString("en-NG")}\nBalance,₦${balance.toLocaleString("en-NG")}`

  const fullCSV = csvContent + summaryCSV

  const blob = new Blob([fullCSV], { type: "text/csv;charset=utf-8;" })
  const link = document.createElement("a")
  const url = URL.createObjectURL(blob)

  link.setAttribute("href", url)
  link.setAttribute("download", filename)
  link.style.visibility = "hidden"

  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
