export function ImageHubHero() {
  return (
    <div className="space-y-3 text-center">
      <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
        <span className="bg-gradient-to-r from-violet-400 to-violet-300 bg-clip-text text-transparent">
          Upload Once.
        </span>{" "}
        <span className="bg-gradient-to-r from-sky-300 to-cyan-300 bg-clip-text text-transparent">
          Transform Anywhere.
        </span>
      </h1>
      <p className="mx-auto max-w-xl text-base text-slate-400">
        Upload your images and get a permanent URL. Resize, compress, and
        convert using simple URL parameters.
      </p>
    </div>
  );
}
