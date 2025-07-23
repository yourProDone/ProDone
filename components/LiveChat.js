import { useEffect } from 'react';

export default function LiveChat() {
  useEffect(() => {
    // Inject Google Tag Manager script
    if (!document.getElementById('gtag-script')) {
      // First script - Google Tag Manager
      const gtagScript = document.createElement('script');
      gtagScript.id = 'gtag-script';
      gtagScript.async = true;
      gtagScript.src = 'https://www.googletagmanager.com/gtag/js?id=AW-627450553';
      
      // Second script - gtag initialization
      const gtagInit = document.createElement('script');
      gtagInit.id = 'gtag-init';
      gtagInit.innerHTML = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'AW-627450553');
      `;
      
      // Append both scripts to the document head
      document.head.appendChild(gtagScript);
      document.head.appendChild(gtagInit);
    }

    // Inject LeadConnector widget script and element (visible by default)
    if (!document.getElementById('leadconnector-chat-script')) {
      const script = document.createElement('script');
      script.id = 'leadconnector-chat-script';
      script.src = 'https://widgets.leadconnectorhq.com/loader.js';
      script.setAttribute('data-resources-url', 'https://widgets.leadconnectorhq.com/chat-widget/loader.js');
      script.async = true;
      document.body.appendChild(script);
    }
    
    if (!document.querySelector('chat-widget')) {
      const chatWidget = document.createElement('chat-widget');
      chatWidget.setAttribute('location-id', 'zgtUPVJPCSPiObs2UyIE');
      // Show the widget by default
      document.body.appendChild(chatWidget);
    } else {
      // If already present, make sure it's visible
      const chatWidget = document.querySelector('chat-widget');
      chatWidget.style.display = 'block';
    }
  }, []);

  return null; // This component does not render anything visible itself
}