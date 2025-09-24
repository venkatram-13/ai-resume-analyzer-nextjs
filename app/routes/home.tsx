import type { Route } from "./+types/home";
import Navbar from "~/components/Navbar";
import { Link } from "react-router";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Resumind" },
    { name: "description", content: "Smart feedback for your dream job!" },
  ];
}

export default function Home() {
  return (
    <main className="bg-[url('/images/bg-main.svg')] bg-cover min-h-screen">
      <Navbar />

      <section className="main-section">
        <div className="page-heading py-16">
          <h1>Get AI-Powered Resume Feedback</h1>
          <h2>Upload your resume and receive detailed analysis to improve your job applications</h2>
        </div>

        <div className="flex flex-col items-center justify-center gap-8 max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full mb-12">
            <div className="text-center p-6 bg-white rounded-2xl shadow-md">
              <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                <img src="/icons/info.svg" alt="Upload" className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Upload Resume</h3>
              <p className="text-gray-600">Upload your PDF resume for analysis</p>
            </div>

            <div className="text-center p-6 bg-white rounded-2xl shadow-md">
              <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                <img src="/icons/check.svg" alt="Analyze" className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">AI Analysis</h3>
              <p className="text-gray-600">Get detailed feedback on content, structure, and ATS compatibility</p>
            </div>

            <div className="text-center p-6 bg-white rounded-2xl shadow-md">
              <div className="w-16 h-16 mx-auto mb-4 bg-purple-100 rounded-full flex items-center justify-center">
                <img src="/icons/ats-good.svg" alt="Improve" className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Improve</h3>
              <p className="text-gray-600">Apply suggestions to enhance your resume</p>
            </div>
          </div>

          <Link to="/upload" className="primary-button w-fit text-xl font-semibold px-12 py-4">
            Start Analysis
          </Link>
        </div>
      </section>
    </main>
  );
}