"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Users, Share2, Calendar, MessageCircle, CheckCircle2, Sparkles, Mail, MessageSquare, Mic, Upload, FileText, Sparkles as SparklesIcon, BookOpen } from "lucide-react"
import { useRouter } from "next/navigation"

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

export default function Step6Page() {
  const router = useRouter()
  const [shareMethod, setShareMethod] = useState<string | null>(null)
  const [recordingMethod, setRecordingMethod] = useState<string | null>(null)
  const [isRecording, setIsRecording] = useState(false)
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const [transcriptionText, setTranscriptionText] = useState<string>("")
  const [recordingComplete, setRecordingComplete] = useState(false)

  // 處理記帳數據
  const processAccountingData = (content: string) => {
    // 這裡可以添加實際的 AI 分類邏輯
    // 目前先使用案例數據
    const existingRecords = localStorage.getItem("accountingRecords")
    let allRecords = existingRecords ? JSON.parse(existingRecords) : []
    
    // 添加新記錄（案例數據）
    allRecords = [...allRecords, ...sampleAccountingData]
    
    // 保存到 localStorage
    localStorage.setItem("accountingRecords", JSON.stringify(allRecords))
    
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
    
    setUploadSuccess(true)
    setTimeout(() => {
      setUploadSuccess(false)
      // 導航到記帳記錄頁面
      router.push("/records")
    }, 2000)
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-accent/20">
      <div className="container mx-auto px-4 py-8 md:py-12 max-w-4xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <Users className="w-16 h-16 text-primary" />
              <Sparkles className="w-8 h-8 text-secondary absolute -top-2 -right-2 animate-pulse" />
            </div>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-4 text-balance">
            全家一起知道，才真的做得到
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed text-pretty max-w-2xl mx-auto">
            當每個人都知道
            <br />
            什麼時候可以、什麼時候要等，
            <br />
            家裡就少一點吵架，多一點安心。
          </p>
        </div>

        {/* Benefits */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <Card className="p-6 bg-gradient-to-br from-primary/10 to-blue-500/10 text-center">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-3">
              <Calendar className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">清楚的時間表</h3>
            <p className="text-sm text-muted-foreground">每個願望什麼時候可以達成，一目了然</p>
          </Card>
          <Card className="p-6 bg-gradient-to-br from-secondary/20 to-amber-500/10 text-center">
            <div className="w-12 h-12 rounded-full bg-secondary/50 flex items-center justify-center mx-auto mb-3">
              <MessageCircle className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">減少金錢爭執</h3>
            <p className="text-sm text-muted-foreground">不用猜測，不用等月底才發現錢不夠</p>
          </Card>
          <Card className="p-6 bg-gradient-to-br from-accent/30 to-green-500/10 text-center">
            <div className="w-12 h-12 rounded-full bg-accent/50 flex items-center justify-center mx-auto mb-3">
              <CheckCircle2 className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">一起為目標努力</h3>
            <p className="text-sm text-muted-foreground">全家人都能看到進度，更有動力</p>
          </Card>
        </div>

        {/* Record Keeping Card */}
        <Card className="p-6 md:p-8 bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
              <FileText className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-semibold text-foreground">落實記帳</h2>
              <p className="text-sm text-muted-foreground mt-1">
                透過語音輸入或上傳帳務資訊，我們會自動幫您分類整理並分析現金流
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <Button
              variant="outline"
              className={`p-6 h-auto flex flex-col items-center gap-3 hover:bg-primary/5 transition-all ${
                recordingMethod === "voice" ? "border-primary bg-primary/5" : ""
              }`}
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
              <div className="text-center">
                <p className="font-semibold text-foreground mb-1">語音輸入記帳</p>
                <p className="text-sm text-muted-foreground">
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
              <div className="text-center">
                <p className="font-semibold text-foreground mb-1">上傳帳務資訊</p>
                <p className="text-sm text-muted-foreground">
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
                          // 處理語音轉錄的數據
                          processAccountingData(transcriptionText)
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
                        <Button size="sm" className="mt-3" variant="outline">
                          選擇檔案
                        </Button>
                      </label>
                    </div>
                  )}
                </div>
              </div>
              <div className="mt-4 p-3 rounded-lg bg-card/60">
                <p className="text-xs font-medium text-foreground mb-2 flex items-center gap-2">
                  <SparklesIcon className="w-4 h-4 text-primary" />
                  自動處理功能
                </p>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>✓ 自動辨識日期、項目內容、金額</li>
                  <li>✓ 自動分類為生意收入/支出、生活收入/支出</li>
                  <li>✓ 生成月度收支統計表</li>
                  <li>✓ 提供現金流分析與財務建議</li>
                  <li>✓ 自動更新夢想完成進度與緊急預備金</li>
                </ul>
              </div>
            </div>
          )}

          {!recordingMethod && (
            <div className="p-4 rounded-lg bg-card/60 border border-border">
              <p className="text-sm text-muted-foreground text-center">
                選擇上方任一方式開始記帳，系統會自動幫您分類整理並提供財務分析
              </p>
            </div>
          )}
        </Card>

        {/* Share Options */}
        <Card className="p-6 md:p-8 bg-card/80 backdrop-blur mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Share2 className="w-6 h-6 text-primary" />
            </div>
            <h2 className="text-2xl font-semibold text-foreground">分享給家人</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <Button
              variant="outline"
              className={`p-6 h-auto flex flex-col items-center gap-3 hover:bg-primary/5 ${shareMethod === "link" ? "border-primary bg-primary/5" : ""}`}
              onClick={() => setShareMethod("link")}
            >
              <Share2 className="w-8 h-8 text-primary" />
              <div className="text-center">
                <p className="font-semibold text-foreground mb-1">產生分享連結</p>
                <p className="text-sm text-muted-foreground">複製連結傳給家人查看</p>
              </div>
            </Button>

            <Button
              variant="outline"
              className={`p-6 h-auto flex flex-col items-center gap-3 hover:bg-primary/5 ${shareMethod === "email" ? "border-primary bg-primary/5" : ""}`}
              onClick={() => setShareMethod("email")}
            >
              <Mail className="w-8 h-8 text-primary" />
              <div className="text-center">
                <p className="font-semibold text-foreground mb-1">寄送電子郵件</p>
                <p className="text-sm text-muted-foreground">直接將計畫寄到信箱</p>
              </div>
            </Button>
          </div>

          {shareMethod === "link" && (
            <div className="p-4 rounded-lg bg-accent/20 border border-accent animate-in fade-in">
              <p className="text-sm text-muted-foreground mb-2">分享連結已產生</p>
              <div className="flex gap-2">
                <input
                  type="text"
                  readOnly
                  value="https://財務管理.app/share/abc123xyz"
                  className="flex-1 px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm"
                />
                <Button size="sm" className="px-4">
                  複製
                </Button>
              </div>
            </div>
          )}

          {shareMethod === "email" && (
            <div className="p-4 rounded-lg bg-accent/20 border border-accent animate-in fade-in">
              <p className="text-sm text-muted-foreground mb-2">輸入家人的電子郵件</p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="family@example.com"
                  className="flex-1 px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm"
                />
                <Button size="sm" className="px-4">
                  寄送
                </Button>
              </div>
            </div>
          )}
        </Card>

        {/* Consultation */}
        <Card className="p-8 md:p-12 bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* 左側：文字敘述 */}
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-xl bg-card/80 backdrop-blur flex items-center justify-center flex-shrink-0">
                  <MessageSquare className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-2xl md:text-3xl font-semibold text-foreground">需要進一步的專業建議？</h3>
              </div>
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                如果你想要更細緻的規劃、投資建議，或是有複雜的家庭財務狀況需要討論，我們的理財顧問可以幫助你。
              </p>
            </div>
            {/* 右側：預約按鈕 */}
            <div className="flex-1 flex items-center justify-center md:justify-end">
              <Button 
                variant="outline" 
                size="lg"
                className="bg-card/60 text-lg px-8 py-6 h-auto rounded-xl min-w-[200px] md:min-w-[250px]"
              >
                預約免費諮詢
              </Button>
            </div>
          </div>
        </Card>

        {/* Summary Card */}
        <Card className="p-6 md:p-8 bg-accent/30 border-accent mt-6">
          <div className="text-center">
            <CheckCircle2 className="w-12 h-12 text-primary mx-auto mb-3" />
            <h3 className="text-xl font-semibold text-foreground mb-2">恭喜！你已經完成財務整理</h3>
            <p className="text-muted-foreground mb-4">現在你知道：</p>
            <ul className="text-sm text-muted-foreground space-y-2 max-w-md mx-auto text-left">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                每個月可以彈性運用多少錢
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                每個願望需要怎麼準備
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                緊急預備金還需要多少
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                如何讓全家人一起達成目標
              </li>
            </ul>
          </div>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between items-center mt-8">
          <Link href="/step5">
            <Button variant="ghost">返回</Button>
          </Link>
          <div className="flex gap-3">
            <Link href="/records">
              <Button variant="outline" size="lg" className="px-6 py-6 rounded-xl">
                <BookOpen className="w-5 h-5 mr-2" />
                查看記帳記錄
              </Button>
            </Link>
            <Link href="/">
              <Button size="lg" className="px-8 py-6 rounded-xl">
                回到首頁
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
