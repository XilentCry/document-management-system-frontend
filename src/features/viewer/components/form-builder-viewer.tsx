import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Spinner } from "@/components/ui/spinner";
import { useGetBuilderToken } from "@/features/submissions/api/mutations";
import { TItem } from "@/features/items/types/item";
import { DocusealBuilder } from "@docuseal/react";
import { Send, X } from "lucide-react";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { NewSubmissionDialog } from "@/features/submissions/components/new-submission-dialog";

export function FormBuilderViewer({
  item,
  openFormBuilderViewer,
  setOpenFormBuilderViewer,
}: {
  item: TItem;
  openFormBuilderViewer: boolean;
  setOpenFormBuilderViewer: Dispatch<SetStateAction<boolean>>;
}) {
  const [token, setToken] = useState<string | null>(null);
  const [templateId, setTemplateId] = useState<number | null>(null);
  const [roles, setRoles] = useState<string[]>([]);
  const [openNewSubmissionDialog, setOpenNewSubmissionDialog] = useState(false);
  const [template, setTemplate] = useState();
  useEffect(() => template && console.log(template), [template]);

  const { mutateAsync: getBuilderToken, isPending } = useGetBuilderToken();

  useEffect(() => {
    if (openFormBuilderViewer && !token) {
      getBuilderToken(item.id).then((t) => setToken(t));
    }
  }, [openFormBuilderViewer, item.id, getBuilderToken, token]);

  const handleClose = () => {
    setToken(null);
    setRoles([]);
    setTemplateId(null);
    setOpenFormBuilderViewer(false);
  };

  const handleSendClick = () => {
    setOpenNewSubmissionDialog(true);
  };

  if (!openFormBuilderViewer) return null;

  return (
    <div className="bg-background fixed inset-0 isolate z-50 flex flex-col">
      <header className="bg-background border-b h-14 flex items-center justify-between px-4">
        <div className="flex items-center justify-between gap-4">
          <Button variant="ghost" size="icon" onClick={handleClose}>
            <X className="size-5" />
          </Button>
          <span className="text-sm leading-snug font-medium">
            Form Builder
          </span>
        </div>
        <Button onClick={handleSendClick} disabled={!templateId}><Send />Send</Button>
      </header>

      <div className="flex-1 min-h-0 flex flex-col">
        {isPending || !token ? (
          <div className="flex items-center justify-center flex-1">
            <Spinner className="text-primary size-9" />
          </div>
        ) : (
          <ScrollArea className="flex-1">
            <DocusealBuilder
              token={token}
              fieldTypes={["signature"]}
              withSendButton={false}
              withSignYourselfButton={false}
              withUploadButton={false}
              onLoad={(data) => {
                setTemplateId(data.id)
                setRoles(data.submitters.map((submitter: { name: string }) => submitter.name))
                setTemplate(data);
              }}
              onSave={(data) => {
                setTemplateId(data.id);
                setRoles(data.submitters.map((submitter: { name: string }) => submitter.name))
                setTemplate(data);
              }}
            />
          </ScrollArea>
        )}
      </div>

      {templateId && (
        <NewSubmissionDialog
          openNewSubmissionDialog={openNewSubmissionDialog}
          setOpenNewSubmissionDialog={setOpenNewSubmissionDialog}
          roles={roles}
          templateId={templateId}
          documentId={item.id}
          onSubmissionCreated={handleClose}
        />
      )}
    </div>
  );
}
