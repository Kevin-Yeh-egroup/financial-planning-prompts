"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Plane, GraduationCap, Home, Gift, ShoppingBag, Heart, Calendar, TrendingUp, CheckCircle2, Lightbulb, Wallet, ArrowUp, ArrowDown, GripVertical, Input as InputIcon } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

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
  
  // 格式化數字為千分位號
  const formatNumber = (value: string): string => {
    if (!value) return ""
    const numValue = value.replace(/\D/g, "")
    if (!numValue) return ""
    const num = Number(numValue)
    if (isNaN(num)) return ""
    return num.toLocaleString("zh-TW")
  }

  // 解析格式化後的數字（移除千分位號）
  const parseNumber = (value: string): string => {
    return value.replace(/,/g, "")
  }

  // 處理分配金額輸入變化
  const handleAllocationChange = (index: number, value: string) => {
    const cleaned = value.replace(/[^\d,]/g, "")
    const numValue = cleaned.replace(/,/g, "")
    if (!numValue) {
      const updated = [...savingsPlans]
      updated[index].allocatedAmount = 0
      updated[index].allocatedAmountFormatted = ""
      setSavingsPlans(updated)
      return
    }
    const num = Number(numValue)
    const updated = [...savingsPlans]
    updated[index].allocatedAmount = num
    updated[index].allocatedAmountFormatted = numValue
    // 重新計算完成時間
    if (num > 0) {
      const stillNeeded = updated[index].targetAmount - updated[index].currentSaved
      const monthsNeeded = Math.ceil(stillNeeded / num)
      updated[index].monthsNeededWithAllocation = monthsNeeded
    } else {
      updated[index].monthsNeededWithAllocation = updated[index].monthsRemaining
    }
    setSavingsPlans(updated)
    // 保存到localStorage
    saveAllocationsToStorage(updated)
  }

  // 處理分配金額失去焦點時格式化
  const handleAllocationBlur = (index: number, value: string) => {
    const parsed = parseNumber(value)
    const formatted = formatNumber(parsed)
    const updated = [...savingsPlans]
    updated[index].allocatedAmountFormatted = formatted
    setSavingsPlans(updated)
    saveAllocationsToStorage(updated)
  }

  // 保存分配金額到localStorage
  const saveAllocationsToStorage = (plans: any[]) => {
    if (typeof window === "undefined") return
    const wishesStr = localStorage.getItem("wishes")
    if (wishesStr) {
      try {
        const wishes = JSON.parse(wishesStr)
        const updatedWishes = wishes.map((wish: any, index: number) => {
          const plan = plans.find((p) => p.name === wish.name)
          if (plan) {
            return {
              ...wish,
              priority: plan.priority,
              allocatedAmount: plan.allocatedAmount || 0,
            }
          }
          return wish
        })
        localStorage.setItem("wishes", JSON.stringify(updatedWishes))
      } catch (e) {
        console.error("Error saving allocations", e)
      }
    }
  }

  // 調整優先級（向上移動）
  const moveUp = (index: number) => {
    if (index === 0) return
    const updated = [...savingsPlans]
    const temp = updated[index]
    updated[index] = updated[index - 1]
    updated[index - 1] = temp
    // 更新優先級
    updated.forEach((plan, i) => {
      plan.priority = i + 1
    })
    setSavingsPlans(updated)
    saveAllocationsToStorage(updated)
  }

  // 調整優先級（向下移動）
  const moveDown = (index: number) => {
    if (index === savingsPlans.length - 1) return
    const updated = [...savingsPlans]
    const temp = updated[index]
    updated[index] = updated[index + 1]
    updated[index + 1] = temp
    // 更新優先級
    updated.forEach((plan, i) => {
      plan.priority = i + 1
    })
    setSavingsPlans(updated)
    saveAllocationsToStorage(updated)
  }

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

            // 按優先級排序（如果有的話）
            const sortedWishes = [...validWishes].sort((a: any, b: any) => {
              const priorityA = a.priority || 999
              const priorityB = b.priority || 999
              return priorityA - priorityB
            })

            const plans = sortedWishes.map((wish: any, index: number) => {
              const targetYear = parseInt(wish.year || currentYear.toString())
              const targetMonth = parseInt(wish.month || "12")
              const targetAmount = parseFloat(wish.cost ? wish.cost.replace(/,/g, "") : "0")
              const currentSaved = parseFloat(wish.currentSaved ? wish.currentSaved.replace(/,/g, "") : "0")
              const allocatedAmount = wish.allocatedAmount || 0

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

              // 計算每月需存金額（如果沒有分配金額，使用原計算方式）
              const monthlySaving = allocatedAmount > 0 
                ? allocatedAmount 
                : (monthsRemaining > 0 ? Math.ceil(stillNeeded / monthsRemaining) : stillNeeded)

              // 如果使用分配金額，計算完成時間
              let monthsNeededWithAllocation = monthsRemaining
              if (allocatedAmount > 0) {
                monthsNeededWithAllocation = Math.ceil(stillNeeded / allocatedAmount)
              }

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
                priority: wish.priority || index + 1,
                allocatedAmount: allocatedAmount,
                allocatedAmountFormatted: allocatedAmount > 0 ? allocatedAmount.toLocaleString("zh-TW") : "",
                monthsNeededWithAllocation: monthsNeededWithAllocation,
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

            // 按優先級排序（如果有的話）
            const sortedWishes = [...validWishes].sort((a: any, b: any) => {
              const priorityA = a.priority || 999
              const priorityB = b.priority || 999
              return priorityA - priorityB
            })

            const plans = sortedWishes.map((wish: any, index: number) => {
              const targetYear = parseInt(wish.year || currentYear.toString())
              const targetMonth = parseInt(wish.month || "12")
              const targetAmount = parseFloat(wish.cost ? wish.cost.replace(/,/g, "") : "0")
              const currentSaved = parseFloat(wish.currentSaved ? wish.currentSaved.replace(/,/g, "") : "0")
              const allocatedAmount = wish.allocatedAmount || 0

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

              // 計算每月需存金額（如果沒有分配金額，使用原計算方式）
              const monthlySaving = allocatedAmount > 0 
                ? allocatedAmount 
                : (monthsRemaining > 0 ? Math.ceil(stillNeeded / monthsRemaining) : stillNeeded)

              // 如果使用分配金額，計算完成時間
              let monthsNeededWithAllocation = monthsRemaining
              if (allocatedAmount > 0) {
                monthsNeededWithAllocation = Math.ceil(stillNeeded / allocatedAmount)
              }

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
                priority: wish.priority || index + 1,
                allocatedAmount: allocatedAmount,
                allocatedAmountFormatted: allocatedAmount > 0 ? allocatedAmount.toLocaleString("zh-TW") : "",
                monthsNeededWithAllocation: monthsNeededWithAllocation,
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

  // 計算總分配金額
  const totalAllocated = savingsPlans.reduce((sum, plan) => sum + (plan.allocatedAmount || 0), 0)
  const remainingAllocation = Math.max(0, flexibleAmount - totalAllocated)

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

        {/* 每月可彈性運用金額分配 */}
        <Card className="p-4 md:p-6 bg-gradient-to-br from-secondary/10 to-accent/10 border-secondary/20 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">每月可彈性運用金額</p>
              <p className="text-2xl font-bold text-primary">NT$ {flexibleAmount.toLocaleString()}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground mb-1">已分配金額</p>
              <p className={`text-2xl font-bold ${totalAllocated > flexibleAmount ? 'text-destructive' : 'text-foreground'}`}>
                NT$ {totalAllocated.toLocaleString()}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground mb-1">剩餘可分配</p>
              <p className={`text-2xl font-bold ${remainingAllocation < 0 ? 'text-destructive' : 'text-primary'}`}>
                NT$ {remainingAllocation.toLocaleString()}
              </p>
            </div>
          </div>
          {totalAllocated > flexibleAmount && (
            <div className="mt-4 p-3 rounded-lg bg-destructive/10 border border-destructive/20">
              <p className="text-sm text-destructive">
                ⚠️ 總分配金額超過每月可彈性運用金額，請調整分配。
              </p>
            </div>
          )}
        </Card>

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
                  {/* 優先級調整按鈕 */}
                  <div className="flex flex-col gap-1 pt-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => moveUp(index)}
                      disabled={index === 0}
                    >
                      <ArrowUp className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => moveDown(index)}
                      disabled={index === savingsPlans.length - 1}
                    >
                      <ArrowDown className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="w-16 h-16 rounded-xl bg-card/80 backdrop-blur flex items-center justify-center flex-shrink-0 shadow-sm">
                    <IconComponent className="w-8 h-8 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground bg-accent/50 px-2 py-1 rounded">優先級 {plan.priority}</span>
                        <h2 className="text-2xl font-semibold text-foreground">{plan.name}</h2>
                      </div>
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
                      <span className="text-sm">
                        目標完成時間：{plan.month}
                        {plan.allocatedAmount > 0 && plan.monthsNeededWithAllocation && (
                          <span className="ml-2 text-primary">
                            （依分配金額約需 {plan.monthsNeededWithAllocation} 個月）
                          </span>
                        )}
                      </span>
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

                {/* 每月分配金額輸入 */}
                <div className="mb-4 p-4 rounded-lg bg-card/60 backdrop-blur border border-border">
                  <Label htmlFor={`allocation-${index}`} className="text-sm font-medium text-foreground mb-2 block">
                    每月分配金額（根據可彈性運用金額分配）
                  </Label>
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">NT$</span>
                      <Input
                        id={`allocation-${index}`}
                        type="text"
                        placeholder="0"
                        value={plan.allocatedAmountFormatted || ""}
                        onChange={(e) => handleAllocationChange(index, e.target.value)}
                        onBlur={(e) => handleAllocationBlur(index, e.target.value)}
                        className="pl-12 rounded-lg"
                      />
                    </div>
                    <div className="text-sm text-muted-foreground min-w-[120px]">
                      {plan.allocatedAmount > 0 ? (
                        <span className="text-primary">
                          約需 {plan.monthsNeededWithAllocation} 個月完成
                        </span>
                      ) : (
                        <span>未分配</span>
                      )}
                    </div>
                  </div>
                  {plan.allocatedAmount > 0 && plan.allocatedAmount > flexibleAmount && (
                    <p className="text-xs text-destructive mt-2">
                      ⚠️ 分配金額超過每月可彈性運用金額
                    </p>
                  )}
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
                    <p className="text-lg font-semibold text-foreground">
                      {plan.allocatedAmount > 0 && plan.monthsNeededWithAllocation 
                        ? `${plan.monthsNeededWithAllocation} 個月（依分配）`
                        : `${plan.monthsRemaining} 個月（原目標）`}
                    </p>
                  </div>
                  <div className={`p-4 rounded-lg backdrop-blur border ${isFeasible ? 'bg-primary/10 border-primary/20' : 'bg-destructive/10 border-destructive/20'}`}>
                    <div className="flex items-center gap-1 mb-1">
                      <TrendingUp className={`w-3 h-3 ${isFeasible ? 'text-primary' : 'text-destructive'}`} />
                      <p className={`text-xs font-medium ${isFeasible ? 'text-primary' : 'text-destructive'}`}>
                        {plan.allocatedAmount > 0 ? '每月分配' : '每個月需存'}
                      </p>
                    </div>
                    <p className={`text-lg font-bold ${isFeasible ? 'text-primary' : 'text-destructive'}`}>
                      NT$ {(plan.allocatedAmount > 0 ? plan.allocatedAmount : plan.monthlySaving).toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Feasibility Message */}
                {!isFeasible && (
                  <div className="mt-4 p-4 rounded-lg bg-destructive/10 border border-destructive/20">
                    <p className="text-base font-medium text-destructive mb-2">
                      ⚠️ 無法規劃
                    </p>
                    <p className="text-sm text-destructive leading-relaxed">
                      每月需存金額（NT$ {plan.monthlySaving.toLocaleString()}）超過可彈性運用金額（NT$ {flexibleAmount.toLocaleString()}）。
                      <br />
                      <span className="font-semibold">若無法增加收入或降低支出，夢想難以達成。</span>
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

