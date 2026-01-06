import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Plane, GraduationCap, Calendar, TrendingUp, CheckCircle2, Lightbulb } from "lucide-react"

export default function Step4Page() {
  const savingsPlans = [
    {
      name: "日本家庭旅遊",
      icon: Plane,
      targetAmount: 150000,
      currentSaved: 30000,
      monthsRemaining: 8,
      monthlySaving: 15000,
      month: "8月",
      color: "from-blue-500/20 to-cyan-500/20",
    },
    {
      name: "孩子才藝課程",
      icon: GraduationCap,
      targetAmount: 30000,
      currentSaved: 20000,
      monthsRemaining: 3,
      monthlySaving: 3333,
      month: "3月",
      color: "from-green-500/20 to-emerald-500/20",
    },
  ]

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

        {/* Savings Plans */}
        <div className="space-y-6 mb-8">
          {savingsPlans.map((plan, index) => {
            const progress = (plan.currentSaved / plan.targetAmount) * 100
            const IconComponent = plan.icon
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
                    <h2 className="text-2xl font-semibold text-foreground mb-2">{plan.name}</h2>
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
                  <div className="p-4 rounded-lg bg-primary/10 backdrop-blur border border-primary/20">
                    <div className="flex items-center gap-1 mb-1">
                      <TrendingUp className="w-3 h-3 text-primary" />
                      <p className="text-xs text-primary font-medium">建議每月存</p>
                    </div>
                    <p className="text-lg font-bold text-primary">NT$ {plan.monthlySaving.toLocaleString()}</p>
                  </div>
                </div>
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
                如果這個月先把「日本旅遊」的 NT$ 15,000
                存下來，願望就不會擠壓到日常生活費。建議可以在發薪日當天就先轉到專用帳戶，這樣剩下的錢才是真正可以花的。
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
