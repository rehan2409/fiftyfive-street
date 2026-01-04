
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { useCoupons, useAddCoupon, useUpdateCoupon, useDeleteCoupon } from '@/hooks/useSupabaseCoupons';
import { Plus, Edit, Trash2, Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const CouponManagement = () => {
  const { data: coupons = [], isLoading } = useCoupons();
  const addCouponMutation = useAddCoupon();
  const updateCouponMutation = useUpdateCoupon();
  const deleteCouponMutation = useDeleteCoupon();
  
  const [showForm, setShowForm] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    code: '',
    type: 'percentage' as 'percentage' | 'flat',
    value: '',
    maxUsages: '',
    expiryDate: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.code || !formData.value || !formData.maxUsages || !formData.expiryDate) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    const couponData = {
      code: formData.code.toUpperCase(),
      type: formData.type,
      value: parseFloat(formData.value),
      maxUsages: parseInt(formData.maxUsages),
      currentUsages: 0,
      expiryDate: new Date(formData.expiryDate).toISOString(),
      active: true,
    };

    try {
      if (editingCoupon) {
        await updateCouponMutation.mutateAsync({ id: editingCoupon, updates: couponData });
        toast({
          title: "Success",
          description: "Coupon updated successfully!",
        });
      } else {
        await addCouponMutation.mutateAsync(couponData);
        toast({
          title: "Success",
          description: "Coupon created successfully!",
        });
      }
      resetForm();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save coupon",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      code: '',
      type: 'percentage',
      value: '',
      maxUsages: '',
      expiryDate: ''
    });
    setShowForm(false);
    setEditingCoupon(null);
  };

  const handleEdit = (coupon: any) => {
    setFormData({
      code: coupon.code,
      type: coupon.type,
      value: coupon.value.toString(),
      maxUsages: coupon.maxUsages.toString(),
      expiryDate: coupon.expiryDate.split('T')[0]
    });
    setEditingCoupon(coupon.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this coupon?')) {
      try {
        await deleteCouponMutation.mutateAsync(id);
        toast({
          title: "Success",
          description: "Coupon deleted successfully!",
        });
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message || "Failed to delete coupon",
          variant: "destructive",
        });
      }
    }
  };

  const toggleCouponStatus = async (id: string, active: boolean) => {
    try {
      await updateCouponMutation.mutateAsync({ id, updates: { active } });
      toast({
        title: "Success",
        description: `Coupon ${active ? 'activated' : 'deactivated'} successfully!`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update coupon",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Coupon Management</h2>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Coupon
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingCoupon ? 'Edit Coupon' : 'Create New Coupon'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="code">Coupon Code</Label>
                <Input
                  id="code"
                  value={formData.code}
                  onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value }))}
                  placeholder="e.g., SAVE20"
                  required
                />
              </div>

              <div>
                <Label htmlFor="type">Discount Type</Label>
                <Select value={formData.type} onValueChange={(value: 'percentage' | 'flat') => setFormData(prev => ({ ...prev, type: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Percentage</SelectItem>
                    <SelectItem value="flat">Flat Amount</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="value">
                  {formData.type === 'percentage' ? 'Percentage (%)' : 'Amount (₹)'}
                </Label>
                <Input
                  id="value"
                  type="number"
                  value={formData.value}
                  onChange={(e) => setFormData(prev => ({ ...prev, value: e.target.value }))}
                  required
                />
              </div>

              <div>
                <Label htmlFor="maxUsages">Maximum Uses</Label>
                <Input
                  id="maxUsages"
                  type="number"
                  value={formData.maxUsages}
                  onChange={(e) => setFormData(prev => ({ ...prev, maxUsages: e.target.value }))}
                  required
                />
              </div>

              <div>
                <Label htmlFor="expiryDate">Expiry Date</Label>
                <Input
                  id="expiryDate"
                  type="date"
                  value={formData.expiryDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, expiryDate: e.target.value }))}
                  required
                />
              </div>

              <div className="flex space-x-2">
                <Button type="submit" disabled={addCouponMutation.isPending || updateCouponMutation.isPending}>
                  {(addCouponMutation.isPending || updateCouponMutation.isPending) && (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  )}
                  {editingCoupon ? 'Update Coupon' : 'Create Coupon'}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Existing Coupons</CardTitle>
        </CardHeader>
        <CardContent>
          {coupons.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No coupons created yet</p>
          ) : (
            <div className="space-y-4">
              {coupons.map((coupon) => (
                <div key={coupon.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-lg">{coupon.code}</span>
                      <Badge variant={coupon.active ? "default" : "secondary"}>
                        {coupon.active ? 'Active' : 'Inactive'}
                      </Badge>
                      {coupon.currentUsages >= coupon.maxUsages && (
                        <Badge variant="destructive">Limit Reached</Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">
                      {coupon.type === 'percentage' ? `${coupon.value}% OFF` : `₹${coupon.value} OFF`}
                    </p>
                    <p className="text-xs text-gray-500">
                      Uses: {coupon.currentUsages}/{coupon.maxUsages} | Expires: {new Date(coupon.expiryDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={coupon.active}
                      onCheckedChange={(checked) => toggleCouponStatus(coupon.id, checked)}
                      disabled={updateCouponMutation.isPending}
                    />
                    <Button variant="outline" size="sm" onClick={() => handleEdit(coupon)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleDelete(coupon.id)}
                      disabled={deleteCouponMutation.isPending}
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
  );
};

export default CouponManagement;
