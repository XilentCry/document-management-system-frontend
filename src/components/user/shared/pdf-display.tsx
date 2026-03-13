"use client";

import { Spinner } from "@/components/ui/spinner";
import { createPluginRegistration } from "@embedpdf/core";
import { EmbedPDF } from "@embedpdf/core/react";
import { usePdfiumEngine } from "@embedpdf/engines/react";
import {
  DocumentContent,
  DocumentManagerPluginPackage,
} from "@embedpdf/plugin-document-manager/react";
import { RenderLayer, RenderPluginPackage } from "@embedpdf/plugin-render/react";
import { Scroller, ScrollPluginPackage } from "@embedpdf/plugin-scroll/react";
import {
  Viewport,
  ViewportPluginPackage,
} from "@embedpdf/plugin-viewport/react";
import { useEffect, useState } from "react";
import { ZoomPluginPackage, ZoomMode } from '@embedpdf/plugin-zoom/react';
import { ZoomToolbar } from "./zoom-toolbar";

const centered = "h-[calc(100vh-3.5rem)] flex items-center justify-center";

export function PdfDisplay({ fileUrl }: { fileUrl: string }) {
  const [dpr, setDpr] = useState(1);
  const { engine, isLoading: engineLoading } = usePdfiumEngine();

  useEffect(() => {
    setDpr(Math.max(window.devicePixelRatio || 1, 2));
  }, []);

  const plugins = [
    createPluginRegistration(DocumentManagerPluginPackage, {
      initialDocuments: [{ url: fileUrl }],
    }),
    createPluginRegistration(ViewportPluginPackage),
    createPluginRegistration(ScrollPluginPackage),
    createPluginRegistration(RenderPluginPackage),
    createPluginRegistration(ZoomPluginPackage),
  ];

  if (engineLoading || !engine) {
    return (
      <div className={centered}>
        <Spinner className="text-primary size-9" />
      </div>
    );
  }

  return (
    <EmbedPDF engine={engine} plugins={plugins}>
      {({ activeDocumentId }) =>
        activeDocumentId && (
          <DocumentContent documentId={activeDocumentId}>
            {({ isLoaded }) =>
              isLoaded && (
                <>
                <Viewport
                  documentId={activeDocumentId}
                  style={{
                    height: "calc(100vh - 3.5rem)",
                    width: "100%",
                  }}
                >
                  <Scroller
                    documentId={activeDocumentId}
                    renderPage={({ width, height, pageIndex }) => (
                      <div
                        key={pageIndex}
                        className="shadow-xl"
                        style={{
                          width,
                          aspectRatio: `${width} / ${height}`,
                        }}
                      >
                        <RenderLayer
                          documentId={activeDocumentId}
                          pageIndex={pageIndex}
                          dpr={dpr}
                          style={{ width: '100%', height: '100%' }}
                        />
                      </div>
                    )}
                  />
                </Viewport>
                <ZoomToolbar documentId={activeDocumentId} />
                </>
              )
            }
          </DocumentContent>
        )
      }
    </EmbedPDF>
  );
}
