import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

/**
 * Export tabular data as CSV file
 */
export const exportToCSV = (filename: string, headers: string[], rows: (string | number)[][]) => {
  const sanitize = (val: string | number) => {
    if (val === null || val === undefined) return '""';
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  };

  const csvContent = [
    headers.map(sanitize).join(','),
    ...rows.map((row) => row.map(sanitize).join(',')),
  ].join('\r\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename.replace(/\s+/g, '_')}_${new Date().toISOString().substring(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Export tabular data as Excel (.xlsx) file
 */
export const exportToExcel = (
  filename: string,
  sheetName: string = 'DataSheet',
  headers: string[],
  rows: (string | number)[][]
) => {
  const worksheetData = [headers, ...rows];
  const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

  // Set header column widths
  const colWidths = headers.map((h, i) => {
    const maxLen = Math.max(
      h.length,
      ...rows.map((r) => (r[i] !== undefined && r[i] !== null ? String(r[i]).length : 0))
    );
    return { wch: Math.min(Math.max(maxLen + 3, 12), 40) };
  });
  worksheet['!cols'] = colWidths;

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

  const cleanFileName = `${filename.replace(/\s+/g, '_')}_${new Date().toISOString().substring(0, 10)}.xlsx`;
  XLSX.writeFile(workbook, cleanFileName);
};

/**
 * Export tabular data as styled PDF report
 */
export const exportToPDF = (
  title: string,
  filename: string,
  headers: string[],
  rows: (string | number)[][],
  subtitle: string = 'Exported Financial Report'
) => {
  const doc = new jsPDF({ orientation: headers.length > 5 ? 'landscape' : 'portrait' });

  const primaryColor = [13, 148, 136]; // Teal #0d9488
  const timestamp = new Date().toLocaleString();

  // PDF Document Header
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.rect(0, 0, doc.internal.pageSize.width, 18, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text(title.toUpperCase(), 14, 12);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(`Generated: ${timestamp}`, doc.internal.pageSize.width - 14, 12, { align: 'right' });

  // Subtitle / Info
  doc.setTextColor(50, 50, 50);
  doc.setFontSize(10);
  doc.text(subtitle, 14, 26);

  // Table
  autoTable(doc, {
    startY: 32,
    head: [headers],
    body: rows,
    theme: 'striped',
    headStyles: {
      fillColor: [13, 148, 136],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 9,
    },
    bodyStyles: {
      fontSize: 8,
      textColor: [30, 41, 59],
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },
    margin: { top: 32, left: 14, right: 14, bottom: 18 },
    didDrawPage: (data) => {
      // Footer page numbering
      const str = `Page ${data.pageNumber} of ${doc.getNumberOfPages()}`;
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text(str, doc.internal.pageSize.width - 14, doc.internal.pageSize.height - 8, { align: 'right' });
      doc.text('Couple Finance — Official Report', 14, doc.internal.pageSize.height - 8);
    },
  });

  const cleanFileName = `${filename.replace(/\s+/g, '_')}_${new Date().toISOString().substring(0, 10)}.pdf`;
  doc.save(cleanFileName);
};
