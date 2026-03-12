
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { CustomerData } from '@/hooks/useCustomerData';
import { TargetedCoupon, useDeleteTargetedCoupon, useToggleTargetedCoupon } from '@/hooks/useTargetedCoupons';
import { User, Mail, Phone, MapPin, Calendar, ShoppingBag, Star, Gift, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';

interface Props {
  customer: CustomerData;
  targetedCoupons: TargetedCoupon[];
  onClose: () => void;
  onAssignCoupon: () => void;
}

const CustomerDetailModal = ({ customer, targetedCoupons, onClose, onAssignCoupon }: Props) => {
  const deleteCoupon = useDeleteTargetedCoupon();
  const toggleCoupon = useToggleTargetedCoupon();

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-500 to-rose-500 flex items-center justify-center text-white font-bold text-lg">
              {customer.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <span className="flex items-center gap-2">
                {customer.name}
                {customer.isHighValue && <Star className="h-4 w-4 text-amber-500 fill-amber-500" />}
                <Badge variant={customer.isActive ? 'default' : 'secondary'} className={customer.isActive ? 'bg-green-100 text-green-700' : ''}>
                  {customer.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </span>
              <p className="text-sm text-muted-foreground font-normal">{customer.email}</p>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Personal Info */}
          <Card>
            <CardContent className="p-4 grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{customer.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{customer.phone || 'Not provided'}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>{customer.address || 'Not provided'}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p>Signed up: {new Date(customer.signupDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                  <p className="text-xs text-muted-foreground">{new Date(customer.signupDate).toLocaleTimeString('en-IN')}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Order Stats */}
          <div className="grid grid-cols-3 gap-3">
            <Card>
              <CardContent className="p-4 text-center">
                <ShoppingBag className="h-6 w-6 mx-auto mb-1 text-violet-500" />
                <p className="text-2xl font-bold">{customer.totalOrders}</p>
                <p className="text-xs text-muted-foreground">Total Orders</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold">₹{customer.totalSpent.toFixed(0)}</p>
                <p className="text-xs text-muted-foreground">Total Spent</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold">
                  {customer.lastPurchaseDate
                    ? new Date(customer.lastPurchaseDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
                    : '—'}
                </p>
                <p className="text-xs text-muted-foreground">Last Purchase</p>
              </CardContent>
            </Card>
          </div>

          {/* Last Purchase Details */}
          {customer.lastPurchaseDate && (
            <Card>
              <CardContent className="p-4">
                <h4 className="font-semibold text-sm mb-2">Last Purchase Details</h4>
                <div className="text-sm space-y-1">
                  <p><span className="text-muted-foreground">Date:</span> {new Date(customer.lastPurchaseDate).toLocaleString('en-IN')}</p>
                  <p><span className="text-muted-foreground">Products:</span> {customer.lastPurchaseProducts.join(', ') || 'N/A'}</p>
                  <p><span className="text-muted-foreground">Value:</span> ₹{customer.lastPurchaseValue}</p>
                  <p><span className="text-muted-foreground">Status:</span> <Badge variant="outline">{customer.lastPurchaseStatus}</Badge></p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Assigned Coupons */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-sm flex items-center gap-2">
                  <Gift className="h-4 w-4" /> Assigned Coupons ({targetedCoupons.length})
                </h4>
                <Button size="sm" onClick={onAssignCoupon} className="bg-gradient-to-r from-violet-500 to-rose-500 text-white border-0">
                  <Gift className="h-3 w-3 mr-1" /> Assign New
                </Button>
              </div>
              {targetedCoupons.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">No coupons assigned yet</p>
              ) : (
                <div className="space-y-2">
                  {targetedCoupons.map((coupon) => (
                    <div key={coupon.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border">
                      <div>
                        <p className="font-mono font-bold text-sm">{coupon.code}</p>
                        <p className="text-xs text-muted-foreground">
                          {coupon.type === 'percentage' ? `${coupon.value}% off` : `₹${coupon.value} off`}
                          {coupon.minPurchase > 0 && ` · Min ₹${coupon.minPurchase}`}
                          {coupon.maxDiscount && ` · Max ₹${coupon.maxDiscount}`}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Expires: {new Date(coupon.expiryDate).toLocaleDateString('en-IN')}
                          {coupon.used && ' · ✅ Used'}
                        </p>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8"
                          onClick={() => toggleCoupon.mutate({ id: coupon.id, active: !coupon.active })}
                        >
                          {coupon.active ? <ToggleRight className="h-4 w-4 text-green-600" /> : <ToggleLeft className="h-4 w-4 text-muted-foreground" />}
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-red-500 hover:text-red-700"
                          onClick={() => deleteCoupon.mutate(coupon.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CustomerDetailModal;
