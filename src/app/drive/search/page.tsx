"use client";

import { Search } from "@/features/search/components/search";
import { Suspense } from "react";

export default function SearchPage() {
  return (
    <Suspense>
      <Search />
    </Suspense>
  );
}
