import { useEffect, useState, useCallback } from "react";
import {
  Image as ImageIcon,
  RefreshCcw,
  Copy,
  Check,
  Trash2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatBytes, formatDate, type UploadedImage } from "./types";
import { getUserId } from "@/lib/userId";

const API_BASE_URL = "https://imaginghub-api.onrender.com";

// Exact shape returned by your backend: SELECT id, url, name, size, uploaded_at FROM media
interface MediaRow {
  id: string;
  url: string;
  name: string;
  size: number;
  uploaded_at: string;
}

function mapToUploadedImage(row: MediaRow): UploadedImage {
  return {
    id: row.id,
    name: row.name,
    previewUrl: row.url,
    originalUrl: row.url,
    sizeBytes: row.size,
    uploadedAt: row.uploaded_at,
  };
}

export function ImagesTable() {
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const loadImages = useCallback(async (isManualRefresh = false) => {
    isManualRefresh ? setIsRefreshing(true) : setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_BASE_URL}`, {
        method: "GET",
        headers: {
          "X-User-Id": getUserId(),
        },
      });

      if (!res) {
        throw new Error(`Failed to load images: ${res}`);
      }

      const rows: MediaRow[] = await res.json();
      setImages(rows.map(mapToUploadedImage));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadImages();
  }, [loadImages]);

  const handleCopy = async (id: string, url: string) => {
    try {
      let baseURL: string = `${API_BASE_URL}/transform/${url}`;

      await navigator.clipboard.writeText(baseURL);
      setCopiedId(id);
      setTimeout(
        () => setCopiedId((current) => (current === id ? null : current)),
        1500,
      );
    } catch {
      // Clipboard API unavailable; fail silently in the UI
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/delete/?id=${id}`, {
        method: "DELETE",
      });

      console.log(res);
      console.log(res.status);

      if (res.status == 200) {
        setImages((current) => current.filter((img) => img.id !== id));
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Card className="border-slate-800 bg-slate-900/60">
      <CardHeader className="flex items-center justify-between space-y-0">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-violet-500/15">
            <ImageIcon className="h-4.5 w-4.5 text-violet-400" />
          </div>
          <div>
            <CardTitle className="text-base font-semibold text-slate-50">
              Your Images
            </CardTitle>
            <p className="text-xs text-slate-500">
              All your uploaded images and their original URLs.
            </p>
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={() => loadImages(true)}
          disabled={isRefreshing}
          className="gap-1.5 border-violet-700/60 text-violet-300 hover:bg-violet-500/10 hover:text-violet-200"
        >
          <RefreshCcw
            className={`h-3.5 w-3.5 ${isRefreshing ? "animate-spin" : ""}`}
          />
          Refresh
        </Button>
      </CardHeader>

      <CardContent className="p-2">
        {error && (
          <p className="px-2 pb-2 text-sm text-red-400">
            Couldn't load images: {error}
          </p>
        )}

        <Table>
          <TableHeader>
            <TableRow className="border-slate-800 hover:bg-transparent">
              <TableHead className="text-xs text-slate-500">Preview</TableHead>
              <TableHead className="text-xs text-slate-500">
                Image Name
              </TableHead>
              <TableHead className="text-xs text-slate-500">Size</TableHead>
              <TableHead className="text-xs text-slate-500">
                Uploaded At
              </TableHead>
              <TableHead className="text-right text-xs text-slate-500">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading ? (
              <TableRow className="border-slate-800 hover:bg-transparent">
                <TableCell
                  colSpan={6}
                  className="py-10 text-center text-sm text-slate-500"
                >
                  Loading your images…
                </TableCell>
              </TableRow>
            ) : images.length === 0 ? (
              <TableRow className="border-slate-800 hover:bg-transparent">
                <TableCell
                  colSpan={6}
                  className="py-10 text-center text-sm text-slate-500"
                >
                  No images uploaded yet. Upload one above to get started.
                </TableCell>
              </TableRow>
            ) : (
              [...images].reverse().map((image) => (
                <>
                  <TableRow
                    key={image.id}
                    className="border-slate-800 hover:bg-slate-800/30"
                  >
                    <TableCell>
                      <img
                        src={image.previewUrl}
                        alt={image.name}
                        className="h-12 w-12 rounded-md object-cover"
                      />
                    </TableCell>
                    <TableCell className="text-sm font-medium text-slate-200">
                      {image.name}
                    </TableCell>
                    <TableCell className="text-sm text-slate-400">
                      {formatBytes(image.sizeBytes)}
                    </TableCell>
                    <TableCell className="text-sm text-slate-400">
                      {formatDate(image.uploadedAt)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => handleCopy(image.id, image.name)}
                          className="gap-1.5 border-violet-700/60 text-violet-300 hover:bg-violet-500/10 hover:text-violet-200"
                        >
                          {copiedId === image.id ? (
                            <Check className="h-3.5 w-3.5" />
                          ) : (
                            <Copy className="h-3.5 w-3.5" />
                          )}
                          Copy URL
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => handleDelete(image.id)}
                          className="border-slate-700 text-slate-400 hover:bg-red-500/10 hover:text-red-400"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                </>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
