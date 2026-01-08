"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import {
  FileText,
  TrendingUp,
  TrendingDown,
  Calendar,
  Wallet,
  PiggyBank,
  Heart,
  ArrowLeft,
  Plus,
  Filter,
  Download,
  Mic,
  Upload,
  Sparkles as SparklesIcon,
  CheckCircle2,
  Edit,
  Save,
  X,
} from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useRouter } from "next/navigation"

interface AccountingRecord {
  id: string
  date: string
  description: string
  amount: number
  type: "income" | "expense"
  category: string
  subCategory: string
}

// 記帳案例數據
const sampleAccountingData = [
  {
    id: "1",
    date: new Date().toISOString().split("T")[0],
    description: "早餐店營業收入",
    amount: 3500,
    type: "income" as const,
    category: "生意收入",
    subCategory: "商品銷售收入",
  },
  {
    id: "2",
    date: new Date(Date.now() - 86400000).toISOString().split("T")[0],
    description: "購買咖啡豆原料",
    amount: 2500,
    type: "expense" as const,
    category: "生意支出",
    subCategory: "原料",
  },
  {
    id: "3",
    date: new Date(Date.now() - 86400000).toISOString().split("T")[0],
    description: "買菜",
    amount: 800,
    type: "expense" as const,
    category: "生活支出",
    subCategory: "食",
  },
  {
    id: "4",
    date: new Date(Date.now() - 2 * 86400000).toISOString().split("T")[0],
    description: "正職工作薪資",
    amount: 40000,
    type: "income" as const,
    category: "生活收入",
    subCategory: "薪資收入",
  },
  {
    id: "5",
    date: new Date(Date.now() - 2 * 86400000).toISOString().split("T")[0],
    description: "房租",
    amount: 15000,
    type: "expense" as const,
    category: "生活支出",
    subCategory: "住",
  },
  {
    id: "6",
    date: new Date(Date.now() - 3 * 86400000).toISOString().split("T")[0],
    description: "日本家庭旅遊儲蓄",
    amount: 5000,
    type: "expense" as const,
    category: "生活支出",
    subCategory: "儲蓄",
  },
  {
    id: "7",
    date: new Date(Date.now() - 3 * 86400000).toISOString().split("T")[0],
    description: "緊急預備金儲蓄",
    amount: 3000,
    type: "expense" as const,
    category: "生活支出",
    subCategory: "儲蓄",
  },
  {
    id: "8",
    date: new Date(Date.now() - 4 * 86400000).toISOString().split("T")[0],
    description: "孩子才藝課程儲蓄",
    amount: 2000,
    type: "expense" as const,
    category: "生活支出",
    subCategory: "儲蓄",
  },
  {
    id: "9",
    date: new Date(Date.now() - 5 * 86400000).toISOString().split("T")[0],
    description: "手機月租費",
    amount: 599,
    type: "expense" as const,
    category: "生活支出",
    subCategory: "電信",
  },
  {
    id: "10",
    date: new Date(Date.now() - 5 * 86400000).toISOString().split("T")[0],
    description: "早餐店包材費用",
    amount: 1200,
    type: "expense" as const,
    category: "生意支出",
    subCategory: "包材",
  },
]

