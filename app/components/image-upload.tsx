import React, { useEffect, useMemo, useRef, useState } from "react";

type ImageItem = {
  id: string;
  file: File;
  url: string;
};

type Props = {
  label?: string;
  accept?: string;
  multiple?: boolean;
  maxFiles?: number;
  maxSizeMB?: number;
  onChange?: (files: File[]) => void;
};

function uid() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export default function ImageUploader({
  label = "Upload images",
  accept = "image/*",
  multiple = true,
  maxFiles = 100,
  maxSizeMB = 10,
  onChange,
}: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [items, setItems] = useState<ImageItem[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const maxBytes = useMemo(() => maxSizeMB * 1024 * 1024, [maxSizeMB]);

  // Cleanup object URLs
  useEffect(() => {
    return () => {
      for (const it of items) URL.revokeObjectURL(it.url);
    };
  }, [items]);

  useEffect(() => {
    onChange?.(items.map((i) => i.file));
  }, [items, onChange]);

  function pick() {
    inputRef.current?.click();
  }

  function validateAndBuild(newFiles: File[]): ImageItem[] {
    const accepted: ImageItem[] = [];
    const errs: string[] = [];

    for (const file of newFiles) {
      if (!file.type.startsWith("image/")) {
        errs.push(`${file.name}: not an image`);
        continue;
      }
      if (file.size > maxBytes) {
        errs.push(`${file.name}: larger than ${maxSizeMB}MB`);
        continue;
      }
      accepted.push({ id: uid(), file, url: URL.createObjectURL(file) });
    }

    return accepted;
  }

  function addFiles(fileList: FileList | null) {
    if (!fileList) return;

    const incoming = Array.from(fileList);
    const built = validateAndBuild(incoming);

    setItems((prev) => {
      const room = Math.max(0, maxFiles - prev.length);
      const next = [...prev, ...built.slice(0, room)];

      return next;
    });
  }

  function remove(id: string) {
    setItems((prev) => {
      const target = prev.find((p) => p.id === id);
      if (target) URL.revokeObjectURL(target.url);
      return prev.filter((p) => p.id !== id);
    });
  }

  function clearAll() {
    setItems((prev) => {
      for (const it of prev) URL.revokeObjectURL(it.url);
      return [];
    });
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    addFiles(e.dataTransfer.files);
  }

  function onDragOver(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }

  function onDragLeave(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }

  return (
    <div className="w-full px-8">
      <div className="mb-2 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs text-slate-500">
            Ielādējiet bildes - Līdz {maxSizeMB}MB
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={pick}
            className="rounded-xl bg-slate-900 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400"
          >
            Izvēlieties failus
          </button>
          <button
            type="button"
            onClick={clearAll}
            disabled={items.length === 0}
            className="rounded-xl px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-slate-300"
          >
            Notīrīt!
          </button>
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        className="hidden"
        onChange={(e) => {
          addFiles(e.target.files);
          e.currentTarget.value = "";
        }}
      />

      <div
        onClick={pick}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") pick();
        }}
        className={[
          "cursor-pointer rounded-2xl border-2 border-dashed p-5 transition",
          isDragging ? "border-slate-900 bg-slate-50" : "border-slate-200 bg-white hover:bg-slate-50",
          "focus:outline-none focus:ring-2 focus:ring-slate-300",
        ].join(" ")}
      >
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-slate-900"> Novelciet šeit! </p>
            <p className="text-xs text-slate-500">Vai nospiediet, lai izvēlētos! </p>
          </div>
          <div className="text-xs text-slate-500">
            {items.length}/{maxFiles}
          </div>
        </div>

        {items.length > 0 && (
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {items.map((it) => (
              <div key={it.id} className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white">
                <img
                  src={it.url}
                  alt={it.file.name}
                  className="h-28 w-full object-cover"
                  loading="lazy"
                />
                <div className="flex items-center justify-between gap-2 p-2">
                  <p className="min-w-0 truncate text-xs text-slate-700" title={it.file.name}>
                    {it.file.name}
                  </p>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      remove(it.id);
                    }}
                    className="rounded-lg px-2 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-300"
                    aria-label={`Remove ${it.file.name}`}
                  >
                    Remove
                  </button>
                </div>

                <div className="pointer-events-none absolute inset-0 opacity-0 ring-1 ring-inset ring-slate-900/10 transition group-hover:opacity-100" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
