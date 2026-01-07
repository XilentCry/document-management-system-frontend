import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { STATUSES } from "@/constant";
import { useUpdateStatus } from "@/services/users/mutations";
import { TOrganizationUnit } from "@/types/organization-unit";
import { TUser } from "@/types/user";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function ViewUser({
  user,
}: {
  user: TUser & {
    organizationUnits: Pick<TOrganizationUnit, "id" | "name">[];
  };
}) {
  const [status, setStatus] = useState(user.status);
  const router = useRouter();

  const { mutateAsync: updateStatusMutation, isPending } =
    useUpdateStatus(setStatus);

  const handleApprove = async () => {
    const statusId =
      user.status === "Approved" ? STATUSES.PENDING : STATUSES.APPROVED;

    await updateStatusMutation({ userId: user.id, statusId });
  };

  return (
    <div className="flex-1 flex flex-col gap-4">
      <div className="grid grid-cols-2 text-sm">
        <div className="flex gap-4">
          <div className="flex flex-col gap-2">
            <p className="font-medium">Name</p>
            <p className="font-medium">Email</p>
            <p className="font-medium">Role</p>
            <p className="font-medium">Status</p>
            <p className="font-medium">Created</p>
            <p className="font-medium">Updated</p>
          </div>
          <div className="flex flex-col gap-2">
            <p>
              {user.first_name} {user.middle_name} {user.last_name}
            </p>
            <p>{user.email}</p>
            <p>{user.role}</p>
            <p>{user.status}</p>
            <p>{new Date(user.created_at).toLocaleString()}</p>
            <p>{new Date(user.updated_at).toLocaleString()}</p>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <p className="font-medium">Offices/Units</p>
          <div>
            {user.organizationUnits.map((organizationUnit) => (
              <p key={organizationUnit.id}>{organizationUnit.name}</p>
            ))}
          </div>
        </div>
      </div>
      <ButtonGroup>
        <Button
          variant="outline"
          onClick={() => router.push(`/admin/user-management/edit/${user.id}`)}
        >
          Edit
        </Button>
        <Button variant="outline" onClick={handleApprove}>
          {isPending
            ? "Processing..."
            : status === "Approved"
            ? "Unapprove"
            : "Approve"}
        </Button>
      </ButtonGroup>
    </div>
  );
}
