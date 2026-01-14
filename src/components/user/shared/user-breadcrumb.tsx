import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { TBreadcrumb } from "@/types/breadcrumb";
import Link from "next/link";
import { Fragment } from "react";

export function UserBreadCrumb({
  breadcrumb,
}: {
  breadcrumb: TBreadcrumb[] | TBreadcrumb | string;
}) {
  const breadcrumbArray = Array.isArray(breadcrumb) ? breadcrumb : [breadcrumb];
  const lastIndex = breadcrumbArray.length - 1;

  return (
    <Breadcrumb>
      <BreadcrumbList className="text-xl">
        {breadcrumbArray.map((item, index) => (
          <Fragment key={index}>
            <BreadcrumbItem>
              {typeof item === "string" ? (
                <BreadcrumbPage>{item}</BreadcrumbPage>
              ) : index === lastIndex ? (
                <BreadcrumbPage>{item.name}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink
                  render={
                    <Link
                      href={
                        item.type === "organization unit"
                          ? `/drive/department-drive/${item.id}`
                          : `/drive/folders/${item.id}`
                      }
                    />
                  }
                >
                  {item.name}
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
            {index !== lastIndex && (
              <BreadcrumbSeparator className="[&>svg]:size-5" />
            )}
          </Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
