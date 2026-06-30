
import { useState } from "react";
import { Image as ImageIcon, RefreshCcw, Copy, Check, Trash2 } from "lucide-react";
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

interface ImagesTableProps {
  images: UploadedImage[];
  onRefresh?: () => void;
  onDelete?: (id: string) => void;
  isRefreshing?: boolean;
}

export function ImagesTable({
  images,
  onRefresh,
  onDelete,
  isRefreshing = false,
}: ImagesTableProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = async (id: string, url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedId(id);
      setTimeout(() => setCopiedId((current) => (current === id ? null : current)), 1500);
    } catch {
      // Clipboard API unavailable; fail silently in the UI
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
          onClick={onRefresh}
          disabled={isRefreshing}
          className="gap-1.5 border-violet-700/60 text-violet-300 hover:bg-violet-500/10 hover:text-violet-200"
        >
          <RefreshCcw className={`h-3.5 w-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </CardHeader>

      <CardContent className="p-2">
        <Table>
          <TableHeader>
            <TableRow className="border-slate-800 hover:bg-transparent">
              <TableHead className="text-xs text-slate-500">Preview</TableHead>
              <TableHead className="text-xs text-slate-500">Image Name</TableHead>
              <TableHead className="text-xs text-slate-500">Original URL</TableHead>
              <TableHead className="text-xs text-slate-500">Size</TableHead>
              <TableHead className="text-xs text-slate-500">Uploaded At</TableHead>
              <TableHead className="text-right text-xs text-slate-500">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {images.length === 0 ? (
              <TableRow className="border-slate-800 hover:bg-transparent">
                <TableCell colSpan={6} className="py-10 text-center text-sm text-slate-500">
                  No images uploaded yet. Upload one above to get started.
                </TableCell>
              </TableRow>
            ) : (
              images.map((image) => (
                <TableRow key={image.id} className="border-slate-800 hover:bg-slate-800/30">
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
                  <TableCell>
                    <a
                      href={image.originalUrl}
                      className="text-sm text-cyan-400 hover:text-cyan-300 hover:underline"
                    >
                      {image.originalUrl}
                    </a>
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
                        onClick={() => handleCopy(image.id, image.originalUrl)}
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
                        onClick={() => onDelete?.(image.id)}
                        className="border-slate-700 text-slate-400 hover:bg-red-500/10 hover:text-red-400"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
