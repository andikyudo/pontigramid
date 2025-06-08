'use client';

import { useState, useEffect } from 'react';
import { Facebook, Twitter, MessageCircle, Send, Link as LinkIcon, Check } from 'lucide-react';

interface SocialShareButtonsProps {
  url: string;
  title: string;
  description?: string;
}

interface ShareCount {
  facebook: number;
  twitter: number;
  whatsapp: number;
  telegram: number;
}

export default function SocialShareButtons({ url, title }: SocialShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const [shareCounts, setShareCounts] = useState<ShareCount>({
    facebook: 0,
    twitter: 0,
    whatsapp: 0,
    telegram: 0
  });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show buttons after a short delay for better UX
    const timer = setTimeout(() => setIsVisible(true), 1000);
    
    // Mock share counts (in real app, fetch from APIs)
    setShareCounts({
      facebook: Math.floor(Math.random() * 100) + 10,
      twitter: Math.floor(Math.random() * 50) + 5,
      whatsapp: Math.floor(Math.random() * 200) + 20,
      telegram: Math.floor(Math.random() * 30) + 3
    });

    return () => clearTimeout(timer);
  }, []);

  const shareUrls = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`,
    telegram: `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`
  };

  const handleShare = (platform: string) => {
    const shareUrl = shareUrls[platform as keyof typeof shareUrls];
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
      
      // Increment share count (mock)
      setShareCounts(prev => ({
        ...prev,
        [platform]: prev[platform as keyof ShareCount] + 1
      }));
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const shareButtons = [
    {
      name: 'facebook',
      icon: Facebook,
      color: 'bg-blue-600 hover:bg-blue-700',
      label: 'Facebook',
      count: shareCounts.facebook
    },
    {
      name: 'twitter',
      icon: Twitter,
      color: 'bg-sky-500 hover:bg-sky-600',
      label: 'Twitter',
      count: shareCounts.twitter
    },
    {
      name: 'whatsapp',
      icon: MessageCircle,
      color: 'bg-green-500 hover:bg-green-600',
      label: 'WhatsApp',
      count: shareCounts.whatsapp
    },
    {
      name: 'telegram',
      icon: Send,
      color: 'bg-blue-500 hover:bg-blue-600',
      label: 'Telegram',
      count: shareCounts.telegram
    }
  ];

  if (!isVisible) return null;

  return (
    <>
      {/* Desktop: Fixed right sidebar */}
      <div className="hidden lg:block fixed right-6 top-1/2 transform -translate-y-1/2 z-40">
        <div className="bg-white rounded-lg shadow-lg p-3 border">
          <div className="text-center mb-3">
            <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
              Bagikan
            </p>
          </div>
          
          <div className="space-y-3">
            {shareButtons.map((button) => {
              const IconComponent = button.icon;
              return (
                <div key={button.name} className="text-center">
                  <button
                    onClick={() => handleShare(button.name)}
                    className={`${button.color} text-white p-3 rounded-full transition-all duration-300 transform hover:scale-110 shadow-md hover:shadow-lg w-12 h-12 flex items-center justify-center group relative`}
                    aria-label={`Share on ${button.label}`}
                    title={`Share on ${button.label}`}
                  >
                    <IconComponent className="w-5 h-5" />
                    
                    {/* Tooltip */}
                    <div className="absolute right-full mr-3 bg-gray-900 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                      {button.label}
                    </div>
                  </button>
                  
                  {/* Share count */}
                  {button.count > 0 && (
                    <div className="text-xs text-gray-500 mt-1 font-medium">
                      {button.count}
                    </div>
                  )}
                </div>
              );
            })}
            
            {/* Copy Link Button */}
            <div className="text-center">
              <button
                onClick={copyToClipboard}
                className={`${
                  copied 
                    ? 'bg-green-500 hover:bg-green-600' 
                    : 'bg-gray-600 hover:bg-gray-700'
                } text-white p-3 rounded-full transition-all duration-300 transform hover:scale-110 shadow-md hover:shadow-lg w-12 h-12 flex items-center justify-center group relative`}
                aria-label="Copy link"
                title="Copy link"
              >
                {copied ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <LinkIcon className="w-5 h-5" />
                )}
                
                {/* Tooltip */}
                <div className="absolute right-full mr-3 bg-gray-900 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                  {copied ? 'Copied!' : 'Copy Link'}
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile: Fixed bottom bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-40">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold text-gray-600">
              Bagikan artikel ini:
            </div>
            
            <div className="flex space-x-2">
              {shareButtons.map((button) => {
                const IconComponent = button.icon;
                return (
                  <button
                    key={button.name}
                    onClick={() => handleShare(button.name)}
                    className={`${button.color} text-white p-2.5 rounded-full transition-all duration-300 transform active:scale-95 shadow-md`}
                    aria-label={`Share on ${button.label}`}
                  >
                    <IconComponent className="w-4 h-4" />
                  </button>
                );
              })}
              
              {/* Copy Link Button */}
              <button
                onClick={copyToClipboard}
                className={`${
                  copied 
                    ? 'bg-green-500' 
                    : 'bg-gray-600'
                } text-white p-2.5 rounded-full transition-all duration-300 transform active:scale-95 shadow-md`}
                aria-label="Copy link"
              >
                {copied ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <LinkIcon className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
          
          {/* Share counts on mobile */}
          <div className="flex justify-center mt-2 space-x-4 text-xs text-gray-500">
            {shareButtons.map((button) => (
              <span key={button.name}>
                {button.count} {button.label.toLowerCase()}
              </span>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
