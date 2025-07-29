import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, FileText, Database } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const ProjectDocumentation = () => {
  const { toast } = useToast();

  const generatePDF = async () => {
    try {
      const documentElement = document.getElementById('project-documentation');
      if (!documentElement) return;

      toast({
        title: "Generating PDF",
        description: "Please wait while we generate your documentation PDF...",
      });

      const canvas = await html2canvas(documentElement, {
        scale: 2,
        logging: false,
        useCORS: true,
        allowTaint: true
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 190;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 10;

      // Add first page
      pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // Add additional pages if needed
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight + 10;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
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

  const downloadERDiagram = () => {
    // Create ER diagram content
    const erDiagramSVG = `
      <svg width="800" height="600" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <style>
            .table-box { fill: #f8f9fa; stroke: #000; stroke-width: 2; }
            .primary-key { fill: #ffd700; }
            .foreign-key { fill: #87ceeb; }
            .text { font-family: Arial, sans-serif; font-size: 12px; }
            .title { font-weight: bold; font-size: 14px; }
            .relationship { stroke: #000; stroke-width: 2; fill: none; }
          </style>
        </defs>
        
        <!-- Products Table -->
        <rect x="50" y="50" width="150" height="120" class="table-box"/>
        <text x="125" y="70" text-anchor="middle" class="text title">PRODUCTS</text>
        <line x1="50" y1="75" x2="200" y2="75" stroke="#000"/>
        <text x="55" y="90" class="text">🔑 id (UUID)</text>
        <text x="55" y="105" class="text">name (TEXT)</text>
        <text x="55" y="120" class="text">price (DECIMAL)</text>
        <text x="55" y="135" class="text">category (TEXT)</text>
        <text x="55" y="150" class="text">image_url (TEXT)</text>
        <text x="55" y="165" class="text">created_at (TIMESTAMP)</text>
        
        <!-- Orders Table -->
        <rect x="300" y="50" width="150" height="140" class="table-box"/>
        <text x="375" y="70" text-anchor="middle" class="text title">ORDERS</text>
        <line x1="300" y1="75" x2="450" y2="75" stroke="#000"/>
        <text x="305" y="90" class="text">🔑 id (UUID)</text>
        <text x="305" y="105" class="text">🔗 user_id (UUID)</text>
        <text x="305" y="120" class="text">total (DECIMAL)</text>
        <text x="305" y="135" class="text">status (TEXT)</text>
        <text x="305" y="150" class="text">customer_info (JSONB)</text>
        <text x="305" y="165" class="text">payment_method (TEXT)</text>
        <text x="305" y="180" class="text">created_at (TIMESTAMP)</text>
        
        <!-- Order Items Table -->
        <rect x="300" y="220" width="150" height="120" class="table-box"/>
        <text x="375" y="240" text-anchor="middle" class="text title">ORDER_ITEMS</text>
        <line x1="300" y1="245" x2="450" y2="245" stroke="#000"/>
        <text x="305" y="260" class="text">🔑 id (UUID)</text>
        <text x="305" y="275" class="text">🔗 order_id (UUID)</text>
        <text x="305" y="290" class="text">🔗 product_id (UUID)</text>
        <text x="305" y="305" class="text">quantity (INTEGER)</text>
        <text x="305" y="320" class="text">price (DECIMAL)</text>
        <text x="305" y="335" class="text">created_at (TIMESTAMP)</text>
        
        <!-- Coupons Table -->
        <rect x="550" y="50" width="150" height="120" class="table-box"/>
        <text x="625" y="70" text-anchor="middle" class="text title">COUPONS</text>
        <line x1="550" y1="75" x2="700" y2="75" stroke="#000"/>
        <text x="555" y="90" class="text">🔑 id (UUID)</text>
        <text x="555" y="105" class="text">code (TEXT)</text>
        <text x="555" y="120" class="text">discount (DECIMAL)</text>
        <text x="555" y="135" class="text">type (TEXT)</text>
        <text x="555" y="150" class="text">is_active (BOOLEAN)</text>
        <text x="555" y="165" class="text">created_at (TIMESTAMP)</text>
        
        <!-- Settings Table -->
        <rect x="50" y="220" width="150" height="100" class="table-box"/>
        <text x="125" y="240" text-anchor="middle" class="text title">SETTINGS</text>
        <line x1="50" y1="245" x2="200" y2="245" stroke="#000"/>
        <text x="55" y="260" class="text">🔑 id (UUID)</text>
        <text x="55" y="275" class="text">key (TEXT)</text>
        <text x="55" y="290" class="text">value (TEXT)</text>
        <text x="55" y="305" class="text">updated_at (TIMESTAMP)</text>
        
        <!-- Relationships -->
        <!-- Products to Order Items -->
        <line x1="200" y1="110" x2="300" y2="280" class="relationship" marker-end="url(#arrowhead)"/>
        
        <!-- Orders to Order Items -->
        <line x1="375" y1="190" x2="375" y2="220" class="relationship" marker-end="url(#arrowhead)"/>
        
        <!-- Arrow marker -->
        <defs>
          <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#000"/>
          </marker>
        </defs>
        
        <!-- Relationship Labels -->
        <text x="250" y="200" class="text" style="font-size: 10px;">has many</text>
        <text x="380" y="210" class="text" style="font-size: 10px;">contains</text>
        
        <!-- Legend -->
        <rect x="50" y="400" width="200" height="100" fill="#f0f0f0" stroke="#000"/>
        <text x="60" y="420" class="text title">LEGEND</text>
        <text x="60" y="440" class="text">🔑 Primary Key</text>
        <text x="60" y="455" class="text">🔗 Foreign Key</text>
        <text x="60" y="470" class="text">→ One-to-Many</text>
        <text x="60" y="485" class="text">⟷ Many-to-Many</text>
        
        <!-- Database Info -->
        <text x="300" y="420" class="text title">FIFTY-FIVE E-COMMERCE DATABASE</text>
        <text x="300" y="440" class="text">Database: Supabase PostgreSQL</text>
        <text x="300" y="455" class="text">Authentication: Supabase Auth</text>
        <text x="300" y="470" class="text">Storage: Supabase Storage</text>
        <text x="300" y="485" class="text">Real-time: Supabase Realtime</text>
      </svg>
    `;

    const blob = new Blob([erDiagramSVG], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'FIFTY-FIVE-ER-Diagram.svg';
    link.click();
    URL.revokeObjectURL(url);

    toast({
      title: "ER Diagram Downloaded",
      description: "Database ER diagram has been downloaded successfully.",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Project Documentation</h2>
          <p className="text-gray-600 mt-1">Complete project documentation and database schema</p>
        </div>
        <div className="flex space-x-3">
          <Button onClick={downloadERDiagram} variant="outline">
            <Database className="h-4 w-4 mr-2" />
            Download ER Diagram
          </Button>
          <Button onClick={generatePDF}>
            <Download className="h-4 w-4 mr-2" />
            Download PDF
          </Button>
        </div>
      </div>

      {/* Documentation Content */}
      <Card>
        <CardContent className="p-8">
          <div id="project-documentation" className="space-y-8 text-gray-800">
            
            {/* Title Slide */}
            <div className="text-center border-b pb-6">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">FIFTY-FIVE</h1>
              <h2 className="text-2xl font-semibold text-gray-700 mb-6">Full-Stack E-Commerce Platform with 3D Visualization</h2>
              <div className="space-y-2 text-lg">
                <p><strong>Student Name:</strong> [Your Name]</p>
                <p><strong>Guide Name:</strong> [Guide Name]</p>
                <p><strong>Institution:</strong> [Your Institution]</p>
                <p><strong>Date:</strong> {new Date().toLocaleDateString()}</p>
              </div>
            </div>

            {/* Introduction */}
            <section className="space-y-4">
              <h3 className="text-2xl font-bold text-gray-900">2. Introduction</h3>
              
              <div className="space-y-3">
                <h4 className="text-lg font-semibold">• Background:</h4>
                <p className="text-gray-700 leading-relaxed ml-4">
                  Traditional e-commerce platforms lack interactive elements and engaging user experiences. 
                  There is a need for modern platforms that combine robust backend functionality with immersive 
                  frontend experiences using 3D visualization and real-time features.
                </p>
                
                <h4 className="text-lg font-semibold">• Purpose:</h4>
                <p className="text-gray-700 leading-relaxed ml-4">
                  To develop a comprehensive e-commerce platform that integrates modern web technologies 
                  including 3D visualizations, real-time data synchronization, and cross-platform mobile 
                  deployment capabilities.
                </p>
              </div>
            </section>

            {/* Objectives */}
            <section className="space-y-4">
              <h3 className="text-2xl font-bold text-gray-900">3. Objectives</h3>
              
              <div className="space-y-3">
                <h4 className="text-lg font-semibold">• Primary Objective:</h4>
                <p className="text-gray-700 leading-relaxed ml-4">
                  Develop a full-featured e-commerce platform with administrative capabilities, real-time 
                  order management, and interactive 3D brand visualization deployable across web and mobile platforms.
                </p>
                
                <h4 className="text-lg font-semibold">• Secondary Objectives:</h4>
                <ul className="list-disc ml-8 space-y-1 text-gray-700">
                  <li>Implement real-time data synchronization using Supabase</li>
                  <li>Create intuitive admin dashboard for product and order management</li>
                  <li>Develop 3D interactive elements using Three.js for enhanced user engagement</li>
                  <li>Build responsive design system using modern CSS frameworks</li>
                  <li>Enable cross-platform mobile deployment using Capacitor</li>
                  <li>Implement secure payment processing and coupon management systems</li>
                </ul>
              </div>
            </section>

            {/* Literature Review */}
            <section className="space-y-4">
              <h3 className="text-2xl font-bold text-gray-900">4. Literature Review</h3>
              
              <div className="space-y-3">
                <h4 className="text-lg font-semibold">• Existing Research:</h4>
                <ul className="list-disc ml-8 space-y-1 text-gray-700">
                  <li>Modern e-commerce platforms (Shopify, WooCommerce, Magento) require extensive customization for unique brand experiences</li>
                  <li>Three.js and WebGL technologies improve user engagement in web applications by 40-60%</li>
                  <li>Real-time data synchronization improves operational efficiency and customer satisfaction in e-commerce</li>
                </ul>
                
                <h4 className="text-lg font-semibold">• Gaps in Knowledge:</h4>
                <ul className="list-disc ml-8 space-y-1 text-gray-700">
                  <li>Limited integration of 3D visualization in small-to-medium e-commerce platforms</li>
                  <li>Lack of documentation on combining Supabase real-time features with React-based e-commerce solutions</li>
                  <li>Insufficient research on cross-platform deployment strategies for modern web-based e-commerce applications</li>
                </ul>
                
                <h4 className="text-lg font-semibold">• Your Contribution:</h4>
                <ul className="list-disc ml-8 space-y-1 text-gray-700">
                  <li>Demonstrating practical implementation of 3D elements in e-commerce</li>
                  <li>Providing blueprint for Supabase integration with React Query for real-time e-commerce operations</li>
                  <li>Creating reusable architecture for cross-platform e-commerce deployment</li>
                </ul>
              </div>
            </section>

            {/* Project Scope */}
            <section className="space-y-4">
              <h3 className="text-2xl font-bold text-gray-900">5. Project Scope</h3>
              
              <div className="space-y-3">
                <h4 className="text-lg font-semibold">• Inclusions:</h4>
                <ul className="list-disc ml-8 space-y-1 text-gray-700">
                  <li>Product catalog with search and filtering</li>
                  <li>Shopping cart and checkout functionality</li>
                  <li>User authentication and account management</li>
                  <li>3D animated brand visualization</li>
                  <li>Responsive design for all screen sizes</li>
                  <li>Product management system</li>
                  <li>Order processing and tracking</li>
                  <li>Coupon and discount management</li>
                  <li>Real-time data synchronization</li>
                  <li>Admin dashboard with analytics</li>
                  <li>Cross-platform mobile app using Capacitor</li>
                </ul>
              </div>
            </section>

            {/* Methodology */}
            <section className="space-y-4">
              <h3 className="text-2xl font-bold text-gray-900">6. Methodology</h3>
              
              <div className="space-y-3">
                <h4 className="text-lg font-semibold">• Research Design:</h4>
                <p className="text-gray-700 leading-relaxed ml-4">
                  Applied research with iterative development methodology using component-based development 
                  approach and continuous integration testing.
                </p>
                
                <h4 className="text-lg font-semibold">• Data Collection:</h4>
                <ul className="list-disc ml-8 space-y-1 text-gray-700">
                  <li>User interface design patterns from leading e-commerce platforms</li>
                  <li>Performance benchmarks for 3D web applications</li>
                  <li>Best practices for React and TypeScript development</li>
                  <li>Documentation from React, Supabase, and Three.js communities</li>
                </ul>
                
                <h4 className="text-lg font-semibold">• Data Analysis:</h4>
                <ul className="list-disc ml-8 space-y-1 text-gray-700">
                  <li>Code quality assessment using TypeScript strict mode</li>
                  <li>Performance monitoring using React DevTools</li>
                  <li>Real-time data flow analysis using Supabase analytics</li>
                  <li>Component reusability metrics and mobile responsiveness testing</li>
                </ul>
              </div>
            </section>

            {/* Conclusion */}
            <section className="space-y-4">
              <h3 className="text-2xl font-bold text-gray-900">7. Conclusion</h3>
              
              <div className="space-y-3">
                <h4 className="text-lg font-semibold">• Summary:</h4>
                <ul className="list-disc ml-8 space-y-1 text-gray-700">
                  <li>Successfully developed a full-featured e-commerce platform with admin capabilities</li>
                  <li>Implemented real-time order management using Supabase</li>
                  <li>Created engaging 3D brand visualization using Three.js</li>
                  <li>Built responsive, mobile-first design system</li>
                  <li>Enabled cross-platform mobile deployment</li>
                  <li>Provides reusable architecture for modern e-commerce development</li>
                  <li>Demonstrates practical implementation of real-time web applications with 3D graphics integration</li>
                </ul>
              </div>
            </section>

            {/* Technology Stack */}
            <section className="space-y-4">
              <h3 className="text-2xl font-bold text-gray-900">8. Technology Stack & Architecture</h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-lg font-semibold mb-2">Frontend Technologies:</h4>
                  <ul className="list-disc ml-6 space-y-1 text-gray-700">
                    <li>React 18 with TypeScript</li>
                    <li>Tailwind CSS for styling</li>
                    <li>Three.js for 3D visualization</li>
                    <li>Zustand for state management</li>
                    <li>React Query for data fetching</li>
                    <li>Vite for build tooling</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="text-lg font-semibold mb-2">Backend & Infrastructure:</h4>
                  <ul className="list-disc ml-6 space-y-1 text-gray-700">
                    <li>Supabase for database & auth</li>
                    <li>PostgreSQL for data storage</li>
                    <li>Real-time subscriptions</li>
                    <li>Capacitor for mobile deployment</li>
                    <li>Shadcn/UI component library</li>
                    <li>ESLint & TypeScript for code quality</li>
                  </ul>
                </div>
              </div>
            </section>

          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectDocumentation;