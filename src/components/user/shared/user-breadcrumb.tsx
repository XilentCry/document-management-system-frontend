import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TBreadcrumb } from "@/types/breadcrumb";
import Link from "next/link";
import { Fragment } from "react";
import { Ellipsis } from "lucide-react";

export function UserBreadCrumb({
  breadcrumb,
}: {
  breadcrumb: TBreadcrumb[] | TBreadcrumb;
}) {
  const breadcrumbArray = Array.isArray(breadcrumb) ? breadcrumb : [breadcrumb];

  const shouldTruncate = breadcrumbArray.length > 1;

  const shouldCollapse = breadcrumbArray.length >= 4;

  const hiddenItems = shouldCollapse
    ? breadcrumbArray.slice(0, breadcrumbArray.length - 2)
    : [];

  const visibleItems = shouldCollapse
    ? breadcrumbArray.slice(-2)
    : breadcrumbArray;

  return (
    <Breadcrumb>
      <BreadcrumbList className="text-xl">
        {shouldCollapse && (
          <>
            <BreadcrumbItem>
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center">
                  <Ellipsis className="size-5" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-auto max-w-96">
                  {hiddenItems.map((item) => (
                    <DropdownMenuItem key={item.id}>
                      <BreadcrumbLink
                        render={
                          <Link
                            href={
                              item.type === "organization_unit"
                                ? `/drive/department-drive/${item.id}`
                                : `/drive/folders/${item.id}`
                            }
                          />
                        }
                        className="truncate"
                      >
                        {item.name}
                      </BreadcrumbLink>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </BreadcrumbItem>

            <BreadcrumbSeparator className="[&>svg]:size-5" />
          </>
        )}

        {visibleItems.map((item, index) => {
          const isLast = index === visibleItems.length - 1;

          return (
            <Fragment key={item.id}>
              <BreadcrumbItem className={`${shouldTruncate && "max-w-72"}`}>
                {isLast ? (
                  <BreadcrumbPage className={`${shouldTruncate && "truncate"}`}>
                    {item.name}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink
                    render={
                      <Link
                        href={
                          item.type === "organization_unit"
                            ? `/drive/department-drive/${item.id}`
                            : `/drive/folders/${item.id}`
                        }
                      />
                    }
                    className="truncate"
                  >
                    {item.name}
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>

              {!isLast && <BreadcrumbSeparator className="[&>svg]:size-5" />}
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
