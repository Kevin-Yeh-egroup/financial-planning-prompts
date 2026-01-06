"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Users, Share2, Calendar, MessageCircle, CheckCircle2, Sparkles, Mail, Phone } from "lucide-react"

export default function Step6Page() {
  const [shareMethod, setShareMethod] = useState<string | null>(null)

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-accent/20">
      <div className="container mx-auto px-4 py-8 md:py-12 max-w-4xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <Users className="w-16 h-16 text-primary" />
              <Sparkles className="w-8 h-8 text-secondary absolute -top-2 -right-2 animate-pulse" />
            </div>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-4 text-balance">
            全家一起知道，才真的做得到
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed text-pretty max-w-2xl mx-auto">
            當每個人都知道
            <br />
            什麼時候可以、什麼時候要等，
            <br />
            家裡就少一點吵架，多一點安心。
          </p>
        </div>

        {/* Benefits */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <Card className="p-6 bg-gradient-to-br from-primary/10 to-blue-500/10 text-center">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-3">
              <Calendar className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">清楚的時間表</h3>
            <p className="text-sm text-muted-foreground">每個願望什麼時候可以達成，一目了然</p>
          </Card>
          <Card className="p-6 bg-gradient-to-br from-secondary/20 to-amber-500/10 text-center">
            <div className="w-12 h-12 rounded-full bg-secondary/50 flex items-center justify-center mx-auto mb-3">
              <MessageCircle className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">減少金錢爭執</h3>
            <p className="text-sm text-muted-foreground">不用猜測，不用等月底才發現錢不夠</p>
          </Card>
          <Card className="p-6 bg-gradient-to-br from-accent/30 to-green-500/10 text-center">
            <div className="w-12 h-12 rounded-full bg-accent/50 flex items-center justify-center mx-auto mb-3">
              <CheckCircle2 className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">一起為目標努力</h3>
            <p className="text-sm text-muted-foreground">全家人都能看到進度，更有動力</p>
          </Card>
        </div>

        {/* Share Options */}
        <Card className="p-6 md:p-8 bg-card/80 backdrop-blur mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Share2 className="w-6 h-6 text-primary" />
            </div>
            <h2 className="text-2xl font-semibold text-foreground">分享給家人</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <Button
              variant="outline"
              className={`p-6 h-auto flex flex-col items-center gap-3 hover:bg-primary/5 ${shareMethod === "link" ? "border-primary bg-primary/5" : ""}`}
              onClick={() => setShareMethod("link")}
            >
              <Share2 className="w-8 h-8 text-primary" />
              <div className="text-center">
                <p className="font-semibold text-foreground mb-1">產生分享連結</p>
                <p className="text-sm text-muted-foreground">複製連結傳給家人查看</p>
              </div>
            </Button>

            <Button
              variant="outline"
              className={`p-6 h-auto flex flex-col items-center gap-3 hover:bg-primary/5 ${shareMethod === "email" ? "border-primary bg-primary/5" : ""}`}
              onClick={() => setShareMethod("email")}
            >
              <Mail className="w-8 h-8 text-primary" />
              <div className="text-center">
                <p className="font-semibold text-foreground mb-1">寄送電子郵件</p>
                <p className="text-sm text-muted-foreground">直接將計畫寄到信箱</p>
              </div>
            </Button>
          </div>

          {shareMethod === "link" && (
            <div className="p-4 rounded-lg bg-accent/20 border border-accent animate-in fade-in">
              <p className="text-sm text-muted-foreground mb-2">分享連結已產生</p>
              <div className="flex gap-2">
                <input
                  type="text"
                  readOnly
                  value="https://財務管理.app/share/abc123xyz"
                  className="flex-1 px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm"
                />
                <Button size="sm" className="px-4">
                  複製
                </Button>
              </div>
            </div>
          )}

          {shareMethod === "email" && (
            <div className="p-4 rounded-lg bg-accent/20 border border-accent animate-in fade-in">
              <p className="text-sm text-muted-foreground mb-2">輸入家人的電子郵件</p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="family@example.com"
                  className="flex-1 px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm"
                />
                <Button size="sm" className="px-4">
                  寄送
                </Button>
              </div>
            </div>
          )}
        </Card>

        {/* Consultation */}
        <Card className="p-6 md:p-8 bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-card/80 backdrop-blur flex items-center justify-center flex-shrink-0">
              <Phone className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-foreground mb-2">需要進一步的專業建議？</h3>
              <p className="text-muted-foreground mb-4 leading-relaxed">
                如果你想要更細緻的規劃、投資建議，或是有複雜的家庭財務狀況需要討論，我們的理財顧問可以幫助你。
              </p>
              <Button variant="outline" className="bg-card/60">
                預約免費諮詢
              </Button>
            </div>
          </div>
        </Card>

        {/* Summary Card */}
        <Card className="p-6 md:p-8 bg-accent/30 border-accent mt-6">
          <div className="text-center">
            <CheckCircle2 className="w-12 h-12 text-primary mx-auto mb-3" />
            <h3 className="text-xl font-semibold text-foreground mb-2">恭喜！你已經完成財務整理</h3>
            <p className="text-muted-foreground mb-4">現在你知道：</p>
            <ul className="text-sm text-muted-foreground space-y-2 max-w-md mx-auto text-left">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                每個月可以彈性運用多少錢
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                每個願望需要怎麼準備
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                緊急預備金還需要多少
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                如何讓全家人一起達成目標
              </li>
            </ul>
          </div>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between items-center mt-8">
          <Link href="/step5">
            <Button variant="ghost">返回</Button>
          </Link>
          <Link href="/">
            <Button size="lg" className="px-8 py-6 rounded-xl">
              回到首頁
            </Button>
          </Link>
        </div>
      </div>
    </main>
  )
}
