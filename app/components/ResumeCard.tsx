import { Link } from "react-router";
import ScoreCircle from "./ScoreCircle";

interface ResumeCardProps {
  resume: Resume;
}

const ResumeCard: React.FC<ResumeCardProps> = ({ resume }) => {
  const handleAnalyze = () => {
    // Store resume data for results page
    sessionStorage.setItem('resume-analysis', JSON.stringify({
      companyName: resume.companyName || '',
      jobTitle: resume.jobTitle || '',
      feedback: resume.feedback,
      fileName: `Resume for ${resume.companyName || 'Unknown Company'}`,
      resumeImageUrl: resume.imagePath
    }));
  };

  return (
    <div className="resume-card gradient-border">
      <div className="resume-card-header">
        <div className="flex flex-col gap-2">
          <h3 className="text-xl font-semibold">
            {resume.companyName || 'Resume Analysis'}
          </h3>
          {resume.jobTitle && (
            <p className="text-gray-600">{resume.jobTitle}</p>
          )}
        </div>
        <ScoreCircle score={resume.feedback.overallScore} />
      </div>

      <div className="flex-1 flex items-center justify-center">
        {resume.imagePath ? (
          <img 
            src={resume.imagePath} 
            alt="Resume Preview" 
            className="max-w-full max-h-[300px] object-contain rounded-lg shadow-sm"
          />
        ) : (
          <div className="text-center p-8">
            <img src="/images/pdf.png" alt="PDF" className="w-16 h-16 mx-auto mb-4" />
            <p className="text-gray-500">Resume Preview</p>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center text-sm text-gray-600">
          <span>Overall Score</span>
          <span className="font-semibold">{resume.feedback.overallScore}/100</span>
        </div>
        
        <Link 
          to="/results" 
          onClick={handleAnalyze}
          className="primary-button text-center"
        >
          View Analysis
        </Link>
      </div>
    </div>
  );
};

export default ResumeCard;