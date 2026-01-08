"use client"

import { useState, useEffect, useMemo } from "react"
import * as React from "react"
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
  Trash2,
  CheckSquare,
} from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useRouter } from "next/navigation"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Line, LineChart, XAxis, YAxis, CartesianGrid, Legend } from "recharts"
import { toast } from "sonner"
import { PartyPopper, Bell, Clock, Mail } from "lucide-react"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

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

// 生成12個月的合理記帳數據（符合 step2 預設值）
// step2 預設：薪資 40,000, 副業 20,000, 總支出 50,000, 淨現金流 10,000
// 加上早餐店生意：每月約 100,000 收入，約 30,000 支出
const generateMonthlyRecords = (year: number, month: number): AccountingRecord[] => {
  const daysInMonth = new Date(year, month, 0).getDate()
  const records: AccountingRecord[] = []
  let recordId = 0

  // 1. 正職工作薪資（每月1日）
  records.push({
    id: `${year}-${month}-${++recordId}`,
    date: `${year}-${String(month).padStart(2, "0")}-01`,
    description: "正職工作薪資",
    amount: 40000,
    type: "income",
    category: "生活收入",
    subCategory: "薪資收入",
  })

  // 2. 副業收入（每月10日和20日，各10,000）
  records.push({
    id: `${year}-${month}-${++recordId}`,
    date: `${year}-${String(month).padStart(2, "0")}-10`,
    description: "副業收入",
    amount: 10000,
    type: "income",
    category: "生活收入",
    subCategory: "副業收入",
  })
  records.push({
    id: `${year}-${month}-${++recordId}`,
    date: `${year}-${String(month).padStart(2, "0")}-20`,
    description: "副業收入",
    amount: 10000,
    type: "income",
    category: "生活收入",
    subCategory: "副業收入",
  })

  // 3. 早餐店營業收入（每週2-3次，每次 3,000-4,500，每月約 100,000）
  const businessIncomeDays = [2, 5, 8, 12, 15, 18, 22, 25, 28]
  const businessIncomeAmounts = [3500, 3200, 3800, 4200, 3600, 4000, 3400, 4100, 3700]
  businessIncomeDays.forEach((day, idx) => {
    if (day <= daysInMonth) {
      records.push({
        id: `${year}-${month}-${++recordId}`,
        date: `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
        description: "早餐店營業收入",
        amount: businessIncomeAmounts[idx % businessIncomeAmounts.length],
        type: "income",
        category: "生意收入",
        subCategory: "商品銷售收入",
      })
    }
  })

  // 4. 生活固定支出
  // 房租（每月5日）
  records.push({
    id: `${year}-${month}-${++recordId}`,
    date: `${year}-${String(month).padStart(2, "0")}-05`,
    description: "房租",
    amount: 15000,
    type: "expense",
    category: "生活支出",
    subCategory: "住",
  })
  // 電信費（每月5日）
  records.push({
    id: `${year}-${month}-${++recordId}`,
    date: `${year}-${String(month).padStart(2, "0")}-05`,
    description: "手機月租費",
    amount: 3000,
    type: "expense",
    category: "生活支出",
    subCategory: "電信",
  })
  // 還款（每月10日）
  records.push({
    id: `${year}-${month}-${++recordId}`,
    date: `${year}-${String(month).padStart(2, "0")}-10`,
    description: "信用卡還款",
    amount: 3000,
    type: "expense",
    category: "生活支出",
    subCategory: "還款",
  })
  // 保險（每月15日）
  records.push({
    id: `${year}-${month}-${++recordId}`,
    date: `${year}-${String(month).padStart(2, "0")}-15`,
    description: "保險費",
    amount: 5000,
    type: "expense",
    category: "生活支出",
    subCategory: "保險(月繳)",
  })
  // 儲蓄（每月20日）
  records.push({
    id: `${year}-${month}-${++recordId}`,
    date: `${year}-${String(month).padStart(2, "0")}-20`,
    description: "定期儲蓄",
    amount: 1000,
    type: "expense",
    category: "生活支出",
    subCategory: "儲蓄",
  })

  // 5. 生活變動支出
  // 買菜（食）- 每週約 2,000，分4次
  const foodDays = [3, 7, 14, 21]
  foodDays.forEach((day) => {
    if (day <= daysInMonth) {
      records.push({
        id: `${year}-${month}-${++recordId}`,
        date: `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
        description: "買菜",
        amount: 2000,
        type: "expense",
        category: "生活支出",
        subCategory: "食",
      })
    }
  })
  // 衣（每月1次，約2,000）
  records.push({
    id: `${year}-${month}-${++recordId}`,
    date: `${year}-${String(month).padStart(2, "0")}-${String(Math.min(12, daysInMonth)).padStart(2, "0")}`,
    description: "購買衣物",
    amount: 2000,
    type: "expense",
    category: "生活支出",
    subCategory: "衣",
  })
  // 行（加油、交通費，每月2-3次，約3,000）
  const transportDays = [6, 16, 26]
  transportDays.forEach((day) => {
    if (day <= daysInMonth) {
      records.push({
        id: `${year}-${month}-${++recordId}`,
        date: `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
        description: "加油費",
        amount: 1000,
        type: "expense",
        category: "生活支出",
        subCategory: "行",
      })
    }
  })
  // 育（每月1次，約5,000）
  records.push({
    id: `${year}-${month}-${++recordId}`,
    date: `${year}-${String(month).padStart(2, "0")}-${String(Math.min(18, daysInMonth)).padStart(2, "0")}`,
    description: "孩子教育費",
    amount: 5000,
    type: "expense",
    category: "生活支出",
    subCategory: "育",
  })
  // 樂（每月1次，約2,000）
  records.push({
    id: `${year}-${month}-${++recordId}`,
    date: `${year}-${String(month).padStart(2, "0")}-${String(Math.min(25, daysInMonth)).padStart(2, "0")}`,
    description: "娛樂支出",
    amount: 2000,
    type: "expense",
    category: "生活支出",
    subCategory: "樂",
  })
  // 醫療（每月1次，約2,000）
  records.push({
    id: `${year}-${month}-${++recordId}`,
    date: `${year}-${String(month).padStart(2, "0")}-${String(Math.min(22, daysInMonth)).padStart(2, "0")}`,
    description: "醫療費用",
    amount: 2000,
    type: "expense",
    category: "生活支出",
    subCategory: "醫療",
  })
  // 其他（每月1次，約1,000）
  records.push({
    id: `${year}-${month}-${++recordId}`,
    date: `${year}-${String(month).padStart(2, "0")}-${String(Math.min(28, daysInMonth)).padStart(2, "0")}`,
    description: "其他支出",
    amount: 1000,
    type: "expense",
    category: "生活支出",
    subCategory: "其他",
  })

  // 6. 夢想儲蓄（每月1次，更合理的頻率）
  // 檢查夢想是否已完成（根據預設數據：日本家庭旅遊 150,000，已完成 10,000；孩子才藝課程 30,000，已完成 15,000）
  // 計算到當前月份為止的累積儲蓄
  const monthsBefore = (year - 2024) * 12 + (month - 1)
  const japanTourSaved = 10000 + (monthsBefore * 5000) // 初始 10,000 + 每月 5,000
  const japanTourTarget = 150000
  const japanTourCompleted = japanTourSaved >= japanTourTarget
  
  const talentCourseSaved = 15000 + (monthsBefore * 2000) // 初始 15,000 + 每月 2,000
  const talentCourseTarget = 30000
  const talentCourseCompleted = talentCourseSaved >= talentCourseTarget
  
  // 夢想儲蓄改為每月1次（每月20日統一儲蓄）
  // 只有未完成的夢想才生成儲蓄記錄
  if (!japanTourCompleted) {
    records.push({
      id: `${year}-${month}-${++recordId}`,
      date: `${year}-${String(month).padStart(2, "0")}-20`,
      description: "日本家庭旅遊儲蓄",
      amount: 5000,
      type: "expense",
      category: "生活支出",
      subCategory: "儲蓄",
    })
  }
  
  // 緊急預備金儲蓄（每月1次）
  records.push({
    id: `${year}-${month}-${++recordId}`,
    date: `${year}-${String(month).padStart(2, "0")}-20`,
    description: "緊急預備金儲蓄",
    amount: 3000,
    type: "expense",
    category: "生活支出",
    subCategory: "儲蓄",
  })
  
  if (!talentCourseCompleted) {
    records.push({
      id: `${year}-${month}-${++recordId}`,
      date: `${year}-${String(month).padStart(2, "0")}-20`,
      description: "孩子才藝課程儲蓄",
      amount: 2000,
      type: "expense",
      category: "生活支出",
      subCategory: "儲蓄",
    })
  }

  // 7. 早餐店支出
  // 原料（每月2-3次，約 25,000）
  const materialDays = [4, 13, 24]
  const materialAmounts = [8500, 9000, 7500]
  materialDays.forEach((day, idx) => {
    if (day <= daysInMonth) {
      records.push({
        id: `${year}-${month}-${++recordId}`,
        date: `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
        description: "購買咖啡豆原料",
        amount: materialAmounts[idx],
        type: "expense",
        category: "生意支出",
        subCategory: "原料",
      })
    }
  })
  // 包材（每月2次，約 2,500）
  const packagingDays = [9, 23]
  packagingDays.forEach((day) => {
    if (day <= daysInMonth) {
      records.push({
        id: `${year}-${month}-${++recordId}`,
        date: `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
        description: "早餐店包材費用",
        amount: 1250,
        type: "expense",
        category: "生意支出",
        subCategory: "包材",
      })
    }
  })

  return records
}

// 生成2025年12月15日到2026年1月7日的模擬數據（demo用）
const generateDemoData = (): AccountingRecord[] => {
  const allRecords: AccountingRecord[] = []
  
  // 2025年12月15-31日的數據
  const dec2025Records = generateMonthlyRecords(2025, 12)
  const dec2025Filtered = dec2025Records.filter((record) => {
    const day = parseInt(record.date.split("-")[2])
    return day >= 15 // 只保留15日及之後的記錄
  })
  allRecords.push(...dec2025Filtered)
  
  // 2026年1月1-7日的數據
  const jan2026Records = generateMonthlyRecords(2026, 1)
  const jan2026Filtered = jan2026Records.filter((record) => {
    const day = parseInt(record.date.split("-")[2])
    return day <= 7 // 只保留1-7日的記錄
  })
  allRecords.push(...jan2026Filtered)
  
  return allRecords
}

const decemberSampleData = generateDemoData()

export default function RecordsPage() {
  const router = useRouter()
  const [records, setRecords] = useState<AccountingRecord[]>([])
  const [filterMonth, setFilterMonth] = useState<string>("all")
  const [filterType, setFilterType] = useState<string>("all")
  const [searchText, setSearchText] = useState<string>("")
  const [filterCategory, setFilterCategory] = useState<string>("all")
  const [filterSubCategory, setFilterSubCategory] = useState<string>("all")
  
  // 批次刪除相關狀態
  const [selectedRecordIds, setSelectedRecordIds] = useState<Set<string>>(new Set())
  
  // 新增夢想相關狀態
  const [isAddWishDialogOpen, setIsAddWishDialogOpen] = useState(false)
  const [newWishData, setNewWishData] = useState({
    name: "",
    cost: "",
    currentSaved: "",
    year: new Date().getFullYear().toString(),
    month: "",
    icon: "other" as "travel" | "education" | "house" | "car" | "health" | "other",
  })
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
  
  // 追蹤已通知的夢想（避免重複通知）- 從 localStorage 讀取
  const [notifiedCompletedWishes, setNotifiedCompletedWishes] = useState<Set<string>>(new Set())
  const [notifiedNearCompleteWishes, setNotifiedNearCompleteWishes] = useState<Set<string>>(new Set())
  
  // 從 localStorage 讀取已通知的夢想狀態
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedCompleted = localStorage.getItem("notifiedCompletedWishes")
      const savedNearComplete = localStorage.getItem("notifiedNearCompleteWishes")
      
      if (savedCompleted) {
        try {
          const parsed = JSON.parse(savedCompleted)
          setNotifiedCompletedWishes(new Set(parsed))
        } catch (e) {
          console.error("Error parsing notifiedCompletedWishes", e)
        }
      }
      
      if (savedNearComplete) {
        try {
          const parsed = JSON.parse(savedNearComplete)
          setNotifiedNearCompleteWishes(new Set(parsed))
        } catch (e) {
          console.error("Error parsing notifiedNearCompleteWishes", e)
        }
      }
    }
  }, [])
  
  // 每日回顧時間設定
  const [reminderTime, setReminderTime] = useState<string>("20:00")
  const [reminderEnabled, setReminderEnabled] = useState<boolean>(false)
  const [isReminderDialogOpen, setIsReminderDialogOpen] = useState(false)
  
  // 提醒歷史記錄
  interface ReminderHistory {
    id: string
    date: string
    time: string
    message: string
    type: "dream_completed" | "dream_near_complete" | "daily_reminder" | "custom"
  }
  const [reminderHistory, setReminderHistory] = useState<ReminderHistory[]>([])
  const [isReminderHistoryDialogOpen, setIsReminderHistoryDialogOpen] = useState(false)
  
  // 點擊行事曆日期填寫記帳
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [isDateRecordDialogOpen, setIsDateRecordDialogOpen] = useState(false)
  const [dateRecords, setDateRecords] = useState<Array<{
    description: string
    amount: string
    type: "income" | "expense"
    category: string
    subCategory: string
  }>>([{
    description: "",
    amount: "",
    type: "expense" as "income" | "expense",
    category: "",
    subCategory: "",
  }])

  // 分類選項定義
  const categoryOptions = {
    income: {
      "生意收入": [
        "商品銷售收入",
        "服務提供收入",
        "二手設備出售",
        "場地出租",
        "合作分潤",
        "其他創業相關收入",
      ],
      "生活收入": {
        "固定收入": [
          "薪資收入",
          "租金收入",
          "定期投資收益",
          "退休金/年金",
          "政府定期補助",
        ],
        "變動收入": [
          "副業收入",
          "臨時性工作",
          "利息收入",
          "親友贈與",
          "其他生活收入",
        ],
      },
    },
    expense: {
      "生意支出": {
        "變動支出": [
          "原料",
          "包材",
          "耗材",
          "運費",
          "變動其他",
        ],
        "固定支出": [
          "租金",
          "人事",
          "水電",
          "瓦斯",
          "通訊",
          "還款",
          "固定其他",
        ],
        "額外支出": [
          "設備添購",
          "器材修繕",
          "行銷廣告",
          "額外其他",
        ],
      },
      "生活支出": {
        "生活固定支出": [
          "住",
          "電信",
          "還款",
          "保險(月繳)",
          "儲蓄",
        ],
        "生活變動支出": [
          "食",
          "衣",
          "行",
          "育",
          "樂",
          "醫療",
          "其他",
        ],
      },
    },
  }
  
  // 計算有記帳的日期
  const datesWithRecords = useMemo(() => {
    const dateSet = new Set<string>()
    records.forEach((record) => {
      const dateStr = record.date.split("T")[0] // 只取日期部分
      dateSet.add(dateStr)
    })
    return dateSet
  }, [records])
  
  // 將日期字符串轉換為 Date 對象（用於行事曆）
  const datesWithRecordsAsDates = useMemo(() => {
    return Array.from(datesWithRecords).map((dateStr) => new Date(dateStr))
  }, [datesWithRecords])

  // 處理記帳數據
  // 解析語音轉錄內容為記帳記錄
  const parseTranscriptionToRecords = (content: string, useCurrentDate: boolean = false): AccountingRecord[] => {
    if (!content || content.trim() === "") return []
    
    const records: AccountingRecord[] = []
    const today = new Date()
    const todayStr = today.toISOString().split("T")[0]
    const currentDate = useCurrentDate ? todayStr : todayStr
    
    // 解析日期關鍵詞
    const parseDate = (text: string): string => {
      if (useCurrentDate) {
        // 如果指定使用當前日期，直接返回今天
        return currentDate
      }
      if (text.includes("今天") || text.includes("今日")) {
        return todayStr
      } else if (text.includes("昨天") || text.includes("昨日")) {
        const yesterday = new Date(today)
        yesterday.setDate(yesterday.getDate() - 1)
        return yesterday.toISOString().split("T")[0]
      } else if (text.includes("前天")) {
        const dayBefore = new Date(today)
        dayBefore.setDate(dayBefore.getDate() - 2)
        return dayBefore.toISOString().split("T")[0]
      }
      return useCurrentDate ? currentDate : todayStr
    }
    
    // 識別分類
    const categorize = (description: string, amount: number): { category: string; subCategory: string; type: "income" | "expense" } => {
      const desc = description.toLowerCase()
      
      // 收入關鍵詞
      if (desc.includes("收入") || desc.includes("薪資") || desc.includes("薪水") || desc.includes("工資")) {
        if (desc.includes("生意") || desc.includes("營業") || desc.includes("銷售") || desc.includes("商品")) {
          return { category: "生意收入", subCategory: "商品銷售收入", type: "income" }
        }
        return { category: "生活收入", subCategory: "薪資收入", type: "income" }
      }
      
      // 支出關鍵詞
      if (desc.includes("儲蓄")) {
        if (desc.includes("緊急預備金")) {
          return { category: "生活支出", subCategory: "儲蓄", type: "expense" }
        }
        // 檢查是否與夢想相關
        const wishesStr = localStorage.getItem("wishes")
        if (wishesStr) {
          try {
            const wishes = JSON.parse(wishesStr)
            for (const wish of wishes) {
              if (desc.includes(wish.name)) {
                return { category: "生活支出", subCategory: "儲蓄", type: "expense" }
              }
            }
          } catch (e) {
            console.error("Error parsing wishes", e)
          }
        }
        return { category: "生活支出", subCategory: "儲蓄", type: "expense" }
      }
      
      if (desc.includes("原料") || desc.includes("包材") || desc.includes("材料") || desc.includes("成本")) {
        if (desc.includes("原料")) {
          return { category: "生意支出", subCategory: "原料", type: "expense" }
        } else if (desc.includes("包材")) {
          return { category: "生意支出", subCategory: "包材", type: "expense" }
        }
        return { category: "生意支出", subCategory: "其他", type: "expense" }
      }
      
      if (desc.includes("房租") || desc.includes("租金") || desc.includes("房貸")) {
        return { category: "生活支出", subCategory: "住", type: "expense" }
      }
      
      if (desc.includes("買菜") || desc.includes("食物") || desc.includes("餐") || desc.includes("吃")) {
        return { category: "生活支出", subCategory: "食", type: "expense" }
      }
      
      if (desc.includes("電信") || desc.includes("手機") || desc.includes("月租") || desc.includes("電話")) {
        return { category: "生活支出", subCategory: "電信", type: "expense" }
      }
      
      // 預設為生活支出-其他
      return { category: "生活支出", subCategory: "其他", type: "expense" }
    }
    
    // 提取日期（如果 useCurrentDate 為 true，所有記錄都使用當天日期）
    const date = useCurrentDate ? currentDate : parseDate(content)
    
    // 分割多筆交易（用逗號、頓號或句號分隔）
    const transactions = content.split(/[，,、。]/).filter(t => t.trim() !== "")
    
    const timestamp = Date.now()
    transactions.forEach((transaction, index) => {
      const trimmed = transaction.trim()
      if (!trimmed) return
      
      // 提取金額（數字+元）
      const amountMatch = trimmed.match(/(\d+(?:,\d{3})*)\s*元/)
      if (!amountMatch) return
      
      const amountStr = amountMatch[1].replace(/,/g, "")
      const amount = parseInt(amountStr)
      if (isNaN(amount) || amount <= 0) return
      
      // 提取描述（移除金額部分）
      let description = trimmed.replace(/\d+(?:,\d{3})*\s*元/g, "").trim()
      // 移除日期關鍵詞
      description = description.replace(/(今天|昨天|前天|今日|昨日)/g, "").trim()
      
      if (!description) {
        description = `記帳項目 ${index + 1}`
      }
      
      // 分類
      const { category, subCategory, type } = categorize(description, amount)
      
      // 生成唯一ID
      const id = `record-${timestamp}-${index}-${Math.random().toString(36).substr(2, 9)}`
      
      records.push({
        id,
        date,
        description,
        amount,
        type,
        category,
        subCategory,
      })
    })
    
    return records
  }

  const processAccountingData = (content: string, useCurrentDate: boolean = false) => {
    const existingRecords = localStorage.getItem("accountingRecords")
    let allRecords = existingRecords ? JSON.parse(existingRecords) : []
    
    // 為新記錄生成唯一的 id（使用時間戳 + 索引）
    const timestamp = Date.now()
    const currentDate = new Date().toISOString().split("T")[0] // 當下時間的日期
    
    let newRecords: AccountingRecord[] = []
    
    if (useCurrentDate) {
      // 語音輸入：解析語音轉錄內容為記帳記錄
      newRecords = parseTranscriptionToRecords(content, true)
    } else {
      // 上傳帳務資訊：使用 sampleAccountingData 中的所有記錄
      newRecords = sampleAccountingData.map((record, index) => ({
        ...record,
        id: `${timestamp}-${index}`,
        date: record.date,
      }))
    }
    
    // 添加新記錄
    allRecords = [...allRecords, ...newRecords]
    
    // 保存到 localStorage
    localStorage.setItem("accountingRecords", JSON.stringify(allRecords))
    setRecords(allRecords)
    
    // 更新願望的已完成金額（如果有相關儲蓄）- 只處理上傳的情況
    if (!useCurrentDate) {
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
        
        // 同步更新 step2Data 中的 availableSavings
        const step2DataStr = localStorage.getItem("step2Data")
        if (step2DataStr) {
          try {
            const step2Data = JSON.parse(step2DataStr)
            step2Data.availableSavings = newSavings.toString()
            localStorage.setItem("step2Data", JSON.stringify(step2Data))
          } catch (e) {
            console.error("Error updating step2Data", e)
          }
        }
      }
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
          // 如果有所修改（例如添加唯一ID），更新localStorage
          if (JSON.stringify(recordsWithUniqueIds) !== JSON.stringify(parsedRecords)) {
            localStorage.setItem("accountingRecords", JSON.stringify(recordsWithUniqueIds))
          }
        } catch (e) {
          console.error("Error parsing accounting records", e)
          setRecords([])
        }
      } else {
        // 如果沒有記錄，初始化為空數組
        setRecords([])
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
  const filteredRecords = records
    .filter((record) => {
      // 月份篩選
      if (filterMonth !== "all") {
        const recordMonth = new Date(record.date).toLocaleDateString("zh-TW", { year: "numeric", month: "2-digit" })
        if (recordMonth !== filterMonth) return false
      }
      // 類型篩選
      if (filterType !== "all") {
        if (filterType === "income" && record.type !== "income") return false
        if (filterType === "expense" && record.type !== "expense") return false
      }
      // 文字搜尋（描述）
      if (searchText && !record.description.toLowerCase().includes(searchText.toLowerCase())) {
        return false
      }
      // 主分類篩選
      if (filterCategory !== "all" && record.category !== filterCategory) {
        return false
      }
      // 子分類篩選
      if (filterSubCategory !== "all" && record.subCategory !== filterSubCategory) {
        return false
      }
      return true
    })
    // 按日期由近到遠排序（最新的在最上面）
    .sort((a, b) => {
      const dateA = new Date(a.date).getTime()
      const dateB = new Date(b.date).getTime()
      // 降序排列：日期較新的在前
      return dateB - dateA
    })
  
  // 獲取所有可用的主分類和子分類
  const availableCategories = Array.from(new Set(records.map((r) => r.category))).filter(Boolean).sort()
  const availableSubCategories = filterCategory === "all"
    ? Array.from(new Set(records.map((r) => r.subCategory))).filter(Boolean).sort()
    : Array.from(new Set(records.filter((r) => r.category === filterCategory).map((r) => r.subCategory))).filter(Boolean).sort()

  // 計算當月的生意收支、生活收支和淨現金流（使用所有記錄，不受篩選影響）
  const currentMonth = new Date().toLocaleDateString("zh-TW", { year: "numeric", month: "2-digit" })
  const currentMonthRecords = records.filter((r) => {
    const recordMonth = new Date(r.date).toLocaleDateString("zh-TW", { year: "numeric", month: "2-digit" })
    return recordMonth === currentMonth
  })

  // 當月統計（使用所有當月記錄）
  const businessIncome = currentMonthRecords
    .filter((r) => r.type === "income" && r.category === "生意收入")
    .reduce((sum, r) => sum + r.amount, 0)
  const businessExpense = currentMonthRecords
    .filter((r) => r.type === "expense" && r.category === "生意支出")
    .reduce((sum, r) => sum + r.amount, 0)
  const businessNetCashFlow = businessIncome - businessExpense

  const lifeIncome = currentMonthRecords
    .filter((r) => r.type === "income" && r.category === "生活收入")
    .reduce((sum, r) => sum + r.amount, 0)
  const lifeExpense = currentMonthRecords
    .filter((r) => r.type === "expense" && r.category === "生活支出")
    .reduce((sum, r) => sum + r.amount, 0)
  const lifeNetCashFlow = lifeIncome - lifeExpense

  const totalNetCashFlow = businessNetCashFlow + lifeNetCashFlow

  // 總收入、總支出（使用所有記錄，不受篩選影響，與當月統計連動）
  const totalIncome = records
    .filter((r) => r.type === "income")
    .reduce((sum, r) => sum + r.amount, 0)
  const totalExpense = records
    .filter((r) => r.type === "expense")
    .reduce((sum, r) => sum + r.amount, 0)
  const netCashFlow = totalIncome - totalExpense
  
  // 驗證：當月統計應該等於所有記錄中當月部分的總和
  const currentMonthTotalIncome = currentMonthRecords
    .filter((r) => r.type === "income")
    .reduce((sum, r) => sum + r.amount, 0)
  const currentMonthTotalExpense = currentMonthRecords
    .filter((r) => r.type === "expense")
    .reduce((sum, r) => sum + r.amount, 0)
  const currentMonthNetCashFlow = currentMonthTotalIncome - currentMonthTotalExpense
  
  // 驗證當月統計與總收入支出的連動關係
  // 當月總收入 = 當月生意收入 + 當月生活收入
  // 當月總支出 = 當月生意支出 + 當月生活支出
  // 當月淨現金流 = 當月總收入 - 當月總支出 = 生意淨現金流 + 生活淨現金流

  // 計算歷史數據（按月統計）
  const monthlyData = useMemo(() => {
    const monthMap = new Map<string, {
      month: string
      businessIncome: number
      businessExpense: number
      businessNetCashFlow: number
      lifeIncome: number
      lifeExpense: number
      lifeNetCashFlow: number
      totalNetCashFlow: number
    }>()

    records.forEach((record) => {
      const month = new Date(record.date).toLocaleDateString("zh-TW", { year: "numeric", month: "2-digit" })
      
      if (!monthMap.has(month)) {
        monthMap.set(month, {
          month,
          businessIncome: 0,
          businessExpense: 0,
          businessNetCashFlow: 0,
          lifeIncome: 0,
          lifeExpense: 0,
          lifeNetCashFlow: 0,
          totalNetCashFlow: 0,
        })
      }

      const data = monthMap.get(month)!
      
      if (record.type === "income") {
        if (record.category === "生意收入") {
          data.businessIncome += record.amount
        } else if (record.category === "生活收入") {
          data.lifeIncome += record.amount
        }
      } else if (record.type === "expense") {
        if (record.category === "生意支出") {
          data.businessExpense += record.amount
        } else if (record.category === "生活支出") {
          data.lifeExpense += record.amount
        }
      }
    })

    // 計算淨現金流
    monthMap.forEach((data) => {
      data.businessNetCashFlow = data.businessIncome - data.businessExpense
      data.lifeNetCashFlow = data.lifeIncome - data.lifeExpense
      data.totalNetCashFlow = data.businessNetCashFlow + data.lifeNetCashFlow
    })

    // 轉換為數組並排序
    return Array.from(monthMap.values()).sort((a, b) => {
      const [aYear, aMonth] = a.month.split("/").map(Number)
      const [bYear, bMonth] = b.month.split("/").map(Number)
      if (aYear !== bYear) return aYear - bYear
      return aMonth - bMonth
    })
  }, [records])

  const chartConfig = {
    businessNetCashFlow: {
      label: "生意淨現金流",
      color: "#a855f7", // purple
    },
    lifeNetCashFlow: {
      label: "生活淨現金流",
      color: "#3b82f6", // blue
    },
    totalNetCashFlow: {
      label: "總淨現金流",
      color: "#10b981", // green
    },
  }

  // 計算夢想完成狀況（根據記帳記錄更新）
  const wishesWithProgress = wishes.map((wish) => {
    const targetAmount = parseFloat(wish.cost ? wish.cost.replace(/,/g, "") : "0")
    
    // 獲取初始的 currentSaved（step1 中設定的初始值）
    let initialSaved = 0
    if (wish.id === "1" && wish.name === "日本家庭旅遊") {
      initialSaved = 10000
    } else if (wish.id === "2" && wish.name === "孩子才藝課程") {
      initialSaved = 15000
    } else {
      // 其他夢想的初始值從 currentSaved 讀取
      initialSaved = parseFloat(wish.currentSaved ? wish.currentSaved.replace(/,/g, "") : "0")
    }
    
    const completedDate = (wish as any).completedDate // 完成日期
    
    // 如果夢想已完成，不再從記帳記錄中累積儲蓄
    let additionalSaved = 0
    if (!completedDate) {
      // 從記帳記錄中找出與此夢想相關的儲蓄記錄（使用所有 records，不只是 filteredRecords）
      const relatedSavings = records.filter(
        (r) => r.type === "expense" && r.subCategory === "儲蓄" && r.description.includes(wish.name)
      )
      additionalSaved = relatedSavings.reduce((sum, r) => sum + r.amount, 0)
    }
    
    // 總儲蓄 = 初始值 + 記帳記錄中的儲蓄
    // 如果記帳記錄被清空，additionalSaved 會是 0，totalSaved 會回到初始值
    const totalSaved = initialSaved + additionalSaved
    const progress = targetAmount > 0 ? (totalSaved / targetAmount) * 100 : 0
    const stillNeeded = Math.max(0, targetAmount - totalSaved)
    const isCompleted = progress >= 100 || !!completedDate
    
    // 如果剛完成但還沒有記錄完成日期，記錄完成日期
    if (isCompleted && !completedDate) {
      const completionDate = new Date().toISOString().split("T")[0]
      const updatedWishes = wishes.map((w: any) => {
        if ((w.id || w.name) === (wish.id || wish.name)) {
          return {
            ...w,
            completedDate: completionDate,
          }
        }
        return w
      })
      localStorage.setItem("wishes", JSON.stringify(updatedWishes))
      setWishes(updatedWishes)
    }
    
    // 計算每月需存金額（用於判斷是否即將完成）
    const currentYear = new Date().getFullYear()
    const currentMonth = new Date().getMonth() + 1
    const targetYear = parseInt(wish.year || currentYear.toString())
    const targetMonth = parseInt(wish.month || "12")
    
    let monthsRemaining = 0
    if (targetYear > currentYear) {
      monthsRemaining = (targetYear - currentYear - 1) * 12 + (12 - currentMonth) + targetMonth
    } else if (targetYear === currentYear) {
      monthsRemaining = Math.max(0, targetMonth - currentMonth)
    }
    
    const monthlySaving = monthsRemaining > 0 ? Math.ceil(stillNeeded / monthsRemaining) : stillNeeded
    const isNearComplete = !isCompleted && stillNeeded > 0 && stillNeeded <= monthlySaving && progress >= 80

    return {
      ...wish,
      targetAmount,
      currentSaved: isCompleted ? targetAmount : totalSaved, // 已完成時固定為目標金額
      progress: isCompleted ? 100 : Math.min(100, Math.max(0, progress)),
      stillNeeded: isCompleted ? 0 : stillNeeded,
      isCompleted,
      completedDate: completedDate || (isCompleted ? new Date().toISOString().split("T")[0] : undefined),
      isNearComplete,
      wishId: wish.id || wish.name,
    }
  })

  // 添加提醒到歷史記錄
  const addReminderToHistory = (reminder: Omit<ReminderHistory, "id" | "date" | "time">) => {
    const now = new Date()
    const newReminder: ReminderHistory = {
      id: `reminder-${Date.now()}`,
      date: now.toLocaleDateString("zh-TW"),
      time: now.toLocaleTimeString("zh-TW", { hour: "2-digit", minute: "2-digit" }),
      ...reminder,
    }
    const updatedHistory = [newReminder, ...reminderHistory]
    setReminderHistory(updatedHistory)
    localStorage.setItem("reminderHistory", JSON.stringify(updatedHistory))
  }

  // 從 localStorage 讀取提醒歷史
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("reminderHistory")
      if (saved) {
        try {
          const parsed = JSON.parse(saved)
          setReminderHistory(parsed)
        } catch (e) {
          console.error("Error loading reminder history", e)
        }
      }
    }
  }, [])

  // 檢測並顯示夢想完成通知（只在狀態真正改變時觸發，不在一進系統就提醒）
  useEffect(() => {
    // 從 localStorage 讀取已通知的狀態（確保使用最新狀態）
    const savedCompleted = localStorage.getItem("notifiedCompletedWishes")
    const savedNearComplete = localStorage.getItem("notifiedNearCompleteWishes")
    const savedCompletedSet = savedCompleted ? new Set(JSON.parse(savedCompleted)) : new Set<string>()
    const savedNearCompleteSet = savedNearComplete ? new Set(JSON.parse(savedNearComplete)) : new Set<string>()
    
    // 只在 wishesWithProgress 真正改變時檢查
    wishesWithProgress.forEach((wish) => {
      const wishId = wish.wishId
      
      // 夢想已完成 - 只在真正完成且尚未通知時觸發一次
      if (wish.isCompleted && !savedCompletedSet.has(wishId)) {
        const message = `「${wish.name}」已經完成囉！`
        toast.success(
          <div className="flex items-center gap-3">
            <PartyPopper className="w-6 h-6 text-yellow-500" />
            <div>
              <p className="font-semibold">🎉 恭喜！夢想達成！</p>
              <p className="text-sm text-muted-foreground">{message}</p>
            </div>
          </div>,
          {
            duration: 5000,
            position: "top-center",
          }
        )
        addReminderToHistory({
          message,
          type: "dream_completed",
        })
        const newSet = new Set(savedCompletedSet).add(wishId)
        setNotifiedCompletedWishes(newSet)
        // 保存到 localStorage
        localStorage.setItem("notifiedCompletedWishes", JSON.stringify(Array.from(newSet)))
      }
      
      // 夢想即將完成（還剩一期就完成）- 只在真正接近完成且尚未通知時觸發一次
      if (wish.isNearComplete && !savedNearCompleteSet.has(wishId) && !wish.isCompleted) {
        const message = `「${wish.name}」還需要 NT$ ${wish.stillNeeded.toLocaleString()} 就完成囉！`
        toast.info(
          <div className="flex items-center gap-3">
            <Bell className="w-6 h-6 text-blue-500" />
            <div>
              <p className="font-semibold">💡 即將完成！</p>
              <p className="text-sm text-muted-foreground">{message}</p>
            </div>
          </div>,
          {
            duration: 5000,
            position: "top-center",
          }
        )
        addReminderToHistory({
          message,
          type: "dream_near_complete",
        })
        const newSet = new Set(savedNearCompleteSet).add(wishId)
        setNotifiedNearCompleteWishes(newSet)
        // 保存到 localStorage
        localStorage.setItem("notifiedNearCompleteWishes", JSON.stringify(Array.from(newSet)))
      }
    })
  }, [wishesWithProgress]) // 只依賴 wishesWithProgress，確保只在夢想狀態改變時檢查

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
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="relative"
                onClick={() => setIsReminderHistoryDialogOpen(true)}
              >
                <Bell className="w-5 h-5" />
                {reminderHistory.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                    {reminderHistory.length > 99 ? "99+" : reminderHistory.length}
                  </span>
                )}
              </Button>
              <Button size="lg" className="px-6" onClick={() => setIsDialogOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                新增記帳
              </Button>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {/* 總收入（所有記錄） */}
          <Card className="p-6 bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/20">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              <span className="text-sm text-muted-foreground">總收入（全部記錄）</span>
            </div>
            <p className="text-2xl font-bold text-foreground">NT$ {totalIncome.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground mt-1">
              當月：NT$ {currentMonthTotalIncome.toLocaleString()}
            </p>
          </Card>

          {/* 總支出（所有記錄） */}
          <Card className="p-6 bg-gradient-to-br from-red-500/10 to-orange-500/10 border-red-500/20">
            <div className="flex items-center gap-3 mb-2">
              <TrendingDown className="w-5 h-5 text-red-600" />
              <span className="text-sm text-muted-foreground">總支出（全部記錄）</span>
            </div>
            <p className="text-2xl font-bold text-foreground">NT$ {totalExpense.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground mt-1">
              當月：NT$ {currentMonthTotalExpense.toLocaleString()}
            </p>
          </Card>

          {/* 淨現金流（所有記錄） */}
          <Card className="p-6 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-500/20">
            <div className="flex items-center gap-3 mb-2">
              <Wallet className="w-5 h-5 text-blue-600" />
              <span className="text-sm text-muted-foreground">淨現金流（全部記錄）</span>
            </div>
            <p className={`text-2xl font-bold ${netCashFlow >= 0 ? "text-green-600" : "text-red-600"}`}>
              NT$ {netCashFlow.toLocaleString()}
            </p>
            <p className={`text-xs mt-1 ${currentMonthNetCashFlow >= 0 ? "text-green-600" : "text-red-600"}`}>
              當月：NT$ {currentMonthNetCashFlow.toLocaleString()}
            </p>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* 夢想完成狀況 */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Heart className="w-6 h-6 text-primary" />
                <h2 className="text-xl font-semibold text-foreground">夢想完成狀況</h2>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsAddWishDialogOpen(true)}
              >
                <Plus className="w-4 h-4 mr-2" />
                新增夢想
              </Button>
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
                    <div key={wish.id || wish.name} className={`p-4 rounded-lg border ${wish.isCompleted ? "bg-green-50 border-green-200" : "bg-accent/20 border-border"}`}>
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-medium text-foreground">{wish.name}</h3>
                            {wish.isCompleted && (
                              <span className="px-2 py-0.5 rounded-full bg-green-500 text-white text-xs font-semibold">
                                已完成
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            目標：NT$ {wish.targetAmount.toLocaleString()}
                          </p>
                          {wish.isCompleted && wish.completedDate && (
                            <p className="text-xs text-green-600 mt-1 font-medium">
                              ✓ 完成日期：{new Date(wish.completedDate).toLocaleDateString("zh-TW", { year: "numeric", month: "long", day: "numeric" })}
                            </p>
                          )}
                          {!wish.isCompleted && (
                            <p className="text-xs text-muted-foreground mt-1">
                              💡 已完成金額 = 初始設定金額 + 記帳中的儲蓄金額
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`text-sm font-medium ${wish.isCompleted ? "text-green-600" : "text-primary"}`}>
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
                          {wish.isCompleted ? (
                            <div className="p-3 rounded-lg bg-green-50 border border-green-200">
                              <div className="flex items-center gap-2 mb-1">
                                <CheckCircle2 className="w-4 h-4 text-green-600" />
                                <span className="text-sm font-semibold text-green-800">夢想已完成！</span>
                              </div>
                              <p className="text-xs text-green-700">
                                已完成金額：NT$ {wish.targetAmount.toLocaleString()} / NT$ {wish.targetAmount.toLocaleString()}
                              </p>
                              {wish.completedDate && (
                                <p className="text-xs text-green-600 mt-1">
                                  完成日期：{new Date(wish.completedDate).toLocaleDateString("zh-TW", { year: "numeric", month: "long", day: "numeric" })}
                                </p>
                              )}
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
                      // 保存修改 - 同步更新 availableSavings 和 step2Data
                      localStorage.setItem("availableSavings", editingEmergencyAmount.toString())
                      setAvailableSavings(editingEmergencyAmount)
                      
                      // 同步更新 step2Data 中的 availableSavings
                      const step2DataStr = localStorage.getItem("step2Data")
                      if (step2DataStr) {
                        try {
                          const step2Data = JSON.parse(step2DataStr)
                          step2Data.availableSavings = editingEmergencyAmount.toString()
                          localStorage.setItem("step2Data", JSON.stringify(step2Data))
                        } catch (e) {
                          console.error("Error updating step2Data", e)
                        }
                      }
                      
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

        {/* 記帳行事曆和歷史趨勢圖 */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* 記帳行事曆 */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Calendar className="w-6 h-6 text-primary" />
                <h2 className="text-xl font-semibold text-foreground">記帳行事曆</h2>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsReminderDialogOpen(true)}
                className="gap-2"
              >
                <Clock className="w-4 h-4" />
                設定提醒
              </Button>
            </div>
            <CalendarComponent
              modifiers={{
                hasRecord: datesWithRecordsAsDates,
              }}
              modifiersClassNames={{
                hasRecord: "bg-primary/20 text-primary font-semibold",
              }}
              className="w-full"
              mode="single"
              captionLayout="dropdown"
              fromYear={2020}
              toYear={2030}
              onSelect={(date) => {
                if (date) {
                  setSelectedDate(date)
                  setIsDateRecordDialogOpen(true)
                  setDateRecords([{
                    description: "",
                    amount: "",
                    type: "expense",
                    category: "",
                    subCategory: "",
                  }])
                }
              }}
            />
            <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-primary/20 border border-primary/50 flex items-center justify-center">
                  <CheckCircle2 className="w-3 h-3 text-primary" />
                </div>
                <span>已記帳</span>
              </div>
              {reminderEnabled && (
                <div className="flex items-center gap-2 text-primary">
                  <Mail className="w-4 h-4" />
                  <span>每日 {reminderTime} 提醒</span>
                </div>
              )}
            </div>
          </Card>

          {/* 歷史趨勢圖 */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-foreground mb-6">歷史趨勢圖</h2>
            {monthlyData.length > 0 ? (
              <ChartContainer config={chartConfig} className="h-[400px]">
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="month"
                    tick={{ fontSize: 12 }}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => `NT$ ${(value / 1000).toFixed(0)}k`}
                  />
                  <ChartTooltip
                    content={
                      <ChartTooltipContent
                        formatter={(value: number) => `NT$ ${value.toLocaleString()}`}
                      />
                    }
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="businessNetCashFlow"
                    stroke="#a855f7"
                    strokeWidth={2}
                    name="生意淨現金流"
                    dot={{ r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="lifeNetCashFlow"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    name="生活淨現金流"
                    dot={{ r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="totalNetCashFlow"
                    stroke="#10b981"
                    strokeWidth={2}
                    name="總淨現金流"
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ChartContainer>
            ) : (
              <div className="h-[400px] flex items-center justify-center border border-border rounded-lg bg-muted/20">
                <p className="text-muted-foreground">尚無歷史數據</p>
              </div>
            )}
          </Card>
        </div>

        {/* 當月統計 */}
        <Card className="p-6 mb-8">
          <h2 className="text-xl font-semibold text-foreground mb-6">當月統計 ({currentMonth})</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {/* 生意收支 */}
            <div className="p-4 rounded-lg bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/20">
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp className="w-5 h-5 text-purple-600" />
                <span className="text-sm text-muted-foreground">生意收支</span>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">
                  收入：NT$ {businessIncome.toLocaleString()}
                </p>
                <p className="text-sm text-muted-foreground">
                  支出：NT$ {businessExpense.toLocaleString()}
                </p>
                <p className={`text-xl font-bold ${businessNetCashFlow >= 0 ? "text-green-600" : "text-red-600"}`}>
                  淨現金流：NT$ {businessNetCashFlow.toLocaleString()}
                </p>
              </div>
            </div>

            {/* 生活收支 */}
            <div className="p-4 rounded-lg bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-500/20">
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                <span className="text-sm text-muted-foreground">生活收支</span>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">
                  收入：NT$ {lifeIncome.toLocaleString()}
                </p>
                <p className="text-sm text-muted-foreground">
                  支出：NT$ {lifeExpense.toLocaleString()}
                </p>
                <p className={`text-xl font-bold ${lifeNetCashFlow >= 0 ? "text-green-600" : "text-red-600"}`}>
                  淨現金流：NT$ {lifeNetCashFlow.toLocaleString()}
                </p>
              </div>
            </div>

            {/* 總淨現金流 */}
            <div className="p-4 rounded-lg bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/20">
              <div className="flex items-center gap-3 mb-2">
                <Wallet className="w-5 h-5 text-green-600" />
                <span className="text-sm text-muted-foreground">總淨現金流</span>
              </div>
              <p className={`text-2xl font-bold ${totalNetCashFlow >= 0 ? "text-green-600" : "text-red-600"}`}>
                NT$ {totalNetCashFlow.toLocaleString()}
              </p>
            </div>
          </div>
        </Card>
        
        {/* 新增記帳對話框 */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>新增記帳</DialogTitle>
              <DialogDescription>
                透過語音輸入或上傳帳務資訊，我們會自動幫您分類整理並分析現金流
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6 py-4">
              <div className="grid md:grid-cols-2 gap-4">
                <Button
                  variant="outline"
                  className={`p-6 h-auto flex flex-col items-center gap-3 hover:bg-primary/5 transition-all ${
                    recordingMethod === "voice" ? "border-primary bg-primary/5" : ""
                  }`}
                  style={{ wordBreak: "break-word", textAlign: "center" }}
                  onClick={() => {
                    setRecordingMethod("voice")
                    setIsRecording(true)
                    setRecordingComplete(false)
                    setTranscriptionText("")
                    
                    // 模擬語音轉錄過程
                    const sampleTranscriptions = [
                      "今天早餐店營業收入3500元",
                      "今天早餐店營業收入3500元，購買咖啡豆原料2500元",
                      "今天早餐店營業收入3500元，購買咖啡豆原料2500元，買菜800元",
                      "今天早餐店營業收入3500元，購買咖啡豆原料2500元，買菜800元，正職工作薪資40000元",
                      "今天早餐店營業收入3500元，購買咖啡豆原料2500元，買菜800元，正職工作薪資40000元，房租15000元",
                      "今天早餐店營業收入3500元，購買咖啡豆原料2500元，買菜800元，正職工作薪資40000元，房租15000元，日本家庭旅遊儲蓄5000元",
                      "今天早餐店營業收入3500元，購買咖啡豆原料2500元，買菜800元，正職工作薪資40000元，房租15000元，日本家庭旅遊儲蓄5000元，緊急預備金儲蓄3000元",
                      "今天早餐店營業收入3500元，購買咖啡豆原料2500元，買菜800元，正職工作薪資40000元，房租15000元，日本家庭旅遊儲蓄5000元，緊急預備金儲蓄3000元，孩子才藝課程儲蓄2000元",
                    ]
                    
                    let currentIndex = 0
                    const transcriptionInterval = setInterval(() => {
                      if (currentIndex < sampleTranscriptions.length) {
                        setTranscriptionText(sampleTranscriptions[currentIndex])
                        currentIndex++
                      } else {
                        clearInterval(transcriptionInterval)
                        setIsRecording(false)
                        setRecordingComplete(true)
                      }
                    }, 500) // 每500ms更新一次文字
                    
                    // 總錄製時間約4秒
                    setTimeout(() => {
                      clearInterval(transcriptionInterval)
                      setIsRecording(false)
                      setRecordingComplete(true)
                    }, 4000)
                  }}
                >
                  <div className="relative">
                    <Mic className={`w-8 h-8 text-primary ${isRecording && recordingMethod === "voice" ? "animate-pulse" : ""}`} />
                    {isRecording && recordingMethod === "voice" && (
                      <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping" />
                    )}
                  </div>
                  <div className="text-center w-full px-2">
                    <p className="font-semibold text-foreground mb-1 text-sm">語音輸入記帳</p>
                    <p className="text-xs text-muted-foreground break-words leading-relaxed">
                      用說的就能記帳，自動辨識時間、內容與金額
                    </p>
                  </div>
                </Button>

                <Button
                  variant="outline"
                  className={`p-6 h-auto flex flex-col items-center gap-3 hover:bg-primary/5 transition-all ${
                    recordingMethod === "upload" ? "border-primary bg-primary/5" : ""
                  }`}
                  onClick={() => setRecordingMethod("upload")}
                >
                  <Upload className="w-8 h-8 text-primary" />
                  <div className="text-center w-full px-2">
                    <p className="font-semibold text-foreground mb-1 text-sm">上傳帳務資訊</p>
                    <p className="text-xs text-muted-foreground break-words leading-relaxed">
                      上傳記帳訊息，自動分類整理成表格並分析
                    </p>
                  </div>
                </Button>
              </div>

              {recordingMethod === "voice" && (
                <div className="p-4 rounded-lg bg-accent/20 border border-accent animate-in fade-in">
                  <div className="flex items-start gap-3">
                    <Mic className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      {!recordingComplete ? (
                        <>
                          <p className="text-sm font-medium text-foreground mb-2">語音輸入說明</p>
                          <ul className="text-sm text-muted-foreground space-y-1 mb-4">
                            <li>• 直接說出記帳內容，例如：「今天買菜花了500元」</li>
                            <li>• 系統會自動辨識時間、項目、金額並分類</li>
                            <li>• 支援生意收支和生活收支的自動分類</li>
                            <li>• 可隨時查看分類結果和現金流分析</li>
                          </ul>
                          {isRecording && (
                            <div className="mt-3 p-4 rounded-lg bg-primary/10 border border-primary/20">
                              <div className="flex items-center gap-2 text-primary mb-3">
                                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                                <span className="text-sm font-medium">正在錄製中...</span>
                              </div>
                              {transcriptionText && (
                                <div className="mt-3 p-3 rounded-lg bg-card/80 border border-border">
                                  <p className="text-xs text-muted-foreground mb-2">即時轉錄：</p>
                                  <p className="text-sm text-foreground leading-relaxed">
                                    {transcriptionText}
                                    <span className="inline-block w-1 h-4 bg-primary ml-1 animate-pulse" />
                                  </p>
                                </div>
                              )}
                            </div>
                          )}
                        </>
                      ) : (
                        <>
                          <p className="text-sm font-medium text-foreground mb-2">錄音完成</p>
                          <div className="mt-3 p-4 rounded-lg bg-card/80 border border-border mb-4">
                            <p className="text-xs text-muted-foreground mb-2">轉錄內容：</p>
                            <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                              {transcriptionText}
                            </p>
                          </div>
                          <Button
                            onClick={() => {
                              // 處理語音轉錄的數據，使用當下時間的日期
                              processAccountingData(transcriptionText, true)
                            }}
                            className="w-full"
                            size="lg"
                          >
                            <SparklesIcon className="w-4 h-4 mr-2" />
                            進行整理
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {recordingMethod === "upload" && (
                <div className="p-4 rounded-lg bg-accent/20 border border-accent animate-in fade-in">
                  <div className="flex items-start gap-3 mb-4">
                    <Upload className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground mb-2">上傳帳務資訊</p>
                      <p className="text-sm text-muted-foreground mb-4">
                        您可以上傳從通訊軟體收集的記帳訊息，我們會自動整理成表格並進行分類統計與現金流分析。
                      </p>
                      {uploadSuccess ? (
                        <div className="border-2 border-green-500 rounded-lg p-6 text-center bg-green-50">
                          <CheckCircle2 className="w-8 h-8 text-green-600 mx-auto mb-2" />
                          <p className="text-sm font-medium text-green-800 mb-1">上傳成功！</p>
                          <p className="text-xs text-green-600">正在處理並分類您的記帳資料...</p>
                        </div>
                      ) : (
                        <div className="border-2 border-dashed border-primary/30 rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer">
                          <Upload className="w-8 h-8 text-primary mx-auto mb-2" />
                          <p className="text-sm font-medium text-foreground mb-1">點擊或拖曳檔案到此處</p>
                          <p className="text-xs text-muted-foreground">支援 .txt, .doc, .docx 格式</p>
                          <input
                            type="file"
                            accept=".txt,.doc,.docx"
                            className="hidden"
                            id="accounting-upload"
                            onChange={(e) => {
                              const file = e.target.files?.[0]
                              if (file) {
                                // 當作已上傳，直接處理
                                processAccountingData("")
                              }
                            }}
                          />
                          <label htmlFor="accounting-upload" className="cursor-pointer">
                            <Button
                              variant="outline"
                              className="mt-4"
                              onClick={(e) => {
                                e.preventDefault()
                                document.getElementById("accounting-upload")?.click()
                              }}
                            >
                              選擇檔案
                            </Button>
                          </label>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>

        {/* 點擊行事曆日期填寫記帳對話框 */}
        <Dialog open={isDateRecordDialogOpen} onOpenChange={setIsDateRecordDialogOpen}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                填寫記帳 - {selectedDate?.toLocaleDateString("zh-TW", { year: "numeric", month: "long", day: "numeric" })}
              </DialogTitle>
              <DialogDescription>
                為選定的日期新增記帳記錄，可以一次新增多筆
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6 py-4">
              {/* 顯示當天已記帳的內容 */}
              {selectedDate && (() => {
                const selectedDateStr = selectedDate.toISOString().split("T")[0]
                const dayRecords = records.filter((r) => {
                  const recordDateStr = r.date.split("T")[0]
                  return recordDateStr === selectedDateStr
                })
                
                if (dayRecords.length > 0) {
                  return (
                    <div className="mb-6">
                      <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        當天已記帳內容 ({dayRecords.length} 筆)
                      </h3>
                      <div className="space-y-2 max-h-60 overflow-y-auto">
                        {dayRecords.map((record, idx) => (
                          <div
                            key={record.id || idx}
                            className="p-3 rounded-lg border border-border bg-card/50"
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className={`text-xs px-2 py-0.5 rounded ${
                                    record.type === "income" 
                                      ? "bg-green-100 text-green-700" 
                                      : "bg-red-100 text-red-700"
                                  }`}>
                                    {record.type === "income" ? "收入" : "支出"}
                                  </span>
                                  <span className="text-xs text-muted-foreground">
                                    {record.category} / {record.subCategory}
                                  </span>
                                </div>
                                <p className="text-sm font-medium text-foreground">{record.description}</p>
                              </div>
                              <div className="text-right">
                                <p className={`text-sm font-semibold ${
                                  record.type === "income" ? "text-green-600" : "text-red-600"
                                }`}>
                                  {record.type === "income" ? "+" : "-"}NT$ {record.amount.toLocaleString()}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                }
                return null
              })()}
              
              <div className="border-t pt-4">
                <h3 className="text-sm font-semibold text-foreground mb-4">新增記帳記錄</h3>
              </div>
              
              {dateRecords.map((record, index) => {
                const getCategoryOptions = () => {
                  if (record.type === "income") {
                    return Object.keys(categoryOptions.income)
                  } else {
                    return Object.keys(categoryOptions.expense)
                  }
                }

                const getSubCategoryOptions = () => {
                  if (record.type === "income") {
                    if (record.category === "生意收入") {
                      return categoryOptions.income["生意收入"]
                    } else if (record.category === "生活收入") {
                      // 返回所有生活收入的子分類（固定+變動）
                      return [
                        ...categoryOptions.income["生活收入"]["固定收入"],
                        ...categoryOptions.income["生活收入"]["變動收入"],
                      ]
                    }
                  } else {
                    if (record.category === "生意支出") {
                      // 返回所有生意支出的子分類
                      return [
                        ...categoryOptions.expense["生意支出"]["變動支出"],
                        ...categoryOptions.expense["生意支出"]["固定支出"],
                        ...categoryOptions.expense["生意支出"]["額外支出"],
                      ]
                    } else if (record.category === "生活支出") {
                      // 返回所有生活支出的子分類
                      return [
                        ...categoryOptions.expense["生活支出"]["生活固定支出"],
                        ...categoryOptions.expense["生活支出"]["生活變動支出"],
                      ]
                    }
                  }
                  return []
                }

                return (
                  <div key={index} className="p-4 rounded-lg border border-border space-y-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-foreground">記帳項目 {index + 1}</h3>
                      {dateRecords.length > 1 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setDateRecords(dateRecords.filter((_, i) => i !== index))
                          }}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor={`date-record-desc-${index}`}>描述</Label>
                        <Input
                          id={`date-record-desc-${index}`}
                          type="text"
                          placeholder="例如：買菜"
                          value={record.description}
                          onChange={(e) => {
                            const newRecords = [...dateRecords]
                            newRecords[index].description = e.target.value
                            setDateRecords(newRecords)
                          }}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`date-record-amount-${index}`}>金額</Label>
                        <Input
                          id={`date-record-amount-${index}`}
                          type="number"
                          placeholder="例如：500"
                          value={record.amount}
                          onChange={(e) => {
                            const newRecords = [...dateRecords]
                            newRecords[index].amount = e.target.value
                            setDateRecords(newRecords)
                          }}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`date-record-type-${index}`}>類型</Label>
                      <Select
                        value={record.type}
                        onValueChange={(value: "income" | "expense") => {
                          const newRecords = [...dateRecords]
                          newRecords[index].type = value
                          newRecords[index].category = ""
                          newRecords[index].subCategory = ""
                          setDateRecords(newRecords)
                        }}
                      >
                        <SelectTrigger id={`date-record-type-${index}`}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="income">收入</SelectItem>
                          <SelectItem value="expense">支出</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`date-record-category-${index}`}>主分類</Label>
                      <Select
                        value={record.category}
                        onValueChange={(value) => {
                          const newRecords = [...dateRecords]
                          newRecords[index].category = value
                          newRecords[index].subCategory = ""
                          setDateRecords(newRecords)
                        }}
                      >
                        <SelectTrigger id={`date-record-category-${index}`}>
                          <SelectValue placeholder="請選擇主分類" />
                        </SelectTrigger>
                        <SelectContent>
                          {getCategoryOptions().map((cat) => (
                            <SelectItem key={cat} value={cat}>
                              {cat}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    {record.category && (
                      <div className="space-y-2">
                        <Label htmlFor={`date-record-subcategory-${index}`}>子分類</Label>
                        <Select
                          value={record.subCategory}
                          onValueChange={(value) => {
                            const newRecords = [...dateRecords]
                            newRecords[index].subCategory = value
                            setDateRecords(newRecords)
                          }}
                        >
                          <SelectTrigger id={`date-record-subcategory-${index}`}>
                            <SelectValue placeholder="請選擇子分類" />
                          </SelectTrigger>
                          <SelectContent>
                            {getSubCategoryOptions().map((subCat) => (
                              <SelectItem key={subCat} value={subCat}>
                                {subCat}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>
                )
              })}
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  setDateRecords([
                    ...dateRecords,
                    {
                      description: "",
                      amount: "",
                      type: "expense",
                      category: "",
                      subCategory: "",
                    },
                  ])
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                新增一筆記帳
              </Button>
              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsDateRecordDialogOpen(false)
                    setSelectedDate(undefined)
                    setDateRecords([{
                      description: "",
                      amount: "",
                      type: "expense",
                      category: "",
                      subCategory: "",
                    }])
                  }}
                >
                  取消
                </Button>
                <Button
                  onClick={() => {
                    if (!selectedDate) {
                      toast.error("請選擇日期")
                      return
                    }
                    // 驗證所有記錄
                    const invalidRecords = dateRecords.filter(
                      (r) => !r.description || !r.amount || !r.category || !r.subCategory
                    )
                    if (invalidRecords.length > 0) {
                      toast.error("請填寫完整資訊")
                      return
                    }
                    // 新增所有記帳記錄
                    const existingRecords = localStorage.getItem("accountingRecords")
                    let allRecords = existingRecords ? JSON.parse(existingRecords) : []
                    const timestamp = Date.now()
                    const newRecords = dateRecords.map((record, index) => ({
                      id: `record-${timestamp}-${index}`,
                      date: selectedDate.toISOString().split("T")[0],
                      description: record.description,
                      amount: parseFloat(record.amount) || 0,
                      type: record.type,
                      category: record.category,
                      subCategory: record.subCategory,
                    }))
                    allRecords = [...allRecords, ...newRecords]
                    localStorage.setItem("accountingRecords", JSON.stringify(allRecords))
                    setRecords(allRecords)
                    
                    // 更新願望的已完成金額（如果有相關儲蓄）
                    const wishesStr = localStorage.getItem("wishes")
                    if (wishesStr) {
                      try {
                        const wishes = JSON.parse(wishesStr)
                        const updatedWishes = wishes.map((wish: any) => {
                          const relatedSavings = newRecords.filter(
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
                    const emergencySavings = newRecords.filter(
                      (r) => r.description.includes("緊急預備金") && r.subCategory === "儲蓄"
                    )
                    if (emergencySavings.length > 0) {
                      const additionalAmount = emergencySavings.reduce((sum, r) => sum + r.amount, 0)
                      const currentSavings = parseFloat(localStorage.getItem("availableSavings") || "0")
                      const newSavings = currentSavings + additionalAmount
                      localStorage.setItem("availableSavings", newSavings.toString())
                      setAvailableSavings(newSavings)
                      
                      // 同步更新 step2Data 中的 availableSavings
                      const step2DataStr = localStorage.getItem("step2Data")
                      if (step2DataStr) {
                        try {
                          const step2Data = JSON.parse(step2DataStr)
                          step2Data.availableSavings = newSavings.toString()
                          localStorage.setItem("step2Data", JSON.stringify(step2Data))
                        } catch (e) {
                          console.error("Error updating step2Data", e)
                        }
                      }
                    }
                    
                    toast.success(`已新增 ${newRecords.length} 筆記帳記錄`)
                    setIsDateRecordDialogOpen(false)
                    setSelectedDate(undefined)
                    setDateRecords([{
                      description: "",
                      amount: "",
                      type: "expense",
                      category: "",
                      subCategory: "",
                    }])
                    // 重新載入數據
                    window.location.reload()
                  }}
                >
                  保存所有記錄
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* 每日回顧時間設定對話框 */}
        <Dialog open={isReminderDialogOpen} onOpenChange={setIsReminderDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>設定每日記帳提醒</DialogTitle>
              <DialogDescription>
                設定每日回顧時間，系統會在固定時間提醒您記帳
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="reminder-time">提醒時間</Label>
                <Input
                  id="reminder-time"
                  type="time"
                  value={reminderTime}
                  onChange={(e) => setReminderTime(e.target.value)}
                  className="w-full"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="reminder-enabled"
                  checked={reminderEnabled}
                  onChange={(e) => {
                    setReminderEnabled(e.target.checked)
                    if (e.target.checked) {
                      const message = `已啟用每日 ${reminderTime} 的記帳提醒`
                      toast.success(
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          <span>{message}</span>
                        </div>,
                        {
                          description: "系統會在每天固定時間發送 Email 提醒您記帳（此為 Demo 功能）",
                        }
                      )
                      addReminderToHistory({
                        message: `每日記帳提醒已啟用（${reminderTime}）`,
                        type: "daily_reminder",
                      })
                    } else {
                      toast.info("已關閉每日記帳提醒")
                    }
                  }}
                  className="w-4 h-4"
                />
                <Label htmlFor="reminder-enabled" className="cursor-pointer">
                  啟用每日提醒
                </Label>
              </div>
              {reminderEnabled && (
                <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
                  <p className="text-sm text-blue-800">
                    💡 提醒：此為 Demo 功能。實際應用中，系統會在每天 {reminderTime} 發送 Email 提醒您記帳。
                  </p>
                </div>
              )}
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsReminderDialogOpen(false)}
                >
                  取消
                </Button>
                <Button
                  onClick={() => {
                    localStorage.setItem("reminderTime", reminderTime)
                    localStorage.setItem("reminderEnabled", reminderEnabled.toString())
                    setIsReminderDialogOpen(false)
                    toast.success("提醒設定已保存")
                  }}
                >
                  保存
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* 提醒歷史記錄對話框 */}
        <Dialog open={isReminderHistoryDialogOpen} onOpenChange={setIsReminderHistoryDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                提醒歷史記錄
              </DialogTitle>
              <DialogDescription>
                查看所有提醒通知的歷史記錄
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              {reminderHistory.length > 0 ? (
                <div className="space-y-3">
                  {reminderHistory.map((reminder) => {
                    const getIcon = () => {
                      switch (reminder.type) {
                        case "dream_completed":
                          return <PartyPopper className="w-5 h-5 text-yellow-500" />
                        case "dream_near_complete":
                          return <Bell className="w-5 h-5 text-blue-500" />
                        case "daily_reminder":
                          return <Mail className="w-5 h-5 text-green-500" />
                        default:
                          return <Bell className="w-5 h-5 text-gray-500" />
                      }
                    }

                    const getTypeLabel = () => {
                      switch (reminder.type) {
                        case "dream_completed":
                          return "夢想完成"
                        case "dream_near_complete":
                          return "即將完成"
                        case "daily_reminder":
                          return "每日提醒"
                        default:
                          return "其他"
                      }
                    }

                    return (
                      <div
                        key={reminder.id}
                        className="p-4 rounded-lg border border-border hover:bg-accent/20 transition-colors"
                      >
                        <div className="flex items-start gap-3">
                          <div className="mt-0.5">{getIcon()}</div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm font-semibold text-foreground">
                                {getTypeLabel()}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {reminder.date} {reminder.time}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground">{reminder.message}</p>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <p className="text-sm text-muted-foreground">尚無提醒記錄</p>
                </div>
              )}
              {reminderHistory.length > 0 && (
                <div className="flex justify-end pt-4 border-t">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      if (confirm("確定要清除所有提醒記錄嗎？")) {
                        setReminderHistory([])
                        localStorage.removeItem("reminderHistory")
                        toast.success("已清除所有提醒記錄")
                      }
                    }}
                  >
                    <X className="w-4 h-4 mr-2" />
                    清除所有記錄
                  </Button>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>

        {/* 新增夢想對話框 */}
        <Dialog open={isAddWishDialogOpen} onOpenChange={setIsAddWishDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>新增夢想</DialogTitle>
              <DialogDescription>
                新增一個新的夢想目標
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="new-wish-name">夢想名稱</Label>
                <Input
                  id="new-wish-name"
                  type="text"
                  placeholder="例如：買車"
                  value={newWishData.name}
                  onChange={(e) => setNewWishData({ ...newWishData, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-wish-cost">目標金額</Label>
                <Input
                  id="new-wish-cost"
                  type="text"
                  placeholder="例如：500,000"
                  value={newWishData.cost}
                  onChange={(e) => {
                    const parsed = e.target.value.replace(/,/g, "")
                    const formatted = parsed ? parseInt(parsed || "0").toLocaleString("zh-TW") : ""
                    setNewWishData({ ...newWishData, cost: formatted })
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-wish-currentSaved">已完成金額</Label>
                <Input
                  id="new-wish-currentSaved"
                  type="text"
                  placeholder="例如：50,000"
                  value={newWishData.currentSaved}
                  onChange={(e) => {
                    const parsed = e.target.value.replace(/,/g, "")
                    const formatted = parsed ? parseInt(parsed || "0").toLocaleString("zh-TW") : ""
                    setNewWishData({ ...newWishData, currentSaved: formatted })
                  }}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="new-wish-year">目標年份</Label>
                  <Input
                    id="new-wish-year"
                    type="number"
                    placeholder="例如：2025"
                    value={newWishData.year}
                    onChange={(e) => setNewWishData({ ...newWishData, year: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-wish-month">目標月份</Label>
                  <Select
                    value={newWishData.month}
                    onValueChange={(value) => setNewWishData({ ...newWishData, month: value })}
                  >
                    <SelectTrigger id="new-wish-month">
                      <SelectValue placeholder="選擇月份" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                        <SelectItem key={month} value={month.toString()}>
                          {month} 月
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsAddWishDialogOpen(false)
                    setNewWishData({
                      name: "",
                      cost: "",
                      currentSaved: "",
                      year: new Date().getFullYear().toString(),
                      month: "",
                      icon: "other",
                    })
                  }}
                >
                  取消
                </Button>
                <Button
                  onClick={() => {
                    if (!newWishData.name || !newWishData.cost) {
                      toast.error("請填寫夢想名稱和目標金額")
                      return
                    }
                    const existingWishes = localStorage.getItem("wishes")
                    const wishes = existingWishes ? JSON.parse(existingWishes) : []
                    const newWish = {
                      id: Date.now().toString(),
                      name: newWishData.name,
                      cost: newWishData.cost,
                      currentSaved: newWishData.currentSaved || "0",
                      year: newWishData.year,
                      month: newWishData.month,
                      icon: newWishData.icon,
                    }
                    const updatedWishes = [...wishes, newWish]
                    localStorage.setItem("wishes", JSON.stringify(updatedWishes))
                    setWishes(updatedWishes)
                    toast.success("夢想已新增")
                    setIsAddWishDialogOpen(false)
                    setNewWishData({
                      name: "",
                      cost: "",
                      currentSaved: "",
                      year: new Date().getFullYear().toString(),
                      month: "",
                      icon: "other",
                    })
                    // 重新載入數據
                    window.location.reload()
                  }}
                >
                  保存
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* 記帳記錄列表 */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <FileText className="w-6 h-6 text-primary" />
              <h2 className="text-xl font-semibold text-foreground">記帳記錄</h2>
            </div>
            <div className="flex gap-2 flex-wrap">
              <Input
                placeholder="搜尋描述..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="w-40"
              />
              <Select value={filterCategory} onValueChange={(value) => {
                setFilterCategory(value)
                setFilterSubCategory("all") // 重置子分類
              }}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="主分類" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部主分類</SelectItem>
                  {availableCategories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={filterSubCategory} onValueChange={setFilterSubCategory}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="子分類" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部子分類</SelectItem>
                  {availableSubCategories.map((subCat) => (
                    <SelectItem key={subCat} value={subCat}>
                      {subCat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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

          {/* 批次操作欄 */}
          {filteredRecords.length > 0 && (
            <div className="flex items-center justify-between mb-4 p-3 rounded-lg bg-accent/30 border border-border">
              <div className="flex items-center gap-3">
                <Checkbox
                  checked={selectedRecordIds.size > 0 && selectedRecordIds.size === filteredRecords.length}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      // 全選
                      setSelectedRecordIds(new Set(filteredRecords.map((r) => r.id)))
                    } else {
                      // 取消全選
                      setSelectedRecordIds(new Set())
                    }
                  }}
                />
                <span className="text-sm text-muted-foreground">
                  已選擇 {selectedRecordIds.size} 筆記錄
                </span>
              </div>
              {selectedRecordIds.size > 0 && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    // 批次刪除
                    const updatedRecords = records.filter((r) => !selectedRecordIds.has(r.id))
                    localStorage.setItem("accountingRecords", JSON.stringify(updatedRecords))
                    setRecords(updatedRecords)
                    setSelectedRecordIds(new Set())
                    
                    // 如果刪除的記錄中有儲蓄相關的，需要更新願望和緊急預備金
                    const deletedRecords = records.filter((r) => selectedRecordIds.has(r.id))
                    const hasSavings = deletedRecords.some((r) => r.subCategory === "儲蓄")
                    
                    if (hasSavings) {
                      // 更新願望的已完成金額
                      const wishesStr = localStorage.getItem("wishes")
                      if (wishesStr) {
                        try {
                          const wishes = JSON.parse(wishesStr)
                          const updatedWishes = wishes.map((wish: any) => {
                            const relatedSavings = deletedRecords.filter(
                              (r) => r.description.includes(wish.name) && r.subCategory === "儲蓄"
                            )
                            if (relatedSavings.length > 0) {
                              const subtractAmount = relatedSavings.reduce((sum, r) => sum + r.amount, 0)
                              const currentSaved = parseFloat(wish.currentSaved ? wish.currentSaved.replace(/,/g, "") : "0")
                              const newSaved = Math.max(0, currentSaved - subtractAmount)
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
                      const emergencySavings = deletedRecords.filter(
                        (r) => r.description.includes("緊急預備金") && r.subCategory === "儲蓄"
                      )
                      if (emergencySavings.length > 0) {
                        const subtractAmount = emergencySavings.reduce((sum, r) => sum + r.amount, 0)
                        const currentSavings = parseFloat(localStorage.getItem("availableSavings") || "0")
                        const newSavings = Math.max(0, currentSavings - subtractAmount)
                        localStorage.setItem("availableSavings", newSavings.toString())
                        setAvailableSavings(newSavings)
                        
                        // 同步更新 step2Data
                        const step2DataStr = localStorage.getItem("step2Data")
                        if (step2DataStr) {
                          try {
                            const step2Data = JSON.parse(step2DataStr)
                            step2Data.availableSavings = newSavings.toString()
                            localStorage.setItem("step2Data", JSON.stringify(step2Data))
                          } catch (e) {
                            console.error("Error updating step2Data", e)
                          }
                        }
                      }
                    }
                  }}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  批次刪除 ({selectedRecordIds.size})
                </Button>
              )}
            </div>
          )}

          {filteredRecords.length > 0 ? (
            <div className="space-y-2">
              {filteredRecords.map((record, index) => {
                const isEditing = editingRecordId === record.id
                const recordData = isEditing ? editingRecordData : record

                return (
                  <div
                    key={`${record.id}-${index}`}
                    className="p-4 rounded-lg border border-border hover:bg-accent/20 transition-colors flex items-start gap-3"
                  >
                    {/* 勾選框 */}
                    <div className="pt-1">
                      <Checkbox
                        checked={selectedRecordIds.has(record.id)}
                        disabled={isEditing}
                        onCheckedChange={(checked) => {
                          if (!isEditing) {
                            const newSelected = new Set(selectedRecordIds)
                            if (checked) {
                              newSelected.add(record.id)
                            } else {
                              newSelected.delete(record.id)
                            }
                            setSelectedRecordIds(newSelected)
                          }
                        }}
                      />
                    </div>
                    
                    <div className="flex-1">
                    {isEditing ? (
                      <div className="space-y-3 w-full">
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
                      <div className="flex items-center justify-between w-full">
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

