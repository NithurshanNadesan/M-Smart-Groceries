import React, { useState } from "react";
import axios from "axios";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import "../css/Reports.css";

const Reports = () => {
  const [loading, setLoading] = useState(null);
  
  const reports = [
    "Sales Report",
    "Category Sales Report",
    "Stock Purchase Report",
    "Stock Purchase Details Report",
    "Chatbot Logs Report",
  ];

  const reportRoutes = {
    "Sales Report": "http://localhost:4000/sales/sales-details",
    "Category Sales Report": "http://localhost:4000/sales/sales-by-category",
    "Stock Purchase Report": "http://localhost:4000/stock-purchase",
    "Stock Purchase Details Report": "http://localhost:4000/stock-purchase-details",
    "Chatbot Logs Report": "http://localhost:4000/chatbot-logs",
  };

  const handleDownload = async (reportName, format) => {
    try {
      setLoading(`${reportName}-${format}`);
      
      const route = reportRoutes[reportName];
      if (!route) throw new Error("Invalid report selected");

      const response = await axios.get(route);
      const data = response.data;

      switch (format) {
        case "CSV":
          await downloadCSV(data, reportName);
          break;
        case "Excel":
          await downloadExcel(data, reportName);
          break;
        case "PDF":
          await downloadPDF(data, reportName);
          break;
        default:
          throw new Error("Unsupported format");
      }
    } catch (error) {
      console.error("Download error:", error);
      alert(`Failed to download ${reportName}: ${error.message}`);
    } finally {
      setLoading(null);
    }
  };

  // ... (keep all other existing functions the same: flattenData, formatValue, downloadCSV, downloadExcel)
  const flattenData = (data, reportName) => {
    // Handle special case for Chatbot Logs
    if (reportName === "Chatbot Logs Report" && data.chatbotLogs) {
      data = data.chatbotLogs;
    }

    if (!Array.isArray(data)) return [];

    return data.map(row => {
      const flatRow = {};
      Object.keys(row).forEach(key => {
        // Handle nested objects
        if (typeof row[key] === 'object' && row[key] !== null) {
          Object.keys(row[key]).forEach(subKey => {
            const newKey = `${key}_${subKey}`;
            flatRow[newKey] = formatValue(row[key][subKey]);
          });
        } else {
          flatRow[key] = formatValue(row[key]);
        }
      });
      return flatRow;
    });
  };

  const formatValue = (value) => {
    if (value === null || value === undefined) return '';
    if (value instanceof Date) return value.toLocaleString();
    if (typeof value === 'boolean') return value ? 'Yes' : 'No';
    return String(value);
  };

  const downloadCSV = async (data, reportName) => {
    const flattenedData = flattenData(data, reportName);
    if (flattenedData.length === 0) throw new Error("No data available");

    const headers = Object.keys(flattenedData[0]);
    const headerRow = headers.join(',');
    
    const dataRows = flattenedData.map(row => 
      headers.map(field => {
        const value = row[field] || '';
        // Escape quotes and wrap in quotes if contains commas
        return `"${String(value).replace(/"/g, '""')}"`;
      }).join(',')
    );

    const csvContent = [headerRow, ...dataRows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, `${reportName.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0,10)}.csv`);
  };

  const downloadExcel = async (data, reportName) => {
    const flattenedData = flattenData(data, reportName);
    if (flattenedData.length === 0) throw new Error("No data available");

    const worksheet = XLSX.utils.json_to_sheet(flattenedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Report Data");
    
    // Auto-size columns
    const wscols = Object.keys(flattenedData[0]).map(() => ({ wch: 20 }));
    worksheet['!cols'] = wscols;

    const excelBuffer = XLSX.write(workbook, { 
      bookType: 'xlsx', 
      type: 'array' 
    });
    
    const blob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });
    
    saveAs(blob, `${reportName.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0,10)}.xlsx`);
  };

  const downloadPDF = async (data, reportName) => {
    const flattenedData = flattenData(data, reportName);
    if (flattenedData.length === 0) throw new Error("No data available");

    // Create new PDF instance
    const doc = new jsPDF({
      orientation: "landscape" // Use landscape for wider tables
    });

    // Add title and date
    doc.setFontSize(16);
    doc.text(reportName, 14, 15);
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 22);

    // Prepare table data
    const headers = Object.keys(flattenedData[0]);
    const body = flattenedData.map(row => 
      headers.map(header => row[header])
    );

    // Add the table using jspdf-autotable
    autoTable(doc, {
      head: [headers],
      body: body,
      startY: 30,
      styles: { 
        overflow: 'linebreak',
        fontSize: 8 // Smaller font for better fit
      },
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255,
        fontStyle: 'bold'
      },
      margin: { top: 30 },
      tableWidth: 'auto',
      columnStyles: {
        0: { cellWidth: 'auto' }
      }
    });

    doc.save(`${reportName.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0,10)}.pdf`);
  };

  return (
    <div className="reports-container">
      <h3 id="page-name">Reports</h3>
      <table className="reports-table">
        <thead>
          <tr>
            <th>Report Name</th>
            <th>Download</th>
          </tr>
        </thead>
        <tbody>
          {reports.map((report, index) => (
            <tr key={index}>
              <td>{report}</td>
              <td className="download-buttons">
                <button
                  className="csv-btn"
                  onClick={() => handleDownload(report, "CSV")}
                  disabled={loading === `${report}-CSV`}
                >
                  {loading === `${report}-CSV` ? 'Generating...' : 'CSV'}
                </button>
                <button
                  className="excel-btn"
                  onClick={() => handleDownload(report, "Excel")}
                  disabled={loading === `${report}-Excel`}
                >
                  {loading === `${report}-Excel` ? 'Generating...' : 'Excel'}
                </button>
                <button
                  className="pdf-btn"
                  onClick={() => handleDownload(report, "PDF")}
                  disabled={loading === `${report}-PDF`}
                >
                  {loading === `${report}-PDF` ? 'Generating...' : 'PDF'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Reports;
