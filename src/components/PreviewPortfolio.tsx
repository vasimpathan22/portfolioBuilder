import { useNavigate } from "react-router-dom";
import { usePortfolio } from "../context/PortfolioContext";
import { useRef, useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const PreviewPortfolio = () => {
  const { portfolio } = usePortfolio();
  const { about, skills, projects, contact } = { ...portfolio };

  const navigate = useNavigate();

  const portfolioRef = useRef<HTMLDivElement>(null);
  //to avoid the printing of the buttons.
  const [isPdfGenerating, setIsPdfGenerating] = useState(false);

  const handleDownloadClick = async () => {
    const portfolioElement = portfolioRef.current;
    if (!portfolioElement) return;

    setIsPdfGenerating(true);

    setTimeout(async () => {
      //portfolio content to canvas
      const canvas = await html2canvas(portfolioElement, {
        scale: 3,
        useCORS: true,
        logging: true,
      });

      //create pdf object
      const pdf = new jsPDF("p", "mm", "a4");

      //canvas -> image
      const imgData = canvas.toDataURL("image/png");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);

      pdf.save("portfolio.pdf");
      setIsPdfGenerating(false);
    }, 0);
  };

  const handleEditClick = () => {
    navigate("/edit");
  };

  return (
    <div
      ref={portfolioRef}
      className="max-w-4xl mx-auto p-6 bg-gray-100 rounded-lg shadow-md mt-3"
    >
      {/* About Section displays the name, tagline, and description */}
      <section className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">{about?.name}</h1>
        <h2 className="text-lg text-gray-600">{about?.tagline}</h2>
        <p className="mt-2 text-gray-700">{about?.description}</p>
      </section>

      {/* Skills Section */}
      <section className="mb-6">
        <h3 className="text-xl font-semibold text-gray-800">Skills</h3>
        <ul className="flex flex-wrap mt-2">
          {skills?.map((skill, index) => (
            <li
              key={index}
              className="bg-blue-400 text-white px-4 py-1 m-1 rounded-full text-sm shadow-sm"
            >
              {skill}
            </li>
          ))}
        </ul>
      </section>

      {/* Projects Section shown as list */}
      <section className="mb-6">
        <h3 className="text-xl font-semibold text-gray-800">Projects</h3>
        <ul className="mt-2 space-y-4">
          {projects?.map((project, index) => (
            <li
              key={index}
              className="bg-white p-4 rounded-lg shadow-md border border-gray-200"
            >
              <h4 className="text-lg font-bold text-gray-800">
                {project.title}
              </h4>
              <p className="text-gray-700">{project.description}</p>
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline mt-2 block"
              >
                View Project
              </a>
            </li>
          ))}
        </ul>
      </section>

      {/* Contact Section */}
      <section>
        <h3 className="text-xl font-semibold text-gray-800">Contact</h3>
        <p className="mt-2 text-gray-700">
          Email:{" "}
          <a
            href={`mailto:${contact?.email}`}
            className="text-blue-600 hover:underline"
          >
            {contact?.email}
          </a>
        </p>
        <p className="text-gray-700">
          Phone: <span>{contact?.phone}</span>
        </p>
        <div className="mt-2">
          <h4 className="font-semibold text-gray-800">Socials</h4>
          <ul className="flex space-x-4 mt-1">
            {Object.entries(contact?.socials ?? {}).map(
              ([platform, link], index) => (
                <li key={index}>
                  {" "}
                  <a
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {platform}
                  </a>
                </li>
              )
            )}
          </ul>
        </div>
      </section>
      {/* Download and Edit Buttons */}
      {!isPdfGenerating && (
        <section className="flex justify-end no-print">
          <button
            onClick={handleDownloadClick}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4  mr-3 "
          >
            Download Pdf
          </button>
          <button
            onClick={handleEditClick}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4 "
          >
            Edit Portfolio
          </button>
        </section>
      )}
    </div>
  );
};

export default PreviewPortfolio;
