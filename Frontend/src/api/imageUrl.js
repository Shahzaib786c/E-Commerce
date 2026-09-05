const BACKEND_BASE_URL = "http://localhost:5000";

export function getImageUrl(path) {
    if (!path) return "";
    if (path.startsWith("http")) return path; 
    return `${BACKEND_BASE_URL}${path}`;
}