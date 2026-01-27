import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

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
    pdf.text(text, 15, yPosition);
    yPosition += 12;
  };

  const addSubHeading = (text: string) => {
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.text(text, 15, yPosition);
    yPosition += 8;
  };

  const addText = (text: string, indent = 0) => {
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    const lines = pdf.splitTextToSize(text, pageWidth - 30 - indent);
    lines.forEach((line: string) => {
      if (yPosition > pageHeight - 20) {
        addPage();
      }
      pdf.text(line, 15 + indent, yPosition);
      yPosition += 6;
    });
  };

  const addLineBreak = (space = 5) => {
    yPosition += space;
  };

  const checkPageSpace = (neededSpace = 30) => {
    if (yPosition + neededSpace > pageHeight - 20) {
      addPage();
    }
  };

  pdf.setTextColor(0, 0, 0);

  addTitle('FIFTY-FIVE');
  addSubHeading('Full-Stack E-Commerce Platform');
  addSubHeading('with 3D Visualization');
  addLineBreak(15);
  addText('Comprehensive Project Documentation');
  addLineBreak(15);
  addText('Version 1.0');

  checkPageSpace(40);
  addLineBreak(20);
  addHeading('Project Overview');
  addLineBreak(5);
  addSubHeading('About the Project');
  addText('FIFTY-FIVE is a modern, full-featured e-commerce platform that combines robust backend functionality with immersive frontend experiences. It leverages cutting-edge technologies including 3D visualization, real-time data synchronization, and cross-platform mobile deployment.');
  addLineBreak(5);
  addSubHeading('Key Objectives');
  addText('• Develop a full-featured e-commerce platform with admin capabilities');
  addText('• Implement real-time data synchronization using Supabase');
  addText('• Create intuitive admin dashboard for product and order management');
  addText('• Build 3D interactive elements using Three.js');
  addText('• Enable cross-platform mobile deployment using Capacitor');
  addText('• Implement secure payment processing and coupon management');

  checkPageSpace(40);
  addLineBreak(10);
  addHeading('Technology Stack');
  addLineBreak(5);
  addSubHeading('Frontend');
  addText('• React 18 with TypeScript for type-safe component development');
  addText('• Vite for fast development and optimized production builds');
  addText('• Tailwind CSS + shadcn/ui for modern, responsive design');
  addText('• React Router DOM for client-side routing');
  addText('• React Hook Form + Zod for form validation');
  addLineBreak(5);
  addSubHeading('3D Graphics & Visualization');
  addText('• Three.js for 3D rendering and WebGL graphics');
  addText('• React Three Fiber for React integration with Three.js');
  addText('• Drei library for pre-built 3D components');
  addLineBreak(5);
  addSubHeading('Backend & Database');
  addText('• Supabase PostgreSQL for primary database');
  addText('• Real-time subscriptions for live data updates');
  addText('• Row Level Security (RLS) for data protection');
  addText('• Supabase Edge Functions for serverless operations');
  addLineBreak(5);
  addSubHeading('State Management & Data Fetching');
  addText('• Zustand for lightweight state management');
  addText('• React Query (TanStack Query) for server state management');
  addLineBreak(5);
  addSubHeading('Utilities');
  addText('• jsPDF + html2canvas for PDF generation');
  addText('• Sonner for toast notifications');
  addText('• Date-fns for date manipulation');
  addText('• Recharts for data visualization');

  checkPageSpace(40);
  addLineBreak(10);
  addHeading('System Architecture');
  addLineBreak(5);
  addSubHeading('Architecture Overview');
  addText('The application follows a modern three-tier architecture:');
  addLineBreak(3);
  addText('Presentation Layer (React Components)', 5);
  addText('Responsible for rendering UI and handling user interactions', 10);
  addLineBreak(3);
  addText('Application Layer (Zustand + React Query)', 5);
  addText('Manages application state and server-state synchronization', 10);
  addLineBreak(3);
  addText('Data Layer (Supabase)', 5);
  addText('Handles all data persistence, real-time updates, and authentication', 10);
  addLineBreak(10);
  addSubHeading('Data Flow');
  addText('1. User interactions trigger React component state changes');
  addText('2. Components dispatch actions to Zustand store or React Query');
  addText('3. Store updates trigger API calls to Supabase');
  addText('4. Supabase real-time subscriptions broadcast changes to all clients');
  addText('5. Components re-render with updated data from subscriptions');

  checkPageSpace(40);
  addLineBreak(10);
  addHeading('Database Schema');
  addLineBreak(5);
  addSubHeading('Core Tables');
  addLineBreak(3);
  addText('users', 5);
  addText('Stores user authentication and profile information', 10);
  addLineBreak(3);
  addText('products', 5);
  addText('Contains product catalog with details, pricing, and images', 10);
  addLineBreak(3);
  addText('product_variants', 5);
  addText('Manages product variants (size, color, etc.)', 10);
  addLineBreak(3);
  addText('orders', 5);
  addText('Records customer orders and transaction details', 10);
  addLineBreak(3);
  addText('order_items', 5);
  addText('Line items within each order', 10);
  addLineBreak(3);
  addText('coupons', 5);
  addText('Manages discount codes and promotional campaigns', 10);
  addLineBreak(3);
  addText('admin_settings', 5);
  addText('Stores global platform configuration and settings', 10);
  addLineBreak(5);
  addSubHeading('Security Features');
  addText('• Row Level Security (RLS) policies enforce data access control');
  addText('• JWT token-based authentication via Supabase Auth');
  addText('• User isolation - customers see only their own orders');
  addText('• Admin role separation for privileged operations');

  checkPageSpace(40);
  addLineBreak(10);
  addHeading('Core Features');
  addLineBreak(5);
  addSubHeading('Customer Features');
  addText('• Product browsing with search and category filtering');
  addText('• Product detail pages with 3D visualization');
  addText('• Virtual try-on using AI-powered image generation');
  addText('• Shopping cart with real-time updates');
  addText('• Secure checkout with multiple payment options');
  addText('• Order history and tracking');
  addText('• Coupon code application and validation');
  addText('• Style recommendations via AI chatbot');
  addLineBreak(5);
  addSubHeading('Admin Features');
  addText('• Product management (add, edit, delete)');
  addText('• Order management and fulfillment tracking');
  addText('• Customer analytics and statistics');
  addText('• Coupon campaign management');
  addText('• Platform-wide settings configuration');
  addText('• Real-time order notifications');
  addText('• Documentation PDF generation');
  addLineBreak(5);
  addSubHeading('3D Visualization');
  addText('• Interactive 3D brand animations on homepage');
  addText('• Product 3D viewer with rotation and zoom');
  addText('• Virtual fitting room with body tracking');
  addText('• AI-powered outfit visualization');

  checkPageSpace(40);
  addLineBreak(10);
  addHeading('File Structure');
  addLineBreak(5);
  addSubHeading('Project Organization');
  addLineBreak(3);
  addText('/src', 5);
  addText('Main application source code', 10);
  addLineBreak(2);
  addText('/components', 10);
  addText('Reusable React components including admin and UI components', 15);
  addLineBreak(2);
  addText('/pages', 10);
  addText('Page-level components for routing', 15);
  addLineBreak(2);
  addText('/hooks', 10);
  addText('Custom React hooks for state and data management', 15);
  addLineBreak(2);
  addText('/store', 10);
  addText('Zustand store definitions for global state', 15);
  addLineBreak(2);
  addText('/utils', 10);
  addText('Utility functions and helpers', 15);
  addLineBreak(2);
  addText('/integrations/supabase', 10);
  addText('Supabase client configuration and types', 15);
  addLineBreak(3);
  addText('/supabase', 5);
  addText('Supabase configuration and migrations', 10);
  addLineBreak(2);
  addText('/functions', 10);
  addText('Edge functions for serverless operations', 15);
  addLineBreak(2);
  addText('/migrations', 10);
  addText('Database migration files', 15);

  checkPageSpace(40);
  addLineBreak(10);
  addHeading('Development Setup');
  addLineBreak(5);
  addSubHeading('Prerequisites');
  addText('• Node.js v18 or higher');
  addText('• Modern web browser with WebGL support');
  addText('• Supabase account and project');
  addText('• Git for version control');
  addLineBreak(5);
  addSubHeading('Installation Steps');
  addText('1. Clone the repository');
  addText('   git clone <repository-url>', 5);
  addLineBreak(3);
  addText('2. Install dependencies');
  addText('   npm install', 5);
  addLineBreak(3);
  addText('3. Configure environment variables');
  addText('   Create .env file with Supabase credentials', 5);
  addLineBreak(3);
  addText('4. Run development server');
  addText('   npm run dev', 5);
  addLineBreak(3);
  addText('5. Build for production');
  addText('   npm run build', 5);

  checkPageSpace(40);
  addLineBreak(10);
  addHeading('API & Integration Points');
  addLineBreak(5);
  addSubHeading('Supabase Edge Functions');
  addText('• virtual-tryon: Generates AI-powered outfit visualizations');
  addText('• style-chat: Provides AI-powered styling recommendations');
  addText('• create-razorpay-order: Initiates payment transactions');
  addText('• verify-razorpay-payment: Confirms payment completion');
  addLineBreak(5);
  addSubHeading('Real-time Subscriptions');
  addText('• Order updates for admin notifications');
  addText('• Product inventory changes');
  addText('• Customer message updates from chatbot');
  addText('• Admin settings configuration changes');

  checkPageSpace(40);
  addLineBreak(10);
  addHeading('Deployment');
  addLineBreak(5);
  addSubHeading('Deployment Platforms');
  addText('• Web: Vercel, Netlify, or custom cloud providers');
  addText('• Mobile: iOS and Android via Capacitor');
  addLineBreak(5);
  addSubHeading('Environment Configuration');
  addText('• Production environment variables for Supabase');
  addText('• API keys for third-party services (Razorpay, Hugging Face)');
  addText('• CORS configuration for API endpoints');
  addText('• Security headers and SSL/TLS configuration');

  checkPageSpace(40);
  addLineBreak(10);
  addHeading('Key Dependencies');
  addLineBreak(5);
  addSubHeading('Production Dependencies');
  addText('React 18.3.1, React Router 6.26.2, Zustand 5.0.6');
  addText('Three.js 0.178.0, React Three Fiber 8.18.0');
  addText('Tailwind CSS 3.4.11, shadcn/ui components');
  addText('Supabase 2.50.3, React Query 5.56.2');
  addText('jsPDF 3.0.1, html2canvas 1.4.1');
  addLineBreak(5);
  addSubHeading('Development Dependencies');
  addText('Vite 5.4.1, TypeScript 5.5.3, ESLint 9.9.0');

  checkPageSpace(30);
  addLineBreak(10);
  addHeading('Performance Optimization');
  addLineBreak(5);
  addText('• Lazy loading of product images and 3D models');
  addText('• Code splitting with dynamic imports');
  addText('• Memoization of expensive computations');
  addText('• Optimized re-renders with React.memo');
  addText('• Efficient state management with Zustand');
  addText('• Real-time sync only when needed');

  checkPageSpace(30);
  addLineBreak(10);
  addHeading('Security Best Practices');
  addLineBreak(5);
  addText('• Row Level Security (RLS) on all database tables');
  addText('• JWT-based authentication with Supabase Auth');
  addText('• Secure API endpoints with proper CORS headers');
  addText('• Input validation and sanitization');
  addText('• Protection against XSS and injection attacks');
  addText('• Secure password handling');
  addText('• Environment variables for sensitive data');

  checkPageSpace(30);
  addLineBreak(10);
  addHeading('Testing & Quality Assurance');
  addLineBreak(5);
  addText('• TypeScript strict mode for type safety');
  addText('• Component testing with React Testing Library');
  addText('• Integration testing with real Supabase instance');
  addText('• Cross-browser testing (Chrome, Firefox, Safari, Edge)');
  addText('• Mobile responsiveness testing');
  addText('• Performance monitoring with Web Vitals');
  addText('• Real-time data synchronization verification');

  checkPageSpace(40);
  addLineBreak(10);
  addHeading('Future Enhancements');
  addLineBreak(5);
  addText('• Enhanced 3D models with advanced animations');
  addText('• Machine learning for personalized recommendations');
  addText('• Advanced analytics and reporting');
  addText('• Multi-vendor marketplace capabilities');
  addText('• Extended AR/VR support');
  addText('• Voice-based shopping assistance');
  addText('• Loyalty and rewards program');
  addText('• Subscription-based products');

  checkPageSpace(30);
  addLineBreak(10);
  addHeading('Troubleshooting & Support');
  addLineBreak(5);
  addSubHeading('Common Issues');
  addLineBreak(3);
  addText('3D Models Not Loading', 5);
  addText('Check WebGL support and ensure proper model file paths', 10);
  addLineBreak(3);
  addText('Real-time Updates Not Working', 5);
  addText('Verify Supabase connection and subscription setup', 10);
  addLineBreak(3);
  addText('Authentication Issues', 5);
  addText('Ensure .env variables are correctly set', 10);
  addLineBreak(5);
  addSubHeading('Support Resources');
  addText('• Supabase Documentation: https://supabase.com/docs');
  addText('• React Documentation: https://react.dev');
  addText('• Three.js Documentation: https://threejs.org/docs');
  addText('• Tailwind CSS: https://tailwindcss.com/docs');

  checkPageSpace(50);
  addPage();
  addTitle('End of Documentation');
  addLineBreak(10);
  addText('FIFTY-FIVE E-Commerce Platform');
  addLineBreak(5);
  addText('Version 1.0');
  addLineBreak(10);
  addText('For more information, visit the project repository or contact the development team.');

  pdf.save('FIFTY-FIVE-Documentation.pdf');
};

export default generateDocumentationPDF;
