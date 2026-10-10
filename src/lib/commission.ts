// Keep the client and route limits aligned. Leave room for multipart fields
// below Vercel's 4.5 MB request limit.
export const MAX_ATTACHMENTS = 5;
export const MAX_ATTACHMENT_BYTES = 3 * 1024 * 1024;
export const MAX_BODY_CHARS = 16_000;
export const ATTACHMENT_ACCEPT = ".pdf,.ai,.indd,.png,.jpg,.jpeg";

type AttachmentInfo = { name: string; size: number };

export function validateAttachments(files: AttachmentInfo[]): string | null {
  if (files.some((file) => file.size === 0)) {
    return "Empty files cannot be attached. Please choose a file with content.";
  }
  if (files.length > MAX_ATTACHMENTS) {
    return "Please choose up to five files.";
  }
  if (files.reduce((total, file) => total + file.size, 0) > MAX_ATTACHMENT_BYTES) {
    return "Attachments must total 3 MiB or less. For larger files, add a download link in the notes.";
  }
  if (files.some((file) => !/\.(pdf|ai|indd|png|jpe?g)$/i.test(file.name))) {
    return "Please attach PDF, AI, INDD, PNG or JPG files.";
  }
  return null;
}
