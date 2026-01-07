"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import {
  DollarSign,
  Home,
  Wifi,
  CreditCard,
  Shield,
  PiggyBank,
  Utensils,
  Shirt,
  Car,
  GraduationCap,
  Film,
  HeartPulse,
  FileText,
  Building2,
  TrendingUp,
  Briefcase,
  Percent,
  Gift,
  Landmark,
  Store,
  Package,
  Users,
  Zap,
  Wrench,
  Megaphone,
  Handshake,
  Wallet,
} from "lucide-react"

export default function Step2Page() {
  const router = useRouter()
  
  // 目前可動用的存款金額
  const [availableSavings, setAvailableSavings] = useState("")

  // 固定收入
  const [fixedIncome, setFixedIncome] = useState({
    salary: "",
    rent: "",
    investment: "",
    pension: "",
    governmentSubsidy: "",
  })

  // 變動收入
  const [variableIncome, setVariableIncome] = useState({
    sideJob: "",
    temporaryWork: "",
    interest: "",
    gift: "",
    other: "",
  })

  // 生活固定支出
  const [fixedExpenses, setFixedExpenses] = useState({
    housing: "",
    telecom: "",
    repayment: "",
    insurance: "",
    savings: "",
  })

  // 生活變動支出
  const [variableExpenses, setVariableExpenses] = useState({
    food: "",
    clothing: "",
    transportation: "",
    education: "",
    entertainment: "",
    medical: "",
    other: "",
  })

  // 是否有做生意
  const [hasBusiness, setHasBusiness] = useState(false)

  // 生意收入
  const [businessIncome, setBusinessIncome] = useState({
    productSales: "",
    serviceIncome: "",
    equipmentSale: "",
    venueRental: "",
    partnership: "",
    other: "",
  })

  // 生意變動支出
  const [businessVariableExpenses, setBusinessVariableExpenses] = useState({
    materials: "",
    packaging: "",
    supplies: "",
    shipping: "",
    other: "",
  })

  // 生意固定支出
  const [businessFixedExpenses, setBusinessFixedExpenses] = useState({
    rent: "",
    personnel: "",
    utilities: "",
    gas: "",
    communication: "",
    repayment: "",
    other: "",
  })

  // 生意額外支出
  const [businessExtraExpenses, setBusinessExtraExpenses] = useState({
    equipment: "",
    repair: "",
    marketing: "",
    other: "",
  })

  const updateFixedIncome = (field: string, value: string) => {
    setFixedIncome({ ...fixedIncome, [field]: value })
  }

  const updateVariableIncome = (field: string, value: string) => {
    setVariableIncome({ ...variableIncome, [field]: value })
  }

  const updateFixedExpenses = (field: string, value: string) => {
    setFixedExpenses({ ...fixedExpenses, [field]: value })
  }

  const updateVariableExpenses = (field: string, value: string) => {
    setVariableExpenses({ ...variableExpenses, [field]: value })
  }

  const updateBusinessIncome = (field: string, value: string) => {
    setBusinessIncome({ ...businessIncome, [field]: value })
  }

  const updateBusinessVariableExpenses = (field: string, value: string) => {
    setBusinessVariableExpenses({ ...businessVariableExpenses, [field]: value })
  }

  const updateBusinessFixedExpenses = (field: string, value: string) => {
    setBusinessFixedExpenses({ ...businessFixedExpenses, [field]: value })
  }

  const updateBusinessExtraExpenses = (field: string, value: string) => {
    setBusinessExtraExpenses({ ...businessExtraExpenses, [field]: value })
  }

  // 保存數據到 localStorage
  useEffect(() => {
    if (availableSavings) {
      localStorage.setItem("availableSavings", availableSavings)
    }
    
    // 保存所有收入和支出數據
    const allData = {
      availableSavings,
      fixedIncome,
      variableIncome,
      fixedExpenses,
      variableExpenses,
      hasBusiness,
      businessIncome,
      businessVariableExpenses,
      businessFixedExpenses,
      businessExtraExpenses,
    }
    localStorage.setItem("step2Data", JSON.stringify(allData))
  }, [
    availableSavings,
    fixedIncome,
    variableIncome,
    fixedExpenses,
    variableExpenses,
    hasBusiness,
    businessIncome,
    businessVariableExpenses,
    businessFixedExpenses,
    businessExtraExpenses,
  ])

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-accent/20">
      <div className="container mx-auto px-4 py-8 md:py-12 max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-4 text-balance">你的錢，每個月都去哪了？</h1>
          <p className="text-lg text-muted-foreground leading-relaxed text-pretty">
            記錄每一筆收支
          </p>
        </div>

        <div className="space-y-6">
          {/* Available Savings Section */}
          <Card className="p-6 md:p-8 bg-card/80 backdrop-blur">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Wallet className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-foreground">目前我可動用的存款金額</h2>
                <p className="text-sm text-muted-foreground mt-1">此項目可用於緊急預備金的計算以及願望差額的計算</p>
              </div>
            </div>
            <div className="max-w-md">
              <Label htmlFor="availableSavings" className="text-sm text-muted-foreground mb-2 block">
                可動用存款金額
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">NT$</span>
                <Input
                  id="availableSavings"
                  type="number"
                  placeholder="100000"
                  value={availableSavings}
                  onChange={(e) => setAvailableSavings(e.target.value)}
                  className="pl-12 rounded-lg"
                />
              </div>
            </div>
          </Card>

          {/* Income Section */}
          <Card className="p-6 md:p-8 bg-card/80 backdrop-blur">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-primary" />
              </div>
              <h2 className="text-2xl font-semibold text-foreground">生活收入</h2>
            </div>

            <Accordion type="multiple" defaultValue={["fixed-income", "variable-income"]} className="space-y-4">
              {/* 固定收入 */}
              <AccordionItem value="fixed-income" className="border rounded-lg px-4">
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-primary" />
                    <span className="font-semibold">固定收入</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="grid md:grid-cols-2 gap-4 pt-4">
              <div>
                <Label htmlFor="salary" className="text-sm text-muted-foreground mb-2 block">
                        薪資收入
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">NT$</span>
                  <Input
                    id="salary"
                    type="number"
                    placeholder="40000"
                          value={fixedIncome.salary}
                          onChange={(e) => updateFixedIncome("salary", e.target.value)}
                          className="pl-12 rounded-lg"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="rent" className="text-sm text-muted-foreground mb-2 block">
                        租金收入
                      </Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">NT$</span>
                        <Input
                          id="rent"
                          type="number"
                          placeholder="0"
                          value={fixedIncome.rent}
                          onChange={(e) => updateFixedIncome("rent", e.target.value)}
                          className="pl-12 rounded-lg"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="investment" className="text-sm text-muted-foreground mb-2 block">
                        定期投資收益
                      </Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">NT$</span>
                        <Input
                          id="investment"
                          type="number"
                          placeholder="0"
                          value={fixedIncome.investment}
                          onChange={(e) => updateFixedIncome("investment", e.target.value)}
                          className="pl-12 rounded-lg"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="pension" className="text-sm text-muted-foreground mb-2 block">
                        退休金/年金
                      </Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">NT$</span>
                        <Input
                          id="pension"
                          type="number"
                          placeholder="0"
                          value={fixedIncome.pension}
                          onChange={(e) => updateFixedIncome("pension", e.target.value)}
                          className="pl-12 rounded-lg"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="governmentSubsidy" className="text-sm text-muted-foreground mb-2 block">
                        政府定期補助
                      </Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">NT$</span>
                        <Input
                          id="governmentSubsidy"
                          type="number"
                          placeholder="0"
                          value={fixedIncome.governmentSubsidy}
                          onChange={(e) => updateFixedIncome("governmentSubsidy", e.target.value)}
                          className="pl-12 rounded-lg"
                        />
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* 變動收入 */}
              <AccordionItem value="variable-income" className="border rounded-lg px-4">
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-primary" />
                    <span className="font-semibold">變動收入</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="grid md:grid-cols-2 gap-4 pt-4">
                    <div>
                      <Label htmlFor="sideJob" className="text-sm text-muted-foreground mb-2 block">
                        副業收入
                      </Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">NT$</span>
                        <Input
                          id="sideJob"
                          type="number"
                          placeholder="0"
                          value={variableIncome.sideJob}
                          onChange={(e) => updateVariableIncome("sideJob", e.target.value)}
                          className="pl-12 rounded-lg"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="temporaryWork" className="text-sm text-muted-foreground mb-2 block">
                        臨時性工作
                      </Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">NT$</span>
                        <Input
                          id="temporaryWork"
                          type="number"
                          placeholder="0"
                          value={variableIncome.temporaryWork}
                          onChange={(e) => updateVariableIncome("temporaryWork", e.target.value)}
                          className="pl-12 rounded-lg"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="interest" className="text-sm text-muted-foreground mb-2 block">
                        利息收入
                      </Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">NT$</span>
                        <Input
                          id="interest"
                          type="number"
                          placeholder="0"
                          value={variableIncome.interest}
                          onChange={(e) => updateVariableIncome("interest", e.target.value)}
                          className="pl-12 rounded-lg"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="gift" className="text-sm text-muted-foreground mb-2 block">
                        親友贈與
                      </Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">NT$</span>
                        <Input
                          id="gift"
                          type="number"
                          placeholder="0"
                          value={variableIncome.gift}
                          onChange={(e) => updateVariableIncome("gift", e.target.value)}
                    className="pl-12 rounded-lg"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="otherIncome" className="text-sm text-muted-foreground mb-2 block">
                        其他生活收入
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">NT$</span>
                  <Input
                    id="otherIncome"
                    type="number"
                          placeholder="0"
                          value={variableIncome.other}
                          onChange={(e) => updateVariableIncome("other", e.target.value)}
                    className="pl-12 rounded-lg"
                  />
                </div>
              </div>
            </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </Card>

          {/* Expenses Section */}
          <Card className="p-6 md:p-8 bg-card/80 backdrop-blur">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-secondary/50 flex items-center justify-center">
                <FileText className="w-6 h-6 text-primary" />
              </div>
              <h2 className="text-2xl font-semibold text-foreground">生活支出</h2>
            </div>

            <Accordion type="multiple" defaultValue={["fixed-expenses", "variable-expenses"]} className="space-y-4">
              {/* 生活固定支出 */}
              <AccordionItem value="fixed-expenses" className="border rounded-lg px-4">
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-primary" />
                    <span className="font-semibold">生活固定支出</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="grid md:grid-cols-2 gap-4 pt-4">
              <div>
                      <Label htmlFor="housing" className="text-sm text-muted-foreground mb-2 block flex items-center gap-2">
                  <Home className="w-4 h-4" />
                        住（房租、水電、瓦斯、生活用品等）
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">NT$</span>
                  <Input
                          id="housing"
                    type="number"
                    placeholder="15000"
                          value={fixedExpenses.housing}
                          onChange={(e) => updateFixedExpenses("housing", e.target.value)}
                          className="pl-12 rounded-lg"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="telecom" className="text-sm text-muted-foreground mb-2 block flex items-center gap-2">
                        <Wifi className="w-4 h-4" />
                        電信（網路、電話、手機月租費等）
                      </Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">NT$</span>
                        <Input
                          id="telecom"
                          type="number"
                          placeholder="1200"
                          value={fixedExpenses.telecom}
                          onChange={(e) => updateFixedExpenses("telecom", e.target.value)}
                    className="pl-12 rounded-lg"
                  />
                </div>
              </div>
              <div>
                      <Label htmlFor="repayment" className="text-sm text-muted-foreground mb-2 block flex items-center gap-2">
                        <CreditCard className="w-4 h-4" />
                        還款（信用卡、車貸、房貸、信貸等）
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">NT$</span>
                  <Input
                          id="repayment"
                    type="number"
                          placeholder="0"
                          value={fixedExpenses.repayment}
                          onChange={(e) => updateFixedExpenses("repayment", e.target.value)}
                    className="pl-12 rounded-lg"
                  />
                </div>
              </div>
              <div>
                      <Label htmlFor="insurance" className="text-sm text-muted-foreground mb-2 block flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                        保險(月繳)（健保、壽險、醫療險等）
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">NT$</span>
                  <Input
                    id="insurance"
                    type="number"
                    placeholder="5000"
                          value={fixedExpenses.insurance}
                          onChange={(e) => updateFixedExpenses("insurance", e.target.value)}
                    className="pl-12 rounded-lg"
                  />
                </div>
              </div>
              <div>
                      <Label htmlFor="savings" className="text-sm text-muted-foreground mb-2 block flex items-center gap-2">
                        <PiggyBank className="w-4 h-4" />
                        儲蓄
                      </Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">NT$</span>
                        <Input
                          id="savings"
                          type="number"
                          placeholder="0"
                          value={fixedExpenses.savings}
                          onChange={(e) => updateFixedExpenses("savings", e.target.value)}
                          className="pl-12 rounded-lg"
                        />
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* 生活變動支出 */}
              <AccordionItem value="variable-expenses" className="border rounded-lg px-4">
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-primary" />
                    <span className="font-semibold">生活變動支出</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="grid md:grid-cols-2 gap-4 pt-4">
                    <div>
                      <Label htmlFor="food" className="text-sm text-muted-foreground mb-2 block flex items-center gap-2">
                        <Utensils className="w-4 h-4" />
                        食（三餐、零食、飲品、買菜等）
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">NT$</span>
                  <Input
                          id="food"
                    type="number"
                    placeholder="8000"
                          value={variableExpenses.food}
                          onChange={(e) => updateVariableExpenses("food", e.target.value)}
                          className="pl-12 rounded-lg"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="clothing" className="text-sm text-muted-foreground mb-2 block flex items-center gap-2">
                        <Shirt className="w-4 h-4" />
                        衣（衣褲、剪髮、保養品、鞋子等）
                      </Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">NT$</span>
                        <Input
                          id="clothing"
                          type="number"
                          placeholder="2000"
                          value={variableExpenses.clothing}
                          onChange={(e) => updateVariableExpenses("clothing", e.target.value)}
                          className="pl-12 rounded-lg"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="transportation" className="text-sm text-muted-foreground mb-2 block flex items-center gap-2">
                        <Car className="w-4 h-4" />
                        行（油錢、維修保養、大眾運輸等）
                      </Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">NT$</span>
                        <Input
                          id="transportation"
                          type="number"
                          placeholder="3000"
                          value={variableExpenses.transportation}
                          onChange={(e) => updateVariableExpenses("transportation", e.target.value)}
                    className="pl-12 rounded-lg"
                  />
                </div>
              </div>
              <div>
                      <Label htmlFor="education" className="text-sm text-muted-foreground mb-2 block flex items-center gap-2">
                        <GraduationCap className="w-4 h-4" />
                        育（教育費、學雜費、小孩生活費等）
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">NT$</span>
                  <Input
                          id="education"
                    type="number"
                          placeholder="5000"
                          value={variableExpenses.education}
                          onChange={(e) => updateVariableExpenses("education", e.target.value)}
                    className="pl-12 rounded-lg"
                  />
                </div>
              </div>
              <div>
                      <Label htmlFor="entertainment" className="text-sm text-muted-foreground mb-2 block flex items-center gap-2">
                        <Film className="w-4 h-4" />
                        樂（電影、遊樂園、展覽等）
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">NT$</span>
                  <Input
                          id="entertainment"
                    type="number"
                    placeholder="2000"
                          value={variableExpenses.entertainment}
                          onChange={(e) => updateVariableExpenses("entertainment", e.target.value)}
                          className="pl-12 rounded-lg"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="medical" className="text-sm text-muted-foreground mb-2 block flex items-center gap-2">
                        <HeartPulse className="w-4 h-4" />
                        醫療（看醫生、掛號費、成藥、醫療器材等）
                      </Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">NT$</span>
                        <Input
                          id="medical"
                          type="number"
                          placeholder="1000"
                          value={variableExpenses.medical}
                          onChange={(e) => updateVariableExpenses("medical", e.target.value)}
                          className="pl-12 rounded-lg"
                        />
                      </div>
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="otherExpenses" className="text-sm text-muted-foreground mb-2 block flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        其他（紅包、請客、個人進修、給父母生活費、宗教奉獻等）
                      </Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">NT$</span>
                        <Input
                          id="otherExpenses"
                          type="number"
                          placeholder="3000"
                          value={variableExpenses.other}
                          onChange={(e) => updateVariableExpenses("other", e.target.value)}
                    className="pl-12 rounded-lg"
                  />
                </div>
              </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </Card>

          {/* Business Toggle */}
          <Card className="p-4 md:p-6 bg-card/80 backdrop-blur">
            <div className="flex items-center gap-3">
              <Checkbox
                id="hasBusiness"
                checked={hasBusiness}
                onCheckedChange={(checked) => setHasBusiness(checked === true)}
              />
              <Label
                htmlFor="hasBusiness"
                className="text-base font-medium text-foreground cursor-pointer flex items-center gap-2"
              >
                <Store className="w-5 h-5 text-primary" />
                我有做生意
              </Label>
            </div>
          </Card>

          {/* Business Section */}
          {hasBusiness ? (
            <Card className="p-6 md:p-8 bg-card/80 backdrop-blur">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Store className="w-6 h-6 text-primary" />
                </div>
                <h2 className="text-2xl font-semibold text-foreground">生意收入支出</h2>
              </div>

              <Accordion type="multiple" defaultValue={["business-income", "business-expenses"]} className="space-y-4">
                {/* 生意收入 */}
                <AccordionItem value="business-income" className="border rounded-lg px-4">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-5 h-5 text-primary" />
                      <span className="font-semibold">生意收入</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="grid md:grid-cols-2 gap-4 pt-4">
                    <div>
                      <Label htmlFor="productSales" className="text-sm text-muted-foreground mb-2 block flex items-center gap-2">
                        <Package className="w-4 h-4" />
                        商品銷售收入（產品或商品的銷售所得）
                      </Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">NT$</span>
                        <Input
                          id="productSales"
                          type="number"
                          placeholder="0"
                          value={businessIncome.productSales}
                          onChange={(e) => updateBusinessIncome("productSales", e.target.value)}
                          className="pl-12 rounded-lg"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="serviceIncome" className="text-sm text-muted-foreground mb-2 block flex items-center gap-2">
                        <Briefcase className="w-4 h-4" />
                        服務提供收入（提供專業服務或技能所獲得的收入）
                      </Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">NT$</span>
                        <Input
                          id="serviceIncome"
                          type="number"
                          placeholder="0"
                          value={businessIncome.serviceIncome}
                          onChange={(e) => updateBusinessIncome("serviceIncome", e.target.value)}
                          className="pl-12 rounded-lg"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="equipmentSale" className="text-sm text-muted-foreground mb-2 block flex items-center gap-2">
                        <Wrench className="w-4 h-4" />
                        二手設備出售（出售舊設備或閒置資產的收入）
                      </Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">NT$</span>
                        <Input
                          id="equipmentSale"
                          type="number"
                          placeholder="0"
                          value={businessIncome.equipmentSale}
                          onChange={(e) => updateBusinessIncome("equipmentSale", e.target.value)}
                          className="pl-12 rounded-lg"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="venueRental" className="text-sm text-muted-foreground mb-2 block flex items-center gap-2">
                        <Home className="w-4 h-4" />
                        場地出租（將部分營業場所臨時出租獲得的收入）
                      </Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">NT$</span>
                        <Input
                          id="venueRental"
                          type="number"
                          placeholder="0"
                          value={businessIncome.venueRental}
                          onChange={(e) => updateBusinessIncome("venueRental", e.target.value)}
                          className="pl-12 rounded-lg"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="partnership" className="text-sm text-muted-foreground mb-2 block flex items-center gap-2">
                        <Handshake className="w-4 h-4" />
                        合作分潤（與其他商家合作獲得的分成收入）
                      </Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">NT$</span>
                        <Input
                          id="partnership"
                          type="number"
                          placeholder="0"
                          value={businessIncome.partnership}
                          onChange={(e) => updateBusinessIncome("partnership", e.target.value)}
                          className="pl-12 rounded-lg"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="otherBusinessIncome" className="text-sm text-muted-foreground mb-2 block flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                        其他創業相關收入（與事業相關的其他收入來源）
                      </Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">NT$</span>
                        <Input
                          id="otherBusinessIncome"
                          type="number"
                          placeholder="0"
                          value={businessIncome.other}
                          onChange={(e) => updateBusinessIncome("other", e.target.value)}
                          className="pl-12 rounded-lg"
                        />
                      </div>
                    </div>
                  </div>
                  </AccordionContent>
                </AccordionItem>

                {/* 生意支出 */}
                <AccordionItem value="business-expenses" className="border rounded-lg px-4">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-2">
                      <FileText className="w-5 h-5 text-primary" />
                      <span className="font-semibold">生意支出</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4 pt-4">
                    {/* 變動支出 */}
                    <div>
                      <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                        <TrendingUp className="w-4 h-4" />
                        變動支出
                      </h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="materials" className="text-sm text-muted-foreground mb-2 block">
                            原料（材料費用、批貨等）
                          </Label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">NT$</span>
                            <Input
                              id="materials"
                              type="number"
                              placeholder="0"
                              value={businessVariableExpenses.materials}
                              onChange={(e) => updateBusinessVariableExpenses("materials", e.target.value)}
                              className="pl-12 rounded-lg"
                            />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="packaging" className="text-sm text-muted-foreground mb-2 block">
                            包材（塑膠袋、免洗餐具、外帶盒等）
                          </Label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">NT$</span>
                            <Input
                              id="packaging"
                              type="number"
                              placeholder="0"
                              value={businessVariableExpenses.packaging}
                              onChange={(e) => updateBusinessVariableExpenses("packaging", e.target.value)}
                              className="pl-12 rounded-lg"
                            />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="supplies" className="text-sm text-muted-foreground mb-2 block">
                            耗材（收據、文具、清潔用品等）
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">NT$</span>
                  <Input
                              id="supplies"
                    type="number"
                              placeholder="0"
                              value={businessVariableExpenses.supplies}
                              onChange={(e) => updateBusinessVariableExpenses("supplies", e.target.value)}
                    className="pl-12 rounded-lg"
                  />
                </div>
              </div>
              <div>
                          <Label htmlFor="shipping" className="text-sm text-muted-foreground mb-2 block">
                            運費（宅配、郵資、快遞等）
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">NT$</span>
                  <Input
                              id="shipping"
                    type="number"
                              placeholder="0"
                              value={businessVariableExpenses.shipping}
                              onChange={(e) => updateBusinessVariableExpenses("shipping", e.target.value)}
                    className="pl-12 rounded-lg"
                  />
                </div>
              </div>
              <div>
                          <Label htmlFor="variableOther" className="text-sm text-muted-foreground mb-2 block">
                            變動其他（交通費、工讀生薪資等）
                          </Label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">NT$</span>
                            <Input
                              id="variableOther"
                              type="number"
                              placeholder="0"
                              value={businessVariableExpenses.other}
                              onChange={(e) => updateBusinessVariableExpenses("other", e.target.value)}
                              className="pl-12 rounded-lg"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 固定支出 */}
                    <div>
                      <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                        固定支出
                      </h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="businessRent" className="text-sm text-muted-foreground mb-2 block">
                            租金（店租、擺攤租金等）
                          </Label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">NT$</span>
                            <Input
                              id="businessRent"
                              type="number"
                              placeholder="0"
                              value={businessFixedExpenses.rent}
                              onChange={(e) => updateBusinessFixedExpenses("rent", e.target.value)}
                              className="pl-12 rounded-lg"
                            />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="personnel" className="text-sm text-muted-foreground mb-2 block">
                            人事（會計師、助理、工會等薪資）
                          </Label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">NT$</span>
                            <Input
                              id="personnel"
                              type="number"
                              placeholder="0"
                              value={businessFixedExpenses.personnel}
                              onChange={(e) => updateBusinessFixedExpenses("personnel", e.target.value)}
                              className="pl-12 rounded-lg"
                            />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="businessUtilities" className="text-sm text-muted-foreground mb-2 block">
                            水電（營業用的水電費）
                          </Label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">NT$</span>
                            <Input
                              id="businessUtilities"
                              type="number"
                              placeholder="0"
                              value={businessFixedExpenses.utilities}
                              onChange={(e) => updateBusinessFixedExpenses("utilities", e.target.value)}
                              className="pl-12 rounded-lg"
                            />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="businessGas" className="text-sm text-muted-foreground mb-2 block">
                            瓦斯（天然氣、瓦斯費）
                          </Label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">NT$</span>
                            <Input
                              id="businessGas"
                              type="number"
                              placeholder="0"
                              value={businessFixedExpenses.gas}
                              onChange={(e) => updateBusinessFixedExpenses("gas", e.target.value)}
                              className="pl-12 rounded-lg"
                            />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="businessCommunication" className="text-sm text-muted-foreground mb-2 block">
                            通訊（店內電話、網路費）
                          </Label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">NT$</span>
                            <Input
                              id="businessCommunication"
                              type="number"
                              placeholder="0"
                              value={businessFixedExpenses.communication}
                              onChange={(e) => updateBusinessFixedExpenses("communication", e.target.value)}
                              className="pl-12 rounded-lg"
                            />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="businessRepayment" className="text-sm text-muted-foreground mb-2 block">
                            還款（信扶專案貸款、進貨貸款等）
                          </Label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">NT$</span>
                            <Input
                              id="businessRepayment"
                              type="number"
                              placeholder="0"
                              value={businessFixedExpenses.repayment}
                              onChange={(e) => updateBusinessFixedExpenses("repayment", e.target.value)}
                              className="pl-12 rounded-lg"
                            />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="fixedOther" className="text-sm text-muted-foreground mb-2 block">
                            固定其他（營業稅、會計費等）
                          </Label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">NT$</span>
                            <Input
                              id="fixedOther"
                              type="number"
                              placeholder="0"
                              value={businessFixedExpenses.other}
                              onChange={(e) => updateBusinessFixedExpenses("other", e.target.value)}
                              className="pl-12 rounded-lg"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 額外支出 */}
                    <div>
                      <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                        <TrendingUp className="w-4 h-4" />
                        額外支出
                      </h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="equipment" className="text-sm text-muted-foreground mb-2 block">
                            設備添購（器材或包裝機器等）
                          </Label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">NT$</span>
                            <Input
                              id="equipment"
                              type="number"
                              placeholder="0"
                              value={businessExtraExpenses.equipment}
                              onChange={(e) => updateBusinessExtraExpenses("equipment", e.target.value)}
                              className="pl-12 rounded-lg"
                            />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="repair" className="text-sm text-muted-foreground mb-2 block">
                            器材修繕（設備故障的維修費等）
                          </Label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">NT$</span>
                            <Input
                              id="repair"
                              type="number"
                              placeholder="0"
                              value={businessExtraExpenses.repair}
                              onChange={(e) => updateBusinessExtraExpenses("repair", e.target.value)}
                              className="pl-12 rounded-lg"
                            />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="marketing" className="text-sm text-muted-foreground mb-2 block">
                            行銷廣告（DM、名片、招牌等）
                          </Label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">NT$</span>
                            <Input
                              id="marketing"
                              type="number"
                              placeholder="0"
                              value={businessExtraExpenses.marketing}
                              onChange={(e) => updateBusinessExtraExpenses("marketing", e.target.value)}
                              className="pl-12 rounded-lg"
                            />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="extraOther" className="text-sm text-muted-foreground mb-2 block">
                            額外其他（無法分類的項目）
                          </Label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">NT$</span>
                            <Input
                              id="extraOther"
                              type="number"
                              placeholder="0"
                              value={businessExtraExpenses.other}
                              onChange={(e) => updateBusinessExtraExpenses("other", e.target.value)}
                              className="pl-12 rounded-lg"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            </Card>
          ) : null}
        </div>

        {/* CTA */}
        <div className="flex justify-between items-center mt-8">
          <Link href="/step1">
            <Button variant="ghost">返回</Button>
          </Link>
          <Button
            size="lg"
            className="px-8 py-6 rounded-xl"
            onClick={() => {
              // 在導航前強制保存所有數據
              const allData = {
                availableSavings,
                fixedIncome,
                variableIncome,
                fixedExpenses,
                variableExpenses,
                hasBusiness,
                businessIncome,
                businessVariableExpenses,
                businessFixedExpenses,
                businessExtraExpenses,
              }
              localStorage.setItem("step2Data", JSON.stringify(allData))
              if (availableSavings) {
                localStorage.setItem("availableSavings", availableSavings)
              }
              // 導航到 step3
              router.push("/step3")
            }}
          >
            幫我整理看看
          </Button>
        </div>
      </div>
    </main>
  )
}
