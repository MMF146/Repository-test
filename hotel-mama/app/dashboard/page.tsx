"use client"

import { useState, useEffect } from "react"
import { useLanguage } from "@/lib/i18n/LanguageContext"
import { LanguageSelector } from "@/components/ui/language-selector"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { FoodOrderDialog } from "@/components/ui/food-order-dialog"
import {
  Menu,
  Plus,
  Filter,
  Utensils,
  ShoppingBag,
  Truck
} from "lucide-react"

export default function Dashboard() {
  const { t } = useLanguage()
  const [isMobile, setIsMobile] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeSection, setActiveSection] = useState("dashboard")
  const [orders, setOrders] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const loadOrders = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/food-orders')
      if (!response.ok) throw new Error('Failed to load orders')
      const data = await response.json()
      setOrders(data)
    } catch (error) {
      console.error('Error loading orders:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    loadOrders()

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  const renderDashboard = () => (
    <div>
      <h2 className="text-2xl font-bold mb-6">{t('navigation', 'dashboard')}</h2>
      {/* Contenido del dashboard */}
    </div>
  )

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 flex items-center justify-between px-4 py-4 md:px-6">
          <div className="flex items-center">
            {isMobile && (
              <Button variant="ghost" size="icon" className="mr-2" onClick={() => setSidebarOpen(true)}>
                <Menu className="h-5 w-5" />
              </Button>
            )}
            <h1 className="text-xl font-semibold text-gray-800">
              {t('navigation', activeSection === "dashboard"
                ? "dashboard"
                : activeSection === "food-delivery"
                  ? "foodDelivery"
                  : activeSection)}
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <LanguageSelector />
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50">
          {activeSection === "dashboard" && renderDashboard()}
          {activeSection === "food-delivery" && (
            <>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">{t('foodDelivery', 'title')}</h2>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex items-center gap-1">
                    <Filter className="h-4 w-4" />
                    {t('common', 'filter')}
                  </Button>
                  <FoodOrderDialog
                    trigger={
                      <Button size="sm" className="flex items-center gap-1">
                        <Plus className="h-4 w-4" />
                        {t('foodDelivery', 'newOrder')}
                      </Button>
                    }
                    onOrderCreated={loadOrders}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Card>
                  <CardContent className="p-4 flex items-center">
                    <div className="bg-blue-50 p-3 rounded-full mr-4">
                      <Utensils className="h-6 w-6 text-blue-500" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">{t('foodDelivery', 'totalOrders')}</p>
                      <h3 className="text-2xl font-bold">42</h3>
                      <p className="text-xs text-green-600">+8% from yesterday</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 flex items-center">
                    <div className="bg-green-50 p-3 rounded-full mr-4">
                      <ShoppingBag className="h-6 w-6 text-green-500" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">{t('foodDelivery', 'completed')}</p>
                      <h3 className="text-2xl font-bold">35</h3>
                      <p className="text-xs text-green-600">83% of total</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 flex items-center">
                    <div className="bg-amber-50 p-3 rounded-full mr-4">
                      <Truck className="h-6 w-6 text-amber-500" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">{t('foodDelivery', 'inProgress')}</p>
                      <h3 className="text-2xl font-bold">7</h3>
                      <p className="text-xs text-amber-600">17% of total</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  )
} 