import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const ProjectDocumentation = () => {
  const { toast } = useToast();

  const generatePDF = async () => {
    try {
      const documentElement = document.getElementById('project-documentation-content');
      if (!documentElement) return;

      toast({
        title: "Generating PDF",
        description: "Please wait while we generate your project documentation PDF...",
      });

      const canvas = await html2canvas(documentElement, {
        scale: 2,
        logging: false,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        height: documentElement.scrollHeight,
        windowHeight: documentElement.scrollHeight
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pdfWidth - 20; // 10mm margin on each side
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      let heightLeft = imgHeight;
      let position = 10;
      
      // Add first page
      pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight - 20;
      
      // Add additional pages if content is longer than one page
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight + 10;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
        heightLeft -= pdfHeight;
      }

      pdf.save('FIFTY-FIVE-Project-Documentation.pdf');
      
      toast({
        title: "PDF Generated",
        description: "Project documentation has been downloaded successfully.",
      });
    } catch (error) {
      console.error('PDF generation error:', error);
      toast({
        title: "PDF Generation Failed",
        description: "There was an error generating the PDF. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Project Documentation</h2>
          <p className="text-gray-600 mt-1">Comprehensive project report for FIFTY FIVE platform</p>
        </div>
        <div className="flex space-x-3">
          <Button onClick={generatePDF}>
            <Download className="h-4 w-4 mr-2" />
            Download PDF Report
          </Button>
        </div>
      </div>

      {/* Documentation Content */}
      <Card>
        <CardContent className="p-8">
          <div id="project-documentation-content" className="max-w-4xl mx-auto bg-white space-y-12">
            
            {/* Title Slide */}
            <div className="text-center py-16 border-b-2 border-gray-200">
              <div className="mb-8">
                <h1 className="text-5xl font-bold text-primary mb-4">FIFTY FIVE</h1>
                <h2 className="text-3xl font-semibold text-gray-700">Full Stack E-Commerce Platform</h2>
              </div>
              <div className="space-y-4 text-lg text-gray-600">
                <p><strong>Student Name:</strong> [Your Name]</p>
                <p><strong>Guide Name:</strong> [Guide Name]</p>
                <p><strong>Academic Year:</strong> 2024-2025</p>
                <p><strong>Department:</strong> Computer Science and Engineering</p>
              </div>
            </div>

            {/* 1. Introduction */}
            <section className="space-y-6">
              <h2 className="text-3xl font-bold text-primary border-b-2 border-primary pb-2">1. Introduction</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">Background</h3>
                  <p className="text-gray-700 leading-relaxed">
                    The e-commerce industry has witnessed exponential growth, especially in the post-pandemic era. Traditional e-commerce platforms often lack modern user experiences and efficient management systems. Small to medium businesses struggle with expensive platform solutions that don't offer customization flexibility. There is a growing need for cost-effective, scalable, and feature-rich e-commerce solutions that can be easily deployed and maintained.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">Purpose</h3>
                  <p className="text-gray-700 leading-relaxed">
                    The main purpose of this project is to develop a comprehensive full-stack e-commerce platform called "FIFTY FIVE" that provides modern web technologies integration, real-time data synchronization, intuitive admin management, and cross-platform deployment capabilities. The platform aims to bridge the gap between functionality and user experience while maintaining cost-effectiveness and scalability.
                  </p>
                </div>
              </div>
            </section>

            {/* 2. Objectives */}
            <section className="space-y-6">
              <h2 className="text-3xl font-bold text-primary border-b-2 border-primary pb-2">2. Objectives</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">Primary Objective</h3>
                  <p className="text-gray-700 leading-relaxed">
                    To develop a complete, production-ready e-commerce platform with administrative capabilities, real-time order management, secure payment processing, and cross-platform mobile deployment using modern web technologies.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">Secondary Objectives</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                    <li>Implement real-time data synchronization using Supabase for instant updates</li>
                    <li>Create an intuitive admin dashboard for product, order, and coupon management</li>
                    <li>Build a responsive, mobile-first design system using Tailwind CSS</li>
                    <li>Develop a style chatbot for personalized product recommendations</li>
                    <li>Implement secure authentication and authorization systems</li>
                    <li>Enable cross-platform mobile deployment using Capacitor</li>
                    <li>Create automated invoice generation and QR code payment systems</li>
                    <li>Implement comprehensive order tracking and management</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* 3. Literature Review */}
            <section className="space-y-6">
              <h2 className="text-3xl font-bold text-primary border-b-2 border-primary pb-2">3. Literature Review</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">Existing Research</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                    <li>Modern e-commerce platforms like Shopify, WooCommerce, and Magento provide robust functionality but require extensive customization for unique brand experiences</li>
                    <li>React-based applications show 40-60% better performance compared to traditional jQuery-based e-commerce solutions</li>
                    <li>Real-time data synchronization improves operational efficiency by 35% and customer satisfaction by 25%</li>
                    <li>Mobile-first design approaches increase conversion rates by up to 30%</li>
                    <li>Supabase as a Backend-as-a-Service shows promising results in rapid application development</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">Gaps in Knowledge</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                    <li>Limited documentation on integrating modern React Query with Supabase real-time features</li>
                    <li>Insufficient research on cross-platform deployment strategies for TypeScript-based e-commerce applications</li>
                    <li>Lack of comprehensive studies on chatbot integration for product recommendations in small-scale e-commerce</li>
                    <li>Limited analysis of performance optimization techniques for React-based e-commerce platforms</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">Your Contribution</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                    <li>Demonstrating practical implementation of real-time e-commerce operations using Supabase</li>
                    <li>Providing a comprehensive blueprint for React Query integration with PostgreSQL real-time subscriptions</li>
                    <li>Creating a reusable architecture pattern for TypeScript-based e-commerce development</li>
                    <li>Developing an integrated chatbot system for product recommendation within e-commerce platforms</li>
                    <li>Establishing best practices for cross-platform deployment using Capacitor</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* 4. Project Scope */}
            <section className="space-y-6">
              <h2 className="text-3xl font-bold text-primary border-b-2 border-primary pb-2">4. Project Scope</h2>
              
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Inclusions</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-semibold text-gray-800">Frontend Features:</h4>
                    <ul className="list-disc list-inside text-gray-700 text-sm space-y-1 ml-4">
                      <li>Product catalog with search and filtering</li>
                      <li>Shopping cart and checkout functionality</li>
                      <li>User authentication and account management</li>
                      <li>Responsive design for all screen sizes</li>
                      <li>Style chatbot for product recommendations</li>
                      <li>Order tracking and history</li>
                      <li>Coupon and discount system</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-gray-800">Backend Features:</h4>
                    <ul className="list-disc list-inside text-gray-700 text-sm space-y-1 ml-4">
                      <li>Product management system</li>
                      <li>Order processing and tracking</li>
                      <li>Real-time data synchronization</li>
                      <li>Admin dashboard with analytics</li>
                      <li>QR code payment integration</li>
                      <li>Automated invoice generation</li>
                      <li>Cross-platform mobile app using Capacitor</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* 5. Methodology */}
            <section className="space-y-6">
              <h2 className="text-3xl font-bold text-primary border-b-2 border-primary pb-2">5. Methodology</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">Research Design</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Applied research methodology with iterative development approach using Agile principles. Component-based development strategy with continuous integration and testing. User-centered design approach with responsive web design principles.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">Technology Stack</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-blue-800 mb-2">Frontend</h4>
                      <ul className="text-sm text-blue-700 space-y-1">
                        <li>• React 18 with TypeScript</li>
                        <li>• Vite for build tooling</li>
                        <li>• Tailwind CSS for styling</li>
                        <li>• Shadcn/ui components</li>
                        <li>• React Query for state management</li>
                        <li>• React Router for navigation</li>
                      </ul>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-green-800 mb-2">Backend</h4>
                      <ul className="text-sm text-green-700 space-y-1">
                        <li>• Supabase (PostgreSQL)</li>
                        <li>• Supabase Auth</li>
                        <li>• Real-time subscriptions</li>
                        <li>• Row Level Security (RLS)</li>
                        <li>• Auto-generated APIs</li>
                        <li>• Cloud storage</li>
                      </ul>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-purple-800 mb-2">Tools & Libraries</h4>
                      <ul className="text-sm text-purple-700 space-y-1">
                        <li>• Capacitor for mobile</li>
                        <li>• jsPDF for invoice generation</li>
                        <li>• Recharts for analytics</li>
                        <li>• Zustand for local state</li>
                        <li>• React Hook Form</li>
                        <li>• Zod for validation</li>
                      </ul>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">Data Collection</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                    <li>User interface design patterns analysis from leading e-commerce platforms</li>
                    <li>Performance benchmarks comparison between different technology stacks</li>
                    <li>Best practices documentation from React, TypeScript, and Supabase communities</li>
                    <li>User experience research for mobile-first e-commerce design</li>
                    <li>Security analysis of modern web application architectures</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">Data Analysis</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                    <li>Code quality assessment using TypeScript strict mode and ESLint</li>
                    <li>Performance monitoring using React DevTools and Lighthouse</li>
                    <li>Real-time data flow analysis using Supabase dashboard analytics</li>
                    <li>Component reusability metrics and bundle size optimization</li>
                    <li>Mobile responsiveness testing across different devices and browsers</li>
                    <li>Security vulnerability assessment using automated scanning tools</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* 6. System Architecture */}
            <section className="space-y-6">
              <h2 className="text-3xl font-bold text-primary border-b-2 border-primary pb-2">6. System Architecture</h2>
              
              <div className="space-y-4">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Database Schema</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-gray-700 mb-2">Core Tables:</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• <strong>products:</strong> Product catalog management</li>
                        <li>• <strong>orders:</strong> Order processing and tracking</li>
                        <li>• <strong>coupons:</strong> Discount and promotion management</li>
                        <li>• <strong>app_settings:</strong> Application configuration</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-700 mb-2">Key Features:</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• UUID primary keys for security</li>
                        <li>• JSONB for flexible data storage</li>
                        <li>• Row Level Security (RLS) enabled</li>
                        <li>• Automatic timestamp tracking</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* 7. Conclusion */}
            <section className="space-y-6">
              <h2 className="text-3xl font-bold text-primary border-b-2 border-primary pb-2">7. Conclusion</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">Summary</h3>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    The FIFTY FIVE e-commerce platform successfully demonstrates the integration of modern web technologies to create a comprehensive, scalable, and user-friendly online shopping solution. The project achieves its primary objectives by delivering:
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-3">Technical Achievements:</h4>
                      <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                        <li>Full-featured e-commerce platform with admin capabilities</li>
                        <li>Real-time order management using Supabase real-time features</li>
                        <li>Responsive, mobile-first design system</li>
                        <li>Cross-platform mobile deployment using Capacitor</li>
                        <li>Intelligent style chatbot for product recommendations</li>
                        <li>Secure payment processing with QR code integration</li>
                        <li>Comprehensive admin dashboard with analytics</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-3">Business Impact:</h4>
                      <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                        <li>Provides cost-effective alternative to expensive platforms</li>
                        <li>Enables rapid deployment and scalability</li>
                        <li>Offers modern user experience with real-time features</li>
                        <li>Supports cross-platform reach (web and mobile)</li>
                        <li>Includes AI-powered product recommendations</li>
                        <li>Provides comprehensive business analytics</li>
                        <li>Ensures data security with modern authentication</li>
                      </ul>
                    </div>
                  </div>
                  
                  <p className="text-gray-700 leading-relaxed mt-4">
                    This project contributes to the field by providing a reusable architecture pattern for modern e-commerce development, demonstrating practical implementation of real-time web applications, and establishing best practices for cross-platform deployment using current technologies.
                  </p>
                </div>
                
                <div className="bg-blue-50 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold text-blue-800 mb-3">Future Enhancements</h3>
                  <ul className="list-disc list-inside text-blue-700 space-y-1 text-sm">
                    <li>Integration with multiple payment gateways (Stripe, PayPal, Razorpay)</li>
                    <li>Advanced analytics and reporting with machine learning insights</li>
                    <li>Multi-vendor marketplace functionality</li>
                    <li>Advanced inventory management with automated reordering</li>
                    <li>Social media integration for product sharing and marketing</li>
                    <li>Progressive Web App (PWA) features for offline functionality</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Footer */}
            <div className="text-center py-8 border-t-2 border-gray-200 text-gray-500">
              <p>Generated on {new Date().toLocaleDateString()} | FIFTY FIVE - Full Stack E-Commerce Platform</p>
              <p className="text-sm mt-2">This document contains confidential and proprietary information</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectDocumentation;