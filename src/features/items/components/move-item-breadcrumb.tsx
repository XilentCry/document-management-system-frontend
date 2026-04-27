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
import { TMoveItemFormSchema } from "@/features/items/schemas/move-item-form-schema";
import { TBreadcrumb } from "@/types/breadcrumb";
import { TItem } from "@/features/items/types/item";
import { Ellipsis } from "lucide-react";
import { Dispatch, Fragment, SetStateAction } from "react";
import { UseFormReset, UseFormSetValue } from "react-hook-form";

export function MoveItemBreadCrumb({
  breadcrumb,
  setCurrentParentFolderId,
  setValue,
  reset,
  item,
}: {
  breadcrumb: TBreadcrumb[] | TBreadcrumb;
  setCurrentParentFolderId: Dispatch<SetStateAction<string | null>>;
  setValue: UseFormSetValue<TMoveItemFormSchema>;
  reset: UseFormReset<TMoveItemFormSchema>;
  item: TItem;
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
      <BreadcrumbList>
        {shouldCollapse && (
          <>
            <BreadcrumbItem>
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center">
                  <Ellipsis className="size-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-auto max-w-96">
                  {hiddenItems.map((hiddenItem) => (
                    <DropdownMenuItem key={hiddenItem.id}>
                      <BreadcrumbLink
                        render={
                          <button
                            type="button"
                            onClick={() => {
                              if (hiddenItem.type === "organization_unit") {
                                setCurrentParentFolderId(null);
                                reset();
                              } else {
                                setCurrentParentFolderId(hiddenItem.id);
                                if (item.parent_item_id === hiddenItem.id) {
                                  reset();
                                } else {
                                  setValue("parent_folder_id", hiddenItem.id);
                                }
                              }
                            }}
                          />
                        }
                        className="truncate"
                      >
                        {hiddenItem.name}
                      </BreadcrumbLink>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </BreadcrumbItem>

            <BreadcrumbSeparator />
          </>
        )}

        {visibleItems.map((visibleItem, index) => {
          const isLast = index === visibleItems.length - 1;

          return (
            <Fragment key={visibleItem.id}>
              <BreadcrumbItem className={`${shouldTruncate && "max-w-40"}`}>
                {isLast ? (
                  <BreadcrumbPage className={`${shouldTruncate && "truncate"}`}>
                    {visibleItem.name}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink
                    render={
                      <button
                        type="button"
                        onClick={() => {
                          if (visibleItem.type === "organization_unit") {
                            setCurrentParentFolderId(null);
                            reset();
                          } else {
                            setCurrentParentFolderId(visibleItem.id);
                            if (item.parent_item_id === visibleItem.id) {
                              reset();
                            } else {
                              setValue("parent_folder_id", visibleItem.id);
                            }
                          }
                        }}
                      />
                    }
                    className="truncate"
                  >
                    {visibleItem.name}
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>

              {!isLast && <BreadcrumbSeparator />}
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
