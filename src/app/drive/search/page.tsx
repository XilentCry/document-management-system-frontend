"use client";

import { Search } from "@/components/user/search/search";
import { Suspense } from "react";

export default function SearchPage() {
  return (
    <Suspense>
      <Search />
    </Suspense>
  );
}
