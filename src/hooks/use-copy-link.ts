import { toast } from "sonner";

export function useCopyLink() {
  const copyLink = async (documentId: string) => {
    try {
      const url = `${process.env.NEXT_PUBLIC_FRONTEND_URL}/document/${documentId}/view`;
      await navigator.clipboard.writeText(url);
      toast.success("Link copied.");
    } catch (error) {
      console.log(error);
      toast.error("Failed to copy link. Please try again.");
    }
  };

  return { copyLink };
}
