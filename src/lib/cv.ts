export const CV_PDF_PATH = "/cv.pdf";

export const CV_PDF_FILENAME = "CV_KlodianaMazrekaj_FullStack_Software_Engineer.pdf";

export function downloadCv() {
  if (typeof document === "undefined") return;

  const link = document.createElement("a");
  link.href = CV_PDF_PATH;
  link.download = CV_PDF_FILENAME;
  link.rel = "noopener";
  document.body.appendChild(link);
  link.click();
  link.remove();
}
