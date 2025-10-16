// app/preview/page.tsx
import { Suspense } from "react";
import { PreviewClient } from "./PreviewClient";
import { FormSkeleton } from "@/components/form-skeleton";

// ✅ This is a Server Component — no "use client"
export default function PreviewPage({
  searchParams,
}: {
  searchParams: { from?: string };
}) {
  return (
    <Suspense fallback={<FormSkeleton />}>
      <PreviewClient from={searchParams.from || "personal-info"} />
    </Suspense>
  );
}