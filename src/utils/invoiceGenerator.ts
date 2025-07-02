
import { Order } from '@/store/useStore';

export const generateInvoicePDF = (order: Order): void => {
  // Create a simple HTML structure for the invoice
  const invoiceHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Invoice #${order.id}</title>
      <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
        .header { text-align: center; margin-bottom: 30px; }
        .company-name { font-size: 24px; font-weight: bold; }
        .invoice-details { margin: 20px 0; }
        .customer-info { margin: 20px 0; }
        .items-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        .items-table th, .items-table td { border: 1px solid #ddd; padding: 12px; text-align: left; }
        .items-table th { background-color: #f2f2f2; }
        .total { text-align: right; font-size: 18px; font-weight: bold; margin-top: 20px; }
        .footer { margin-top: 40px; text-align: center; color: #666; }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="company-name">FIFTY-FIVE</div>
        <p>Phone: 8446421463 | Email: fiftyfivestreetwear@gmail.com</p>
        <p>Instagram: @the.fifty.five</p>
      </div>
      
      <div class="invoice-details">
        <h2>INVOICE</h2>
        <p><strong>Invoice Number:</strong> #${order.id}</p>
        <p><strong>Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}</p>
        <p><strong>Status:</strong> ${order.status}</p>
      </div>
      
      <div class="customer-info">
        <h3>Bill To:</h3>
        <p><strong>${order.customerInfo.name}</strong></p>
        <p>${order.customerInfo.address}</p>
        <p>PIN: ${order.customerInfo.pincode}</p>
        <p>Phone: ${order.customerInfo.phone}</p>
        <p>Email: ${order.customerInfo.email}</p>
      </div>
      
      <table class="items-table">
        <thead>
          <tr>
            <th>Item</th>
            <th>Size</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          ${order.items.map(item => `
            <tr>
              <td>${item.product.name}</td>
              <td>${item.size}</td>
              <td>${item.quantity}</td>
              <td>₹${item.product.price}</td>
              <td>₹${item.product.price * item.quantity}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
      
      <div class="total">
        ${order.discount > 0 ? `<p>Subtotal: ₹${order.total + order.discount}</p>` : ''}
        ${order.discount > 0 ? `<p>Discount${order.couponCode ? ` (${order.couponCode})` : ''}: -₹${order.discount}</p>` : ''}
        <p>Total: ₹${order.total}</p>
      </div>
      
      <div class="footer">
        <p>Thank you for your business!</p>
        <p>Follow us on Instagram @the.fifty.five</p>
      </div>
    </body>
    </html>
  `;

  // Create a new window and print
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(invoiceHTML);
    printWindow.document.close();
    printWindow.focus();
    
    // Wait for content to load, then print
    setTimeout(() => {
      printWindow.print();
    }, 250);
  } else {
    // Fallback: download as HTML file
    const blob = new Blob([invoiceHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `invoice-${order.id}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
};
