import Head from 'next/head';
import '../styles/globals.css';
import { Analytics } from "@vercel/analytics/next";
import { useEffect } from 'react';

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    // On first load, always scroll to top if there is a hash
    if (window.location.hash) {
      window.scrollTo(0, 0);
      // Optionally, remove the hash from the URL
      history.replaceState(null, '', window.location.pathname);
    }
  }, []);

  return (
    <>
      <Head>
        <title>ProDone - Web,App & AI Solutions</title>
        <link rel="icon" type="image/svg+xml" href="/logo.svg" />
      </Head>
      <Component {...pageProps} />
      <Analytics />
    </>
  );
}

export default MyApp; 
