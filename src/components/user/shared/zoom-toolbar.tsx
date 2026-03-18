import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { useZoom } from "@embedpdf/plugin-zoom/react";
import { Minus, Plus } from "lucide-react";

interface ZoomToolbarProps {
  documentId: string;
}

export const ZoomToolbar = ({ documentId }: ZoomToolbarProps) => {
  const { provides: zoomProvides, state: zoomState } = useZoom(documentId);

  if (!zoomProvides) {
    return null;
  }

  return (
    <ButtonGroup className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-background rounded-4xl">
      <Button variant="outline">{Math.round(zoomState.currentZoomLevel * 100)}%</Button>
      <Button variant="outline" onClick={zoomProvides.zoomOut}><Minus /></Button>
      <Button variant="outline" onClick={zoomProvides.zoomIn}><Plus /></Button>
      <Button variant="outline" onClick={() => zoomProvides.requestZoom(1.33)}>Reset</Button>
    </ButtonGroup>
  );
};
