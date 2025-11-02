"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Download, ImageIcon } from "lucide-react"
import type { Transaction } from "@/app/page"
import { exportTransactionsToCSV, exportTransactionsToImage } from "@/lib/export-utils"

interface ExportModalProps {
    isOpen: boolean
    onClose: () => void
    transactions: Transaction[]
}

export default function ExportModal({ isOpen, onClose, transactions }: ExportModalProps) {
    const [isExporting, setIsExporting] = useState(false)

    const handleExportCSV = async () => {
        setIsExporting(true)
        const filename = `naira-tracker-${new Date().toISOString().split("T")[0]}.csv`
        exportTransactionsToCSV(transactions, filename)
        setTimeout(() => {
            setIsExporting(false)
            onClose()
        }, 500)
    }

    const handleExportImage = async () => {
        setIsExporting(true)
        const filename = `naira-tracker-${new Date().toISOString().split("T")[0]}.png`
        exportTransactionsToImage(transactions, filename)
        setTimeout(() => {
            setIsExporting(false)
            onClose()
        }, 1000)
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md bg-background border-border/50 shadow-2xl">
                <DialogHeader>
                    <DialogTitle className="text-lg font-bold">Export Transactions</DialogTitle>
                </DialogHeader>

                <div className="space-y-3">
                    <p className="text-sm text-muted-foreground">Choose your preferred format to download your financial data</p>

                    {/* CSV Export Option */}
                    <button
                        onClick={handleExportCSV}
                        disabled={isExporting}
                        className="w-full p-4 rounded-lg border border-border/50 bg-secondary/30 hover:bg-secondary/60 transition-all duration-200 text-left group disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 mt-1 p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                                <Download className="h-5 w-5 text-primary" />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-semibold text-foreground">Export as CSV</h3>
                                <p className="text-sm text-muted-foreground mt-1">
                                    Spreadsheet format for Excel, Sheets, or data analysis
                                </p>
                            </div>
                        </div>
                    </button>

                    {/* Image Export Option */}
                    <button
                        onClick={handleExportImage}
                        disabled={isExporting}
                        className="w-full p-4 rounded-lg border border-border/50 bg-secondary/30 hover:bg-secondary/60 transition-all duration-200 text-left group disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 mt-1 p-2 rounded-lg bg-accent/10 group-hover:bg-accent/20 transition-colors">
                                <ImageIcon className="h-5 w-5 text-accent" />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-semibold text-foreground">Export as Image</h3>
                                <p className="text-sm text-muted-foreground mt-1">Beautiful PNG report for sharing or printing</p>
                            </div>
                        </div>
                    </button>

                    <div className="pt-2 flex gap-2">
                        <Button
                            onClick={onClose}
                            variant="outline"
                            className="flex-1 bg-transparent border-border/50 hover:bg-muted/50"
                            disabled={isExporting}
                        >
                            Cancel
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
