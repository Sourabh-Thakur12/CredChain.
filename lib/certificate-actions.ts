import type { CertificateWithAssets } from "@/types";

export function openCertificatePreview(certificate: CertificateWithAssets): void {
  const previewWindow = window.open("", "_blank", "noopener,noreferrer");

  if (!previewWindow) {
    return;
  }

  previewWindow.document.open();
  previewWindow.document.write(certificate.certificateHtml);
  previewWindow.document.close();
}

export function downloadCertificate(certificate: CertificateWithAssets): void {
  const blob = new Blob([certificate.certificateHtml], {
    type: "text/html;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = certificate.downloadFileName;
  anchor.click();
  URL.revokeObjectURL(url);
}
