interface GeminiResponse {
  candidates: {
    content: {
      parts: {
        text: string;
      }[];
    };
  }[];
}

export class GeminiService {
  private apiKey: string;
  private baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async analyzeResume(resumeText: string, jobTitle: string, jobDescription: string): Promise<Feedback> {
    const prompt = this.createPrompt(resumeText, jobTitle, jobDescription);
    
    try {
      const response = await fetch(`${this.baseUrl}?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        })
      });

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status}`);
      }

      const data: GeminiResponse = await response.json();
      const responseText = data.candidates[0]?.content?.parts[0]?.text;
      
      if (!responseText) {
        throw new Error('No response from Gemini API');
      }

      // Extract JSON from response (remove any markdown formatting)
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Invalid JSON response from Gemini');
      }

      return JSON.parse(jsonMatch[0]);
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      throw error;
    }
  }

  private createPrompt(resumeText: string, jobTitle: string, jobDescription: string): string {
    return `You are an expert in ATS (Applicant Tracking System) and resume analysis.
Please analyze and rate this resume and suggest how to improve it.
The rating can be low if the resume is bad.
Be thorough and detailed. Don't be afraid to point out any mistakes or areas for improvement.
If there is a lot to improve, don't hesitate to give low scores. This is to help the user to improve their resume.
If available, use the job description for the job user is applying to to give more detailed feedback.
If provided, take the job description into consideration.

The job title is: ${jobTitle}
The job description is: ${jobDescription}

Resume content:
${resumeText}

Provide the feedback using the following format:
{
  "overallScore": number, // max 100
  "ATS": {
    "score": number, // rate based on ATS suitability
    "tips": [
      {
        "type": "good" | "improve",
        "tip": string // give 3-4 tips
      }
    ]
  },
  "toneAndStyle": {
    "score": number, // max 100
    "tips": [
      {
        "type": "good" | "improve",
        "tip": string, // make it a short "title" for the actual explanation
        "explanation": string // explain in detail here
      }
    ] // give 3-4 tips
  },
  "content": {
    "score": number, // max 100
    "tips": [
      {
        "type": "good" | "improve",
        "tip": string, // make it a short "title" for the actual explanation
        "explanation": string // explain in detail here
      }
    ] // give 3-4 tips
  },
  "structure": {
    "score": number, // max 100
    "tips": [
      {
        "type": "good" | "improve",
        "tip": string, // make it a short "title" for the actual explanation
        "explanation": string // explain in detail here
      }
    ] // give 3-4 tips
  },
  "skills": {
    "score": number, // max 100
    "tips": [
      {
        "type": "good" | "improve",
        "tip": string, // make it a short "title" for the actual explanation
        "explanation": string // explain in detail here
      }
    ] // give 3-4 tips
  }
}

Return the analysis as a JSON object, without any other text and without the backticks.
Do not include any other text or comments.`;
  }
}