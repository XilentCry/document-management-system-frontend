import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { MailCheck } from "lucide-react";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Spinner } from "@/components/ui/spinner";

interface EmailVerificationStatusProps {
  title: string;
  description: string;
  href?: string;
  onClick?: () => void | Promise<void>;
  isPending?: boolean;
}

export function EmailVerificationStatus({
  title,
  description,
  href,
  onClick,
  isPending,
}: EmailVerificationStatusProps) {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <MailCheck />
        </EmptyMedia>
        <EmptyTitle>{title}</EmptyTitle>
        <EmptyDescription>{description}</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        {href ? (
          <Link
            href={href}
            className={cn(buttonVariants({ variant: "default" }))}
          >
            Go back to login
          </Link>
        ) : onClick ? (
          <Button onClick={onClick} disabled={isPending}>
            {isPending ? (
              <>
                <Spinner />
                Resending...
              </>
            ) : (
              "Resend"
            )}
          </Button>
        ) : null}
      </EmptyContent>
    </Empty>
  );
}
