"use client";

import { useNotificationStore } from "@/lib/prisma/useNotificationStore";
import { useEffect, useState } from "react";

export function Toast() {
  const { message, type, isVisible, hideNotification } = useNotificationStore();
  const [render, setRender] = useState(false);

  useEffect(() => {
    if (isVisible) setRender(true);
  }, [isVisible]);

  if (!render) return null;

  const bgColors = {
    success: "bg-emerald-50 border-emerald-200 text-emerald-800",
    error: "bg-red-50 border-red-200 text-red-800",
    info: "bg-blue-50 border-blue-200 text-blue-800",
  };

  const icons = {
    success: (
      <svg className="size-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    ),
    error: (
      <svg className="size-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    ),
    info: (
      <svg className="size-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  };

  return (
    <div
      onAnimationEnd={() => !isVisible && setRender(false)}
      className={`fixed bottom-5 right-5 z-50 flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg transition-all duration-300 transform ${
        isVisible ? "animate-in fade-in slide-in-from-bottom-5" : "animate-out fade-out slide-out-to-bottom-5 opacity-0"
      } ${bgColors[type]}`}
    >
      <span className="shrink-0">{icons[type]}</span>
      <p className="text-sm font-medium">{message}</p>
      <button
        onClick={hideNotification}
        className="ml-2 shrink-0 rounded-md p-1 hover:bg-black/5 transition-colors"
      >
        <svg className="size-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}