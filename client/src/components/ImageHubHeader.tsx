import { CloudUpload } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function ImageHubHeader() {
  return (
    <header className="flex items-center justify-between">
      <div className="flex items-center gap-2.5">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-indigo-500">
          <CloudUpload className="h-5 w-5 text-white" strokeWidth={2.25} />
        </div>
        <span className="text-xl font-semibold tracking-tight text-slate-50">
          ImageHub
        </span>
      </div>

      <Badge
        variant="secondary"
        className="gap-2 rounded-full border border-slate-700/60 bg-slate-900/80 px-3.5 py-1.5 text-xs font-normal text-slate-300 hover:bg-slate-900/80"
      >
        Powered by Node.js + AWS S3 + Sharp
        <span className="h-2 w-2 rounded-full bg-emerald-400" />
      </Badge>
    </header>
  );
}
