import { useState } from "react";
import { ImageHubHeader } from "./ImageHubHeader";
import { ImageHubHero } from "./ImageHubHero";
import { UploadCard } from "./UploadCard";
import { PlaygroundCard } from "./PlaygroundCard";
import { ImagesTable } from "./ImagesTable";

export default function ImageHubPage() {
  const [uploadedUrl, setUploadedUrl] = useState("");

  return (
    <div className="min-h-screen bg-slate-950 px-6 py-10">
      <div className="mx-auto max-w-7xl space-y-10">
        <ImageHubHeader />
        <ImageHubHero />

        <div className="grid gap-6 lg:grid-cols-2">
          <UploadCard
            onUploadSuccess={setUploadedUrl}
           // uploadedUrl={uploadedUrl}
          />
          <PlaygroundCard uploadedURL={uploadedUrl} />
        </div>

        <ImagesTable />
      </div>
    </div>
  );
}
