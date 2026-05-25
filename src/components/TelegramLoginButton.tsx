import React, { useEffect, useRef } from 'react';

interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  auth_date: number;
  hash: string;
}

interface TelegramLoginButtonProps {
  botName: string;
  buttonSize?: 'large' | 'medium' | 'small';
  cornerRadius?: number;
  requestAccess?: boolean;
  usePic?: boolean;
  onAuthCallback: (user: TelegramUser) => void;
}

export default function TelegramLoginButton({
  botName,
  buttonSize = 'large',
  cornerRadius,
  requestAccess = true,
  usePic = true,
  onAuthCallback
}: TelegramLoginButtonProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    
    // Clear previous script if any to prevent duplicates on hot-reload
    containerRef.current.innerHTML = '';

    (window as any).TelegramLoginWidget = {
      dataOnauth: (user: TelegramUser) => {
        onAuthCallback(user);
      }
    };

    const script = document.createElement('script');
    script.src = 'https://telegram.org/js/telegram-widget.js?22';
    script.setAttribute('data-telegram-login', botName);
    script.setAttribute('data-size', buttonSize);
    if (cornerRadius !== undefined) {
      script.setAttribute('data-radius', cornerRadius.toString());
    }
    script.setAttribute('data-request-access', requestAccess ? 'write' : 'read');
    script.setAttribute('data-userpic', usePic.toString());
    script.setAttribute('data-onauth', 'TelegramLoginWidget.dataOnauth(user)');
    script.async = true;

    containerRef.current.appendChild(script);
  }, [botName, buttonSize, cornerRadius, requestAccess, usePic, onAuthCallback]);

  return <div ref={containerRef} className="telegram-login-btn" />;
}
