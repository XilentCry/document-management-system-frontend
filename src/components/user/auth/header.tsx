"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function Header() {
  const pathname = usePathname();

  return <header className="h-14 border-b flex items-center justify-between px-4">
    <div className="flex items-center gap-2">
      <Image src="/norsu.png" alt="NORSU" width={32} height={32} />
      <div>
        <div className="flex flex-col">
          <span className="font-medium">Document Management System</span>
          <span className="text-xs">Negros Oriental State University</span>
        </div>
      </div>
    </div>
    <div className="flex items-center">
      <Button variant="ghost" render={pathname === "/register" ? <Link href="/register" /> : <Link href="/" />} nativeButton={false}>
        {pathname === "/register" ? "Register" : "Login"}
      </Button>
      <Button variant="ghost" render={<Link href="/about-team" />} nativeButton={false}>
        About Team
      </Button>
    </div>
  </header >
}