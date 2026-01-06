import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Heart, Plane, GraduationCap, Home, Gift, Sparkles } from "lucide-react"

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-pink-50/50">
      <div className="container mx-auto px-4 py-12 md:py-20">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <Sparkles className="w-16 h-16 text-pink-400 animate-pulse" />
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 text-balance">夢想達成 財務管理系統</h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed text-pretty">
            年終獎金、旅遊、紅包、學費、保險
            <br />
            我們幫你把願望排好順序，不再月底才後悔。
          </p>
        </div>

        {/* Illustration Card */}
        <Card className="max-w-4xl mx-auto mb-12 p-8 md:p-12 bg-gradient-to-br from-orange-100 to-pink-100 border-orange-200/50">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <div className="flex items-center gap-4 p-4 rounded-lg bg-pink-100/70">
                <Plane className="w-8 h-8 text-pink-500" />
                <div>
                  <p className="font-medium text-foreground">家庭旅遊</p>
                  <p className="text-sm text-muted-foreground">想和家人一起出國</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 rounded-lg bg-orange-100/70">
                <GraduationCap className="w-8 h-8 text-orange-500" />
                <div>
                  <p className="font-medium text-foreground">孩子教育</p>
                  <p className="text-sm text-muted-foreground">學費和才藝費用</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 rounded-lg bg-pink-50/70">
                <Home className="w-8 h-8 text-pink-400" />
                <div>
                  <p className="font-medium text-foreground">家電更新</p>
                  <p className="text-sm text-muted-foreground">冰箱該換了</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 rounded-lg bg-orange-50/70">
                <Gift className="w-8 h-8 text-orange-400" />
                <div>
                  <p className="font-medium text-foreground">節慶紅包</p>
                  <p className="text-sm text-muted-foreground">過年給長輩的心意</p>
                </div>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="relative w-64 h-64 rounded-full bg-gradient-to-br from-orange-200/30 to-pink-200/30 flex items-center justify-center">
                <Heart className="w-32 h-32 text-pink-400/60" />
                <div className="absolute top-4 right-4 w-12 h-12 rounded-full bg-orange-300/60 animate-bounce" />
                <div className="absolute bottom-8 left-8 w-8 h-8 rounded-full bg-pink-300/60 animate-pulse" />
              </div>
            </div>
          </div>
        </Card>

        {/* CTA */}
        <div className="text-center">
          <Link href="/step1">
            <Button size="lg" className="text-lg px-8 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all bg-gradient-to-r from-orange-300 to-pink-300 hover:from-orange-400 hover:to-pink-400 text-white border-0">
              開始整理我的願望與錢
            </Button>
          </Link>
        </div>
      </div>
    </main>
  )
}
