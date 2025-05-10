"use client"

import { useState } from "react"
import { useTelegramGroups } from "@/hooks/use-telegram-groups"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, Users, Globe, Tag } from "lucide-react"
import { useTranslation } from "react-i18next"

export function TelegramGroups() {
  const { groups, loading, error } = useTelegramGroups()
  const [activeCategory, setActiveCategory] = useState("all")
  const { t } = useTranslation()

  // Extract unique categories
  const categories = ["all", ...new Set(groups.map((group) => group.category))]

  // Filter groups by active category
  const filteredGroups = activeCategory === "all" ? groups : groups.filter((group) => group.category === activeCategory)

  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p>{t("loading_telegram_groups")}</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-8 text-center text-red-500">
        <p>{error}</p>
        <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
          {t("try_again")}
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">{t("telegram_communities")}</h2>
      </div>

      <Tabs defaultValue="all" value={activeCategory} onValueChange={setActiveCategory}>
        <TabsList className="mb-4 flex flex-wrap">
          {categories.map((category) => (
            <TabsTrigger key={category} value={category} className="capitalize">
              {category}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={activeCategory} className="mt-0">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredGroups.map((group) => (
              <Card key={group.id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{group.name}</CardTitle>
                    <Badge variant="outline" className="capitalize">
                      {group.category}
                    </Badge>
                  </div>
                  <CardDescription className="line-clamp-2">{group.description}</CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                    {group.memberCount && (
                      <div className="flex items-center gap-1">
                        <Users size={14} />
                        <span>{group.memberCount.toLocaleString()}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <Globe size={14} />
                      <span>{group.language}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button asChild variant="outline" className="w-full">
                    <a href={group.url} target="_blank" rel="noopener noreferrer" className="flex items-center">
                      {t("join_group")}
                      <ExternalLink size={14} className="ml-2" />
                    </a>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          {filteredGroups.length === 0 && (
            <div className="text-center py-12">
              <Tag className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">{t("no_groups_found")}</h3>
              <p className="text-muted-foreground">{t("no_groups_in_category")}</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
