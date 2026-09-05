const BACKEND_BASE_URL =
  import.meta.env.VITE_API_URL?.replace(/\/api\/?$/, "") || "";

export function getImageUrl(path) {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `${BACKEND_BASE_URL}${path}`;
}
