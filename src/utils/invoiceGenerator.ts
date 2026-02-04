import { jsPDF } from 'jspdf';
import { Order, CartItem } from '@/store/useStore';

interface CustomerInfo {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  pincode?: string;
}

export const generateInvoicePDF = (order: Order): void => {
  if (!order || !order.id) {
    console.error('Invalid order data for invoice generation');
    throw new Error('Invalid order data');
  }

  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  let y = 20;

  // Safely access customer info with defaults
  const customerInfo = (order.customerInfo || {}) as CustomerInfo;
  const customerName = customerInfo.name || 'Unknown Customer';
  const customerEmail = customerInfo.email || 'N/A';
  const customerPhone = customerInfo.phone || 'N/A';
  const customerAddress = customerInfo.address || 'N/A';
  const customerPincode = customerInfo.pincode || 'N/A';

  // Header
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('FIFTY-FIVE', pageWidth / 2, y, { align: 'center' });
  
  y += 8;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Phone: 8446421463 | Email: fiftyfivestreetwear@gmail.com', pageWidth / 2, y, { align: 'center' });
  
  y += 5;
  doc.text('Instagram: @the.fifty.five', pageWidth / 2, y, { align: 'center' });

  // Line separator
  y += 8;
  doc.setLineWidth(0.5);
  doc.line(20, y, pageWidth - 20, y);

  // Invoice Title
  y += 15;
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('INVOICE', pageWidth / 2, y, { align: 'center' });

  // Invoice Details
  y += 15;
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Invoice Details', 20, y);
  
  y += 7;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  const orderId = order.id || 'UNKNOWN';
  doc.text(`Invoice Number: #${orderId.slice(0, 8)}...`, 20, y);
  
  y += 6;
  const orderDate = order.createdAt ? new Date(order.createdAt) : new Date();
  doc.text(`Date: ${orderDate.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })}`, 20, y);
  
  y += 6;
  doc.text(`Status: ${order.status || 'Processing'}`, 20, y);

  // Customer Info
  y += 12;
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Bill To', 20, y);
  
  y += 7;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text(`Name: ${customerName}`, 20, y);
  
  y += 6;
  doc.text(`Email: ${customerEmail}`, 20, y);
  
  y += 6;
  doc.text(`Phone: ${customerPhone}`, 20, y);
  
  y += 6;
  doc.text(`Address: ${customerAddress}`, 20, y);
  
  y += 6;
  doc.text(`PIN Code: ${customerPincode}`, 20, y);

  // Items Table Header
  y += 15;
  doc.setFillColor(0, 0, 0);
  doc.rect(20, y - 5, pageWidth - 40, 10, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('ITEM', 25, y);
  doc.text('SIZE', 90, y);
  doc.text('QTY', 110, y);
  doc.text('PRICE', 130, y);
  doc.text('TOTAL', 165, y);

  // Items
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'normal');
  y += 10;

  const items = (order.items || []) as any[];
  items.forEach((item) => {
    // Handle both nested (item.product.name) and flat (item.name) structures
    let productName = 'Unknown Product';
    let productPrice = 0;
    
    if (item.product && typeof item.product === 'object') {
      // Nested structure: { product: { name, price }, quantity, size }
      productName = item.product.name || 'Unknown Product';
      productPrice = Number(item.product.price) || 0;
    } else if (item.name) {
      // Flat structure from database: { name, price, quantity, size }
      productName = item.name || 'Unknown Product';
      productPrice = Number(item.price) || 0;
    }
    
    const quantity = Number(item.quantity) || 1;
    const size = item.size || 'N/A';
    
    const itemName = productName.length > 30 
      ? productName.substring(0, 30) + '...' 
      : productName;
    
    doc.text(itemName, 25, y);
    doc.text(size, 90, y);
    doc.text(quantity.toString(), 110, y);
    doc.text(`Rs ${productPrice.toLocaleString('en-IN')}`, 130, y);
    doc.text(`Rs ${(productPrice * quantity).toLocaleString('en-IN')}`, 165, y);
    
    y += 8;
  });

  // Line before totals
  y += 5;
  doc.setLineWidth(0.3);
  doc.line(120, y, pageWidth - 20, y);

  // Totals
  const total = Number(order.total) || 0;
  const discount = Number(order.discount) || 0;
  
  y += 10;
  doc.setFontSize(10);
  doc.text('Subtotal:', 130, y);
  doc.text(`Rs ${(total + discount).toLocaleString('en-IN')}`, 165, y);

  if (discount > 0) {
    y += 8;
    doc.setTextColor(34, 139, 34);
    doc.text(`Discount${order.couponCode ? ` (${order.couponCode})` : ''}:`, 130, y);
    doc.text(`-Rs ${discount.toLocaleString('en-IN')}`, 165, y);
    doc.setTextColor(0, 0, 0);
  }

  // Total Amount
  y += 12;
  doc.setLineWidth(0.5);
  doc.line(120, y - 4, pageWidth - 20, y - 4);
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Total Amount:', 130, y + 2);
  doc.text(`Rs ${total.toLocaleString('en-IN')}`, 165, y + 2);

  // Footer
  y += 30;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('Thank you for your business!', pageWidth / 2, y, { align: 'center' });
  
  y += 8;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text('For queries: fiftyfivestreetwear@gmail.com | 8446421463', pageWidth / 2, y, { align: 'center' });

  // Save the PDF
  doc.save(`FIFTY-FIVE-Invoice-${orderId.slice(0, 8)}.pdf`);
};
