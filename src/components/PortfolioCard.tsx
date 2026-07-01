"use client";

import Link from "next/link";
import { Project } from "@/lib/types";
import { useEffect, useState } from "react";
import { getCategories } from "@/lib/db";

interface PortfolioCardProps {
  project: Project;
}

export default function PortfolioCard({ project }: PortfolioCardProps) {
  const [categoryName, setCategoryName] = useState("");

  useEffect(() => {
    async function loadCategory() {
      try {
        const categories = await getCategories();
        const cat = categories.find((c) => c.id === project.category_id);
        if (cat) {
          setCategoryName(cat.name);
        }
      } catch (err) {
        console.error("Failed to load category on card:", err);
      }
    }
    loadCategory();
  }, [project.category_id]);

  return (
    <Link href={`/works/${project.slug}`} className="group relative block w-full aspect-[4/3] overflow-hidden bg-neutral-900">
      {/* Thumbnail Image */}
      {project.thumbnail_url ? (
        <img
          src={project.thumbnail_url}
          alt={project.title}
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          loading="lazy"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-between bg-neutral-800 p-8 text-neutral-500">
          No Thumbnail Image
        </div>
      )}

      {/* Hover Overlay - univ.me style */}
      <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out flex flex-col justify-between p-6 sm:p-8">
        {/* Top Info (Category / Year) */}
        <div className="flex justify-between items-center transform -translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-out">
          <span className="text-[10px] font-bold tracking-widest text-accent uppercase">
            {categoryName || "PROJECT"}
          </span>
          <span className="text-[10px] font-bold tracking-widest text-neutral-400">
            {project.year}
          </span>
        </div>

        {/* Bottom Info (Client / Title) */}
        <div className="transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-out delay-75">
          <p className="text-[11px] font-bold tracking-widest text-neutral-400 uppercase mb-1">
            {project.client_name}
          </p>
          <h3 className="text-lg sm:text-xl font-extrabold tracking-tight text-white leading-tight">
            {project.title}
          </h3>
          {project.role && (
            <p className="text-[10px] font-medium tracking-wide text-neutral-500 mt-2 font-mono">
              {project.role}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}
