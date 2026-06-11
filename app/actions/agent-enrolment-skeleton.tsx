// components/agent/agent-enrolment-skeleton.tsx
import React from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function AgentEnrolmentSkeleton() {
  return (
    <Card className="max-w-4xl mx-auto border-slate-200 shadow-xl overflow-hidden">
      {/* Header Skeleton */}
      <CardHeader className="bg-blue-950 p-8">
        <div className="flex items-center gap-3">
          <Skeleton className="size-12 rounded-full bg-blue-900" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-64 bg-blue-900" />
            <Skeleton className="h-4 w-96 bg-blue-900/50" />
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-8 space-y-8">
        {/* Section 1: Identity */}
        <div className="space-y-4">
          <Skeleton className="h-4 w-32 mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-3 w-12" />
                <Skeleton className="h-10 w-full rounded-md" />
              </div>
            ))}
          </div>
        </div>

        {/* Section 2: Contacts & Dates */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <Skeleton className="h-4 w-32 mb-6" />
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-10 w-full rounded-md" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-10 w-full rounded-md" />
              </div>
            </div>
            <div className="space-y-2">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-10 w-full rounded-md" />
            </div>
          </div>

          <div className="space-y-4">
            <Skeleton className="h-4 w-32 mb-6" />
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-10 w-full rounded-md" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-10 w-full rounded-md" />
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Checklist */}
        <div className="space-y-4">
          <Skeleton className="h-4 w-48 mb-6" />
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-12 w-full rounded-lg" />
            ))}
          </div>
        </div>

        {/* Section 4: Photo & Observations */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
           <div className="space-y-2">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-32 w-full rounded-xl" />
           </div>
           <div className="space-y-2">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-32 w-full rounded-xl" />
           </div>
        </div>

        {/* Footer Actions */}
        <div className="flex justify-end gap-4 pt-6 border-t">
          <Skeleton className="h-10 w-24 rounded-md" />
          <Skeleton className="h-10 w-40 rounded-xl" />
        </div>
      </CardContent>
    </Card>
  );
}
