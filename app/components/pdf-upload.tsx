import React, { useMemo, useRef, useState } from "react";

type Props = {
  label?: string;
  maxSizeMB?: number; // per file
  onChange?: (file: File | null) => void;
};

export default function PdfUploader({
  label = "Upload PDF",
  maxSizeMB = 25,
  onChange,
}: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const maxBytes = useMemo(() => maxSizeMB * 1024 * 1024, [maxSizeMB]);

  const previewUrl = useMemo(() => {
    if (!file) return null;
    return URL.createObjectURL(file);
  }, [file]);

  function pick() {
    inputRef.current?.click();
  }

  function clear() {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setFile(null);
    setError(null);
    onChange?.(null);
  }

  function validateAndSet(f: File | null) {
    if (!f) return;

    if (f.type !== "application/pdf" && !f.name.toLowerCase().endsWith(".pdf")) {
      setError("Please choose a PDF file.");
      return;
    }
    if (f.size > maxBytes) {
      setError(`PDF is larger than ${maxSizeMB}MB.`);
      return;
    }

    setError(null);
    setFile(f);
    onChange?.(f);
  }

  return (
    <div className="w-96 my-4 mx-2">
      <div className="mb-2 flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-900">Ielādēt uzdevumu PDF</p>
          <p className="text-xs text-slate-500">Viens fails - Līdz {maxSizeMB}MB</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={pick}
            className="rounded-xl bg-slate-900 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400"
          >
            Izvēlieties PDF
          </button>
          <button
            type="button"
            onClick={clear}
            disabled={!file}
            className="rounded-xl px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-slate-300"
          >
            Notīrīt
          </button>
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="application/pdf,.pdf"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0] ?? null;
          validateAndSet(f);
          // allow selecting the same file again
          e.currentTarget.value = "";
        }}
      />

      <div
        onClick={pick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") pick();
        }}
        className="cursor-pointer rounded-2xl border-2 border-dashed border-slate-200 bg-white p-5 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-300"
      >
        {!file ? (
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-slate-900">Izvēlieties PDF</p>
              <p className="text-xs text-slate-500">Viens fails atļauts</p>
            </div>
            <span className="text-xs text-slate-500">.pdf</span>
          </div>
        ) : (
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-slate-900" title={file.name}>
                {file.name}
              </p>
              <p className="text-xs text-slate-500">
                {(file.size / (1024 * 1024)).toFixed(2)} MB
              </p>
            </div>

            <div className="flex items-center gap-2">
              <a
                href={previewUrl ?? "#"}
                target="_blank"
                rel="noreferrer"
                onClick={(e) => {
                  if (!previewUrl) e.preventDefault();
                }}
                className="rounded-xl bg-slate-900 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400"
              >
                Open
              </a>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  clear();
                }}
                className="rounded-xl px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-300"
              >
                Remove
              </button>
            </div>
          </div>
        )}

        {error && (
          <div className="mt-3 rounded-xl bg-amber-50 px-3 py-2 text-xs text-amber-900">
            {error}
          </div>
        )}

        {file && previewUrl && (
          <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <object data={previewUrl} type="application/pdf" className="h-[520px] w-full">
              <div className="p-4 text-sm text-slate-700">
                Preview not available in this browser.{" "}
                <a
                  className="font-medium underline"
                  href={previewUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  Open the PDF
                </a>
                .
              </div>
            </object>
          </div>
        )}
      </div>
    </div>
  );
}
