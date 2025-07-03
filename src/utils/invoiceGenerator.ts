
import { Order } from '@/store/useStore';

export const generateInvoicePDF = (order: Order): void => {
  // Create a comprehensive HTML structure for the invoice
  const invoiceHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Invoice #${order.id}</title>
      <style>
        body { 
          font-family: 'Arial', sans-serif; 
          max-width: 800px; 
          margin: 0 auto; 
          padding: 20px; 
          line-height: 1.6;
          color: #333;
        }
        .header { 
          text-align: center; 
          margin-bottom: 40px; 
          border-bottom: 3px solid #000;
          padding-bottom: 20px;
        }
        .company-name { 
          font-size: 32px; 
          font-weight: bold; 
          letter-spacing: 2px;
          margin-bottom: 10px;
        }
        .company-contact {
          font-size: 14px;
          color: #666;
          margin: 5px 0;
        }
        .invoice-title {
          font-size: 28px;
          font-weight: bold;
          margin: 30px 0 20px 0;
          text-align: center;
          color: #000;
        }
        .invoice-info {
          display: flex;
          justify-content: space-between;
          margin: 30px 0;
        }
        .invoice-details, .customer-info {
          width: 48%;
        }
        .invoice-details h3, .customer-info h3 {
          margin-bottom: 15px;
          font-size: 18px;
          border-bottom: 2px solid #eee;
          padding-bottom: 5px;
        }
        .info-row {
          margin: 8px 0;
          display: flex;
          justify-content: space-between;
        }
        .info-label {
          font-weight: bold;
          color: #555;
        }
        .items-table { 
          width: 100%; 
          border-collapse: collapse; 
          margin: 30px 0; 
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .items-table th { 
          background-color: #000; 
          color: white;
          padding: 15px 12px; 
          text-align: left;
          font-weight: bold;
          text-transform: uppercase;
          font-size: 12px;
          letter-spacing: 1px;
        }
        .items-table td { 
          border: 1px solid #ddd; 
          padding: 12px; 
          text-align: left;
        }
        .items-table tbody tr:nth-child(even) {
          background-color: #f9f9f9;
        }
        .items-table tbody tr:hover {
          background-color: #f5f5f5;
        }
        .totals-section {
          margin-top: 30px;
          border-top: 2px solid #eee;
          padding-top: 20px;
        }
        .total-row {
          display: flex;
          justify-content: space-between;
          margin: 8px 0;
          font-size: 16px;
        }
        .total-row.final {
          font-size: 20px;
          font-weight: bold;
          border-top: 2px solid #000;
          padding-top: 10px;
          margin-top: 15px;
        }
        .discount-row {
          color: #28a745;
          font-weight: bold;
        }
        .footer { 
          margin-top: 50px; 
          text-align: center; 
          color: #666;
          border-top: 1px solid #eee;
          padding-top: 20px;
          font-size: 14px;
        }
        .thank-you {
          font-size: 18px;
          font-weight: bold;
          color: #000;
          margin-bottom: 10px;
        }
        @media print {
          body { margin: 0; padding: 15px; }
          .header { page-break-inside: avoid; }
          .items-table { page-break-inside: avoid; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="company-name">FIFTY-FIVE</div>
        <div class="company-contact">📞 8446421463</div>
        <div class="company-contact">📧 fiftyfivestreetwear@gmail.com</div>
        <div class="company-contact">📷 @the.fifty.five</div>
      </div>
      
      <div class="invoice-title">INVOICE</div>
      
      <div class="invoice-info">
        <div class="invoice-details">
          <h3>Invoice Details</h3>
          <div class="info-row">
            <span class="info-label">Invoice Number:</span>
            <span>#${order.id}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Date:</span>
            <span>${new Date(order.createdAt).toLocaleDateString('en-IN', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Status:</span>
            <span>${order.status}</span>
          </div>
        </div>
        
        <div class="customer-info">
          <h3>Bill To</h3>
          <div class="info-row">
            <span class="info-label">Name:</span>
            <span>${order.customerInfo.name}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Email:</span>
            <span>${order.customerInfo.email}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Phone:</span>
            <span>${order.customerInfo.phone}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Address:</span>
            <span>${order.customerInfo.address}</span>
          </div>
          <div class="info-row">
            <span class="info-label">PIN Code:</span>
            <span>${order.customerInfo.pincode}</span>
          </div>
        </div>
      </div>
      
      <table class="items-table">
        <thead>
          <tr>
            <th>Item Description</th>
            <th>Size</th>
            <th>Qty</th>
            <th>Unit Price</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          ${order.items.map(item => `
            <tr>
              <td>${item.product.name}</td>
              <td>${item.size}</td>
              <td>${item.quantity}</td>
              <td>₹${item.product.price.toLocaleString('en-IN')}</td>
              <td>₹${(item.product.price * item.quantity).toLocaleString('en-IN')}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
      
      <div class="totals-section">
        <div class="total-row">
          <span>Subtotal:</span>
          <span>₹${(order.total + order.discount).toLocaleString('en-IN')}</span>
        </div>
        ${order.discount > 0 ? `
          <div class="total-row discount-row">
            <span>Discount${order.couponCode ? ` (${order.couponCode})` : ''}:</span>
            <span>-₹${order.discount.toLocaleString('en-IN')}</span>
          </div>
        ` : ''}
        <div class="total-row final">
          <span>Total Amount:</span>
          <span>₹${order.total.toLocaleString('en-IN')}</span>
        </div>
      </div>
      
      <div class="footer">
        <div class="thank-you">Thank you for your business!</div>
        <p>For any queries, contact us at fiftyfivestreetwear@gmail.com or call 8446421463</p>
        <p>Follow us on Instagram @the.fifty.five for latest updates</p>
      </div>
    </body>
    </html>
  `;

  // Create a blob and download
  const blob = new Blob([invoiceHTML], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `FIFTY-FIVE-Invoice-${order.id}.html`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  // Also try to open print dialog
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(invoiceHTML);
    printWindow.document.close();
    printWindow.focus();
    
    setTimeout(() => {
      printWindow.print();
    }, 500);
  }
};
