import { GoBackButton } from "@/components/user/auth/go-back-button";
import { Header } from "@/components/user/auth/header";

export default function AboutTeam() {
  return (
    <div className="flex flex-col min-h-svh">
      <Header />
      <div className="flex-1 flex flex-col gap-4 p-4">
        <GoBackButton />
        <p>About Team</p>
      </div>
    </div>
  );
}
