import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Spinner } from "@/components/ui/spinner";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { formatFileSize } from "@/lib/format-file-size";
import { useGetDocumentVersions } from "@/services/documents/queries";
import { TItem } from "@/types/item";
import { Dispatch, SetStateAction } from "react";

export function VersionHistoryDialog({
    item,
    openVersionHistoryDialog,
    setOpenVersionHistoryDialog,
}: {
    item: TItem;
    openVersionHistoryDialog: boolean;
    setOpenVersionHistoryDialog: Dispatch<SetStateAction<boolean>>;
}) {
    const {
        isLoading,
        isError,
        error,
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useGetDocumentVersions(item.id, openVersionHistoryDialog);

    const versions = data?.pages?.flatMap((page) => page.data) ?? [];

    return (
        <Dialog open={openVersionHistoryDialog} onOpenChange={setOpenVersionHistoryDialog}>
            <DialogContent className="w-150 max-w-150!">
                <DialogHeader>
                    <DialogTitle>Version history for &quot;{item.name}&quot;</DialogTitle>
                </DialogHeader>
                <div className="h-96 flex flex-col">
                    <ScrollArea className="flex-1 flex flex-col min-h-0">
                        {isLoading ? (
                            <div className="h-full flex items-center justify-center">
                                <Spinner className="text-primary size-9" />
                            </div>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Version</TableHead>
                                        <TableHead>Created by</TableHead>
                                        <TableHead>Modified</TableHead>
                                        <TableHead>File size</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {versions.map((version) => (
                                        <TableRow key={version.id}>
                                            <TableCell>{version.version_number}</TableCell>
                                            <TableCell>
                                                {version.created_by.first_name} {version.created_by.middle_name} {version.created_by.last_name}
                                            </TableCell>
                                            <TableCell>{version.updated_at}</TableCell>
                                            <TableCell>{formatFileSize(version.file_size)}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                        {isError && error && (
                            <div className="py-4 flex items-center justify-center">
                                <p className="text-destructive text-sm">{error.message}</p>
                            </div>
                        )}
                        {hasNextPage && (
                            <div className="flex justify-center mt-4 mb-4">
                                <Button
                                    onClick={() => fetchNextPage()}
                                    disabled={isFetchingNextPage}
                                >
                                    {isFetchingNextPage ? (
                                        <>
                                            <Spinner />
                                            Loading more...
                                        </>
                                    ) : (
                                        "Load more versions"
                                    )}
                                </Button>
                            </div>
                        )}
                    </ScrollArea>
                </div>

                <DialogFooter>
                    <DialogClose render={<Button />}>Close</DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
