import React, { useState, useEffect } from 'react';
import { playSystemSound } from '@/lib/sounds';

interface InternetExplorerProps {
  onClose?: () => void;
}

export const InternetExplorer = ({ onClose }: InternetExplorerProps) => {
  const [url, setUrl] = useState('https://www.microsoft.com');
  const [displayUrl, setDisplayUrl] = useState('https://www.microsoft.com');
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState<string[]>(['https://www.microsoft.com']);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [content, setContent] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Default content when no URL is loaded
  const defaultContent = (
    <div className="text-center p-8">
      <h2 className="text-xl font-bold mb-4">Welcome to Internet Explorer</h2>
      <p className="mb-4">Enter a URL or search term in the address bar above.</p>
      
      <div className="mb-8">
        <h3 className="font-bold mb-2">Quick Search</h3>
        <div className="flex items-center justify-center">
          <input 
            type="text" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-2 py-1 border border-gray-400 rounded-l text-sm w-64"
            placeholder="Search the web"
          />
          <button 
            onClick={() => handleSearch()}
            className="bg-[#ECE9D8] border border-l-0 border-gray-400 rounded-r px-3 py-1 text-sm hover:bg-gray-200"
          >
            Search
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 max-w-lg mx-auto">
        <div 
          className="border p-4 rounded hover:bg-gray-100 cursor-pointer"
          onClick={() => navigateTo('https://web.archive.org/web/20050801000000/http://www.msn.com/')}
        >
          <h3 className="font-bold">MSN</h3>
          <p className="text-sm">Visit the MSN portal from 2005 via Web Archive</p>
        </div>
        <div 
          className="border p-4 rounded hover:bg-gray-100 cursor-pointer"
          onClick={() => navigateTo('https://web.archive.org/web/20050801000000/http://www.hotmail.com/')}
        >
          <h3 className="font-bold">Hotmail</h3>
          <p className="text-sm">Visit Hotmail from 2005 via Web Archive</p>
        </div>
        <div 
          className="border p-4 rounded hover:bg-gray-100 cursor-pointer"
          onClick={() => navigateTo('https://google.com')}
        >
          <h3 className="font-bold">Google</h3>
          <p className="text-sm">Search the web with Google</p>
        </div>
        <div 
          className="border p-4 rounded hover:bg-gray-100 cursor-pointer"
          onClick={() => navigateTo('https://web.archive.org/web/20050801000000/http://www.yahoo.com/')}
        >
          <h3 className="font-bold">Yahoo!</h3>
          <p className="text-sm">Visit Yahoo from 2005 via Web Archive</p>
        </div>
      </div>
    </div>
  );

  // Load content from URL
  useEffect(() => {
    if (url === 'https://www.microsoft.com') {
      setContent(null);
      return;
    }
    
    const loadContent = async () => {
      try {
        setIsLoading(true);
        playSystemSound('navigationStart');
        
        // In a real browser, we would load the actual URL
        // Here we're just simulating by embedding the URL in an iframe
        // Note: Many sites will block iframe embedding due to X-Frame-Options
        setContent(`<iframe 
          src="${url}" 
          style="width:100%;height:100%;border:none;" 
          sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
          title="Browser Content"
        ></iframe>`);
        
        // Add to history if this is a new navigation
        if (history[historyIndex] !== url) {
          const newHistory = [...history.slice(0, historyIndex + 1), url];
          setHistory(newHistory);
          setHistoryIndex(newHistory.length - 1);
        }
        
        setTimeout(() => {
          setIsLoading(false);
          playSystemSound('navigationComplete');
        }, 1500);
      } catch (error) {
        console.error('Failed to load content:', error);
        setIsLoading(false);
        setContent('<div class="p-4 text-red-600">Failed to load page. The page might not allow embedding in iframes.</div>');
      }
    };
    
    loadContent();
  }, [url]);

  // Handle URL submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigateTo(displayUrl);
  };

  // Navigate to URL
  const navigateTo = (newUrl: string) => {
    // Ensure URL has protocol
    let processedUrl = newUrl;
    if (!newUrl.startsWith('http://') && !newUrl.startsWith('https://')) {
      processedUrl = 'https://' + newUrl;
    }
    
    setUrl(processedUrl);
    setDisplayUrl(processedUrl);
  };

  // Handle search
  const handleSearch = () => {
    if (searchTerm.trim()) {
      navigateTo(`https://www.google.com/search?q=${encodeURIComponent(searchTerm)}`);
    }
  };

  // Go back in history
  const goBack = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setUrl(history[historyIndex - 1]);
      setDisplayUrl(history[historyIndex - 1]);
    }
  };

  // Go forward in history
  const goForward = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setUrl(history[historyIndex + 1]);
      setDisplayUrl(history[historyIndex + 1]);
    }
  };

  // Refresh current page
  const refresh = () => {
    setUrl(url); // This will trigger the useEffect to reload
  };

  return (
    <div className="flex flex-col h-full">
      <div className="bg-[#ECE9D8] p-1 border-b border-gray-300">
        <div className="flex items-center space-x-1 text-xs">
          <button className="px-2 py-1 bg-[#ECE9D8] hover:bg-gray-200 rounded">File</button>
          <button className="px-2 py-1 bg-[#ECE9D8] hover:bg-gray-200 rounded">Edit</button>
          <button className="px-2 py-1 bg-[#ECE9D8] hover:bg-gray-200 rounded">View</button>
          <button className="px-2 py-1 bg-[#ECE9D8] hover:bg-gray-200 rounded">Favorites</button>
          <button className="px-2 py-1 bg-[#ECE9D8] hover:bg-gray-200 rounded">Tools</button>
          <button className="px-2 py-1 bg-[#ECE9D8] hover:bg-gray-200 rounded">Help</button>
        </div>
      </div>
      
      <div className="flex items-center bg-[#ECE9D8] p-2 border-b border-gray-300">
        <button 
          className="px-2 py-1 bg-gray-200 rounded mr-2 text-xs disabled:opacity-50"
          onClick={goBack}
          disabled={historyIndex <= 0}
        >
          Back
        </button>
        <button 
          className="px-2 py-1 bg-gray-200 rounded mr-2 text-xs disabled:opacity-50"
          onClick={goForward}
          disabled={historyIndex >= history.length - 1}
        >
          Forward
        </button>
        <button 
          className="px-2 py-1 bg-gray-200 rounded mr-2 text-xs"
          onClick={refresh}
        >
          Refresh
        </button>
        <form onSubmit={handleSubmit} className="flex-1 flex">
          <input 
            type="text" 
            value={displayUrl}
            onChange={(e) => setDisplayUrl(e.target.value)}
            className="flex-1 px-2 py-1 bg-white border border-gray-400 rounded-l text-xs"
            placeholder="Enter a URL"
          />
          <button 
            type="submit"
            className="px-2 py-1 bg-gray-200 rounded-r border border-l-0 border-gray-400 text-xs"
          >
            Go
          </button>
        </form>
      </div>
      
      <div className="flex-1 bg-white overflow-auto relative">
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80">
            <div className="text-center">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="mt-2 text-sm">Loading...</p>
            </div>
          </div>
        ) : (
          content ? (
            <div dangerouslySetInnerHTML={{ __html: content }} className="h-full" />
          ) : (
            defaultContent
          )
        )}
      </div>
      
      <div className="bg-[#ECE9D8] p-1 text-xs flex items-center">
        <span>{isLoading ? 'Loading...' : 'Done'}</span>
      </div>
    </div>
  );
}; 