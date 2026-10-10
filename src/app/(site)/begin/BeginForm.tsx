"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import { ATTACHMENT_ACCEPT, validateAttachments } from "@/lib/commission";

const PendingContext = createContext(false);
const DELIVERY_ERROR = "Couldn't deliver right now. Please try again or email info@huamei.io.";

export function BeginForm({ children }: { children: ReactNode }) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inFlight = useRef(false);
  const errorRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (error) errorRef.current?.focus();
  }, [error]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (inFlight.current) return;

    const formData = new FormData(event.currentTarget);
    const files = formData.getAll("attachments").filter(
      (value): value is File => value instanceof File && (value.size > 0 || value.name.length > 0),
    );
    const attachmentError = validateAttachments(files);
    if (attachmentError) {
      setError(attachmentError);
      return;
    }

    setError(null);
    inFlight.current = true;
    setPending(true);
    try {
      const response = await fetch("/api/commission", {
        method: "POST",
        headers: { Accept: "application/json" },
        body: formData,
        signal: AbortSignal.timeout(30_000),
      });
      const result = await response.json().catch(() => null);
      if (!response.ok || result?.ok !== true) {
        setError(
          typeof result?.error === "string" ? result.error : DELIVERY_ERROR,
        );
        return;
      }
      window.location.assign("/begin/sent");
    } catch {
      setError(DELIVERY_ERROR);
    } finally {
      inFlight.current = false;
      setPending(false);
    }
  }

  return (
    <PendingContext.Provider value={pending}>
      <form
        className="bg-form"
        method="post"
        action="/api/commission"
        autoComplete="off"
        encType="multipart/form-data"
        aria-busy={pending}
        onSubmit={submit}
      >
        {children}
        {pending && <p role="status">Sending your project…</p>}
        {error && (
          <p
            ref={errorRef}
            tabIndex={-1}
            role="alert"
            style={{ color: "var(--ink)", marginTop: 20 }}
          >
            {error}
          </p>
        )}
      </form>
    </PendingContext.Provider>
  );
}

export function AttachmentInput() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<File[]>([]);
  const error = validateAttachments(files);

  return (
    <>
      <div
        className="bg-drop"
        onDragOver={(event) => event.preventDefault()}
        onDrop={(event) => {
          event.preventDefault();
          if (inputRef.current && event.dataTransfer.files.length) {
            inputRef.current.files = event.dataTransfer.files;
            setFiles(Array.from(event.dataTransfer.files));
          }
        }}
      >
        <div className="l">
          <div className="t">Drop files here, or browse.</div>
          <div className="d">PDF · AI · INDD · PNG · JPG · 3 MiB total</div>
        </div>
        <label
          className="r"
          htmlFor="project-attachments"
          role="button"
          tabIndex={0}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              inputRef.current?.click();
            }
          }}
        >
          Browse
        </label>
        <input
          ref={inputRef}
          id="project-attachments"
          type="file"
          name="attachments"
          aria-label="Project attachments"
          aria-describedby="attachment-feedback"
          accept={ATTACHMENT_ACCEPT}
          multiple
          hidden
          onChange={(event) => setFiles(Array.from(event.target.files ?? []))}
        />
      </div>
      <div id="attachment-feedback" aria-live="polite">
        {files.length > 0 && (
          <p style={{ fontSize: 13, overflowWrap: "anywhere" }}>
            {files.map((file) => file.name).join(", ")}
          </p>
        )}
        {error && <p role="alert">{error}</p>}
      </div>
    </>
  );
}

export function SubmitButton() {
  const pending = useContext(PendingContext);
  return (
    <button className="hm-plate" type="submit" disabled={pending}>
      <span className="roman">→</span> {pending ? "Sending…" : "Send project"}
    </button>
  );
}
