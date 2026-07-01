import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { Category, Project, Settings } from "./types";
import { DEFAULT_CATEGORIES, DEFAULT_SETTINGS, DEFAULT_PROJECTS } from "./mockData";

// Environment Check for Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const isSupabaseEnabled = supabaseUrl !== "" && supabaseAnonKey !== "";

let supabase: SupabaseClient | null = null;
if (isSupabaseEnabled) {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
}

// In-Memory Server Fallback (to support SSR when localStorage is not available)
let globalServerCategories = [...DEFAULT_CATEGORIES];
let globalServerProjects = [...DEFAULT_PROJECTS];
let globalServerSettings = { ...DEFAULT_SETTINGS };

// Helpers for localStorage (Client Side fallback)
const getLocalData = <T>(key: string, defaultValue: T): T => {
  if (typeof window === "undefined") {
    if (key === "nexus_categories") return globalServerCategories as unknown as T;
    if (key === "nexus_projects") return globalServerProjects as unknown as T;
    if (key === "nexus_settings") return globalServerSettings as unknown as T;
    return defaultValue;
  }
  const data = localStorage.getItem(key);
  if (!data) {
    localStorage.setItem(key, JSON.stringify(defaultValue));
    return defaultValue;
  }
  try {
    return JSON.parse(data) as T;
  } catch {
    return defaultValue;
  }
};

const setLocalData = <T>(key: string, value: T): void => {
  if (typeof window === "undefined") {
    if (key === "nexus_categories") globalServerCategories = value as unknown as Category[];
    if (key === "nexus_projects") globalServerProjects = value as unknown as Project[];
    if (key === "nexus_settings") globalServerSettings = value as unknown as Settings;
    return;
  }
  localStorage.setItem(key, JSON.stringify(value));
};

// ==========================================
// Category APIs
// ==========================================

export async function getCategories(): Promise<Category[]> {
  if (isSupabaseEnabled && supabase) {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("sort_order", { ascending: true });
    if (error) throw error;
    return data || [];
  } else {
    const categories = getLocalData<Category[]>("nexus_categories", DEFAULT_CATEGORIES);
    return categories.sort((a, b) => a.sort_order - b.sort_order);
  }
}

export async function saveCategory(categoryData: {
  id?: string;
  name: string;
  slug: string;
  sort_order: number;
}): Promise<Category> {
  if (isSupabaseEnabled && supabase) {
    if (categoryData.id) {
      const { data, error } = await supabase
        .from("categories")
        .update({
          name: categoryData.name,
          slug: categoryData.slug,
          sort_order: categoryData.sort_order,
        })
        .eq("id", categoryData.id)
        .select()
        .single();
      if (error) throw error;
      return data;
    } else {
      const { data, error } = await supabase
        .from("categories")
        .insert({
          name: categoryData.name,
          slug: categoryData.slug,
          sort_order: categoryData.sort_order,
        })
        .select()
        .single();
      if (error) throw error;
      return data;
    }
  } else {
    const categories = getLocalData<Category[]>("nexus_categories", DEFAULT_CATEGORIES);
    if (categoryData.id) {
      const index = categories.findIndex((c) => c.id === categoryData.id);
      if (index !== -1) {
        const updatedCategory: Category = {
          ...categories[index],
          name: categoryData.name,
          slug: categoryData.slug,
          sort_order: categoryData.sort_order,
        };
        categories[index] = updatedCategory;
        setLocalData("nexus_categories", categories);
        return updatedCategory;
      }
      throw new Error("Category not found");
    } else {
      const newCategory: Category = {
        id: `cat-${Date.now()}`,
        name: categoryData.name,
        slug: categoryData.slug,
        sort_order: categoryData.sort_order,
        created_at: new Date().toISOString(),
      };
      categories.push(newCategory);
      setLocalData("nexus_categories", categories);
      return newCategory;
    }
  }
}

export async function deleteCategory(id: string): Promise<void> {
  if (isSupabaseEnabled && supabase) {
    const { error } = await supabase.from("categories").delete().eq("id", id);
    if (error) throw error;
  } else {
    const categories = getLocalData<Category[]>("nexus_categories", DEFAULT_CATEGORIES);
    const updated = categories.filter((c) => c.id !== id);
    setLocalData("nexus_categories", updated);
  }
}

// ==========================================
// Project APIs
// ==========================================

export async function getProjects(options?: {
  categorySlug?: string;
  featuredOnly?: boolean;
  includeUnpublished?: boolean;
}): Promise<Project[]> {
  const { categorySlug, featuredOnly, includeUnpublished } = options || {};

  if (isSupabaseEnabled && supabase) {
    let query = supabase.from("projects").select("*, categories(*)");

    if (featuredOnly) {
      query = query.eq("is_featured", true);
    }
    if (!includeUnpublished) {
      query = query.eq("is_published", true);
    }

    const { data, error } = await query.order("sort_order", { ascending: true });
    if (error) throw error;

    let filtered = data || [];
    if (categorySlug) {
      filtered = filtered.filter((p) => {
        const projWithCat = p as unknown as { categories?: { slug: string } | { slug: string }[] | null };
        if (!projWithCat.categories) return false;
        if (Array.isArray(projWithCat.categories)) {
          return projWithCat.categories.some((c) => c.slug === categorySlug);
        }
        return projWithCat.categories.slug === categorySlug;
      });
    }
    return filtered;
  } else {
    const projects = getLocalData<Project[]>("nexus_projects", DEFAULT_PROJECTS);
    const categories = getLocalData<Category[]>("nexus_categories", DEFAULT_CATEGORIES);

    let result = [...projects];

    if (!includeUnpublished) {
      result = result.filter((p) => p.is_published);
    }
    if (featuredOnly) {
      result = result.filter((p) => p.is_featured);
    }
    if (categorySlug) {
      const category = categories.find((c) => c.slug === categorySlug);
      if (category) {
        result = result.filter((p) => p.category_id === category.id);
      } else {
        result = []; // Unknown category slug
      }
    }

    return result.sort((a, b) => a.sort_order - b.sort_order);
  }
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  if (isSupabaseEnabled && supabase) {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();
    if (error) throw error;
    return data;
  } else {
    const projects = getLocalData<Project[]>("nexus_projects", DEFAULT_PROJECTS);
    return projects.find((p) => p.slug === slug && p.is_published) || null;
  }
}

