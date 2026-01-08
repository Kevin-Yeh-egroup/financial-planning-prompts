"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Plane, GraduationCap, Home, Gift, ShoppingBag, Heart, Calendar, TrendingUp, CheckCircle2, Lightbulb, Wallet } from "lucide-react"

const iconMap: { [key: string]: any } = {
  travel: Plane,
  education: GraduationCap,
  home: Home,
  gift: Gift,
  shopping: ShoppingBag,
  other: Heart,
}

export default function Step4Page() {
  const [availableSavings, setAvailableSavings] = useState(0)
  const [monthlyExpenses, setMonthlyExpenses] = useState(33000)
  const [emergencyTarget, setEmergencyTarget] = useState(0)
  const [flexibleAmount, setFlexibleAmount] = useState(0)
  const [savingsPlans, setSavingsPlans] = useState<any[]>([])

  // 從 localStorage 讀取數據
  useEffect(() => {
    if (typeof window === "undefined") return

    // 讀取可動用存款
    const saved = localStorage.getItem("availableSavings")
    if (saved) {
      setAvailableSavings(parseFloat(saved) || 0)
    }

    // 從 step2 讀取每月支出和收入
    const step2DataStr = localStorage.getItem("step2Data")
    if (step2DataStr) {
      try {
        const step2Data = JSON.parse(step2DataStr)
        const fixedExpenses = step2Data.fixedExpenses || {}
        const variableExpenses = step2Data.variableExpenses || {}
        const businessVariableExpenses = step2Data.hasBusiness ? (step2Data.businessVariableExpenses || {}) : {}
        const businessFixedExpenses = step2Data.hasBusiness ? (step2Data.businessFixedExpenses || {}) : {}
        const businessExtraExpenses = step2Data.hasBusiness ? (step2Data.businessExtraExpenses || {}) : {}

        // 計算總支出
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

        const totalExpenses = totalFixedExpenses + totalVariableExpenses + totalBusinessFixedExpenses + totalBusinessVariableExpenses + totalBusinessExtraExpenses
        setMonthlyExpenses(totalExpenses)
        setEmergencyTarget(totalExpenses * 6)

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
        
        // 計算每月可彈性運用金額
        const flexible = totalIncome - totalExpenses
        const calculatedFlexibleAmount = Math.max(0, flexible)
        setFlexibleAmount(calculatedFlexibleAmount)

        // 從 step1 讀取願望數據（在同一個 useEffect 中，這樣可以使用 calculatedFlexibleAmount）
        const wishesStr = localStorage.getItem("wishes")
        if (wishesStr) {
          try {
            const wishes = JSON.parse(wishesStr)
            const currentYear = new Date().getFullYear()
            const currentMonth = new Date().getMonth() + 1

            // 過濾掉空的願望
            const validWishes = wishes.filter((wish: any) => wish.name && wish.name.trim() !== "")

            const plans = validWishes.map((wish: any, index: number) => {
              const targetYear = parseInt(wish.year || currentYear.toString())
              const targetMonth = parseInt(wish.month || "12")
              const targetAmount = parseFloat(wish.cost ? wish.cost.replace(/,/g, "") : "0")
              const currentSaved = parseFloat(wish.currentSaved ? wish.currentSaved.replace(/,/g, "") : "0")

              // 計算剩餘月數
              let monthsRemaining = 0
              if (targetYear > currentYear) {
                monthsRemaining = (targetYear - currentYear - 1) * 12 + (12 - currentMonth) + targetMonth
              } else if (targetYear === currentYear) {
                monthsRemaining = Math.max(0, targetMonth - currentMonth)
              } else {
                monthsRemaining = 0
              }

              // 計算還需要多少金額
              const stillNeeded = Math.max(0, targetAmount - currentSaved)

              // 計算每月需存金額
              const monthlySaving = monthsRemaining > 0 ? Math.ceil(stillNeeded / monthsRemaining) : stillNeeded

              // 判斷是否可以達成：每月需存金額 <= 每月可彈性運用金額
              const isFeasible = monthlySaving <= calculatedFlexibleAmount

              // 選擇圖標
              const IconComponent = iconMap[wish.icon as keyof typeof iconMap] || Heart

              // 選擇顏色（根據索引）
              const colors = [
                "from-blue-500/20 to-cyan-500/20",
                "from-green-500/20 to-emerald-500/20",
                "from-purple-500/20 to-pink-500/20",
                "from-orange-500/20 to-red-500/20",
                "from-yellow-500/20 to-amber-500/20",
              ]
              const color = colors[index % colors.length]

              return {
                name: wish.name,
                icon: IconComponent,
                targetAmount,
                currentSaved,
                monthsRemaining: Math.max(0, monthsRemaining),
                monthlySaving,
                month: `${targetMonth}月`,
                color,
                isFeasible,
              }
            })

            setSavingsPlans(plans)
          } catch (e) {
            console.error("Error parsing wishes", e)
          }
        }
      } catch (e) {
        console.error("Error parsing step2Data", e)
      }
    }

    // 如果 step2Data 不存在，仍然嘗試讀取願望數據
    if (!step2DataStr) {
      const wishesStr = localStorage.getItem("wishes")
      if (wishesStr) {
        try {
          const wishes = JSON.parse(wishesStr)
          const currentYear = new Date().getFullYear()
          const currentMonth = new Date().getMonth() + 1

          // 過濾掉空的願望
          const validWishes = wishes.filter((wish: any) => wish.name && wish.name.trim() !== "")

          const plans = validWishes.map((wish: any, index: number) => {
            const targetYear = parseInt(wish.year || currentYear.toString())
            const targetMonth = parseInt(wish.month || "12")
            const targetAmount = parseFloat(wish.cost ? wish.cost.replace(/,/g, "") : "0")
            const currentSaved = parseFloat(wish.currentSaved ? wish.currentSaved.replace(/,/g, "") : "0")

            // 計算剩餘月數
            let monthsRemaining = 0
            if (targetYear > currentYear) {
              monthsRemaining = (targetYear - currentYear - 1) * 12 + (12 - currentMonth) + targetMonth
            } else if (targetYear === currentYear) {
              monthsRemaining = Math.max(0, targetMonth - currentMonth)
            } else {
              monthsRemaining = 0
            }

            // 計算還需要多少金額
            const stillNeeded = Math.max(0, targetAmount - currentSaved)

            // 計算每月需存金額
            const monthlySaving = monthsRemaining > 0 ? Math.ceil(stillNeeded / monthsRemaining) : stillNeeded

            // 選擇圖標
            const IconComponent = iconMap[wish.icon as keyof typeof iconMap] || Heart

            // 選擇顏色（根據索引）
            const colors = [
              "from-blue-500/20 to-cyan-500/20",
              "from-green-500/20 to-emerald-500/20",
              "from-purple-500/20 to-pink-500/20",
              "from-orange-500/20 to-red-500/20",
              "from-yellow-500/20 to-amber-500/20",
            ]
            const color = colors[index % colors.length]

            return {
              name: wish.name,
              icon: IconComponent,
              targetAmount,
              currentSaved,
              monthsRemaining: Math.max(0, monthsRemaining),
              monthlySaving,
              month: `${targetMonth}月`,
              color,
              isFeasible: false, // 如果沒有 step2Data，無法判斷
            }
          })

          setSavingsPlans(plans)
        } catch (e) {
          console.error("Error parsing wishes", e)
        }
      }
    }
  }, [])

  // 計算可用於夢想的金額（可動用存款 - 緊急預備金需求）
  const remainingForDreams = Math.max(0, availableSavings - emergencyTarget)

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-accent/20">
      <div className="container mx-auto px-4 py-8 md:py-12 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-4 text-balance">你的願望，需要這樣準備</h1>
          <p className="text-lg text-muted-foreground leading-relaxed text-pretty">
            如果這個月先存下來，
            <br />
            願望就不會擠壓生活費。
          </p>
        </div>

        {/* Available for Dreams */}
        {remainingForDreams > 0 && (
          <Card className="p-4 md:p-6 bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20 mb-6">
            <div className="flex items-center gap-3">
              <Wallet className="w-5 h-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">可用於夢想規劃的金額</p>
                <p className="text-xl font-bold text-primary">NT$ {remainingForDreams.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground mt-1">（已優先滿足緊急預備金需求）</p>
              </div>
            </div>
          </Card>
        )}

        {/* Savings Plans */}
        <div className="space-y-6 mb-8">
          {savingsPlans.map((plan, index) => {
            const progress = (plan.currentSaved / plan.targetAmount) * 100
            const IconComponent = plan.icon
            // 使用 plan 中已計算的 isFeasible，如果沒有則使用 flexibleAmount 判斷
            const isFeasible = plan.isFeasible !== undefined ? plan.isFeasible : (plan.monthlySaving <= flexibleAmount)
            return (
              <Card
                key={index}
                className={`p-6 md:p-8 bg-gradient-to-br ${plan.color} backdrop-blur border-primary/20 hover:shadow-lg transition-shadow`}
              >
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-16 h-16 rounded-xl bg-card/80 backdrop-blur flex items-center justify-center flex-shrink-0 shadow-sm">
                    <IconComponent className="w-8 h-8 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h2 className="text-2xl font-semibold text-foreground">{plan.name}</h2>
                      {isFeasible ? (
                        <div className="flex items-center gap-2 text-primary bg-primary/10 px-3 py-1 rounded-full">
                          <CheckCircle2 className="w-4 h-4" />
                          <span className="text-sm font-medium">可達成</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-muted-foreground bg-accent/50 px-3 py-1 rounded-full">
                          <span className="text-sm font-medium">需規劃</span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm">目標完成時間：{plan.month}</span>
                    </div>
                  </div>
                </div>

                {/* Progress */}
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-muted-foreground">目前進度</span>
                    <span className="text-sm font-medium text-foreground">
                      NT$ {plan.currentSaved.toLocaleString()} / NT$ {plan.targetAmount.toLocaleString()}
                    </span>
                  </div>
                  <Progress value={progress} className="h-3 mb-1" />
                  <p className="text-xs text-muted-foreground text-right">{Math.round(progress)}% 完成</p>
                </div>

                {/* Savings Info */}
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-lg bg-card/60 backdrop-blur">
                    <p className="text-xs text-muted-foreground mb-1">還需要</p>
                    <p className="text-lg font-semibold text-foreground">
                      NT$ {(plan.targetAmount - plan.currentSaved).toLocaleString()}
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-card/60 backdrop-blur">
                    <p className="text-xs text-muted-foreground mb-1">剩餘時間</p>
                    <p className="text-lg font-semibold text-foreground">{plan.monthsRemaining} 個月</p>
                  </div>
                  <div className={`p-4 rounded-lg backdrop-blur border ${isFeasible ? 'bg-primary/10 border-primary/20' : 'bg-destructive/10 border-destructive/20'}`}>
                    <div className="flex items-center gap-1 mb-1">
                      <TrendingUp className={`w-3 h-3 ${isFeasible ? 'text-primary' : 'text-destructive'}`} />
                      <p className={`text-xs font-medium ${isFeasible ? 'text-primary' : 'text-destructive'}`}>每個月需存</p>
                    </div>
                    <p className={`text-lg font-bold ${isFeasible ? 'text-primary' : 'text-destructive'}`}>NT$ {plan.monthlySaving.toLocaleString()}</p>
                  </div>
                </div>

                {/* Feasibility Message */}
                {!isFeasible && (
                  <div className="mt-4 p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                    <p className="text-sm text-destructive">
                      ⚠️ 每月需存金額（NT$ {plan.monthlySaving.toLocaleString()}）超過可彈性運用金額（NT$ {flexibleAmount.toLocaleString()}），需要調整目標時間或金額。
                    </p>
                  </div>
                )}
                {isFeasible && (
                  <div className="mt-4 p-3 rounded-lg bg-primary/10 border border-primary/20">
                    <p className="text-sm text-primary">
                      ✓ 每月需存金額在可彈性運用範圍內，可以達成目標。
                    </p>
                  </div>
                )}
              </Card>
            )
          })}
        </div>

        {/* Helper Card */}
        <Card className="p-6 md:p-8 bg-accent/30 border-accent">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-secondary/50 flex items-center justify-center flex-shrink-0">
              <Lightbulb className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-primary" />
                小提醒
              </h3>
                <p className="text-muted-foreground leading-relaxed text-sm">
                {savingsPlans.length > 0 ? (
                  <>
                    如果這個月先把「{savingsPlans[0].name}」的 NT$ {savingsPlans[0].monthlySaving.toLocaleString()}
                    存下來，願望就不會擠壓到日常生活費。建議可以在發薪日當天就先轉到專用帳戶，這樣剩下的錢才是真正可以花的。
                  </>
                ) : (
                  "建議可以在發薪日當天就先轉到專用帳戶，這樣剩下的錢才是真正可以花的。"
                )}
              </p>
            </div>
          </div>
        </Card>

        {/* CTA */}
        <div className="flex justify-between items-center mt-8">
          <Link href="/step3">
            <Button variant="ghost">返回</Button>
          </Link>
          <Link href="/step5">
            <Button size="lg" className="px-8 py-6 rounded-xl">
              下一步，保護計畫不被打亂
            </Button>
          </Link>
        </div>
      </div>
    </main>
  )
}

