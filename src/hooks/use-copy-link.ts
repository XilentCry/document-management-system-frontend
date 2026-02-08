import { toast } from "sonner";

export function useCopyLink() {
  const copyLink = async (filePath: string) => {
    try {
      await navigator.clipboard.writeText(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/storage/${filePath}`,
      );
      toast.success("Link copied.");
    } catch (error) {
      console.log(error);
      toast.error("Failed to copy link. Please try again.");
    }
  };

  return { copyLink };
}
