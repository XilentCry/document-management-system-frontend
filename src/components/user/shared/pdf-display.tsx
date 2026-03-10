"use client";

import { Spinner } from "@/components/ui/spinner";
import { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const A4_WIDTH = 794;
const centered = "h-[calc(100vh-3.5rem)] flex items-center justify-center";

export function PdfDisplay({ fileUrl }: { fileUrl: string }) {
  const [numPages, setNumPages] = useState<number>(0);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  return (
    <div className="flex flex-col items-center">
      <Document
        file={fileUrl}
        onLoadSuccess={onDocumentLoadSuccess}
        loading={
          <div className={centered}>
            <Spinner className="text-primary size-9" />
          </div>
        }
        error={
          <div className={centered}>
            <p className="text-destructive text-sm">
              Failed to load document. Please try again.
            </p>
          </div>
        }
      >
        {Array.from({ length: numPages }, (_, i) => (
          <div
            key={i}
            className={i < numPages - 1 ? "mb-4" : "mb-14"}
            style={{ width: A4_WIDTH }}
          >
            <Page
              pageNumber={i + 1}
              width={A4_WIDTH}
              renderAnnotationLayer
              renderTextLayer
              className="border"
            />
          </div>
        ))}
      </Document>
    </div>
  );
}
