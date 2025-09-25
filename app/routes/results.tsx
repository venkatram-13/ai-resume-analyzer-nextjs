import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import Summary from "~/components/Summary";
import ATS from "~/components/ATS";
import Details from "~/components/Details";

export const meta = () => ([
    { title: 'Resumind | Results' },
    { name: 'description', content: 'Your resume analysis results' },
])

const Results = () => {
    const navigate = useNavigate();
    const [analysisData, setAnalysisData] = useState<{
        companyName: string;
        jobTitle: string;
        feedback: Feedback;
        fileName: string;
        resumeImageUrl?: string;
    } | null>(null);

    useEffect(() => {
        const storedData = sessionStorage.getItem('resume-analysis');
        if (!storedData) {
            navigate('/upload');
            return;
        }
        
        try {
            const data = JSON.parse(storedData);
            setAnalysisData(data);
        } catch (error) {
            console.error('Failed to parse analysis data:', error);
            navigate('/upload');
        }
    }, [navigate]);

    if (!analysisData) {
        return (
            <main className="!pt-0">
                <div className="flex items-center justify-center min-h-screen">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold mb-4">Loading...</h2>
                        <img src="/images/resume-scan-2.gif" className="w-[200px] mx-auto" />
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="!pt-0">
            <nav className="resume-nav">
                <Link to="/upload" className="back-button">
                    <img src="/icons/back.svg" alt="back" className="w-2.5 h-2.5" />
                    <span className="text-gray-800 text-sm font-semibold">Back to Upload</span>
                </Link>
            </nav>
            
            <div className="flex flex-row w-full max-lg:flex-col">
                <section className="feedback-section bg-[url('/images/bg-small.svg')] bg-cover h-[100vh] sticky top-0 items-center justify-center">
                    <div className="animate-in fade-in duration-1000 gradient-border max-sm:m-0 h-[90%] max-wxl:h-fit w-full max-w-md flex flex-col items-center justify-center">
                        {analysisData.resumeImageUrl ? (
                            <div className="w-full h-full flex flex-col">
                                <div className="text-center p-4 border-b border-gray-200">
                                    <h3 className="text-lg font-semibold text-gray-700 truncate">{analysisData.fileName}</h3>
                                    {analysisData.companyName && (
                                        <div className="text-center mt-2">
                                            <p className="text-sm text-gray-500">Applied to</p>
                                            <p className="font-bold text-base">{analysisData.companyName}</p>
                                            {analysisData.jobTitle && (
                                                <p className="text-gray-600 text-sm">{analysisData.jobTitle}</p>
                                            )}
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1 p-4 overflow-hidden">
                                    <img 
                                        src={analysisData.resumeImageUrl} 
                                        alt="Resume Preview" 
                                        className="w-full h-full object-contain rounded-lg shadow-sm"
                                    />
                                </div>
                            </div>
                        ) : (
                            <div className="text-center p-8">
                                <div className="mb-4">
                                    <img src="/images/pdf.png" alt="PDF" className="w-20 h-20 mx-auto mb-4" />
                                    <h3 className="text-lg font-semibold text-gray-700">{analysisData.fileName}</h3>
                                </div>
                                {analysisData.companyName && (
                                    <div className="text-center">
                                        <p className="text-sm text-gray-500">Applied to</p>
                                        <p className="font-bold text-lg">{analysisData.companyName}</p>
                                        {analysisData.jobTitle && (
                                            <p className="text-gray-600">{analysisData.jobTitle}</p>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                        </div>
                </section>
                
                <section className="feedback-section">
                    <h2 className="text-4xl !text-black font-bold">Resume Analysis</h2>
                    <div className="flex flex-col gap-8 animate-in fade-in duration-1000">
                        <Summary feedback={analysisData.feedback} />
                        <ATS score={analysisData.feedback.ATS.score || 0} suggestions={analysisData.feedback.ATS.tips || []} />
                        <Details feedback={analysisData.feedback} />
                    </div>
                </section>
            </div>
        </main>
    )
}

export default Results