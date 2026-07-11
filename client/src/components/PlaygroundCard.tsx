import { useMemo, useState,useEffect } from "react";
import { Code2, Copy, Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { buildTransformUrl, type ImageFormat } from "./types";

interface PlaygroundCardProps {
  initialImageUrl?: string;
  apiDocsHref?: string;
  uploadedURL: string;
}

function useCopyToClipboard() {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copy = async (key: string, value: string) => {
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value);
      setCopiedKey(key);
      setTimeout(
        () => setCopiedKey((current) => (current === key ? null : current)),
        1500,
      );
    } catch {
      // Clipboard API unavailable; fail silently in the UI
    }
  };

  return { copiedKey, copy };
}

export function PlaygroundCard({ uploadedURL }: PlaygroundCardProps) {
  const [imageUrl, setImageUrl] = useState(uploadedURL);
  const [width, setWidth] = useState<number | "">(800);
  const [height, setHeight] = useState<number | "">(600);
  const [quality, setQuality] = useState<number | "">(80);
  const [format, setFormat] = useState<ImageFormat>("webp");

  // Whenever a new upload comes in from the parent, sync it into local state
  useEffect(() => {
    setImageUrl(uploadedURL);
  }, [uploadedURL]);

  const { copiedKey, copy } = useCopyToClipboard();

  const generatedUrl = useMemo(
    () => buildTransformUrl({ imageUrl, width, height, quality, format }),
    [imageUrl, width, height, quality, format],
  );

  const parseNumberInput = (value: string): number | "" =>
    value === "" ? "" : Number(value);

  return (
    <Card className="border-slate-800 bg-slate-900/60">
      <CardHeader className="flex-row items-center gap-3 space-y-0">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-cyan-500/15">
          <Code2 className="h-4.5 w-4.5 text-cyan-400" />
        </div>
        <div>
          <CardTitle className="text-base font-semibold text-slate-50">
            Try it yourself (URL Playground)
          </CardTitle>
          <p className="text-xs text-slate-500">
            Enter the image URL you received and adjust the parameters.
          </p>
        </div>
      </CardHeader>

      <CardContent className="space-y-5">
        {/* Image URL */}
        <div className="space-y-1.5">
          <Label
            htmlFor="image-url"
            className="text-xs font-medium text-slate-300"
          >
            Image URL
          </Label>
          <div className="flex gap-2">
            <Input
              id="image-url"
              value={imageUrl}
              readOnly
              placeholder="URL..."
              className="border-slate-700 bg-slate-950/60 text-sm text-slate-200 placeholder:text-slate-600"
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => copy("imageUrl", imageUrl)}
              className="shrink-0 gap-1.5 border-cyan-700/60 text-cyan-400 hover:bg-cyan-500/10 hover:text-cyan-300"
            >
              {copiedKey === "imageUrl" ? (
                <Check className="h-3.5 w-3.5" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
              Copy
            </Button>
          </div>
        </div>

        {/* Parameter grid */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="space-y-1.5">
            <Label
              htmlFor="width"
              className="text-xs font-medium text-slate-300"
            >
              Width (w)
            </Label>
            <div className="relative">
              <Input
                id="width"
                type="number"
                value={width}
                onChange={(event) =>
                  setWidth(parseNumberInput(event.target.value))
                }
                className="border-slate-700 bg-slate-950/60 pr-9 text-sm text-slate-200"
              />
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500">
                px
              </span>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label
              htmlFor="height"
              className="text-xs font-medium text-slate-300"
            >
              Height (h)
            </Label>
            <div className="relative">
              <Input
                id="height"
                type="number"
                value={height}
                onChange={(event) =>
                  setHeight(parseNumberInput(event.target.value))
                }
                className="border-slate-700 bg-slate-950/60 pr-9 text-sm text-slate-200"
              />
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500">
                px
              </span>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label
              htmlFor="quality"
              className="text-xs font-medium text-slate-300"
            >
              Quality (q)
            </Label>
            <div className="relative">
              <Input
                id="quality"
                type="number"
                min={1}
                max={100}
                value={quality}
                onChange={(event) =>
                  setQuality(parseNumberInput(event.target.value))
                }
                className="border-slate-700 bg-slate-950/60 pr-7 text-sm text-slate-200"
              />
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500">
                %
              </span>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label
              htmlFor="format"
              className="text-xs font-medium text-slate-300"
            >
              Format (f)
            </Label>
            <Select
              value={format}
              onValueChange={(value: string) => setFormat(value as ImageFormat)}
            >
              <SelectTrigger
                id="format"
                className="border-slate-700 bg-slate-950/60 text-sm text-slate-200"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-950/60 text-slate-200">
                <SelectItem value="webp" >webp</SelectItem>
                <SelectItem value="jpeg">jpeg</SelectItem>
                <SelectItem value="png">png</SelectItem>
                <SelectItem value="avif">avif</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Generated URL */}
        <div className="space-y-1.5">
          <Label
            htmlFor="generated-url"
            className="text-xs font-medium text-slate-300"
          >
            Generated URL
          </Label>
          <div className="flex gap-2">
            <Input
              id="generated-url"
              readOnly
              value={generatedUrl}
              className="border-slate-700 bg-slate-950/60 text-sm text-slate-300"
            />
            <Button
              type="button"
              onClick={() => copy("generatedUrl", generatedUrl)}
              className="shrink-0 gap-1.5 bg-cyan-500 text-slate-950 hover:bg-cyan-400"
            >
              {copiedKey === "generatedUrl" ? (
                <Check className="h-3.5 w-3.5" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
              Copy
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-between pt-1">
          <p className="text-xs text-slate-500">
            Add parameters to the URL to resize, compress or convert your image
            on the fly.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
