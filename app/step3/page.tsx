"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { CheckCircle2, DollarSign, TrendingUp, Calendar, Sparkles, Wallet } from "lucide-react"

export default function Step3Page() {
  const [availableSavings, setAvailableSavings] = useState(0)
  const [monthlyIncome, setMonthlyIncome] = useState(0)
  const [monthlyFixedExpenses, setMonthlyFixedExpenses] = useState(0)
  const [monthlyVariableExpenses, setMonthlyVariableExpenses] = useState(0)
  const [flexibleAmount, setFlexibleAmount] = useState(0)
  const [feasibleWishes, setFeasibleWishes] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // 確保在客戶端執行
    if (typeof window === "undefined") {
      return
    }
    
    // 從 localStorage 讀取 step2 的數據
    const loadData = () => {
      const step2DataStr = localStorage.getItem("step2Data")
      console.log("Step3: step2DataStr", step2DataStr)
      
      if (!step2DataStr) {
        console.log("Step3: No data found")
        setIsLoading(false)
        return
      }
      
      try {
        const step2Data = JSON.parse(step2DataStr)
        console.log("Step3: Parsed data", step2Data)
      
      // 可動用儲蓄
      const savings = parseFloat(step2Data.availableSavings || "0")
      setAvailableSavings(savings)

      // 計算總收入
      const fixedIncome = step2Data.fixedIncome || {}
      const variableIncome = step2Data.variableIncome || {}
      const businessIncome = step2Data.hasBusiness ? (step2Data.businessIncome || {}) : {}
      
      const totalFixedIncome = 
        parseFloat(fixedIncome.salary || "0") +
        parseFloat(fixedIncome.rent || "0") +
        parseFloat(fixedIncome.investment || "0") +
        parseFloat(fixedIncome.pension || "0") +
        parseFloat(fixedIncome.governmentSubsidy || "0")
      
      const totalVariableIncome =
        parseFloat(variableIncome.sideJob || "0") +
        parseFloat(variableIncome.temporaryWork || "0") +
        parseFloat(variableIncome.interest || "0") +
        parseFloat(variableIncome.gift || "0") +
        parseFloat(variableIncome.other || "0")
      
      const totalBusinessIncome = step2Data.hasBusiness
        ? parseFloat(businessIncome.productSales || "0") +
          parseFloat(businessIncome.serviceIncome || "0") +
          parseFloat(businessIncome.equipmentSale || "0") +
          parseFloat(businessIncome.venueRental || "0") +
          parseFloat(businessIncome.partnership || "0") +
          parseFloat(businessIncome.other || "0")
        : 0
      
      const totalIncome = totalFixedIncome + totalVariableIncome + totalBusinessIncome
      setMonthlyIncome(totalIncome)

      // 計算總支出
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
      
      const totalBusinessVariableExpenses = step2Data.hasBusiness
        ? parseFloat(businessVariableExpenses.materials || "0") +
          parseFloat(businessVariableExpenses.packaging || "0") +
          parseFloat(businessVariableExpenses.supplies || "0") +
          parseFloat(businessVariableExpenses.shipping || "0") +
          parseFloat(businessVariableExpenses.other || "0")
        : 0
      
      const totalBusinessFixedExpenses = step2Data.hasBusiness
        ? parseFloat(businessFixedExpenses.rent || "0") +
          parseFloat(businessFixedExpenses.personnel || "0") +
          parseFloat(businessFixedExpenses.utilities || "0") +
          parseFloat(businessFixedExpenses.gas || "0") +
          parseFloat(businessFixedExpenses.communication || "0") +
          parseFloat(businessFixedExpenses.repayment || "0") +
          parseFloat(businessFixedExpenses.other || "0")
        : 0
      
      const totalBusinessExtraExpenses = step2Data.hasBusiness
        ? parseFloat(businessExtraExpenses.equipment || "0") +
          parseFloat(businessExtraExpenses.repair || "0") +
          parseFloat(businessExtraExpenses.marketing || "0") +
          parseFloat(businessExtraExpenses.other || "0")
        : 0
      
      const totalBusinessExpenses = totalBusinessVariableExpenses + totalBusinessFixedExpenses + totalBusinessExtraExpenses
      
      setMonthlyFixedExpenses(totalFixedExpenses + totalBusinessFixedExpenses)
      setMonthlyVariableExpenses(totalVariableExpenses + totalBusinessVariableExpenses + totalBusinessExtraExpenses)
      
      // 計算可彈性運用金額
      const totalExpenses = totalFixedExpenses + totalVariableExpenses + totalBusinessExpenses
      const flexible = totalIncome - totalExpenses
      const calculatedFlexibleAmount = Math.max(0, flexible)
      setFlexibleAmount(calculatedFlexibleAmount)

      // 從 localStorage 讀取願望數據
      const wishesStr = localStorage.getItem("wishes")
      console.log("Step3: wishesStr", wishesStr)
      if (wishesStr) {
        try {
          const wishes = JSON.parse(wishesStr)
          console.log("Step3: Parsed wishes", wishes)
          const currentYear = new Date().getFullYear()
          const currentMonth = new Date().getMonth() + 1
          
          // 過濾掉空的願望（沒有名稱的）
          const validWishes = wishes.filter((wish: any) => wish.name && wish.name.trim() !== "")
          console.log("Step3: Valid wishes", validWishes)
          
          if (validWishes.length > 0) {
            const wishesWithStatus = validWishes.map((wish: any) => {
              const targetYear = parseInt(wish.year || currentYear.toString())
              const targetMonth = parseInt(wish.month || "12")
              const cost = parseFloat(wish.cost ? wish.cost.replace(/,/g, "") : "0")
              const currentSaved = parseFloat(wish.currentSaved ? wish.currentSaved.replace(/,/g, "") : "0")
              
              // 計算剩餘月數
              let monthsRemaining = 0
              if (targetYear > currentYear) {
                monthsRemaining = (targetYear - currentYear - 1) * 12 + (12 - currentMonth) + targetMonth
              } else if (targetYear === currentYear) {
                monthsRemaining = Math.max(0, targetMonth - currentMonth)
              } else {
                monthsRemaining = 0 // 已過期
              }
              
              // 計算還需要多少金額
              const stillNeeded = Math.max(0, cost - currentSaved)
              
              // 判斷是否需要儲蓄（如果還需要的金額大於可彈性運用金額，需要儲蓄）
              const needsSaving = stillNeeded > calculatedFlexibleAmount
              
              // 計算進度百分比
              const progress = cost > 0 ? (currentSaved / cost) * 100 : 0
              
              return {
                name: wish.name,
                amount: cost,
                currentSaved: currentSaved,
                stillNeeded: stillNeeded,
                month: targetMonth,
                year: targetYear,
                monthsRemaining: Math.max(0, monthsRemaining),
                needsSaving,
                progress: Math.min(100, Math.max(0, progress)),
              }
            })
            
            console.log("Step3: wishesWithStatus", wishesWithStatus)
            setFeasibleWishes(wishesWithStatus)
          }
        } catch (error) {
          console.error("Step3: Error parsing wishes", error)
        }
      } else {
        console.log("Step3: No wishes found in localStorage")
      }
      
      setIsLoading(false)
      } catch (error) {
        console.error("Step3: Error parsing data", error)
        setIsLoading(false)
      }
    }
    
    // 立即載入數據
    loadData()
    
    // 添加一個小延遲，確保數據已保存
    const timer = setTimeout(() => {
      loadData()
    }, 100)
    
    // 監聽 localStorage 變化（當從 step2 導航過來時）
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "step2Data") {
        loadData()
      }
    }
    
    window.addEventListener("storage", handleStorageChange)
    
    // 也監聽自定義事件（同頁面內的變化）
    const handleCustomStorage = () => {
      loadData()
    }
    window.addEventListener("step2DataUpdated", handleCustomStorage)
    
    return () => {
      clearTimeout(timer)
      window.removeEventListener("storage", handleStorageChange)
      window.removeEventListener("step2DataUpdated", handleCustomStorage)
    }
  }, [])

  if (isLoading) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-background to-accent/20">
        <div className="container mx-auto px-4 py-8 md:py-12 max-w-4xl">
          <div className="text-center">
            <p className="text-muted-foreground">載入中...</p>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-accent/20">
      <div className="container mx-auto px-4 py-8 md:py-12 max-w-4xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="flex justify-center mb-4">
            <Sparkles className="w-12 h-12 text-primary" />
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-4 text-balance">這是你目前的整體狀況</h1>
          <p className="text-lg text-muted-foreground">讓我們一起看清楚錢的流向</p>
        </div>

        <div className="space-y-6">
          {/* Available Savings */}
          {availableSavings > 0 && (
            <Card className="p-6 md:p-8 bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <Wallet className="w-8 h-8 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground mb-1">目前我可動用的存款金額</p>
                  <p className="text-3xl font-bold text-primary">NT$ {availableSavings.toLocaleString()}</p>
                </div>
              </div>
            </Card>
          )}

          {/* Financial Overview */}
          <Card className="p-6 md:p-8 bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/20">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-3">
                  <DollarSign className="w-8 h-8 text-primary" />
                </div>
                <p className="text-sm text-muted-foreground mb-1">每月收入</p>
                <p className="text-2xl font-bold text-foreground">NT$ {monthlyIncome.toLocaleString()}</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-secondary/50 flex items-center justify-center mx-auto mb-3">
                  <TrendingUp className="w-8 h-8 text-primary" />
                </div>
                <p className="text-sm text-muted-foreground mb-1">每月總支出</p>
                <p className="text-2xl font-bold text-foreground">
                  NT$ {(monthlyFixedExpenses + monthlyVariableExpenses).toLocaleString()}
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-accent/50 flex items-center justify-center mx-auto mb-3">
                  <Calendar className="w-8 h-8 text-primary" />
                </div>
                <p className="text-sm text-muted-foreground mb-1">每月可彈性運用</p>
                <p className="text-2xl font-bold text-primary">NT$ {flexibleAmount.toLocaleString()}</p>
              </div>
            </div>
          </Card>

          {/* Explanation Card */}
          <Card className="p-6 md:p-8 bg-card/80 backdrop-blur">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-foreground mb-2">目前狀況說明</h2>
                <div className="space-y-3 text-muted-foreground leading-relaxed">
                  {availableSavings > 0 && (
                    <p>
                      您目前可動用的存款金額為{" "}
                      <span className="font-semibold text-primary">NT$ {availableSavings.toLocaleString()}</span>，
                      <br />
                      這筆金額將優先分配給緊急預備金，剩餘部分可用於夢想規劃。
                    </p>
                  )}
                  <p>
                    目前你的固定支出已預留完成，
                    <br />
                    每月約有 <span className="font-semibold text-primary">NT$ {flexibleAmount.toLocaleString()}</span>{" "}
                    可以彈性運用。
                  </p>
                  {feasibleWishes.length > 0 && (
                    <p className="text-sm bg-accent/30 p-4 rounded-lg">
                      💡 根據您的願望清單，系統會自動計算每個願望的儲蓄計畫，幫助您達成目標。
                    </p>
                  )}
                </div>
              </div>
            </div>
          </Card>

          {/* Wish Status */}
          <Card className="p-6 md:p-8 bg-card/80 backdrop-blur">
            <h2 className="text-xl font-semibold text-foreground mb-6">你的願望實現狀況</h2>
            <div className="space-y-4">
              {feasibleWishes.map((wish, index) => (
                <div
                  key={index}
                  className="p-4 rounded-lg bg-gradient-to-r from-accent/20 to-secondary/20 border border-border"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-medium text-foreground mb-1">{wish.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        目標金額：NT$ {wish.amount.toLocaleString()} | 完成時間：{wish.year} 年 {wish.month} 月
                        {wish.monthsRemaining > 0 && ` (剩餘 ${wish.monthsRemaining} 個月)`}
                        {wish.stillNeeded > 0 && (
                          <span className="ml-2 text-primary">| 還需要：NT$ {wish.stillNeeded.toLocaleString()}</span>
                        )}
                      </p>
                    </div>
                    {!wish.needsSaving && (
                      <div className="flex items-center gap-2 text-primary">
                        <CheckCircle2 className="w-5 h-5" />
                        <span className="text-sm font-medium">可達成</span>
                      </div>
                    )}
                  </div>
                  <Progress value={wish.progress || 0} className="mb-2 h-2" />
                  {wish.needsSaving ? (
                    <>
                      <p className="text-sm text-muted-foreground">
                        需要規劃儲蓄計畫
                        {wish.monthsRemaining > 0 && wish.stillNeeded > 0 && (
                          <span className="ml-2">
                            （建議每月存 NT$ {Math.ceil(wish.stillNeeded / wish.monthsRemaining).toLocaleString()}）
                          </span>
                        )}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        目前已完成：NT$ {wish.currentSaved.toLocaleString()} / 目標：NT$ {wish.amount.toLocaleString()}
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="text-sm text-primary">預算內可以完成</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        目前已完成：NT$ {wish.currentSaved.toLocaleString()} / 目標：NT$ {wish.amount.toLocaleString()}
                      </p>
                    </>
                  )}
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* CTA */}
        <div className="flex justify-between items-center mt-8">
          <Link href="/step2">
            <Button variant="ghost">返回</Button>
          </Link>
          <Link href="/step4">
            <Button size="lg" className="px-8 py-6 rounded-xl">
              幫我算願望怎麼存
            </Button>
          </Link>
        </div>
      </div>
    </main>
  )
}
