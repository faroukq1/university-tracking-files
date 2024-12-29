import React from "react";
import { Card, CardContent } from "../components/ui/card";
import { Loader2 } from "lucide-react";

interface PDFViewerProps {
  initialPdfUrl?: string;
  className?: string;
}

interface PDFSource {
  url: string;
  type: "remote" | "file";
}

const PDFViewer: React.FC<PDFViewerProps> = ({
  initialPdfUrl = "",
  className = "",
}) => {
  const [pdfSource, setPdfSource] = React.useState<PDFSource | null>(null);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (initialPdfUrl) {
      setPdfSource({ url: initialPdfUrl, type: "remote" });
    }
  }, [initialPdfUrl]);

  const handlePDFLoad = () => {
    setLoading(false);
    setError(null);
  };

  const handlePDFError = () => {
    setLoading(false);
    setError(
      "Failed to load PDF. Please check if the file exists and is accessible."
    );
  };

  const renderPDFContent = () => {
    if (!pdfSource) return null;

    return (
      <object
        data={pdfSource.url}
        type="application/pdf"
        className="w-full h-full bg-black rounded-sm"
        onLoad={handlePDFLoad}
        onError={handlePDFError}
        data-testid="pdf-viewer"
      >
        <div className="p-4 text-center">
          <p>Unable to display PDF directly. You can:</p>
          <button
            onClick={() => window.open(pdfSource.url, "_blank")}
            className="mt-2 btn"
          >
            Open in New Tab
          </button>
        </div>
      </object>
    );
  };

  return (
    <div
      className={`h-[85vh] flex flex-col justify-center gap-4 max-w-5xl mx-auto ${className}`}
    >
      <Card className="p-2 h-full">
        <CardContent className="p-0 relative h-full">
          {loading && (
            <div className="h-full absolute inset-0 flex items-center justify-center bg-gray-50">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
          )}
          {error && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
              <p className="text-red-500" data-testid="error-message">
                {error}
              </p>
            </div>
          )}
          {renderPDFContent()}
          {!pdfSource && !error && !loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
              <p className="text-gray-500">Enter a URL to view the PDF</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PDFViewer;
