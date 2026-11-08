import React from "react";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { getBreadcrumbSchema } from "@/lib/seo";

export function Breadcrumbs({ items }) {
  if (!items || items.length === 0) return null;

  const fullBreadcrumbs = [{ label: "Home", href: "/" }, ...items];
  const schema = getBreadcrumbSchema(fullBreadcrumbs);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <nav aria-label="Breadcrumb" className="py-3">
        <ol className="flex flex-wrap items-center gap-1.5 text-xs text-[#71717A]">
          <li>
            <Link
              href="/"
              className="flex items-center gap-1 hover:text-[#171717] transition-colors focus:outline-none focus:ring-1 focus:ring-[#B58A52] rounded"
            >
              <Home className="w-3.5 h-3.5" aria-hidden="true" />
              <span className="sr-only">Home</span>
            </Link>
          </li>
          {items.map((item, idx) => {
            const isLast = idx === items.length - 1;
            return (
              <li key={item.href || idx} className="flex items-center gap-1.5">
                <ChevronRight className="w-3 h-3 text-[#A1A1AA]" aria-hidden="true" />
                {isLast ? (
                  <span
                    aria-current="page"
                    className="font-medium text-[#171717] truncate max-w-[240px]"
                  >
                    {item.label}
                  </span>
                ) : (
                  <Link
                    href={item.href}
                    className="hover:text-[#171717] transition-colors focus:outline-none focus:ring-1 focus:ring-[#B58A52] rounded"
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
