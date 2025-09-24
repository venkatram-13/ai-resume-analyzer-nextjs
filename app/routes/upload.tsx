import type { Route } from "./+types/upload";
import Navbar from "~/components/Navbar";
import FileUploader from "~/components/FileUploader";
import ApiKeyInput from "~/components/ApiKeyInput";
import { useState } from "react";
import { useNavigate } from "react-router";
import { convertPdfToImage } from "~/lib/pdf2img";
import { extractTextFromPDF } from "~/lib/pdfExtractor";
import { GeminiService } from "~/lib/gemini";
import { generateUUID } from "~/lib/utils";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Upload Resume - Resumind" },
    { name: "description", content: "Upload your resume for AI analysis" },
  ];
}

export default function Upload() {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [companyName, setCompanyName] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);
  const [apiKey, setApiKey] = useState("");

  const handleFileSelect = (file: File | null) => {
    setSelectedFile(file);
  };

  const handleApiKeySet = (key: string) => {
    setApiKey(key);
    setShowApiKeyInput(false);
    localStorage.setItem('gemini-api-key', key);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedFile) {
      alert("Please select a resume file");
      return;
    }

    // Check if API key is available
    const storedApiKey = localStorage.getItem('gemini-api-key');
    if (!storedApiKey && !apiKey) {
      setShowApiKeyInput(true);
      return;
    }

    const currentApiKey = apiKey || storedApiKey!;
    setIsAnalyzing(true);

    try {
      // Extract text from PDF
      const resumeText = await extractTextFromPDF(selectedFile);
      
      // Analyze with Gemini
      const geminiService = new GeminiService(currentApiKey);
      const feedback = await geminiService.analyzeResume(
        resumeText,
        jobTitle || "General Position",
        jobDescription || "No specific job description provided"
      );

      // Store analysis results in session storage for the results page
      const analysisData = {
        companyName,
        jobTitle,
        feedback,
        fileName: selectedFile.name
      };
      
      sessionStorage.setItem('resume-analysis', JSON.stringify(analysisData));
      
      // Navigate to results page
      navigate('/results');
      
    } catch (error) {
      console.error('Analysis failed:', error);
      alert('Failed to analyze resume. Please check your API key and try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <main className="bg-[url('/images/bg-main.svg')] bg-cover min-h-screen">
      <Navbar />
      
      <section className="main-section">
        <div className="page-heading py-16">
          <h1>Upload Your Resume</h1>
          <h2>Get AI-powered feedback and improve your chances</h2>
        </div>

        {isAnalyzing ? (
          <div className="flex flex-col items-center justify-center gap-8">
            <img src="/images/resume-scan-2.gif" className="w-[300px]" />
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-2">Analyzing Your Resume...</h3>
              <p className="text-gray-600">This may take a few moments</p>
            </div>
          </div>
        ) : (
          <div className="max-w-2xl w-full">
            <form onSubmit={handleSubmit}>
              <div className="form-div">
                <label htmlFor="resume">Resume (PDF)</label>
                <FileUploader onFileSelect={handleFileSelect} />
              </div>

              <div className="form-div">
                <label htmlFor="company">Company Name (Optional)</label>
                <input
                  type="text"
                  id="company"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g., Google, Microsoft, Apple"
                />
              </div>

              <div className="form-div">
                <label htmlFor="jobTitle">Job Title (Optional)</label>
                <input
                  type="text"
                  id="jobTitle"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  placeholder="e.g., Frontend Developer, Data Scientist"
                />
              </div>

              <div className="form-div">
                <label htmlFor="jobDescription">Job Description (Optional)</label>
                <textarea
                  id="jobDescription"
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the job description here for more targeted feedback..."
                  rows={6}
                />
              </div>

              <button
                type="submit"
                className="primary-button text-xl font-semibold"
                disabled={!selectedFile || isAnalyzing}
              >
                {isAnalyzing ? "Analyzing..." : "Analyze Resume"}
              </button>
            </form>
          </div>
        )}
      </section>

      <ApiKeyInput 
        onApiKeySet={handleApiKeySet}
        isVisible={showApiKeyInput}
      />
    </main>
  );
}