export default function RecordsPage() {
  const router = useRouter()
  const [records, setRecords] = useState<AccountingRecord[]>([])
  const [filterMonth, setFilterMonth] = useState<string>("all")
  const [filterType, setFilterType] = useState<string>("all")
  const [wishes, setWishes] = useState<any[]>([])
  const [availableSavings, setAvailableSavings] = useState(0)
  const [monthlyExpenses, setMonthlyExpenses] = useState(0)
  const [emergencyTarget, setEmergencyTarget] = useState(0)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [recordingMethod, setRecordingMethod] = useState<string | null>(null)
  const [isRecording, setIsRecording] = useState(false)
  const [transcriptionText, setTranscriptionText] = useState<string>("")
  const [recordingComplete, setRecordingComplete] = useState(false)
  const [uploadSuccess, setUploadSuccess] = useState(false)
  
  // 編輯狀態
  const [editingWishId, setEditingWishId] = useState<string | null>(null)
  const [editingEmergency, setEditingEmergency] = useState(false)
  const [editingRecordId, setEditingRecordId] = useState<string | null>(null)
  
  // 編輯中的數據
  const [editingWishData, setEditingWishData] = useState<any>(null)
  const [editingEmergencyAmount, setEditingEmergencyAmount] = useState(0)
  const [editingRecordData, setEditingRecordData] = useState<AccountingRecord | null>(null)

  // 處理記帳數據
  const processAccountingData = (content: string) => {
    const existingRecords = localStorage.getItem("accountingRecords")
    let allRecords = existingRecords ? JSON.parse(existingRecords) : []
    
    // 獲取現有記錄的最大 id，確保新記錄的 id 唯一
    const maxId = allRecords.length > 0 
      ? Math.max(...allRecords.map((r: AccountingRecord) => parseInt(r.id) || 0))
      : 0
    
    // 為新記錄生成唯一的 id（使用時間戳 + 索引）
    const timestamp = Date.now()
    const newRecords = sampleAccountingData.map((record, index) => ({
      ...record,
      id: `${timestamp}-${index}`,
    }))
    
    // 添加新記錄（案例數據）
    allRecords = [...allRecords, ...newRecords]
    
    // 保存到 localStorage
    localStorage.setItem("accountingRecords", JSON.stringify(allRecords))
    setRecords(allRecords)
    
    // 更新願望的已完成金額（如果有相關儲蓄）
    const wishesStr = localStorage.getItem("wishes")
    if (wishesStr) {
      try {
        const wishes = JSON.parse(wishesStr)
        const updatedWishes = wishes.map((wish: any) => {
          const relatedSavings = sampleAccountingData.filter(
            (r) => r.description.includes(wish.name) && r.subCategory === "儲蓄"
          )
          if (relatedSavings.length > 0) {
            const additionalAmount = relatedSavings.reduce((sum, r) => sum + r.amount, 0)
            const currentSaved = parseFloat(wish.currentSaved ? wish.currentSaved.replace(/,/g, "") : "0")
            const newSaved = currentSaved + additionalAmount
            return {
              ...wish,
              currentSaved: newSaved.toLocaleString("zh-TW"),
            }
          }
          return wish
        })
        localStorage.setItem("wishes", JSON.stringify(updatedWishes))
        setWishes(updatedWishes)
      } catch (e) {
        console.error("Error updating wishes", e)
      }
    }
    
    // 更新可動用存款（如果有緊急預備金儲蓄）
    const emergencySavings = sampleAccountingData.filter(
      (r) => r.description.includes("緊急預備金") && r.subCategory === "儲蓄"
    )
    if (emergencySavings.length > 0) {
      const additionalAmount = emergencySavings.reduce((sum, r) => sum + r.amount, 0)
      const currentSavings = parseFloat(localStorage.getItem("availableSavings") || "0")
      const newSavings = currentSavings + additionalAmount
      localStorage.setItem("availableSavings", newSavings.toString())
      setAvailableSavings(newSavings)
    }
    
    setUploadSuccess(true)
    setTimeout(() => {
      setUploadSuccess(false)
      setIsDialogOpen(false)
      setRecordingMethod(null)
      setRecordingComplete(false)
      setTranscriptionText("")
      // 重新載入數據
      window.location.reload()
    }, 2000)
  }

  // 從 localStorage 讀取記帳記錄
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("accountingRecords")
      if (saved) {
        try {
          const parsedRecords = JSON.parse(saved)
          // 確保所有記錄都有唯一的 id
          const recordsWithUniqueIds = parsedRecords.map((record: AccountingRecord, index: number) => {
            // 如果 id 不存在或為空，生成一個新的唯一 id
            if (!record.id || record.id.trim() === "") {
              return {
                ...record,
                id: `record-${Date.now()}-${index}`,
              }
            }
            // 檢查是否有重複的 id，如果有則生成新的
            const duplicateCount = parsedRecords.slice(0, index).filter((r: AccountingRecord) => r.id === record.id).length
            if (duplicateCount > 0) {
              return {
                ...record,
                id: `${record.id}-${duplicateCount + 1}`,
              }
            }
            return record
          })
          setRecords(recordsWithUniqueIds)
          // 如果有修改，更新 localStorage
          if (JSON.stringify(recordsWithUniqueIds) !== JSON.stringify(parsedRecords)) {
            localStorage.setItem("accountingRecords", JSON.stringify(recordsWithUniqueIds))
          }
        } catch (e) {
          console.error("Error parsing accounting records", e)
        }
      }

      // 讀取願望數據
      const wishesStr = localStorage.getItem("wishes")
      if (wishesStr) {
        try {
          const parsed = JSON.parse(wishesStr)
          setWishes(parsed.filter((w: any) => w.name && w.name.trim() !== ""))
        } catch (e) {
          console.error("Error parsing wishes", e)
        }
      }

      // 讀取可動用存款
      const savings = localStorage.getItem("availableSavings")
      if (savings) {
        setAvailableSavings(parseFloat(savings) || 0)
      }

      // 讀取每月支出（用於計算緊急預備金）
      const step2DataStr = localStorage.getItem("step2Data")
      if (step2DataStr) {
        try {
          const step2Data = JSON.parse(step2DataStr)
          const fixedExpenses = step2Data.fixedExpenses || {}
          const variableExpenses = step2Data.variableExpenses || {}
          const businessVariableExpenses = step2Data.hasBusiness ? (step2Data.businessVariableExpenses || {}) : {}
          const businessFixedExpenses = step2Data.hasBusiness ? (step2Data.businessFixedExpenses || {}) : {}
          const businessExtraExpenses = step2Data.hasBusiness ? (step2Data.businessExtraExpenses || {}) : {}

          const totalFixedExpenses =
            parseFloat(fixedExpenses.housing || "0") +
            parseFloat(fixedExpenses.telecom || "0") +
            parseFloat(fixedExpenses.repayment || "0") +
            parseFloat(fixedExpenses.insurance || "0") +
            parseFloat(fixedExpenses.savings || "0")

          const totalVariableExpenses =
            parseFloat(variableExpenses.food || "0") +
            parseFloat(variableExpenses.clothing || "0") +
            parseFloat(variableExpenses.transportation || "0") +
            parseFloat(variableExpenses.education || "0") +
            parseFloat(variableExpenses.entertainment || "0") +
            parseFloat(variableExpenses.medical || "0") +
            parseFloat(variableExpenses.other || "0")

          const totalBusinessFixedExpenses = step2Data.hasBusiness
            ? parseFloat(businessFixedExpenses.rent || "0") +
              parseFloat(businessFixedExpenses.personnel || "0") +
              parseFloat(businessFixedExpenses.utilities || "0") +
              parseFloat(businessFixedExpenses.gas || "0") +
              parseFloat(businessFixedExpenses.communication || "0") +
              parseFloat(businessFixedExpenses.repayment || "0") +
              parseFloat(businessFixedExpenses.other || "0")
            : 0

          const totalBusinessVariableExpenses = step2Data.hasBusiness
            ? parseFloat(businessVariableExpenses.materials || "0") +
              parseFloat(businessVariableExpenses.packaging || "0") +
              parseFloat(businessVariableExpenses.supplies || "0") +
              parseFloat(businessVariableExpenses.shipping || "0") +
              parseFloat(businessVariableExpenses.other || "0")
            : 0

          const totalBusinessExtraExpenses = step2Data.hasBusiness
            ? parseFloat(businessExtraExpenses.equipment || "0") +
              parseFloat(businessExtraExpenses.repair || "0") +
              parseFloat(businessExtraExpenses.marketing || "0") +
              parseFloat(businessExtraExpenses.other || "0")
            : 0

          const totalExpenses =
            totalFixedExpenses +
            totalVariableExpenses +
            totalBusinessFixedExpenses +
            totalBusinessVariableExpenses +
            totalBusinessExtraExpenses

          setMonthlyExpenses(totalExpenses)
          setEmergencyTarget(totalExpenses * 6)
        } catch (e) {
          console.error("Error parsing step2Data", e)
        }
      }
    }
  }, [])

  // 計算統計數據
  const filteredRecords = records.filter((record) => {
    if (filterMonth !== "all") {
      const recordMonth = new Date(record.date).toLocaleDateString("zh-TW", { year: "numeric", month: "2-digit" })
      if (recordMonth !== filterMonth) return false
    }
    if (filterType !== "all") {
      if (filterType === "income" && record.type !== "income") return false
      if (filterType === "expense" && record.type !== "expense") return false
    }
    return true
  })

  const totalIncome = filteredRecords
    .filter((r) => r.type === "income")
    .reduce((sum, r) => sum + r.amount, 0)
  const totalExpense = filteredRecords
    .filter((r) => r.type === "expense")
    .reduce((sum, r) => sum + r.amount, 0)
  const netCashFlow = totalIncome - totalExpense

  // 計算夢想完成狀況（根據記帳記錄更新）
  const wishesWithProgress = wishes.map((wish) => {
    const targetAmount = parseFloat(wish.cost ? wish.cost.replace(/,/g, "") : "0")
    const currentSaved = parseFloat(wish.currentSaved ? wish.currentSaved.replace(/,/g, "") : "0")
    
    // 從記帳記錄中找出與此夢想相關的儲蓄記錄
    const relatedSavings = filteredRecords.filter(
      (r) => r.type === "expense" && r.subCategory === "儲蓄" && r.description.includes(wish.name)
    )
    const additionalSaved = relatedSavings.reduce((sum, r) => sum + r.amount, 0)
    
    const totalSaved = currentSaved + additionalSaved
    const progress = targetAmount > 0 ? (totalSaved / targetAmount) * 100 : 0
    const stillNeeded = Math.max(0, targetAmount - totalSaved)

    return {
      ...wish,
      targetAmount,
      currentSaved: totalSaved,
      progress: Math.min(100, Math.max(0, progress)),
      stillNeeded,
    }
  })

  // 計算緊急預備金狀況（根據記帳記錄更新）
  const emergencySavings = filteredRecords
    .filter((r) => r.type === "expense" && r.subCategory === "儲蓄" && r.description.includes("緊急預備金"))
    .reduce((sum, r) => sum + r.amount, 0)
  
  const totalEmergencySavings = availableSavings + emergencySavings
  const emergencyProgress = emergencyTarget > 0 ? (totalEmergencySavings / emergencyTarget) * 100 : 0
  const emergencyStillNeeded = Math.max(0, emergencyTarget - totalEmergencySavings)

  // 獲取可用的月份列表
  const availableMonths = Array.from(
    new Set(
      records.map((r) =>
        new Date(r.date).toLocaleDateString("zh-TW", { year: "numeric", month: "2-digit" })
      )
    )
  ).sort()

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-accent/20">
      <div className="container mx-auto px-4 py-8 md:py-12 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <Link href="/step6">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl md:text-5xl font-bold text-foreground">記帳記錄</h1>
                <p className="text-muted-foreground mt-2">查看您的記帳歷史與財務狀況</p>
              </div>
            </div>
            <Button size="lg" className="px-6" onClick={() => setIsDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              新增記帳
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {/* 總收入 */}
          <Card className="p-6 bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/20">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              <span className="text-sm text-muted-foreground">總收入</span>
            </div>
            <p className="text-2xl font-bold text-foreground">NT$ {totalIncome.toLocaleString()}</p>
          </Card>

          {/* 總支出 */}
          <Card className="p-6 bg-gradient-to-br from-red-500/10 to-orange-500/10 border-red-500/20">
            <div className="flex items-center gap-3 mb-2">
              <TrendingDown className="w-5 h-5 text-red-600" />
              <span className="text-sm text-muted-foreground">總支出</span>
            </div>
            <p className="text-2xl font-bold text-foreground">NT$ {totalExpense.toLocaleString()}</p>
          </Card>

          {/* 淨現金流 */}
          <Card className="p-6 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-500/20">
            <div className="flex items-center gap-3 mb-2">
              <Wallet className="w-5 h-5 text-blue-600" />
              <span className="text-sm text-muted-foreground">淨現金流</span>
            </div>
            <p className={`text-2xl font-bold ${netCashFlow >= 0 ? "text-green-600" : "text-red-600"}`}>
              NT$ {netCashFlow.toLocaleString()}
            </p>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* 夢想完成狀況 */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <Heart className="w-6 h-6 text-primary" />
              <h2 className="text-xl font-semibold text-foreground">夢想完成狀況</h2>
            </div>
            <div className="space-y-4">
              {wishesWithProgress.length > 0 ? (
                wishesWithProgress.map((wish) => {
                  const isEditing = editingWishId === (wish.id || wish.name)
                  const wishData = isEditing ? editingWishData : wish
                  const currentSavedValue = isEditing 
                    ? (editingWishData?.currentSaved || 0)
                    : wish.currentSaved
                  const progress = wish.targetAmount > 0 ? (currentSavedValue / wish.targetAmount) * 100 : 0
                  const stillNeeded = Math.max(0, wish.targetAmount - currentSavedValue)

                  return (
                    <div key={wish.id || wish.name} className="p-4 rounded-lg bg-accent/20 border border-border">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h3 className="font-medium text-foreground">{wish.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            目標：NT$ {wish.targetAmount.toLocaleString()}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-primary">
                            {Math.round(progress)}%
                          </span>
                          {!isEditing ? (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => {
                                setEditingWishId(wish.id || wish.name)
                                setEditingWishData({ ...wish, currentSaved: wish.currentSaved })
                              }}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                          ) : (
                            <div className="flex gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-green-600 hover:text-green-700"
                                onClick={() => {
                                  // 保存修改
                                  const updatedWishes = wishes.map((w: any) => {
                                    if ((w.id || w.name) === (wish.id || wish.name)) {
                                      return {
                                        ...w,
                                        currentSaved: editingWishData.currentSaved.toLocaleString("zh-TW"),
                                      }
                                    }
                                    return w
                                  })
                                  localStorage.setItem("wishes", JSON.stringify(updatedWishes))
                                  setWishes(updatedWishes)
                                  setEditingWishId(null)
                                  setEditingWishData(null)
                                }}
                              >
                                <Save className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-red-600 hover:text-red-700"
                                onClick={() => {
                                  setEditingWishId(null)
                                  setEditingWishData(null)
                                }}
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                      {isEditing ? (
                        <div className="space-y-2">
                          <Label htmlFor={`wish-${wish.id}`} className="text-xs">已完成金額</Label>
                          <Input
                            id={`wish-${wish.id}`}
                            type="number"
                            value={editingWishData.currentSaved}
                            onChange={(e) => {
                              const value = parseFloat(e.target.value) || 0
                              setEditingWishData({ ...editingWishData, currentSaved: value })
                            }}
                            className="w-full"
                          />
                        </div>
                      ) : (
                        <>
                          <Progress value={progress} className="mb-2 h-2" />
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>已完成：NT$ {currentSavedValue.toLocaleString()}</span>
                            {stillNeeded > 0 && (
                              <span>還需要：NT$ {stillNeeded.toLocaleString()}</span>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  )
                })
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  尚未設定夢想，請先完成夢想規劃
                </p>
              )}
            </div>
          </Card>

          {/* 緊急預備金狀況 */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <PiggyBank className="w-6 h-6 text-primary" />
                <h2 className="text-xl font-semibold text-foreground">緊急預備金狀況</h2>
              </div>
              {!editingEmergency ? (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => {
                    setEditingEmergency(true)
                    setEditingEmergencyAmount(totalEmergencySavings)
                  }}
                >
                  <Edit className="w-4 h-4" />
                </Button>
              ) : (
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-green-600 hover:text-green-700"
                    onClick={() => {
                      // 保存修改
                      localStorage.setItem("availableSavings", editingEmergencyAmount.toString())
                      setAvailableSavings(editingEmergencyAmount)
                      setEditingEmergency(false)
                    }}
                  >
                    <Save className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-red-600 hover:text-red-700"
                    onClick={() => {
                      setEditingEmergency(false)
                    }}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>
            <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-muted-foreground">目標金額</span>
                <span className="text-sm font-medium text-foreground">
                  NT$ {emergencyTarget.toLocaleString()}
                </span>
              </div>
              {editingEmergency ? (
                <div className="space-y-2 mb-4">
                  <Label htmlFor="emergency-amount" className="text-xs">目前金額</Label>
                  <Input
                    id="emergency-amount"
                    type="number"
                    value={editingEmergencyAmount}
                    onChange={(e) => {
                      setEditingEmergencyAmount(parseFloat(e.target.value) || 0)
                    }}
                    className="w-full"
                  />
                </div>
              ) : (
                <>
                  <Progress value={emergencyProgress} className="mb-2 h-3" />
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-sm text-muted-foreground">目前金額</span>
                    <span className="text-lg font-bold text-primary">
                      NT$ {totalEmergencySavings.toLocaleString()}
                    </span>
                  </div>
                </>
              )}
              {(() => {
                const currentAmount = editingEmergency ? editingEmergencyAmount : totalEmergencySavings
                const stillNeeded = Math.max(0, emergencyTarget - currentAmount)
                const progress = emergencyTarget > 0 ? (currentAmount / emergencyTarget) * 100 : 0
                
                if (!editingEmergency) {
                  return emergencyStillNeeded > 0 ? (
                    <div className="p-3 rounded-lg bg-orange-50 border border-orange-200">
                      <p className="text-sm text-orange-800">
                        還需要 NT$ {emergencyStillNeeded.toLocaleString()} 才能達成目標
                      </p>
                    </div>
                  ) : (
                    <div className="p-3 rounded-lg bg-green-50 border border-green-200">
                      <p className="text-sm text-green-800">✓ 緊急預備金已達成目標</p>
                    </div>
                  )
                } else {
                  return stillNeeded > 0 ? (
                    <div className="p-3 rounded-lg bg-orange-50 border border-orange-200">
                      <p className="text-sm text-orange-800">
                        還需要 NT$ {stillNeeded.toLocaleString()} 才能達成目標
                      </p>
                    </div>
                  ) : (
                    <div className="p-3 rounded-lg bg-green-50 border border-green-200">
                      <p className="text-sm text-green-800">✓ 緊急預備金已達成目標</p>
                    </div>
                  )
                }
              })()}
            </div>
          </Card>
        </div>

        {/* 記帳記錄列表 */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <FileText className="w-6 h-6 text-primary" />
              <h2 className="text-xl font-semibold text-foreground">記帳記錄</h2>
            </div>
            <div className="flex gap-2">
              <Select value={filterMonth} onValueChange={setFilterMonth}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="選擇月份" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部月份</SelectItem>
                  {availableMonths.map((month) => (
                    <SelectItem key={month} value={month}>
                      {month}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="收入/支出" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部</SelectItem>
                  <SelectItem value="income">收入</SelectItem>
                  <SelectItem value="expense">支出</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {filteredRecords.length > 0 ? (
            <div className="space-y-2">
              {filteredRecords.map((record, index) => {
                const isEditing = editingRecordId === record.id
                const recordData = isEditing ? editingRecordData : record

                return (
                  <div
                    key={`${record.id}-${index}`}
                    className="p-4 rounded-lg border border-border hover:bg-accent/20 transition-colors"
                  >
                    {isEditing ? (
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <Label htmlFor={`record-date-${record.id}`} className="text-xs">日期</Label>
                            <Input
                              id={`record-date-${record.id}`}
                              type="date"
                              value={editingRecordData?.date || ""}
                              onChange={(e) => {
                                setEditingRecordData({
                                  ...editingRecordData!,
                                  date: e.target.value,
                                })
                              }}
                              className="w-full"
                            />
                          </div>
                          <div>
                            <Label htmlFor={`record-amount-${record.id}`} className="text-xs">金額</Label>
                            <Input
                              id={`record-amount-${record.id}`}
                              type="number"
                              value={editingRecordData?.amount || 0}
                              onChange={(e) => {
                                setEditingRecordData({
                                  ...editingRecordData!,
                                  amount: parseFloat(e.target.value) || 0,
                                })
                              }}
                              className="w-full"
                            />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor={`record-desc-${record.id}`} className="text-xs">描述</Label>
                          <Input
                            id={`record-desc-${record.id}`}
                            type="text"
                            value={editingRecordData?.description || ""}
                            onChange={(e) => {
                              setEditingRecordData({
                                ...editingRecordData!,
                                description: e.target.value,
                              })
                            }}
                            className="w-full"
                          />
                        </div>
                        <div>
                          <Label htmlFor={`record-type-${record.id}`} className="text-xs">類型</Label>
                          <Select
                            value={editingRecordData?.type || "expense"}
                            onValueChange={(value: "income" | "expense") => {
                              setEditingRecordData({
                                ...editingRecordData!,
                                type: value,
                              })
                            }}
                          >
                            <SelectTrigger id={`record-type-${record.id}`} className="w-full">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="income">收入</SelectItem>
                              <SelectItem value="expense">支出</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <Label htmlFor={`record-category-${record.id}`} className="text-xs">主分類</Label>
                            <Input
                              id={`record-category-${record.id}`}
                              type="text"
                              value={editingRecordData?.category || ""}
                              onChange={(e) => {
                                setEditingRecordData({
                                  ...editingRecordData!,
                                  category: e.target.value,
                                })
                              }}
                              className="w-full"
                            />
                          </div>
                          <div>
                            <Label htmlFor={`record-subcategory-${record.id}`} className="text-xs">子分類</Label>
                            <Input
                              id={`record-subcategory-${record.id}`}
                              type="text"
                              value={editingRecordData?.subCategory || ""}
                              onChange={(e) => {
                                setEditingRecordData({
                                  ...editingRecordData!,
                                  subCategory: e.target.value,
                                })
                              }}
                              className="w-full"
                            />
                          </div>
                        </div>
                        <div className="flex gap-2 justify-end">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-green-600 hover:text-green-700"
                            onClick={() => {
                              // 保存修改
                              const updatedRecords = records.map((r) => {
                                if (r.id === record.id) {
                                  return editingRecordData!
                                }
                                return r
                              })
                              localStorage.setItem("accountingRecords", JSON.stringify(updatedRecords))
                              setRecords(updatedRecords)
                              setEditingRecordId(null)
                              setEditingRecordData(null)
                            }}
                          >
                            <Save className="w-4 h-4 mr-1" />
                            保存
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-700"
                            onClick={() => {
                              setEditingRecordId(null)
                              setEditingRecordData(null)
                            }}
                          >
                            <X className="w-4 h-4 mr-1" />
                            取消
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-1">
                            <Calendar className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">
                              {new Date(recordData.date).toLocaleDateString("zh-TW", {
                                year: "numeric",
                                month: "2-digit",
                                day: "2-digit",
                              })}
                            </span>
                            <span className="text-xs px-2 py-0.5 rounded bg-accent/50 text-muted-foreground">
                              {recordData.category} - {recordData.subCategory}
                            </span>
                          </div>
                          <p className="font-medium text-foreground">{recordData.description}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <p
                            className={`text-lg font-bold ${
                              recordData.type === "income" ? "text-green-600" : "text-red-600"
                            }`}
                          >
                            {recordData.type === "income" ? "+" : "-"}NT$ {recordData.amount.toLocaleString()}
                          </p>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => {
                              setEditingRecordId(record.id)
                              setEditingRecordData({ ...record })
                            }}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
              <p className="text-muted-foreground">尚無記帳記錄</p>
              <p className="text-sm text-muted-foreground mt-1">
                請前往首頁上傳帳務資訊或使用語音輸入記帳
              </p>
            </div>
          )}
        </Card>
      </div>
    </main>
  )
}

