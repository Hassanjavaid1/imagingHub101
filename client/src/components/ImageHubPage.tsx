
import { useState } from "react";
import { ImageHubHeader } from "./ImageHubHeader";
import { ImageHubHero } from "./ImageHubHero";
import { UploadCard } from "./UploadCard";
import { PlaygroundCard } from "./PlaygroundCard";
import { ImagesTable } from "./ImagesTable";
import type { UploadedImage } from "./types";


export default function ImageHubPage() {
  const [images, setImages] = useState<UploadedImage[]>();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState("");


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
          <UploadCard onFileSelected={handleFileSelected} onUploadSuccess={setUploadedUrl} />
          <PlaygroundCard uploadedURL={uploadedUrl}/>
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
