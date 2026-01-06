"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { DollarSign, Home, Zap, Shield, GraduationCap, Smartphone, Car, FileText } from "lucide-react"

export default function Step2Page() {
  const [income, setIncome] = useState({
    salary: "",
    otherIncome: "",
  })

  const [monthlyExpenses, setMonthlyExpenses] = useState({
    rent: "",
    utilities: "",
    insurance: "",
    tuition: "",
    phone: "",
    other: "",
  })

  const [yearlyExpenses, setYearlyExpenses] = useState({
    tax: "",
    vehicle: "",
    annualInsurance: "",
    other: "",
  })

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-accent/20">
      <div className="container mx-auto px-4 py-8 md:py-12 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-4 text-balance">你的錢，每個月都去哪了？</h1>
          <p className="text-lg text-muted-foreground leading-relaxed text-pretty">
            很多壓力不是花太多，
            <br />
            而是忘了「一定會來的支出」。
          </p>
        </div>

        <div className="space-y-6">
          {/* Income Section */}
          <Card className="p-6 md:p-8 bg-card/80 backdrop-blur">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-primary" />
              </div>
              <h2 className="text-2xl font-semibold text-foreground">每月收入</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="salary" className="text-sm text-muted-foreground mb-2 block">
                  薪水收入
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">NT$</span>
                  <Input
                    id="salary"
                    type="number"
                    placeholder="40000"
                    value={income.salary}
                    onChange={(e) => setIncome({ ...income, salary: e.target.value })}
                    className="pl-12 rounded-lg"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="otherIncome" className="text-sm text-muted-foreground mb-2 block">
                  其他收入
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">NT$</span>
                  <Input
                    id="otherIncome"
                    type="number"
                    placeholder="5000"
                    value={income.otherIncome}
                    onChange={(e) => setIncome({ ...income, otherIncome: e.target.value })}
                    className="pl-12 rounded-lg"
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* Monthly Fixed Expenses */}
          <Card className="p-6 md:p-8 bg-card/80 backdrop-blur">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-secondary/50 flex items-center justify-center">
                <Home className="w-6 h-6 text-primary" />
              </div>
              <h2 className="text-2xl font-semibold text-foreground">每月固定支出</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="rent" className="text-sm text-muted-foreground mb-2 flex items-center gap-2">
                  <Home className="w-4 h-4" />
                  房租 / 房貸
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">NT$</span>
                  <Input
                    id="rent"
                    type="number"
                    placeholder="15000"
                    value={monthlyExpenses.rent}
                    onChange={(e) => setMonthlyExpenses({ ...monthlyExpenses, rent: e.target.value })}
                    className="pl-12 rounded-lg"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="utilities" className="text-sm text-muted-foreground mb-2 flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  水電瓦斯
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">NT$</span>
                  <Input
                    id="utilities"
                    type="number"
                    placeholder="3000"
                    value={monthlyExpenses.utilities}
                    onChange={(e) => setMonthlyExpenses({ ...monthlyExpenses, utilities: e.target.value })}
                    className="pl-12 rounded-lg"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="insurance" className="text-sm text-muted-foreground mb-2 flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  保險費
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">NT$</span>
                  <Input
                    id="insurance"
                    type="number"
                    placeholder="5000"
                    value={monthlyExpenses.insurance}
                    onChange={(e) => setMonthlyExpenses({ ...monthlyExpenses, insurance: e.target.value })}
                    className="pl-12 rounded-lg"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="tuition" className="text-sm text-muted-foreground mb-2 flex items-center gap-2">
                  <GraduationCap className="w-4 h-4" />
                  學費 / 才藝費
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">NT$</span>
                  <Input
                    id="tuition"
                    type="number"
                    placeholder="8000"
                    value={monthlyExpenses.tuition}
                    onChange={(e) => setMonthlyExpenses({ ...monthlyExpenses, tuition: e.target.value })}
                    className="pl-12 rounded-lg"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="phone" className="text-sm text-muted-foreground mb-2 flex items-center gap-2">
                  <Smartphone className="w-4 h-4" />
                  電話網路費
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">NT$</span>
                  <Input
                    id="phone"
                    type="number"
                    placeholder="1200"
                    value={monthlyExpenses.phone}
                    onChange={(e) => setMonthlyExpenses({ ...monthlyExpenses, phone: e.target.value })}
                    className="pl-12 rounded-lg"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="monthlyOther" className="text-sm text-muted-foreground mb-2 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  其他固定支出
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">NT$</span>
                  <Input
                    id="monthlyOther"
                    type="number"
                    placeholder="2000"
                    value={monthlyExpenses.other}
                    onChange={(e) => setMonthlyExpenses({ ...monthlyExpenses, other: e.target.value })}
                    className="pl-12 rounded-lg"
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* Yearly Expenses */}
          <Card className="p-6 md:p-8 bg-card/80 backdrop-blur">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-accent/50 flex items-center justify-center">
                <FileText className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-foreground">每年 / 不定期支出</h2>
                <p className="text-sm text-muted-foreground">會自動平均分配到每個月</p>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="tax" className="text-sm text-muted-foreground mb-2 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  稅金（所得稅、房屋稅等）
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">NT$</span>
                  <Input
                    id="tax"
                    type="number"
                    placeholder="20000"
                    value={yearlyExpenses.tax}
                    onChange={(e) => setYearlyExpenses({ ...yearlyExpenses, tax: e.target.value })}
                    className="pl-12 rounded-lg"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="vehicle" className="text-sm text-muted-foreground mb-2 flex items-center gap-2">
                  <Car className="w-4 h-4" />
                  車輛相關費用
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">NT$</span>
                  <Input
                    id="vehicle"
                    type="number"
                    placeholder="15000"
                    value={yearlyExpenses.vehicle}
                    onChange={(e) => setYearlyExpenses({ ...yearlyExpenses, vehicle: e.target.value })}
                    className="pl-12 rounded-lg"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="annualInsurance" className="text-sm text-muted-foreground mb-2 flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  年繳保險
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">NT$</span>
                  <Input
                    id="annualInsurance"
                    type="number"
                    placeholder="30000"
                    value={yearlyExpenses.annualInsurance}
                    onChange={(e) => setYearlyExpenses({ ...yearlyExpenses, annualInsurance: e.target.value })}
                    className="pl-12 rounded-lg"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="yearlyOther" className="text-sm text-muted-foreground mb-2 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  其他年度支出
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">NT$</span>
                  <Input
                    id="yearlyOther"
                    type="number"
                    placeholder="10000"
                    value={yearlyExpenses.other}
                    onChange={(e) => setYearlyExpenses({ ...yearlyExpenses, other: e.target.value })}
                    className="pl-12 rounded-lg"
                  />
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* CTA */}
        <div className="flex justify-between items-center mt-8">
          <Link href="/step1">
            <Button variant="ghost">返回</Button>
          </Link>
          <Link href="/step3">
            <Button size="lg" className="px-8 py-6 rounded-xl">
              幫我整理看看
            </Button>
          </Link>
        </div>
      </div>
    </main>
  )
}
