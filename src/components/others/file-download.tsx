
export default function CloudinaryDownload({ fileUrl }: { fileUrl: string }) {
  const downloadUrl = fileUrl.replace("/upload/", "/upload/fl_attachment/");

  return (
    <a
      href={downloadUrl}
      className="inline-flex items-center gap-2 px-3 py-1 rounded-lg transition"
    >
      Baixar
    </a>
  );
}
