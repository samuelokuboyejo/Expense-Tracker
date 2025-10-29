"use client"

import type { Transaction } from "@/app/page"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trash2, ArrowUpRight, ArrowDownLeft } from "lucide-react"

interface TransactionListProps {
  transactions: Transaction[]
  onDelete: (id: string) => void
}

export default function TransactionList({ transactions, onDelete }: TransactionListProps) {
  const sortedTransactions = [...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return (
    <Card className="card-modern border-0 animate-fade-in">
      <CardHeader className="pb-4 bg-gradient-to-r from-primary/5 to-accent/5">
        <CardTitle className="text-lg font-bold">Recent Transactions</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        {sortedTransactions.length > 0 ? (
          <div className="space-y-3">
            {sortedTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between rounded-xl border border-border/50 p-4 hover:bg-muted/50 hover:shadow-md hover:border-border transition-all duration-300 group bg-gradient-to-r from-transparent to-secondary/20"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2.5 rounded-lg transition-all duration-200 ${
                        transaction.type === "income"
                          ? "bg-primary/20 group-hover:bg-primary/30"
                          : "bg-accent/20 group-hover:bg-accent/30"
                      }`}
                    >
                      {transaction.type === "income" ? (
                        <ArrowDownLeft className={`h-4 w-4 text-primary`} />
                      ) : (
                        <ArrowUpRight className={`h-4 w-4 text-accent`} />
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{transaction.category}</p>
                      {transaction.notes && <p className="text-sm text-muted-foreground">{transaction.notes}</p>}
                      <p className="text-xs text-muted-foreground">
                        {new Date(transaction.date).toLocaleDateString("en-NG")}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span
                    className={`font-bold text-lg transition-colors duration-200 ${
                      transaction.type === "income" ? "text-primary" : "text-accent"
                    }`}
                  >
                    {transaction.type === "income" ? "+" : "-"}₦{transaction.amount.toLocaleString("en-NG")}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(transaction.id)}
                    className="text-muted-foreground hover:text-accent opacity-0 group-hover:opacity-100 transition-all duration-200 h-8 w-8 p-0"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex h-32 items-center justify-center text-muted-foreground">
            <p>No transactions yet. Start by adding income or expenses!</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
