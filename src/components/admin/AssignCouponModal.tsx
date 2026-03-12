
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { CustomerData } from '@/hooks/useCustomerData';
import { useCreateTargetedCoupon } from '@/hooks/useTargetedCoupons';
import { toast } from '@/hooks/use-toast';
import { Gift, Loader2 } from 'lucide-react';

interface Props {
  customer: CustomerData;
  onClose: () => void;
}

const AssignCouponModal = ({ customer, onClose }: Props) => {
  const createCoupon = useCreateTargetedCoupon();
  const [form, setForm] = useState({
    code: '',
    type: 'percentage' as 'percentage' | 'flat',
    value: '',
    minPurchase: '0',
    maxDiscount: '',
    expiryDate: '',
    message: 'Special offer just for you! 🎉',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.code.trim() || !form.value || !form.expiryDate) {
      toast({ title: 'Error', description: 'Please fill all required fields', variant: 'destructive' });
      return;
    }

    try {
      await createCoupon.mutateAsync({
        customerEmail: customer.email,
        code: form.code.toUpperCase().trim(),
        type: form.type,
        value: Number(form.value),
        minPurchase: Number(form.minPurchase) || 0,
        maxDiscount: form.maxDiscount ? Number(form.maxDiscount) : null,
        expiryDate: new Date(form.expiryDate).toISOString(),
        message: form.message,
      });
      toast({ title: 'Success', description: `Coupon ${form.code} assigned to ${customer.name}` });
      onClose();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message || 'Failed to create coupon', variant: 'destructive' });
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Gift className="h-5 w-5 text-violet-500" />
            Assign Coupon to {customer.name}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Coupon Code *</Label>
            <Input
              value={form.code}
              onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
              placeholder="e.g. SPECIAL50"
              className="uppercase"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Discount Type *</Label>
              <Select value={form.type} onValueChange={(v: any) => setForm({ ...form, type: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="percentage">Percentage (%)</SelectItem>
                  <SelectItem value="flat">Fixed Amount (₹)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Value *</Label>
              <Input
                type="number"
                value={form.value}
                onChange={(e) => setForm({ ...form, value: e.target.value })}
                placeholder={form.type === 'percentage' ? 'e.g. 20' : 'e.g. 500'}
                min="1"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Min Purchase (₹)</Label>
              <Input
                type="number"
                value={form.minPurchase}
                onChange={(e) => setForm({ ...form, minPurchase: e.target.value })}
                placeholder="0"
                min="0"
              />
            </div>
            <div>
              <Label>Max Discount (₹)</Label>
              <Input
                type="number"
                value={form.maxDiscount}
                onChange={(e) => setForm({ ...form, maxDiscount: e.target.value })}
                placeholder="No limit"
                min="0"
              />
            </div>
          </div>

          <div>
            <Label>Expiry Date *</Label>
            <Input
              type="date"
              value={form.expiryDate}
              onChange={(e) => setForm({ ...form, expiryDate: e.target.value })}
              min={new Date().toISOString().split('T')[0]}
              required
            />
          </div>

          <div>
            <Label>Message to Customer</Label>
            <Textarea
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              placeholder="Special offer just for you!"
              rows={2}
            />
          </div>

          <div className="flex gap-2 pt-2">
            <Button
              type="submit"
              className="flex-1 bg-gradient-to-r from-violet-500 to-rose-500 text-white"
              disabled={createCoupon.isPending}
            >
              {createCoupon.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Gift className="h-4 w-4 mr-2" />}
              Assign Coupon
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AssignCouponModal;
