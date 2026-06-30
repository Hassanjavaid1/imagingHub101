
import { useState } from "react";
import { ImageHubHeader } from "./ImageHubHeader";
import { ImageHubHero } from "./ImageHubHero";
import { UploadCard } from "./UploadCard";
import { PlaygroundCard } from "./PlaygroundCard";
import { ImagesTable } from "./ImagesTable";
import type { UploadedImage } from "./types";

const MOCK_IMAGES: UploadedImage[] = [
  {
    id: "1",
    name: "mountains.jpg",
    previewUrl:
      "https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?w=100&h=100&fit=crop",
    originalUrl: "https://imgapi.vercel.app/images/abc123.jpg",
    sizeBytes: 1_300_000,
    uploadedAt: "2024-06-11T14:45:00",
  },
  {
    id: "2",
    name: "beach.png",
    previewUrl:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=100&h=100&fit=crop",
    originalUrl: "https://imgapi.vercel.app/images/def456.png",
    sizeBytes: 2_130_000,
    uploadedAt: "2024-06-11T14:32:00",
  },
  {
    id: "3",
    name: "flower.webp",
    previewUrl:
      "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=100&h=100&fit=crop",
    originalUrl: "https://imgapi.vercel.app/images/ghi789.webp",
    sizeBytes: 972_800,
    uploadedAt: "2024-06-11T14:10:00",
  },
];

export default function ImageHubPage() {
  const [images, setImages] = useState<UploadedImage[]>(MOCK_IMAGES);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleFileSelected = (file: File) => {
    // Wire this up to your actual upload endpoint (e.g. POST /api/upload).
    console.log("Selected file:", file.name);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Replace with a real fetch of the latest image list.
    await new Promise((resolve) => setTimeout(resolve, 600));
    setIsRefreshing(false);
  };

  const handleDelete = (id: string) => {
    setImages((current) => current.filter((image) => image.id !== id));
  };

  return (
    <div className="min-h-screen bg-slate-950 px-6 py-10">
      <div className="mx-auto max-w-7xl space-y-10">
        <ImageHubHeader />
        <ImageHubHero />

        <div className="grid gap-6 lg:grid-cols-2">
          <UploadCard onFileSelected={handleFileSelected} />
          <PlaygroundCard />
        </div>

        <ImagesTable
          images={images}
          onRefresh={handleRefresh}
          onDelete={handleDelete}
          isRefreshing={isRefreshing}
        />
      </div>
    </div>
  );
}
