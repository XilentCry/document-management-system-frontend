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




const centered = "h-[calc(100vh-3.5rem)] flex items-center justify-center";

export function PdfDisplay({ fileUrl }: { fileUrl: string }) {
  const dpr = Math.max(
    typeof window !== "undefined" ? window.devicePixelRatio : 1,
    2,
  );
  const { engine, isLoading: engineLoading } = usePdfiumEngine();

  const plugins = [
    createPluginRegistration(DocumentManagerPluginPackage, {
      initialDocuments: [{ url: fileUrl, scale: 1.33 }],
    }),
    createPluginRegistration(ViewportPluginPackage),
    createPluginRegistration(ScrollPluginPackage),
    createPluginRegistration(RenderPluginPackage),

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
                            height,
                            contain: "content",
                            willChange: "transform",
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
              )
            }
          </DocumentContent>
        )
      }
    </EmbedPDF>
  );
}
