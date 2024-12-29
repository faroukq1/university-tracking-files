import DashBoard from "../project_component/DashBoard";
import DisplayPdf from "../project_component/DisplayPdf";

const WorkerDashboard = () => {
  const pdfUrl = "https://www.orimi.com/pdf-test.pdf";
  const local_pdf_url =
    "http://localhost:3030/uploads/1735332079640-Chapitre2-SOA-Klai.pdf";
  return (
    <div className="flex gap-4">
      <div className="flex-1">
        <DisplayPdf initialPdfUrl={pdfUrl} />
      </div>
      <DashBoard />
    </div>
  );
};

export default WorkerDashboard;
