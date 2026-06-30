export interface UploadedImage {
  id: string;
  name: string;
  previewUrl: string;
  originalUrl: string;
  sizeBytes: number;
  uploadedAt: string; // ISO date string
}

export type ImageFormat = "webp" | "jpeg" | "png" | "avif";

export interface TransformParams {
  imageUrl: string;
  width: number | "";
  height: number | "";
  quality: number | "";
  format: ImageFormat;
}

export function formatBytes(bytes: number): string {
  if (bytes <= 0) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const exponent = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    units.length - 1
  );
  const value = bytes / Math.pow(1024, exponent);
  return `${exponent === 0 ? value : value.toFixed(2)} ${units[exponent]}`;
}

export function formatDate(iso: string): string {
  const date = new Date(iso);
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function buildTransformUrl(params: TransformParams): string {
  if (!params.imageUrl) return "";
  try {
    const url = new URL(params.imageUrl);
    if (params.width !== "") url.searchParams.set("w", String(params.width));
    if (params.height !== "") url.searchParams.set("h", String(params.height));
    if (params.quality !== "") url.searchParams.set("q", String(params.quality));
    if (params.format) url.searchParams.set("f", params.format);
    return url.toString();
  } catch {
    // Fall back to naive concatenation if imageUrl isn't a full valid URL yet
    const query = new URLSearchParams();
    if (params.width !== "") query.set("w", String(params.width));
    if (params.height !== "") query.set("h", String(params.height));
    if (params.quality !== "") query.set("q", String(params.quality));
    if (params.format) query.set("f", params.format);
    const queryString = query.toString();
    return queryString ? `${params.imageUrl}?${queryString}` : params.imageUrl;
  }
}