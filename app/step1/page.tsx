"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plane, GraduationCap, Home, Gift, ShoppingBag, Heart, Plus, Trash2 } from "lucide-react"

interface Wish {
  id: string
  name: string
  cost: string
  month: string
  icon: string
}

const iconMap = {
  travel: Plane,
  education: GraduationCap,
  home: Home,
  gift: Gift,
  shopping: ShoppingBag,
  other: Heart,
}

export default function Step1Page() {
  const [wishes, setWishes] = useState<Wish[]>([
    { id: "1", name: "日本家庭旅遊", cost: "150000", month: "8", icon: "travel" },
    { id: "2", name: "孩子才藝課程", cost: "30000", month: "3", icon: "education" },
  ])

  const addWish = () => {
    setWishes([...wishes, { id: Date.now().toString(), name: "", cost: "", month: "", icon: "other" }])
  }

  const removeWish = (id: string) => {
    setWishes(wishes.filter((w) => w.id !== id))
  }

  const updateWish = (id: string, field: keyof Wish, value: string) => {
    setWishes(wishes.map((w) => (w.id === id ? { ...w, [field]: value } : w)))
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-accent/20">
      <div className="container mx-auto px-4 py-8 md:py-12 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-4 text-balance">
            今年，你想為家人做哪些事？
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed text-pretty">
            不管是旅遊、家電、紅包、孩子用品
            <br />
            先全部寫下來，錢才會幫得上忙。
          </p>
        </div>

        {/* Wishes List */}
        <div className="space-y-4 mb-6">
          {wishes.map((wish, index) => {
            const IconComponent = iconMap[wish.icon as keyof typeof iconMap] || Heart
            return (
              <Card key={wish.id} className="p-6 bg-card/80 backdrop-blur hover:shadow-lg transition-shadow">
                <div className="flex gap-4">
                  {/* Icon Selector */}
                  <div className="flex-shrink-0">
                    <Select value={wish.icon} onValueChange={(value) => updateWish(wish.id, "icon", value)}>
                      <SelectTrigger className="w-16 h-16 rounded-xl bg-accent/50">
                        <IconComponent className="w-8 h-8 text-primary mx-auto" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="travel">
                          <div className="flex items-center gap-2">
                            <Plane className="w-5 h-5" />
                            旅遊
                          </div>
                        </SelectItem>
                        <SelectItem value="education">
                          <div className="flex items-center gap-2">
                            <GraduationCap className="w-5 h-5" />
                            教育
                          </div>
                        </SelectItem>
                        <SelectItem value="home">
                          <div className="flex items-center gap-2">
                            <Home className="w-5 h-5" />
                            家電
                          </div>
                        </SelectItem>
                        <SelectItem value="gift">
                          <div className="flex items-center gap-2">
                            <Gift className="w-5 h-5" />
                            紅包
                          </div>
                        </SelectItem>
                        <SelectItem value="shopping">
                          <div className="flex items-center gap-2">
                            <ShoppingBag className="w-5 h-5" />
                            購物
                          </div>
                        </SelectItem>
                        <SelectItem value="other">
                          <div className="flex items-center gap-2">
                            <Heart className="w-5 h-5" />
                            其他
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Form Fields */}
                  <div className="flex-1 grid gap-4 md:grid-cols-3">
                    <div className="md:col-span-1">
                      <Label htmlFor={`name-${wish.id}`} className="text-sm text-muted-foreground mb-2 block">
                        願望名稱
                      </Label>
                      <Input
                        id={`name-${wish.id}`}
                        placeholder="例如：日本旅遊"
                        value={wish.name}
                        onChange={(e) => updateWish(wish.id, "name", e.target.value)}
                        className="rounded-lg"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`cost-${wish.id}`} className="text-sm text-muted-foreground mb-2 block">
                        預估金額
                      </Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">NT$</span>
                        <Input
                          id={`cost-${wish.id}`}
                          type="number"
                          placeholder="50000"
                          value={wish.cost}
                          onChange={(e) => updateWish(wish.id, "cost", e.target.value)}
                          className="pl-12 rounded-lg"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor={`month-${wish.id}`} className="text-sm text-muted-foreground mb-2 block">
                        希望完成月份
                      </Label>
                      <Select value={wish.month} onValueChange={(value) => updateWish(wish.id, "month", value)}>
                        <SelectTrigger id={`month-${wish.id}`} className="rounded-lg">
                          <SelectValue placeholder="選擇月份" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                            <SelectItem key={month} value={month.toString()}>
                              {month} 月
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Delete Button */}
                  {wishes.length > 1 && (
                    <div className="flex-shrink-0">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeWish(wish.id)}
                        className="h-10 w-10 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="w-5 h-5" />
                      </Button>
                    </div>
                  )}
                </div>
              </Card>
            )
          })}
        </div>

        {/* Add New Wish Button */}
        <Button
          onClick={addWish}
          variant="outline"
          className="w-full mb-8 py-6 rounded-xl border-dashed border-2 hover:bg-accent/50 bg-transparent"
        >
          <Plus className="w-5 h-5 mr-2" />
          新增願望
        </Button>

        {/* CTA */}
        <div className="flex justify-between items-center">
          <Link href="/">
            <Button variant="ghost">返回</Button>
          </Link>
          <Link href="/step2">
            <Button size="lg" className="px-8 py-6 rounded-xl">
              下一步，看看我的錢
            </Button>
          </Link>
        </div>
      </div>
    </main>
  )
}
