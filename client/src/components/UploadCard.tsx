import { useCallback, useRef, useState } from "react";
import { UploadCloud, CloudUpload, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ToastContainer, toast } from "react-toastify";
import { getUserId } from "@/lib/userId";

interface UploadCardProps {
  accept?: string;
  maxSizeMb?: number;
  onUploadSuccess: (url: string) => void;
  uploadedUrl: string;
}

export function UploadCard({
  accept = "image/jpeg,image/png,image/webp,image/avif,image/tiff,image/gif",
  maxSizeMb = 5,
  onUploadSuccess,
  uploadedUrl,
}: UploadCardProps) {
  const [isDragActive, setIsDragActive] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const uploadFile = async (file: File) => {
    // validate size
    if (file.size > maxSizeMb * 1024 * 1024) {
      setError(`File size must be less than ${maxSizeMb}MB`);
      return;
    }

    setError(null);
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("image", file);
      console.log("form daa", formData);
      const response = await fetch("https://imaginghub-api.onrender.com", {
        method: "POST",
        body: formData,
        headers: {
          "X-User-Id": getUserId(),
        },
      });

      const data = await response.json();
      console.log(data);
      toast.success("Upload success!");

      // Image domain change

      let urlSplit = data.split("/")[3];
      console.log(urlSplit);
      let customURL = `https://imaginghub-api.onrender.com/transform/${urlSplit}`;
      onUploadSuccess(customURL);
    } catch (err) {
      toast.error("Upload failed! Try again.");

      setError("Something went wrong. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleFiles = useCallback((files: FileList | null) => {
    const file = files?.[0];
    if (!file) return;
    uploadFile(file);
  }, []);

  const handleDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      setIsDragActive(false);
      handleFiles(event.dataTransfer.files);
    },
    [handleFiles],
  );

  return (
    <Card className="border-slate-800 bg-slate-900/60">
      <ToastContainer />
      <CardHeader className="flex-row items-center gap-3 space-y-0">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-violet-500/15">
          <CloudUpload className="h-4.5 w-4.5 text-violet-400" />
        </div>
        <CardTitle className="text-base font-semibold text-slate-50">
          Upload Your Image
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div
          role="button"
          tabIndex={0}
          onClick={() => !isUploading && inputRef.current?.click()}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              inputRef.current?.click();
            }
          }}
          onDragOver={(event) => {
            event.preventDefault();
            setIsDragActive(true);
          }}
          onDragLeave={() => setIsDragActive(false)}
          onDrop={handleDrop}
          className={cn(
            "flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed px-6 py-14 text-center transition-colors cursor-pointer",
            "border-violet-500/40 bg-slate-950/40 hover:border-violet-500/70",
            isDragActive && "border-violet-400 bg-violet-500/5",
            isUploading && "opacity-50 cursor-not-allowed",
          )}
        >
          {isUploading ? (
            <Loader2 className="h-9 w-9 text-violet-400 animate-spin" />
          ) : (
            <UploadCloud
              className="h-9 w-9 text-violet-400"
              strokeWidth={1.75}
            />
          )}

          <div className="space-y-1">
            <p className="text-sm font-medium text-slate-200">
              {isUploading ? "Uploading..." : "Drag & drop your image here"}
            </p>
            {!isUploading && <p className="text-xs text-slate-500">or</p>}
          </div>

          {!isUploading && (
            <Button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                inputRef.current?.click();
              }}
              className="bg-violet-600 text-white hover:bg-violet-500"
            >
              Choose File
            </Button>
          )}

          <p className="text-xs text-slate-500">
            JPG, JPEG, PNG, WebP, Avif, Tiff up to {maxSizeMb}MB
          </p>

          <input
            ref={inputRef}
            type="file"
            accept={accept}
            className="hidden"
            onChange={(event) => handleFiles(event.target.files)}
          />
        </div>

        {/* error */}
        {error && <p className="text-xs text-red-400 text-center">{error}</p>}

        {/* success */}
        {uploadedUrl && !isUploading && (
          <div className="rounded-lg border border-violet-500/20 bg-slate-950/40 p-3 space-y-2">
            <p className="text-xs text-slate-400">Uploaded URL:</p>
            <p className="text-xs text-violet-400 break-all">{uploadedUrl}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
