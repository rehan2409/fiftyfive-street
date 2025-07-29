import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Database } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const ProjectDocumentation = () => {
  const { toast } = useToast();

  const generatePDF = async () => {
    try {
      const documentElement = document.getElementById('er-diagram-content');
      if (!documentElement) return;

      toast({
        title: "Generating PDF",
        description: "Please wait while we generate your ER diagram PDF...",
      });

      const canvas = await html2canvas(documentElement, {
        scale: 2,
        logging: false,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('l', 'mm', 'a4'); // Landscape orientation for better ER diagram display
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pdfWidth - 20; // 10mm margin on each side
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      let yPosition = 10;
      
      // If image is taller than page, scale it down
      if (imgHeight > pdfHeight - 20) {
        const scaledHeight = pdfHeight - 20;
        const scaledWidth = (canvas.width * scaledHeight) / canvas.height;
        pdf.addImage(imgData, 'PNG', (pdfWidth - scaledWidth) / 2, yPosition, scaledWidth, scaledHeight);
      } else {
        pdf.addImage(imgData, 'PNG', 10, yPosition, imgWidth, imgHeight);
      }

      pdf.save('FIFTY-FIVE-ER-Diagram.pdf');
      
      toast({
        title: "PDF Generated",
        description: "ER diagram has been downloaded successfully.",
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
    // Enhanced ER diagram with better styling and layout
    const erDiagramSVG = `
      <svg width="1200" height="800" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <style>
            .table-box { fill: #ffffff; stroke: #2563eb; stroke-width: 2; rx: 8; }
            .table-header { fill: #2563eb; }
            .primary-key { fill: #fbbf24; }
            .foreign-key { fill: #60a5fa; }
            .text { font-family: 'Arial', sans-serif; font-size: 13px; fill: #1f2937; }
            .title { font-weight: bold; font-size: 16px; fill: #ffffff; }
            .header-text { font-weight: bold; font-size: 24px; fill: #1f2937; }
            .subtitle { font-size: 18px; fill: #6b7280; }
            .relationship { stroke: #374151; stroke-width: 2; fill: none; }
            .legend-box { fill: #f3f4f6; stroke: #d1d5db; stroke-width: 1; rx: 6; }
          </style>
          <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#374151"/>
          </marker>
        </defs>
        
        <!-- Header -->
        <text x="600" y="40" text-anchor="middle" class="header-text">FIFTY FIVE - Full Stack E-Commerce Platform</text>
        <text x="600" y="65" text-anchor="middle" class="subtitle">Database Entity Relationship Diagram</text>
        <line x1="200" y1="75" x2="1000" y2="75" stroke="#d1d5db" stroke-width="2"/>
        
        <!-- Products Table -->
        <g transform="translate(50, 120)">
          <rect width="200" height="200" class="table-box"/>
          <rect width="200" height="35" class="table-header"/>
          <text x="100" y="25" text-anchor="middle" class="title">PRODUCTS</text>
          
          <text x="15" y="55" class="text">🔑 id (UUID)</text>
          <text x="15" y="75" class="text">📝 name (TEXT)</text>
          <text x="15" y="95" class="text">💰 price (NUMERIC)</text>
          <text x="15" y="115" class="text">📂 category (TEXT)</text>
          <text x="15" y="135" class="text">📄 description (TEXT)</text>
          <text x="15" y="155" class="text">🖼️ images (TEXT[])</text>
          <text x="15" y="175" class="text">📏 sizes (TEXT[])</text>
          <text x="15" y="195" class="text">⏰ created_at (TIMESTAMP)</text>
        </g>
        
        <!-- Orders Table -->
        <g transform="translate(350, 120)">
          <rect width="200" height="220" class="table-box"/>
          <rect width="200" height="35" class="table-header"/>
          <text x="100" y="25" text-anchor="middle" class="title">ORDERS</text>
          
          <text x="15" y="55" class="text">🔑 id (UUID)</text>
          <text x="15" y="75" class="text">🛒 items (JSONB)</text>
          <text x="15" y="95" class="text">💵 total (NUMERIC)</text>
          <text x="15" y="115" class="text">🎯 discount (NUMERIC)</text>
          <text x="15" y="135" class="text">👤 customer_info (JSONB)</text>
          <text x="15" y="155" class="text">🎫 coupon_code (TEXT)</text>
          <text x="15" y="175" class="text">📊 status (TEXT)</text>
          <text x="15" y="195" class="text">📎 payment_proof (TEXT)</text>
          <text x="15" y="215" class="text">⏰ created_at (TIMESTAMP)</text>
        </g>
        
        <!-- Coupons Table -->
        <g transform="translate(650, 120)">
          <rect width="200" height="200" class="table-box"/>
          <rect width="200" height="35" class="table-header"/>
          <text x="100" y="25" text-anchor="middle" class="title">COUPONS</text>
          
          <text x="15" y="55" class="text">🔑 id (UUID)</text>
          <text x="15" y="75" class="text">🏷️ code (TEXT)</text>
          <text x="15" y="95" class="text">💲 value (NUMERIC)</text>
          <text x="15" y="115" class="text">📋 type (TEXT)</text>
          <text x="15" y="135" class="text">📊 max_usages (INTEGER)</text>
          <text x="15" y="155" class="text">📈 current_usages (INTEGER)</text>
          <text x="15" y="175" class="text">✅ active (BOOLEAN)</text>
          <text x="15" y="195" class="text">⏰ created_at (TIMESTAMP)</text>
        </g>
        
        <!-- App Settings Table -->
        <g transform="translate(950, 120)">
          <rect width="200" height="140" class="table-box"/>
          <rect width="200" height="35" class="table-header"/>
          <text x="100" y="25" text-anchor="middle" class="title">APP_SETTINGS</text>
          
          <text x="15" y="55" class="text">🔑 id (UUID)</text>
          <text x="15" y="75" class="text">🔐 key (TEXT)</text>
          <text x="15" y="95" class="text">📝 value (TEXT)</text>
          <text x="15" y="115" class="text">⏰ created_at (TIMESTAMP)</text>
          <text x="15" y="135" class="text">🔄 updated_at (TIMESTAMP)</text>
        </g>
        
        <!-- Relationships -->
        <!-- Orders references Products (through items JSONB) -->
        <line x1="250" y1="220" x2="350" y2="220" class="relationship" marker-end="url(#arrowhead)"/>
        <text x="300" y="215" text-anchor="middle" class="text" style="font-size: 11px;">contains</text>
        
        <!-- Orders references Coupons -->
        <line x1="550" y1="275" x2="650" y2="235" class="relationship" marker-end="url(#arrowhead)"/>
        <text x="600" y="250" text-anchor="middle" class="text" style="font-size: 11px;">uses</text>
        
        <!-- Legend -->
        <g transform="translate(50, 380)">
          <rect width="300" height="160" class="legend-box"/>
          <text x="150" y="25" text-anchor="middle" class="text" style="font-weight: bold; font-size: 16px;">LEGEND</text>
          
          <text x="20" y="50" class="text">🔑 Primary Key</text>
          <text x="20" y="70" class="text">🔗 Foreign Key</text>
          <text x="20" y="90" class="text">→ Relationship</text>
          
          <text x="20" y="115" class="text" style="font-weight: bold;">Data Types:</text>
          <text x="20" y="135" class="text">UUID - Unique Identifier</text>
          <text x="20" y="155" class="text">JSONB - JSON Binary data</text>
        </g>
        
        <!-- Database Information -->
        <g transform="translate(400, 380)">
          <rect width="350" height="160" class="legend-box"/>
          <text x="175" y="25" text-anchor="middle" class="text" style="font-weight: bold; font-size: 16px;">DATABASE SPECIFICATIONS</text>
          
          <text x="20" y="50" class="text" style="font-weight: bold;">Technology Stack:</text>
          <text x="20" y="70" class="text">• Database: Supabase PostgreSQL</text>
          <text x="20" y="90" class="text">• Authentication: Supabase Auth</text>
          <text x="20" y="110" class="text">• Real-time: Supabase Realtime</text>
          <text x="20" y="130" class="text">• Security: Row Level Security (RLS)</text>
          <text x="20" y="150" class="text">• API: Auto-generated REST & GraphQL</text>
        </g>
        
        <!-- Schema Information -->
        <g transform="translate(800, 380)">
          <rect width="350" height="160" class="legend-box"/>
          <text x="175" y="25" text-anchor="middle" class="text" style="font-weight: bold; font-size: 16px;">SCHEMA FEATURES</text>
          
          <text x="20" y="50" class="text" style="font-weight: bold;">Security Features:</text>
          <text x="20" y="70" class="text">• All tables have RLS enabled</text>
          <text x="20" y="90" class="text">• Public access with full CRUD operations</text>
          <text x="20" y="110" class="text">• Automatic timestamp tracking</text>
          <text x="20" y="130" class="text">• UUID primary keys for security</text>
          <text x="20" y="150" class="text">• JSONB for flexible data storage</text>
        </g>
        
        <!-- Footer -->
        <line x1="50" y1="570" x2="1150" y2="570" stroke="#d1d5db" stroke-width="1"/>
        <text x="600" y="590" text-anchor="middle" class="text" style="font-size: 12px;">Generated on ${new Date().toLocaleDateString()} | FIFTY FIVE E-Commerce Platform</text>
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
          <p className="text-gray-600 mt-1">Database Entity Relationship Diagram for FIFTY FIVE platform</p>
        </div>
        <div className="flex space-x-3">
          <Button onClick={downloadERDiagram} variant="outline">
            <Database className="h-4 w-4 mr-2" />
            Download SVG
          </Button>
          <Button onClick={generatePDF}>
            <Download className="h-4 w-4 mr-2" />
            Download PDF
          </Button>
        </div>
      </div>

      {/* ER Diagram */}
      <Card>
        <CardHeader>
          <CardTitle className="text-center">Database Entity Relationship Diagram</CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          <div id="er-diagram-content" className="w-full bg-white">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">FIFTY FIVE</h1>
              <h2 className="text-xl text-gray-600">Full Stack E-Commerce Platform</h2>
              <div className="w-32 h-1 bg-blue-600 mx-auto mt-4 rounded"></div>
            </div>
            
            <div className="w-full overflow-x-auto">
              <svg width="1200" height="600" viewBox="0 0 1200 600" className="w-full h-auto">
                {/* Products Table */}
                <g transform="translate(50, 50)">
                  <rect width="200" height="180" fill="#ffffff" stroke="#2563eb" strokeWidth="2" rx="8"/>
                  <rect width="200" height="35" fill="#2563eb" rx="8"/>
                  <rect width="200" height="35" fill="#2563eb"/>
                  <text x="100" y="25" textAnchor="middle" fill="white" fontSize="16" fontWeight="bold">PRODUCTS</text>
                  
                  <text x="15" y="55" fontSize="12" fill="#1f2937">🔑 id (UUID)</text>
                  <text x="15" y="75" fontSize="12" fill="#1f2937">📝 name (TEXT)</text>
                  <text x="15" y="95" fontSize="12" fill="#1f2937">💰 price (NUMERIC)</text>
                  <text x="15" y="115" fontSize="12" fill="#1f2937">📂 category (TEXT)</text>
                  <text x="15" y="135" fontSize="12" fill="#1f2937">📄 description (TEXT)</text>
                  <text x="15" y="155" fontSize="12" fill="#1f2937">🖼️ images (TEXT[])</text>
                  <text x="15" y="175" fontSize="12" fill="#1f2937">📏 sizes (TEXT[])</text>
                  <text x="15" y="195" fontSize="12" fill="#1f2937">⏰ created_at</text>
                </g>
                
                {/* Orders Table */}
                <g transform="translate(350, 50)">
                  <rect width="200" height="200" fill="#ffffff" stroke="#2563eb" strokeWidth="2" rx="8"/>
                  <rect width="200" height="35" fill="#2563eb" rx="8"/>
                  <rect width="200" height="35" fill="#2563eb"/>
                  <text x="100" y="25" textAnchor="middle" fill="white" fontSize="16" fontWeight="bold">ORDERS</text>
                  
                  <text x="15" y="55" fontSize="12" fill="#1f2937">🔑 id (UUID)</text>
                  <text x="15" y="75" fontSize="12" fill="#1f2937">🛒 items (JSONB)</text>
                  <text x="15" y="95" fontSize="12" fill="#1f2937">💵 total (NUMERIC)</text>
                  <text x="15" y="115" fontSize="12" fill="#1f2937">🎯 discount (NUMERIC)</text>
                  <text x="15" y="135" fontSize="12" fill="#1f2937">👤 customer_info (JSONB)</text>
                  <text x="15" y="155" fontSize="12" fill="#1f2937">🎫 coupon_code (TEXT)</text>
                  <text x="15" y="175" fontSize="12" fill="#1f2937">📊 status (TEXT)</text>
                  <text x="15" y="195" fontSize="12" fill="#1f2937">📎 payment_proof (TEXT)</text>
                  <text x="15" y="215" fontSize="12" fill="#1f2937">⏰ created_at</text>
                </g>
                
                {/* Coupons Table */}
                <g transform="translate(650, 50)">
                  <rect width="200" height="180" fill="#ffffff" stroke="#2563eb" strokeWidth="2" rx="8"/>
                  <rect width="200" height="35" fill="#2563eb" rx="8"/>
                  <rect width="200" height="35" fill="#2563eb"/>
                  <text x="100" y="25" textAnchor="middle" fill="white" fontSize="16" fontWeight="bold">COUPONS</text>
                  
                  <text x="15" y="55" fontSize="12" fill="#1f2937">🔑 id (UUID)</text>
                  <text x="15" y="75" fontSize="12" fill="#1f2937">🏷️ code (TEXT)</text>
                  <text x="15" y="95" fontSize="12" fill="#1f2937">💲 value (NUMERIC)</text>
                  <text x="15" y="115" fontSize="12" fill="#1f2937">📋 type (TEXT)</text>
                  <text x="15" y="135" fontSize="12" fill="#1f2937">📊 max_usages (INTEGER)</text>
                  <text x="15" y="155" fontSize="12" fill="#1f2937">📈 current_usages (INTEGER)</text>
                  <text x="15" y="175" fontSize="12" fill="#1f2937">✅ active (BOOLEAN)</text>
                  <text x="15" y="195" fontSize="12" fill="#1f2937">⏰ created_at</text>
                </g>
                
                {/* App Settings Table */}
                <g transform="translate(950, 50)">
                  <rect width="200" height="140" fill="#ffffff" stroke="#2563eb" strokeWidth="2" rx="8"/>
                  <rect width="200" height="35" fill="#2563eb" rx="8"/>
                  <rect width="200" height="35" fill="#2563eb"/>
                  <text x="100" y="25" textAnchor="middle" fill="white" fontSize="16" fontWeight="bold">APP_SETTINGS</text>
                  
                  <text x="15" y="55" fontSize="12" fill="#1f2937">🔑 id (UUID)</text>
                  <text x="15" y="75" fontSize="12" fill="#1f2937">🔐 key (TEXT)</text>
                  <text x="15" y="95" fontSize="12" fill="#1f2937">📝 value (TEXT)</text>
                  <text x="15" y="115" fontSize="12" fill="#1f2937">⏰ created_at</text>
                  <text x="15" y="135" fontSize="12" fill="#1f2937">🔄 updated_at</text>
                </g>
                
                {/* Relationships */}
                <defs>
                  <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
                    <polygon points="0 0, 10 3.5, 0 7" fill="#374151"/>
                  </marker>
                </defs>
                
                {/* Orders references Products */}
                <line x1="250" y1="150" x2="350" y2="150" stroke="#374151" strokeWidth="2" markerEnd="url(#arrowhead)"/>
                <text x="300" y="145" textAnchor="middle" fontSize="11" fill="#6b7280">contains</text>
                
                {/* Orders references Coupons */}
                <line x1="550" y1="205" x2="650" y2="165" stroke="#374151" strokeWidth="2" markerEnd="url(#arrowhead)"/>
                <text x="600" y="180" textAnchor="middle" fontSize="11" fill="#6b7280">uses</text>
                
                {/* Legend */}
                <g transform="translate(50, 350)">
                  <rect width="280" height="120" fill="#f3f4f6" stroke="#d1d5db" strokeWidth="1" rx="6"/>
                  <text x="140" y="25" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#1f2937">LEGEND</text>
                  
                  <text x="20" y="45" fontSize="12" fill="#1f2937">🔑 Primary Key</text>
                  <text x="20" y="65" fontSize="12" fill="#1f2937">🔗 Foreign Key Reference</text>
                  <text x="20" y="85" fontSize="12" fill="#1f2937">→ One-to-Many Relationship</text>
                  <text x="20" y="105" fontSize="12" fill="#1f2937">JSONB - Flexible JSON data storage</text>
                </g>
                
                {/* Database Info */}
                <g transform="translate(370, 350)">
                  <rect width="320" height="120" fill="#f3f4f6" stroke="#d1d5db" strokeWidth="1" rx="6"/>
                  <text x="160" y="25" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#1f2937">DATABASE TECHNOLOGY</text>
                  
                  <text x="20" y="45" fontSize="12" fill="#1f2937">• Supabase PostgreSQL Database</text>
                  <text x="20" y="65" fontSize="12" fill="#1f2937">• Row Level Security (RLS) Enabled</text>
                  <text x="20" y="85" fontSize="12" fill="#1f2937">• Real-time Data Synchronization</text>
                  <text x="20" y="105" fontSize="12" fill="#1f2937">• Auto-generated REST & GraphQL APIs</text>
                </g>
                
                {/* Security Features */}
                <g transform="translate(720, 350)">
                  <rect width="430" height="120" fill="#f3f4f6" stroke="#d1d5db" strokeWidth="1" rx="6"/>
                  <text x="215" y="25" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#1f2937">SECURITY & FEATURES</text>
                  
                  <text x="20" y="45" fontSize="12" fill="#1f2937">• Public access with full CRUD operations</text>
                  <text x="20" y="65" fontSize="12" fill="#1f2937">• UUID primary keys for enhanced security</text>
                  <text x="20" y="85" fontSize="12" fill="#1f2937">• Automatic timestamp tracking (created_at, updated_at)</text>
                  <text x="20" y="105" fontSize="12" fill="#1f2937">• JSONB for flexible and efficient data storage</text>
                </g>
              </svg>
            </div>
            
            <div className="text-center mt-8 pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                Generated on {new Date().toLocaleDateString()} | FIFTY FIVE E-Commerce Platform Database Schema
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectDocumentation;