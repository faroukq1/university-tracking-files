import DisplayPdf from "../project_component/DisplayPdf";

const WorkerDashboard = () => {
  // You can use any of these formats:
  const pdfUrl = "https://www.orimi.com/pdf-test.pdf"; // From public folder
  // const pdfUrl = "C:/Users/NBX/Downloads/Documents/pdf-open-parameters.pdf"; // Local file path
  // const pdfUrl = "https://example.com/sample.pdf"; // Remote URL

  return (
    <main className="h-screen flex">
      <div className="flex-1 bg-black"></div>
      <div className="flex-1 bg-gray-500">
        <DisplayPdf initialPdfUrl={pdfUrl} />
      </div>
    </main>
  );
};

export default WorkerDashboard;