export async function getProjectById(id: string): Promise<Project | null> {
  if (isSupabaseEnabled && supabase) {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (error) throw error;
    return data;
  } else {
    const projects = getLocalData<Project[]>("nexus_projects", DEFAULT_PROJECTS);
    return projects.find((p) => p.id === id) || null;
  }
}

export async function createProject(
  projectData: Omit<Project, "id" | "created_at" | "updated_at">
): Promise<Project> {
  if (isSupabaseEnabled && supabase) {
    const { data, error } = await supabase
      .from("projects")
      .insert({
        ...projectData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();
    if (error) throw error;
    return data;
  } else {
    const projects = getLocalData<Project[]>("nexus_projects", DEFAULT_PROJECTS);
    const newProject: Project = {
      ...projectData,
      id: `proj-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    projects.push(newProject);
    setLocalData("nexus_projects", projects);
    return newProject;
  }
}

export async function updateProject(id: string, projectData: Partial<Project>): Promise<Project> {
  if (isSupabaseEnabled && supabase) {
    const { data, error } = await supabase
      .from("projects")
      .update({
        ...projectData,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return data;
  } else {
    const projects = getLocalData<Project[]>("nexus_projects", DEFAULT_PROJECTS);
    const index = projects.findIndex((p) => p.id === id);
    if (index === -1) throw new Error("Project not found");

    const updatedProject: Project = {
      ...projects[index],
      ...projectData,
      updated_at: new Date().toISOString(),
    };
    projects[index] = updatedProject;
    setLocalData("nexus_projects", projects);
    return updatedProject;
  }
}

export async function deleteProject(id: string): Promise<void> {
  // PRD: Soft Delete (Sets is_published to false, or removes from UI list but keeps in DB)
  // For safety in MVP mock, we can toggle is_published to false or remove it. Let's do Soft Delete by settings is_published = false, or we can just remove it from local client list to clear space, but we'll mark is_published = false so it's a true "Soft Delete".
  if (isSupabaseEnabled && supabase) {
    const { error } = await supabase
      .from("projects")
      .update({ is_published: false })
      .eq("id", id);
    if (error) throw error;
  } else {
    const projects = getLocalData<Project[]>("nexus_projects", DEFAULT_PROJECTS);
    const index = projects.findIndex((p) => p.id === id);
    if (index !== -1) {
      projects[index].is_published = false;
      setLocalData("nexus_projects", projects);
    }
  }
}

export async function hardDeleteProject(id: string): Promise<void> {
  if (isSupabaseEnabled && supabase) {
    const { error } = await supabase.from("projects").delete().eq("id", id);
    if (error) throw error;
  } else {
    const projects = getLocalData<Project[]>("nexus_projects", DEFAULT_PROJECTS);
    const filtered = projects.filter((p) => p.id !== id);
    setLocalData("nexus_projects", filtered);
  }
}

// ==========================================
// Settings APIs
// ==========================================

export async function getSettings(): Promise<Settings> {
  if (isSupabaseEnabled && supabase) {
    const { data, error } = await supabase
      .from("settings")
      .select("*")
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (error) throw error;
    return data || DEFAULT_SETTINGS;
  } else {
    return getLocalData<Settings>("nexus_settings", DEFAULT_SETTINGS);
  }
}

export async function updateSettings(settingsData: Settings): Promise<Settings> {
  if (isSupabaseEnabled && supabase) {
    const { data, error } = await supabase
      .from("settings")
      .upsert({
        ...settingsData,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();
    if (error) throw error;
    return data;
  } else {
    const updated = {
      ...settingsData,
      updated_at: new Date().toISOString(),
    };
    setLocalData("nexus_settings", updated);
    return updated;
  }
}

// ==========================================
// Media Upload Helper
// ==========================================

export async function uploadMedia(file: File): Promise<string> {
  if (isSupabaseEnabled && supabase) {
    const fileExt = file.name.split(".").pop();
    const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
    const filePath = `uploads/${fileName}`;

    const { error } = await supabase.storage.from("portfolio-media").upload(filePath, file);
    if (error) throw error;

    const { data } = supabase.storage.from("portfolio-media").getPublicUrl(filePath);
    return data.publicUrl;
  } else {
    // Local Demo Mode: Convert file to Base64 so it can be saved persistently in localStorage
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result as string);
      };
      reader.onerror = () => {
        reject(new Error("File upload simulation failed"));
      };
      reader.readAsDataURL(file);
    });
  }
}
