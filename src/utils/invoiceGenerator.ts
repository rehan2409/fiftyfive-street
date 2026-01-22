import { jsPDF } from 'jspdf';
import { Order } from '@/store/useStore';

export const generateInvoicePDF = (order: Order): void => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  let y = 20;

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
  doc.text(`Invoice Number: #${order.id.slice(0, 8)}...`, 20, y);
  
  y += 6;
  doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })}`, 20, y);
  
  y += 6;
  doc.text(`Status: ${order.status}`, 20, y);

  // Customer Info
  y += 12;
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Bill To', 20, y);
  
  y += 7;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text(`Name: ${order.customerInfo.name}`, 20, y);
  
  y += 6;
  doc.text(`Email: ${order.customerInfo.email}`, 20, y);
  
  y += 6;
  doc.text(`Phone: ${order.customerInfo.phone}`, 20, y);
  
  y += 6;
  doc.text(`Address: ${order.customerInfo.address}`, 20, y);
  
  y += 6;
  doc.text(`PIN Code: ${order.customerInfo.pincode}`, 20, y);

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

  order.items.forEach((item) => {
    const itemName = item.product.name.length > 30 
      ? item.product.name.substring(0, 30) + '...' 
      : item.product.name;
    
    doc.text(itemName, 25, y);
    doc.text(item.size, 90, y);
    doc.text(item.quantity.toString(), 110, y);
    doc.text(`₹${item.product.price.toLocaleString('en-IN')}`, 130, y);
    doc.text(`₹${(item.product.price * item.quantity).toLocaleString('en-IN')}`, 165, y);
    
    y += 8;
  });

  // Line before totals
  y += 5;
  doc.setLineWidth(0.3);
  doc.line(120, y, pageWidth - 20, y);

  // Totals
  y += 10;
  doc.setFontSize(10);
  doc.text('Subtotal:', 130, y);
  doc.text(`₹${(order.total + (order.discount || 0)).toLocaleString('en-IN')}`, 165, y);

  if (order.discount && order.discount > 0) {
    y += 8;
    doc.setTextColor(34, 139, 34);
    doc.text(`Discount${order.couponCode ? ` (${order.couponCode})` : ''}:`, 130, y);
    doc.text(`-₹${order.discount.toLocaleString('en-IN')}`, 165, y);
    doc.setTextColor(0, 0, 0);
  }

  // Total Amount
  y += 12;
  doc.setLineWidth(0.5);
  doc.line(120, y - 4, pageWidth - 20, y - 4);
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Total Amount:', 130, y + 2);
  doc.text(`₹${order.total.toLocaleString('en-IN')}`, 165, y + 2);

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
  doc.save(`FIFTY-FIVE-Invoice-${order.id.slice(0, 8)}.pdf`);
};
