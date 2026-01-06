import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Shield, Umbrella, Heart, AlertCircle, CheckCircle2, PiggyBank } from "lucide-react"

export default function Step5Page() {
  const monthlyExpenses = 33000
  const recommendedMonths = 6
  const targetAmount = monthlyExpenses * recommendedMonths
  const currentAmount = 80000
  const progress = (currentAmount / targetAmount) * 100

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

          {/* Progress */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-muted-foreground">目前進度</span>
              <span className="text-sm font-medium text-foreground">
                NT$ {currentAmount.toLocaleString()} / NT$ {targetAmount.toLocaleString()}
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
              <p className="text-lg font-bold text-primary">NT$ {(targetAmount - currentAmount).toLocaleString()}</p>
            </div>
          </div>
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
