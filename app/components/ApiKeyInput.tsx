import { useState } from 'react';

interface ApiKeyInputProps {
  onApiKeySet: (apiKey: string) => void;
  isVisible: boolean;
}

const ApiKeyInput: React.FC<ApiKeyInputProps> = ({ onApiKeySet, isVisible }) => {
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiKey.trim()) {
      onApiKeySet(apiKey.trim());
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
        <h2 className="text-2xl font-bold mb-4">Gemini API Key Required</h2>
        <p className="text-gray-600 mb-6">
          To analyze your resume, please enter your Gemini API key. You can get one from the{' '}
          <a 
            href="https://makersuite.google.com/app/apikey" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            Google AI Studio
          </a>.
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input
              type={showKey ? 'text' : 'password'}
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter your Gemini API key"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <button
              type="button"
              onClick={() => setShowKey(!showKey)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showKey ? '👁️' : '👁️‍🗨️'}
            </button>
          </div>
          
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Set API Key
          </button>
        </form>
        
        <p className="text-xs text-gray-500 mt-4">
          Your API key is stored locally and never sent to our servers.
        </p>
      </div>
    </div>
  );
};

export default ApiKeyInput;