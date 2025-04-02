"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { GuestFeedbackForm } from "@/components/forms/guest-feedback-form"
import { CheckInOutForm } from "@/components/forms/check-in-out-form"
import { LocalPreferencesForm } from "@/components/forms/local-preferences-form"
import { useLanguage } from "@/lib/i18n/LanguageContext"

export default function GuestServicesPage() {
  const { t } = useLanguage()
  const [activeTab, setActiveTab] = useState("feedback")

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">
        {t("guestServices", "title")}
      </h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="feedback">
            {t("guestServices.feedback", "title")}
          </TabsTrigger>
          <TabsTrigger value="checkinout">
            {t("guestServices.checkInOut", "title")}
          </TabsTrigger>
          <TabsTrigger value="preferences">
            {t("guestServices.preferences", "title")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="feedback">
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-2">
              {t("guestServices.feedback", "title")}
            </h2>
            <p className="text-gray-600 mb-6">
              {t("guestServices.feedback", "description")}
            </p>
            <GuestFeedbackForm />
          </Card>
        </TabsContent>

        <TabsContent value="checkinout">
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-2">
              {t("guestServices.checkInOut", "title")}
            </h2>
            <p className="text-gray-600 mb-6">
              {t("guestServices.checkInOut", "description")}
            </p>
            <CheckInOutForm />
          </Card>
        </TabsContent>

        <TabsContent value="preferences">
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-2">
              {t("guestServices.preferences", "title")}
            </h2>
            <p className="text-gray-600 mb-6">
              {t("guestServices.preferences", "description")}
            </p>
            <LocalPreferencesForm />
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 