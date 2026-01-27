import jsPDF from 'jspdf';

export const generateDocumentationPDF = async () => {
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  let yPosition = 20;

  const addPage = () => {
    pdf.addPage();
    yPosition = 20;
  };

  const addTitle = (text: string) => {
    pdf.setFontSize(24);
    pdf.setFont('helvetica', 'bold');
    pdf.text(text, pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 20;
  };

  const addHeading = (text: string) => {
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(25, 118, 210);
    pdf.text(text, 15, yPosition);
    pdf.setTextColor(0, 0, 0);
    yPosition += 12;
  };

  const addSubHeading = (text: string) => {
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(66, 66, 66);
    pdf.text(text, 15, yPosition);
    pdf.setTextColor(0, 0, 0);
    yPosition += 8;
  };

  const addText = (text: string, indent = 0) => {
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'normal');
    const lines = pdf.splitTextToSize(text, pageWidth - 30 - indent);
    lines.forEach((line: string) => {
      if (yPosition > pageHeight - 20) {
        addPage();
      }
      pdf.text(line, 15 + indent, yPosition);
      yPosition += 5;
    });
  };

  const addSmallText = (text: string) => {
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'normal');
    const lines = pdf.splitTextToSize(text, pageWidth - 30);
    lines.forEach((line: string) => {
      if (yPosition > pageHeight - 15) {
        addPage();
      }
      pdf.text(line, 15, yPosition);
      yPosition += 4;
    });
  };

  const addLineBreak = (space = 4) => {
    yPosition += space;
  };

  const checkPageSpace = (neededSpace = 30) => {
    if (yPosition + neededSpace > pageHeight - 20) {
      addPage();
    }
  };

  const addSection = (title: string, content: string[]) => {
    checkPageSpace(40);
    addLineBreak(8);
    addSubHeading(title);
    addLineBreak(3);
    content.forEach(item => addText(item));
  };

  pdf.setTextColor(0, 0, 0);

  addTitle('FIFTY-FIVE');
  addSubHeading('Full-Stack E-Commerce Platform');
  addSubHeading('with 3D Visualization & Real-time Sync');
  addLineBreak(15);
  pdf.setFontSize(10);
  pdf.text('Comprehensive Technical Documentation v1.0', pageWidth / 2, yPosition, { align: 'center' });

  checkPageSpace(40);
  addLineBreak(15);
  addHeading('1. EXECUTIVE SUMMARY');
  addLineBreak(3);
  addText('FIFTY-FIVE is a modern, full-stack e-commerce platform combining React, Supabase, and Three.js for immersive shopping experiences.');
  addText('Supports real-time inventory, 3D product visualization, AI chatbots, and cross-platform mobile deployment via Capacitor.');

  checkPageSpace(40);
  addLineBreak(10);
  addHeading('2. PROJECT ARCHITECTURE');
  addLineBreak(3);
  addSubHeading('System Overview');
  addText('┌─────────────────────────────────────────────┐');
  addText('│          Frontend (React + TypeScript)       │');
  addText('│  ├── Pages (Home, Products, Checkout, etc)  │');
  addText('│  ├── Components (UI, Forms, 3D Viewers)     │');
  addText('│  └── Hooks (State, Data Fetching)           │');
  addText('├─────────────────────────────────────────────┤');
  addText('│  State Management (Zustand + React Query)   │');
  addText('├─────────────────────────────────────────────┤');
  addText('│        Backend (Supabase + Edge Functions)  │');
  addText('│  ├── PostgreSQL Database (RLS Enabled)      │');
  addText('│  ├── Real-time Subscriptions                │');
  addText('│  ├── Authentication (JWT)                   │');
  addText('│  └── Edge Functions (Serverless)            │');
  addText('└─────────────────────────────────────────────┘');

  checkPageSpace(40);
  addLineBreak(10);
  addHeading('3. TECHNOLOGY STACK');
  addLineBreak(3);
  addSection('Frontend Libraries', [
    '• React 18.3.1 - UI library with hooks',
    '• TypeScript 5.5.3 - Type safety',
    '• Vite 5.4.1 - Build tool & dev server',
    '• Tailwind CSS 3.4.11 - Utility CSS framework',
    '• shadcn/ui - Component library',
    '• React Router 6.26.2 - Client-side routing'
  ]);

  addSection('3D & Graphics', [
    '• Three.js 0.178.0 - 3D rendering engine',
    '• React Three Fiber 8.18.0 - React integration',
    '• Drei 9.122.0 - Pre-built 3D components'
  ]);

  addSection('State & Data Management', [
    '• Zustand 5.0.6 - Global state management',
    '• React Query 5.56.2 - Server state sync',
    '• Supabase 2.50.3 - Backend as a service'
  ]);

  addSection('Database & Authentication', [
    '• PostgreSQL (Supabase) - Primary database',
    '• Row Level Security (RLS) - Data protection',
    '• JWT Tokens - Session management',
    '• Supabase Auth - Email/password auth'
  ]);

  addSection('Utilities & Tools', [
    '• jsPDF 3.0.1 - PDF generation',
    '• html2canvas 1.4.1 - Screenshot capture',
    '• Recharts 2.12.7 - Data visualization',
    '• Sonner 1.5.0 - Toast notifications',
    '• Date-fns 3.6.0 - Date manipulation'
  ]);

  checkPageSpace(40);
  addLineBreak(10);
  addHeading('4. DATABASE SCHEMA');
  addLineBreak(3);
  addSubHeading('Core Tables');
  addSmallText('users - Authentication & profiles (id, email, name, avatar_url)');
  addSmallText('products - Catalog (id, name, description, price, category, stock, images)');
  addSmallText('product_variants - Sizes/colors (id, product_id, size, color, stock)');
  addSmallText('orders - Customer orders (id, user_id, total, status, created_at)');
  addSmallText('order_items - Order line items (id, order_id, product_id, quantity, price)');
  addSmallText('coupons - Discount codes (id, code, discount, valid_until)');
  addSmallText('admin_settings - Platform config (id, store_name, logo_url, theme)');

  addLineBreak(3);
  addSubHeading('Security Features');
  addText('• RLS policies on all tables');
  addText('• User isolation - customers access only own data');
  addText('• Admin role separation for privileged ops');
  addText('• JWT-based authentication');
  addText('• Secure API endpoints with CORS');

  checkPageSpace(40);
  addLineBreak(10);
  addHeading('5. API ENDPOINTS & EDGE FUNCTIONS');
  addLineBreak(3);
  addSubHeading('Supabase Edge Functions');
  addSmallText('virtual-tryon - POST /virtual-tryon - AI outfit visualization');
  addSmallText('style-chat - POST /style-chat - AI styling recommendations');
  addSmallText('create-razorpay-order - POST /create-razorpay-order - Payment initiation');
  addSmallText('verify-razorpay-payment - POST /verify-razorpay-payment - Payment verification');

  addLineBreak(3);
  addSubHeading('Database Operations');
  addText('• SELECT - Fetch products, orders, user data');
  addText('• INSERT - Create orders, add products');
  addText('• UPDATE - Modify product stock, order status');
  addText('• DELETE - Remove coupons, archived products');

  addLineBreak(3);
  addSubHeading('Real-time Subscriptions');
  addText('• Order updates - Admin notifications');
  addText('• Product changes - Stock updates');
  addText('• Chat messages - Style bot responses');

  checkPageSpace(40);
  addLineBreak(10);
  addHeading('6. CORE FEATURES');
  addLineBreak(3);
  addSubHeading('Customer Features');
  addText('✓ Product browsing with search & filters');
  addText('✓ 3D product viewer with rotation/zoom');
  addText('✓ Virtual try-on with AI generation');
  addText('✓ Real-time shopping cart');
  addText('✓ Checkout with Razorpay payment');
  addText('✓ Order tracking & history');
  addText('✓ Coupon/discount application');
  addText('✓ AI-powered style recommendations');
  addText('✓ User account management');

  addLineBreak(3);
  addSubHeading('Admin Features');
  addText('✓ Product management (CRUD)');
  addText('✓ Real-time order management');
  addText('✓ Revenue & order analytics');
  addText('✓ Coupon campaign management');
  addText('✓ Platform settings configuration');
  addText('✓ Documentation PDF export');
  addText('✓ Dashboard statistics');
  addText('✓ Customer data insights');

  checkPageSpace(40);
  addLineBreak(10);
  addHeading('7. FILE STRUCTURE');
  addLineBreak(3);
  addSmallText('src/');
  addSmallText('├── components/ - Reusable UI components');
  addSmallText('│   ├── admin/ - Admin dashboard components');
  addSmallText('│   └── ui/ - shadcn/ui base components');
  addSmallText('├── pages/ - Page-level components');
  addSmallText('├── hooks/ - Custom React hooks');
  addSmallText('├── store/ - Zustand global state');
  addSmallText('├── utils/ - Utility functions');
  addSmallText('├── integrations/supabase/ - DB client & types');
  addSmallText('└── assets/ - Images & static files');
  addSmallText('');
  addSmallText('supabase/');
  addSmallText('├── migrations/ - Database schema changes');
  addSmallText('└── functions/ - Edge functions (serverless)');

  checkPageSpace(40);
  addLineBreak(10);
  addHeading('8. COMPONENT HIERARCHY');
  addLineBreak(3);
  addSmallText('App');
  addSmallText('├── Layout (Header/Footer/Navigation)');
  addSmallText('├── Home');
  addSmallText('│   ├── PromoBanner');
  addSmallText('│   ├── ThreeAnimation (3D brand viz)');
  addSmallText('│   ├── ProductCard (repeated)');
  addSmallText('│   ├── TestimonialCarousel');
  addSmallText('│   └── StatsSection');
  addSmallText('├── Products');
  addSmallText('│   ├── ProductCard');
  addSmallText('│   └── Filters');
  addSmallText('├── ProductDetail');
  addSmallText('│   ├── Product3DViewer');
  addSmallText('│   └── VirtualTryOnModal');
  addSmallText('├── Checkout');
  addSmallText('├── AdminDashboard');
  addSmallText('│   ├── DashboardStats');
  addSmallText('│   ├── ProductManagement');
  addSmallText('│   ├── OrderTable');
  addSmallText('│   └── CouponManagement');
  addSmallText('└── Navbar + CartDrawer');

  checkPageSpace(40);
  addLineBreak(10);
  addHeading('9. DATA FLOW DIAGRAM');
  addLineBreak(3);
  addText('User Action (Click Buy)');
  addText('   ↓');
  addText('Component State Update (React)');
  addText('   ↓');
  addText('Zustand/React Query Action');
  addText('   ↓');
  addText('Supabase API Call');
  addText('   ↓');
  addText('Database Query (PostgreSQL)');
  addText('   ↓');
  addText('Real-time Subscription Broadcast');
  addText('   ↓');
  addText('Component Re-render with New Data');
  addText('   ↓');
  addText('UI Update (User sees changes)');

  checkPageSpace(40);
  addLineBreak(10);
  addHeading('10. ENVIRONMENT SETUP');
  addLineBreak(3);
  addSubHeading('Prerequisites');
  addText('• Node.js v18+');
  addText('• npm/yarn package manager');
  addText('• Supabase account & project');
  addText('• Git for version control');

  addLineBreak(3);
  addSubHeading('Installation Steps');
  addSmallText('1. git clone <repo-url>');
  addSmallText('2. npm install');
  addSmallText('3. Create .env with Supabase credentials');
  addSmallText('4. npm run dev (start dev server)');
  addSmallText('5. npm run build (production build)');

  addLineBreak(3);
  addSubHeading('Environment Variables');
  addSmallText('VITE_SUPABASE_URL - Supabase project URL');
  addSmallText('VITE_SUPABASE_ANON_KEY - Public anonymous key');
  addSmallText('SUPABASE_SERVICE_ROLE_KEY - Admin operations');

  checkPageSpace(40);
  addLineBreak(10);
  addHeading('11. AUTHENTICATION FLOW');
  addLineBreak(3);
  addText('Registration');
  addSmallText('User → Register Form → Supabase Auth → JWT Token → Login');
  addLineBreak(3);
  addText('Login');
  addSmallText('User → Login Form → Credentials → Supabase Auth → Session');
  addLineBreak(3);
  addText('Protected Routes');
  addSmallText('Check Auth State → Has Token? → Allow Access : Redirect to Login');

  checkPageSpace(40);
  addLineBreak(10);
  addHeading('12. DEPLOYMENT');
  addLineBreak(3);
  addSubHeading('Frontend Deployment');
  addText('• Vercel - Auto-deploy from GitHub');
  addText('• Netlify - Drag-drop or Git integration');
  addText('• Firebase Hosting');
  addText('• AWS Amplify');

  addLineBreak(3);
  addSubHeading('Mobile Deployment (Capacitor)');
  addSmallText('iOS: npm run build → npx cap add ios → Xcode');
  addSmallText('Android: npm run build → npx cap add android → Android Studio');

  addLineBreak(3);
  addSubHeading('Database & Functions');
  addText('• Supabase hosting (managed)');
  addText('• Edge Functions auto-deployed');
  addText('• Automatic backups & monitoring');

  checkPageSpace(40);
  addLineBreak(10);
  addHeading('13. PAYMENT INTEGRATION');
  addLineBreak(3);
  addSubHeading('Razorpay Payment Flow');
  addText('1. Create order → Razorpay API → Get order_id');
  addText('2. Checkout modal opens → Razorpay payment window');
  addText('3. User completes payment');
  addText('4. Verify payment signature');
  addText('5. Update order status in database');
  addText('6. Send confirmation email');

  checkPageSpace(40);
  addLineBreak(10);
  addHeading('14. PERFORMANCE OPTIMIZATION');
  addLineBreak(3);
  addText('• Code splitting with dynamic imports');
  addText('• Image optimization & lazy loading');
  addText('• Memoization (React.memo, useMemo)');
  addText('• Debounce/throttle for search');
  addText('• Virtualization for long lists');
  addText('• CSS minification & bundling');
  addText('• Gzip compression');
  addText('• CDN for static assets');

  checkPageSpace(40);
  addLineBreak(10);
  addHeading('15. SECURITY PRACTICES');
  addLineBreak(3);
  addText('• Row Level Security on all tables');
  addText('• Input validation & sanitization');
  addText('• CORS headers configured');
  addText('• HTTPS only connections');
  addText('• Secure password hashing (bcrypt)');
  addText('• JWT token expiration');
  addText('• Environment variables for secrets');
  addText('• SQL injection prevention (parameterized)');
  addText('• XSS protection');

  checkPageSpace(40);
  addLineBreak(10);
  addHeading('16. TESTING STRATEGY');
  addLineBreak(3);
  addText('• Unit tests - Component logic');
  addText('• Integration tests - API + DB');
  addText('• E2E tests - User workflows');
  addText('• TypeScript strict mode - Type safety');
  addText('• Manual testing - Mobile responsiveness');
  addText('• Cross-browser testing');
  addText('• Performance testing - Lighthouse');

  checkPageSpace(40);
  addLineBreak(10);
  addHeading('17. COMMON ISSUES & SOLUTIONS');
  addLineBreak(3);
  addSubHeading('3D Models Not Loading');
  addSmallText('→ Check WebGL support, verify model paths, inspect console errors');
  addLineBreak(2);
  addSubHeading('Real-time Updates Not Working');
  addSmallText('→ Verify Supabase connection, check subscription setup, test RLS policies');
  addLineBreak(2);
  addSubHeading('CORS Errors');
  addSmallText('→ Check CORS headers in edge functions, verify domain whitelist');
  addLineBreak(2);
  addSubHeading('Auth Issues');
  addSmallText('→ Verify .env variables, check Supabase auth settings, clear localStorage');
  addLineBreak(2);
  addSubHeading('Build Errors');
  addSmallText('→ Clear node_modules, run npm install, check TypeScript errors');

  checkPageSpace(40);
  addLineBreak(10);
  addHeading('18. FUTURE ENHANCEMENTS');
  addLineBreak(3);
  addText('• Advanced AR/VR support');
  addText('• Machine learning recommendations');
  addText('• Multi-vendor marketplace');
  addText('• Subscription products');
  addText('• Loyalty rewards program');
  addText('• Voice shopping assistant');
  addText('• Social commerce integration');
  addText('• Advanced analytics & reporting');
  addText('• Inventory forecasting');

  checkPageSpace(40);
  addLineBreak(10);
  addHeading('19. DEPENDENCIES SUMMARY');
  addLineBreak(3);
  addSmallText('Total npm packages: 40+');
  addSmallText('Bundle size: ~2.3 MB (gzip: 675 KB)');
  addSmallText('Development dependencies: TypeScript, Vite, ESLint');
  addSmallText('Production: React, Three.js, Supabase, Tailwind');

  checkPageSpace(40);
  addLineBreak(10);
  addHeading('20. SUPPORT & DOCUMENTATION');
  addLineBreak(3);
  addText('Official Resources:');
  addSmallText('• React: https://react.dev');
  addSmallText('• Supabase: https://supabase.com/docs');
  addSmallText('• Three.js: https://threejs.org/docs');
  addSmallText('• Tailwind: https://tailwindcss.com');
  addSmallText('• TypeScript: https://www.typescriptlang.org');
  addSmallText('• Vite: https://vitejs.dev');

  checkPageSpace(50);
  addPage();
  addTitle('END OF DOCUMENTATION');
  addLineBreak(10);
  addText('FIFTY-FIVE E-Commerce Platform');
  addLineBreak(5);
  addText('Version 1.0 - All Rights Reserved');
  addLineBreak(10);
  addSmallText('Generated: ' + new Date().toLocaleString());
  addLineBreak(10);
  addSmallText('For questions or support, contact the development team.');

  pdf.save('FIFTY-FIVE-Documentation.pdf');
};

export default generateDocumentationPDF;
