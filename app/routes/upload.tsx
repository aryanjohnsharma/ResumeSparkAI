import { type FormEvent, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import Navbar from "~/components/Navbar";
import FileUploader from "~/components/FileUploader";
import { usePuterStore } from "~/lib/puter";
import { convertPdfToImage } from "~/lib/pdf2img";
import { generateUUID } from "~/lib/utils";
import { prepareInstructions } from "../../constants";

export const meta = () => ([
  { title: "ResumeSparkAI | Upload" },
  { name: "description", content: "Upload your resume for analysis" },
]);

const Upload = () => {
  const { fs, ai, kv } = usePuterStore();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusText, setStatusText] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const timeline = useMemo(
    () => [
      "Upload the original PDF",
      "Convert the resume into a review preview",
      "Store the draft and generate AI feedback",
      "Open your finished report",
    ],
    []
  );

  const handleFileSelect = (nextFile: File | null) => {
    setFile(nextFile);
  };

  const handleAnalyze = async ({
    companyName,
    jobTitle,
    jobDescription,
    file,
  }: {
    companyName: string;
    jobTitle: string;
    jobDescription: string;
    file: File;
  }) => {
    setIsProcessing(true);

    setStatusText("Uploading the file...");
    const uploadedFile = await fs.upload([file]);
    if (!uploadedFile) return setStatusText("Error: Failed to upload file");

    setStatusText("Converting to image...");
    const imageFile = await convertPdfToImage(file);
    if (!imageFile.file) return setStatusText("Error: Failed to convert PDF to image");

    setStatusText("Uploading the image...");
    const uploadedImage = await fs.upload([imageFile.file]);
    if (!uploadedImage) return setStatusText("Error: Failed to upload image");

    setStatusText("Preparing data...");
    const uuid = generateUUID();
    const data = {
      id: uuid,
      resumePath: uploadedFile.path,
      imagePath: uploadedImage.path,
      companyName,
      jobTitle,
      jobDescription,
      feedback: "",
    };
    await kv.set(`resume:${uuid}`, JSON.stringify(data));

    setStatusText("Analyzing...");

    const feedback = await ai.feedback(
      uploadedFile.path,
      prepareInstructions({ jobTitle, jobDescription })
    );
    if (!feedback) return setStatusText("Error: Failed to analyze resume");

    const feedbackText =
      typeof feedback.message.content === "string"
        ? feedback.message.content
        : feedback.message.content[0].text;

    data.feedback = JSON.parse(feedbackText);
    await kv.set(`resume:${uuid}`, JSON.stringify(data));
    setStatusText("Analysis complete, redirecting...");
    navigate(`/resume/${uuid}`);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget.closest("form");
    if (!form || !file) return;

    const formData = new FormData(form);
    const companyName = formData.get("company-name") as string;
    const jobTitle = formData.get("job-title") as string;
    const jobDescription = formData.get("job-description") as string;

    handleAnalyze({ companyName, jobTitle, jobDescription, file });
  };

  return (
    <main className="app-shell">
      <Navbar />

      <section className="app-container pt-8 md:pt-12">
        <div className="grid gap-6 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <aside className="hero-card p-7 md:p-10">
            <div className="space-y-6">
              <p className="eyebrow">New analysis</p>
              <h1 className="page-title leading-[1.04] md:leading-[1.02]">
                Build a sharper application package.
              </h1>
              <p className="page-subtitle">
                Upload a PDF, add optional target role context, and let
                ResumeSparkAI create a preview, run the AI feedback flow, and save
                the finished review back to your workspace.
              </p>
            </div>

            <div className="mt-8 grid gap-3">
              {timeline.map((step, index) => (
                <div
                  key={step}
                  className="flex items-start gap-4 rounded-[1.35rem] border border-[color:var(--border)] bg-[var(--surface-soft)] px-4 py-4"
                >
                  <span className="inline-flex size-9 items-center justify-center rounded-full bg-[rgba(201,100,66,0.14)] text-sm font-semibold text-[#edaf9a]">
                    {index + 1}
                  </span>
                  <p className="text-sm leading-7 text-[var(--text-secondary)]">{step}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 rounded-[1.5rem] border border-[color:var(--border)] bg-[var(--surface-soft)] p-5">
              <p className="metric-label">Project</p>
              <p className="mt-3 font-serif text-3xl text-[var(--text-primary)]">
                ResumeSparkAI
              </p>
              <p className="metric-copy">
                Dark-first by default, with a theme toggle always available from
                the top navigation.
              </p>
            </div>
          </aside>

          <section className="surface-card-strong p-6 md:p-8">
            <div className="mb-6 space-y-3">
              <p className="eyebrow">Submission form</p>
              <h2 className="section-title">Upload and analyze</h2>
              <p className="text-sm leading-7 text-[var(--text-secondary)]">
                Company name, job title, and description are optional, but adding
                them helps the review become more targeted.
              </p>
            </div>

            {isProcessing ? (
              <div className="loading-pulse flex flex-col items-center gap-5 rounded-[1.75rem] border border-[color:var(--border)] bg-[var(--surface-soft)] p-8 text-center">
                <div className="status-chip">Processing</div>
                <h3 className="panel-title">{statusText}</h3>
                <p className="max-w-xl text-sm leading-7 text-[var(--text-secondary)]">
                  The original upload flow is still running underneath this new
                  interface: file upload, image conversion, AI analysis, and final
                  report creation.
                </p>
                <img
                  src="/images/resume-scan.gif"
                  className="w-full max-w-md rounded-[1.5rem]"
                  alt="Resume analysis animation"
                />
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div>
                  <label htmlFor="company-name" className="field-label">
                    Company Name
                  </label>
                  <input
                    type="text"
                    name="company-name"
                    placeholder="Anthropic"
                    id="company-name"
                    className="field-control"
                  />
                </div>

                <div>
                  <label htmlFor="job-title" className="field-label">
                    Job Title
                  </label>
                  <input
                    type="text"
                    name="job-title"
                    placeholder="Product Designer"
                    id="job-title"
                    className="field-control"
                  />
                </div>

                <div>
                  <label htmlFor="job-description" className="field-label">
                    Job Description
                  </label>
                  <textarea
                    rows={7}
                    name="job-description"
                    placeholder="Paste the role summary, responsibilities, and required skills here."
                    id="job-description"
                    className="field-control resize-y"
                  />
                </div>

                <div>
                  <label htmlFor="uploader" className="field-label">
                    Resume PDF
                  </label>
                  <FileUploader onFileSelect={handleFileSelect} selectedFile={file} />
                </div>

                <div className="flex flex-col gap-3 border-t border-[color:var(--border)] pt-5 md:flex-row md:items-center md:justify-between">
                  <p className="text-sm leading-7 text-[var(--text-secondary)]">
                    Your existing review logic remains unchanged. This redesign only
                    changes presentation, not the upload and analysis behavior.
                  </p>
                  <button className="button-primary min-w-[12rem]" type="submit">
                    Analyze Resume
                  </button>
                </div>
              </form>
            )}
          </section>
        </div>
      </section>
    </main>
  );
};

export default Upload;
