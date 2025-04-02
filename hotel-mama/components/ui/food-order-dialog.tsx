"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/components/ui/use-toast"
import { useLanguage } from "@/lib/i18n/LanguageContext"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface MenuItem {
  id: string
  name: string
  price: number
}

const menuItems: MenuItem[] = [
  { id: "1", name: "Chicken Curry", price: 450 },
  { id: "2", name: "Vegetable Pasta", price: 350 },
  { id: "3", name: "Club Sandwich", price: 250 },
  { id: "4", name: "Naan Bread", price: 50 },
  { id: "5", name: "Rice", price: 100 },
]

interface FoodOrderDialogProps {
  trigger?: React.ReactNode
  onOrderCreated?: () => void
}

export function FoodOrderDialog({ trigger, onOrderCreated }: FoodOrderDialogProps) {
  const { t } = useLanguage()
  const { toast } = useToast()
  const [open, setOpen] = useState(false)
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [guest, setGuest] = useState("")
  const [specialInstructions, setSpecialInstructions] = useState("")

  const totalAmount = selectedItems.reduce((total, itemId) => {
    const item = menuItems.find(i => i.id === itemId)
    return total + (item?.price || 0)
  }, 0)

  const handleSubmit = async () => {
    try {
      if (!guest) {
        toast({
          title: t('common', 'error'),
          description: t('foodDelivery', 'selectGuest'),
          variant: "destructive",
        })
        return
      }

      if (selectedItems.length === 0) {
        toast({
          title: t('common', 'error'),
          description: t('foodDelivery', 'selectItems'),
          variant: "destructive",
        })
        return
      }

      const orderData = {
        guest,
        items: selectedItems.map(id => menuItems.find(item => item.id === id)?.name),
        specialInstructions,
        totalAmount,
        status: "preparing"
      }

      const response = await fetch('/api/food-orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      })

      if (!response.ok) {
        throw new Error(t('foodDelivery', 'orderError'))
      }

      toast({
        title: t('foodDelivery', 'orderSuccess'),
        description: t('foodDelivery', 'orderPlaced'),
      })

      setOpen(false)
      setSelectedItems([])
      setGuest("")
      setSpecialInstructions("")
      
      if (onOrderCreated) {
        onOrderCreated()
      }
    } catch (error) {
      toast({
        title: t('common', 'error'),
        description: error instanceof Error ? error.message : t('foodDelivery', 'orderError'),
        variant: "destructive",
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || <Button>{t('foodDelivery', 'newOrder')}</Button>}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{t('foodDelivery', 'placeOrder')}</DialogTitle>
          <DialogDescription>
            {t('foodDelivery', 'orderDescription')}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="guest" className="text-right">
              {t('common', 'guest')}
            </Label>
            <Select value={guest} onValueChange={setGuest}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder={t('foodDelivery', 'selectGuest')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ram">Ram Kailash - Room 101</SelectItem>
                <SelectItem value="samira">Samira Karki - Room 205</SelectItem>
                <SelectItem value="jeevan">Jeevan Rai - Room 310</SelectItem>
                <SelectItem value="bindu">Bindu Sharma - Room 402</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-start gap-4">
            <Label className="text-right">
              {t('foodDelivery', 'menuItems')}
            </Label>
            <div className="col-span-3 border rounded-md p-3 space-y-2">
              {menuItems.map((item) => (
                <div key={item.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={item.id}
                    checked={selectedItems.includes(item.id)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedItems([...selectedItems, item.id])
                      } else {
                        setSelectedItems(selectedItems.filter(id => id !== item.id))
                      }
                    }}
                  />
                  <Label htmlFor={item.id} className="flex justify-between w-full">
                    <span>{item.name}</span>
                    <span>Rs.{item.price}</span>
                  </Label>
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="instructions" className="text-right">
              {t('foodDelivery', 'specialInstructions')}
            </Label>
            <Textarea
              id="instructions"
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              placeholder={t('foodDelivery', 'instructionsPlaceholder')}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">
              {t('common', 'total')}
            </Label>
            <div className="col-span-3 font-bold">
              Rs.{totalAmount}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit}>
            {t('foodDelivery', 'placeOrder')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 