import React from "react";

export function SkipToContent() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2 focus:bg-[#171717] focus:text-[#FAF8F5] focus:text-xs focus:font-semibold focus:rounded focus:outline-none focus:ring-2 focus:ring-[#B58A52] shadow-lg transition-transform"
    >
      Skip to main content
    </a>
  );
}
