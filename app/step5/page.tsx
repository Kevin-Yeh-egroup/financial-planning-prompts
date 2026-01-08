"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Shield, Umbrella, Heart, AlertCircle, CheckCircle2, PiggyBank, Wallet } from "lucide-react"

export default function Step5Page() {
  const [availableSavings, setAvailableSavings] = useState(0)
  const [monthlyExpenses, setMonthlyExpenses] = useState(33000) // 預設值
  const recommendedMonths = 6
  const targetAmount = monthlyExpenses * recommendedMonths

  // 從 localStorage 讀取可動用存款金額和每月支出
  useEffect(() => {
    const saved = localStorage.getItem("availableSavings")
    if (saved) {
      setAvailableSavings(parseFloat(saved) || 0)
    }

    // 從 step2Data 計算每月支出
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

        if (totalExpenses > 0) {
          setMonthlyExpenses(totalExpenses)
        }
      } catch (e) {
        console.error("Error parsing step2Data in step5", e)
      }
    }
  }, [])

  // 計算邏輯：優先滿足緊急預備金
  // 如果可動用存款 >= 目標，則已滿足緊急預備金，剩餘的可用於夢想
  // 如果可動用存款 < 目標，則可動用存款全部用於緊急預備金
  const allocatedToEmergency = Math.min(availableSavings, targetAmount)
  const remainingForDreams = Math.max(0, availableSavings - targetAmount)
  const stillNeeded = Math.max(0, targetAmount - availableSavings)
  const progress = targetAmount > 0 ? (allocatedToEmergency / targetAmount) * 100 : 0

  const scenarios = [
    { icon: Heart, title: "突然生病住院", description: "醫療費用、暫時無法工作" },
    { icon: Umbrella, title: "意外失業", description: "找新工作期間的生活費" },
    { icon: Shield, title: "家人緊急狀況", description: "需要立即支援家人" },
  ]

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-accent/20">
      <div className="container mx-auto px-4 py-8 md:py-12 max-w-4xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
              <Shield className="w-10 h-10 text-primary" />
            </div>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-4 text-balance">有些錢，是為了安心而存在</h1>
          <p className="text-lg text-muted-foreground leading-relaxed text-pretty max-w-2xl mx-auto">
            生病、失業、突發狀況來的時候，
            <br />
            願望才不會全部被打掉重來。
          </p>
        </div>

        {/* Scenarios */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          {scenarios.map((scenario, index) => {
            const IconComponent = scenario.icon
            return (
              <Card key={index} className="p-6 bg-card/80 backdrop-blur text-center hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 rounded-full bg-accent/50 flex items-center justify-center mx-auto mb-3">
                  <IconComponent className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{scenario.title}</h3>
                <p className="text-sm text-muted-foreground">{scenario.description}</p>
              </Card>
            )
          })}
        </div>

        {/* Emergency Fund Status */}
        <Card className="p-6 md:p-8 bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20 mb-6">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-16 h-16 rounded-xl bg-card/80 backdrop-blur flex items-center justify-center flex-shrink-0 shadow-sm">
              <PiggyBank className="w-8 h-8 text-primary" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-semibold text-foreground mb-2">你的緊急預備金</h2>
              <p className="text-muted-foreground text-sm">建議金額：每月支出 × 3～6 個月</p>
            </div>
          </div>

          {/* Available Savings Info */}
          {availableSavings > 0 && (
            <div className="mb-4 p-4 rounded-lg bg-card/60 backdrop-blur border border-primary/20">
              <div className="flex items-center gap-2 mb-2">
                <Wallet className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-foreground">可動用存款金額</span>
              </div>
              <p className="text-lg font-semibold text-primary">NT$ {availableSavings.toLocaleString()}</p>
            </div>
          )}

          {/* Progress */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-muted-foreground">目前進度</span>
              <span className="text-sm font-medium text-foreground">
                NT$ {allocatedToEmergency.toLocaleString()} / NT$ {targetAmount.toLocaleString()}
              </span>
            </div>
            <Progress value={progress} className="h-3 mb-1" />
            <p className="text-xs text-muted-foreground text-right">{Math.round(progress)}% 完成</p>
          </div>

          {/* Fund Details */}
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-card/60 backdrop-blur">
              <p className="text-xs text-muted-foreground mb-1">每月支出</p>
              <p className="text-lg font-semibold text-foreground">NT$ {monthlyExpenses.toLocaleString()}</p>
            </div>
            <div className="p-4 rounded-lg bg-card/60 backdrop-blur">
              <p className="text-xs text-muted-foreground mb-1">建議準備月數</p>
              <p className="text-lg font-semibold text-foreground">{recommendedMonths} 個月</p>
            </div>
            <div className="p-4 rounded-lg bg-primary/10 backdrop-blur border border-primary/20">
              <p className="text-xs text-primary font-medium mb-1">還需要</p>
              <p className="text-lg font-bold text-primary">NT$ {stillNeeded.toLocaleString()}</p>
            </div>
          </div>

          {/* Remaining for Dreams */}
          {remainingForDreams > 0 ? (
            <div className="mt-4 p-4 rounded-lg bg-accent/30 border border-accent">
              <div className="flex items-center gap-2 mb-2">
                <Heart className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-foreground">可用於夢想規劃</span>
              </div>
              <p className="text-lg font-semibold text-primary">
                NT$ {remainingForDreams.toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                緊急預備金已滿足，剩餘金額可用於實現您的夢想
              </p>
            </div>
          ) : availableSavings > 0 && stillNeeded > 0 ? (
            <div className="mt-4 p-4 rounded-lg bg-orange-50 border border-orange-200">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="w-4 h-4 text-orange-600" />
                <span className="text-sm font-medium text-foreground">優先建議</span>
              </div>
              <p className="text-sm text-muted-foreground">
                您的可動用存款已優先分配給緊急預備金，建議先補足緊急預備金缺口後，再規劃夢想儲蓄。
              </p>
            </div>
          ) : null}
        </Card>

        {/* Important Notes */}
        <Card className="p-6 md:p-8 bg-accent/30 border-accent mb-6">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-card/60 flex items-center justify-center flex-shrink-0">
              <AlertCircle className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-2">重要提醒</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <span>
                    <strong className="text-foreground">不建議作為消費用途</strong> —
                    這筆錢是為了「真正的緊急狀況」準備的
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <span>
                    <strong className="text-foreground">存放在容易領取的地方</strong> —
                    建議放在高利活存或短期定存，不要投資
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <span>
                    <strong className="text-foreground">優先順序高於願望儲蓄</strong> — 先保護好基本生活，再追求夢想
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </Card>

        {/* CTA */}
        <div className="flex justify-between items-center">
          <Link href="/step4">
            <Button variant="ghost">返回</Button>
          </Link>
          <Link href="/step6">
            <Button size="lg" className="px-8 py-6 rounded-xl">
              完成我的家庭財務整理
            </Button>
          </Link>
        </div>
      </div>
    </main>
  )
}
