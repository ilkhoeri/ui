import Script from "next/script";

export function GoogleAnalytics() {
  return (
    <>
      <Script async type="text/javascript" src="https://www.googletagmanager.com/gtag/js?id=G-DFRX9T5L0K&cx=c&_slc=1" />
      <Script async src="https://www.google-analytics.com/analytics.js" />
    </>
  );
}
