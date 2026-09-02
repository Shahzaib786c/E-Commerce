// Your images backend stores relative paths like "/uploads/products/xyz.jpg"
// This turns them into a full URL the <img> tag can actually load.
const BACKEND_BASE_URL = "http://localhost:5000";

export function getImageUrl(path) {
    if (!path) return "";
    if (path.startsWith("http")) return path; // already a full URL (e.g. old Unsplash links)
    return `${BACKEND_BASE_URL}${path}`;
}