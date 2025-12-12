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
      {/* ✅ Wrapper to prevent horizontal scrolling */}
      <div className="overflow-x-hidden">
        <PreviewClient from={searchParams.from || "personal-info"} />
      </div>
    </Suspense>
  );
}