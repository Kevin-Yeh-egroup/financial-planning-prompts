import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { CheckCircle2, DollarSign, TrendingUp, Calendar, Sparkles } from "lucide-react"

export default function Step3Page() {
  // Mock calculation results
  const monthlyIncome = 45000
  const monthlyFixedExpenses = 28000
  const flexibleAmount = 12000
  const yearlyExpensesMonthly = 5000

  const feasibleWishes = [
    { name: "孩子才藝課程", amount: 30000, month: 3 },
    { name: "日本家庭旅遊", amount: 150000, month: 8, needsSaving: true },
  ]

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
                <p className="text-sm text-muted-foreground mb-1">固定支出（含年度平均）</p>
                <p className="text-2xl font-bold text-foreground">
                  NT$ {(monthlyFixedExpenses + yearlyExpensesMonthly).toLocaleString()}
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
                  <p>
                    目前你的固定支出已預留完成，
                    <br />
                    每月約有 <span className="font-semibold text-primary">NT$ {flexibleAmount.toLocaleString()}</span>{" "}
                    可以彈性運用。
                  </p>
                  <p>
                    若想在 8 月完成日本旅遊，
                    <br />
                    建議每月儲蓄 <span className="font-semibold text-primary">NT$ 6,000</span>。
                  </p>
                  <p className="text-sm bg-accent/30 p-4 rounded-lg">
                    💡 這樣算下來，你還有約 NT$ 6,000 可以用在生活開銷和小額願望上，不會感到太緊繃。
                  </p>
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
                        目標金額：NT$ {wish.amount.toLocaleString()} | 完成時間：{wish.month} 月
                      </p>
                    </div>
                    {!wish.needsSaving && (
                      <div className="flex items-center gap-2 text-primary">
                        <CheckCircle2 className="w-5 h-5" />
                        <span className="text-sm font-medium">可達成</span>
                      </div>
                    )}
                  </div>
                  {wish.needsSaving ? (
                    <>
                      <Progress value={40} className="mb-2 h-2" />
                      <p className="text-sm text-muted-foreground">需要規劃儲蓄計畫</p>
                    </>
                  ) : (
                    <>
                      <Progress value={100} className="mb-2 h-2" />
                      <p className="text-sm text-primary">預算內可以完成</p>
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
