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

export async function exportTransactionsToImage(transactions: Transaction[], filename = "transactions.png") {
  if (transactions.length === 0) {
    alert("No transactions to export")
    return
  }

  const totalIncome = transactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0)
  const totalExpenses = transactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0)
  const balance = totalIncome - totalExpenses

  const canvas = document.createElement("canvas")
  const width = 1200
  const height = Math.max(800, 200 + transactions.length * 50)

  canvas.width = width
  canvas.height = height

  const ctx = canvas.getContext("2d")
  if (!ctx) {
    alert("Could not create image")
    return
  }

  // Background gradient
  const gradient = ctx.createLinearGradient(0, 0, 0, height)
  gradient.addColorStop(0, "#f8fafc")
  gradient.addColorStop(1, "#f1f5f9")
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, width, height)

  ctx.fillStyle = "#1e293b"
  ctx.font = "bold 48px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
  ctx.fillText("Naira Tracker Report", 40, 70)

  ctx.font = "16px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
  ctx.fillStyle = "#64748b"
  ctx.fillText(`Generated: ${new Date().toLocaleDateString("en-NG")}`, 40, 110)

  let yPosition = 160

  const cardWidth = 320
  const cardHeight = 120
  const cardGap = 40

  ctx.fillStyle = "#f0fdf4"
  ctx.fillRect(40, yPosition, cardWidth, cardHeight)
  ctx.strokeStyle = "#10b981"
  ctx.lineWidth = 2
  ctx.strokeRect(40, yPosition, cardWidth, cardHeight)

  ctx.fillStyle = "#10b981"
  ctx.font = "14px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
  ctx.fillText("Total Income", 60, yPosition + 30)

  ctx.font = "bold 32px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
  ctx.fillStyle = "#059669"
  ctx.fillText(`₦${totalIncome.toLocaleString("en-NG")}`, 60, yPosition + 70)

  ctx.fillStyle = "#fef2f2"
  ctx.fillRect(40 + cardWidth + cardGap, yPosition, cardWidth, cardHeight)
  ctx.strokeStyle = "#ef4444"
  ctx.lineWidth = 2
  ctx.strokeRect(40 + cardWidth + cardGap, yPosition, cardWidth, cardHeight)

  ctx.fillStyle = "#ef4444"
  ctx.font = "14px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
  ctx.fillText("Total Expenses", 60 + cardWidth + cardGap, yPosition + 30)

  ctx.font = "bold 32px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
  ctx.fillStyle = "#dc2626"
  ctx.fillText(`₦${totalExpenses.toLocaleString("en-NG")}`, 60 + cardWidth + cardGap, yPosition + 70)

  // Balance card
  ctx.fillStyle = "#eff6ff"
  ctx.fillRect(40 + (cardWidth + cardGap) * 2, yPosition, cardWidth, cardHeight)
  ctx.strokeStyle = "#3b82f6"
  ctx.lineWidth = 2
  ctx.strokeRect(40 + (cardWidth + cardGap) * 2, yPosition, cardWidth, cardHeight)

  ctx.fillStyle = "#3b82f6"
  ctx.font = "14px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
  ctx.fillText("Balance", 60 + (cardWidth + cardGap) * 2, yPosition + 30)

  ctx.font = "bold 32px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
  ctx.fillStyle = "#1d4ed8"
  ctx.fillText(`₦${balance.toLocaleString("en-NG")}`, 60 + (cardWidth + cardGap) * 2, yPosition + 70)

  // Transactions section
  yPosition += 200

  // Draw table header
  ctx.fillStyle = "#1e293b"
  ctx.font = "bold 14px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
  ctx.fillText("Recent Transactions", 40, yPosition)

  yPosition += 40

  ctx.fillStyle = "#64748b"
  ctx.font = "bold 12px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
  ctx.fillText("Date", 50, yPosition)
  ctx.fillText("Type", 200, yPosition)
  ctx.fillText("Category", 350, yPosition)
  ctx.fillText("Amount", 900, yPosition)

  yPosition += 25

  transactions.slice(0, 20).forEach((transaction, index) => {
    const rowY = yPosition + index * 40

    if (index % 2 === 0) {
      ctx.fillStyle = "#f8fafc"
      ctx.fillRect(40, rowY - 15, width - 80, 35)
    }

    ctx.strokeStyle = "#e2e8f0"
    ctx.lineWidth = 1
    ctx.strokeRect(40, rowY - 15, width - 80, 35)

    ctx.fillStyle = "#1e293b"
    ctx.font = "12px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    ctx.fillText(new Date(transaction.date).toLocaleDateString("en-NG"), 50, rowY)
    ctx.fillText(transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1), 200, rowY)
    ctx.fillText(transaction.category, 350, rowY)

    ctx.fillStyle = transaction.type === "income" ? "#10b981" : "#ef4444"
    ctx.font = "bold 12px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    ctx.fillText(`₦${transaction.amount.toLocaleString("en-NG")}`, 900, rowY)
  })

  canvas.toBlob((blob) => {
    if (!blob) {
      alert("Could not create image")
      return
    }

    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)

    link.setAttribute("href", url)
    link.setAttribute("download", filename)
    link.style.visibility = "hidden"

    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    URL.revokeObjectURL(url)
  }, "image/png")
}
