"use client";

import { useCallback } from "react";
import { Button } from "./Button";

interface PDFExportButtonProps {
  contentRef?: React.RefObject<HTMLElement>;
  filename?: string;
  onExport?: () => Promise<void> | void;
}

export function PDFExportButton({ contentRef, filename = "score-report", onExport }: PDFExportButtonProps) {
  const handleExport = useCallback(async () => {
    if (onExport) {
      await onExport();
      return;
    }

    if (contentRef?.current) {
      const printWindow = window.open("", "_blank", "width=800,height=600");
      if (!printWindow) return;
      printWindow.document.write(`
        <html>
          <head>
            <title>${filename}</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 24px; }
              table { width: 100%; border-collapse: collapse; }
              th, td { border: 1px solid #e5e7eb; padding: 8px; text-align: left; }
              th { background: #f3f4f6; }
            </style>
          </head>
          <body>${contentRef.current.outerHTML}</body>
        </html>
      `);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
      printWindow.close();
    }
  }, [contentRef, filename, onExport]);

  return (
    <Button variant="outline" size="md" onClick={handleExport}>
      Tải bảng điểm PDF
    </Button>
  );
}

