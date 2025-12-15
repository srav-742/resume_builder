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
      {/* ✅ Wrapper to FULLY prevent horizontal scrolling */}
      <div className="w-full max-w-full overflow-x-hidden">
        <PreviewClient from={searchParams.from || "personal-info"} />
      </div>
    </Suspense>
  );
}
