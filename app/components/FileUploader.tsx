import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { formatSize } from "../lib/utils";
import { cn } from "~/lib/utils";

interface FileUploaderProps {
  onFileSelect?: (file: File | null) => void;
  selectedFile?: File | null;
}

const FileUploader = ({
  onFileSelect,
  selectedFile = null,
}: FileUploaderProps) => {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0] || null;
      onFileSelect?.(file);
    },
    [onFileSelect]
  );

  const maxFileSize = 20 * 1024 * 1024;

  const { getRootProps, getInputProps, isDragActive, fileRejections } =
    useDropzone({
      onDrop,
      multiple: false,
      accept: { "application/pdf": [".pdf"] },
      maxSize: maxFileSize,
    });

  const rejectionMessage = fileRejections[0]?.errors[0]?.message;

  return (
    <div
      {...getRootProps()}
      className={cn(
        "surface-card cursor-pointer p-5 md:p-6",
        isDragActive && "border-[color:var(--accent)] bg-[rgba(201,100,66,0.1)]"
      )}
    >
      <input {...getInputProps()} />

      {selectedFile ? (
        <div
          className="flex flex-col gap-4 rounded-[1.4rem] border border-[color:var(--border)] bg-[var(--surface-soft)] p-4 md:flex-row md:items-center md:justify-between"
          onClick={(event) => event.stopPropagation()}
        >
          <div className="flex items-center gap-4">
            <div className="flex size-14 items-center justify-center rounded-2xl bg-[rgba(201,100,66,0.14)] text-sm font-semibold tracking-[0.22em] text-[#edaf9a]">
              PDF
            </div>
            <div>
              <p className="max-w-xs truncate text-base font-semibold text-[var(--text-primary)]">
                {selectedFile.name}
              </p>
              <p className="mt-1 text-sm text-[var(--text-secondary)]">
                {formatSize(selectedFile.size)}
              </p>
            </div>
          </div>

          <button
            type="button"
            className="button-secondary"
            onClick={(event) => {
              event.stopPropagation();
              onFileSelect?.(null);
            }}
          >
            Remove file
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="flex size-18 items-center justify-center rounded-[1.5rem] border border-[color:var(--border)] bg-[var(--surface-soft)] text-[var(--text-primary)]">
            <svg viewBox="0 0 24 24" className="size-7 fill-current">
              <path d="M11.25 3a.75.75 0 0 1 1.5 0v9.19l2.47-2.47a.75.75 0 1 1 1.06 1.06l-3.75 3.75a.75.75 0 0 1-1.06 0l-3.75-3.75a.75.75 0 0 1 1.06-1.06l2.47 2.47V3Z" />
              <path d="M4.5 15.75A2.25 2.25 0 0 1 6.75 13.5h1.5a.75.75 0 0 1 0 1.5h-1.5A.75.75 0 0 0 6 15.75v1.5c0 .414.336.75.75.75h10.5a.75.75 0 0 0 .75-.75v-1.5a.75.75 0 0 0-.75-.75h-1.5a.75.75 0 0 1 0-1.5h1.5a2.25 2.25 0 0 1 2.25 2.25v1.5A2.25 2.25 0 0 1 17.25 19.5H6.75a2.25 2.25 0 0 1-2.25-2.25v-1.5Z" />
            </svg>
          </div>

          <div className="space-y-2">
            <p className="text-lg font-semibold text-[var(--text-primary)]">
              Drop your resume here or click to browse
            </p>
            <p className="mx-auto max-w-lg text-sm leading-6 text-[var(--text-secondary)]">
              PDF files only, up to {formatSize(maxFileSize)}. We convert the
              uploaded document into a preview image before sending it to the
              AI review flow.
            </p>
          </div>

          <div className="status-chip">Ready for ATS analysis</div>
        </div>
      )}

      {rejectionMessage && (
        <p className="mt-4 text-sm text-[#ebadad]">{rejectionMessage}</p>
      )}
    </div>
  );
};

export default FileUploader;
