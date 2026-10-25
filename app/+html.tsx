import { ScrollViewStyleReset } from 'expo-router/html';
import { type PropsWithChildren } from 'react';

/**
 * Root HTML template for web in Expo Router.
 * Configures the viewport and resets default browser focus outlines (black boxes).
 */
export default function Root({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        <ScrollViewStyleReset />
        <style
          dangerouslySetInnerHTML={{
            __html: `
              /* Reset web tap highlights */
              *, *::before, *::after {
                -webkit-tap-highlight-color: transparent;
              }
              /* Eliminate default browser black box / focus outlines on all inputs */
              input, textarea, select, [contenteditable="true"], [role="textbox"] {
                outline: none !important;
                outline-style: none !important;
                outline-width: 0 !important;
                box-shadow: none !important;
              }
              input:focus, textarea:focus, select:focus, [contenteditable="true"]:focus, [role="textbox"]:focus,
              input:focus-visible, textarea:focus-visible, select:focus-visible, [contenteditable="true"]:focus-visible, [role="textbox"]:focus-visible,
              input:active, textarea:active, select:active, [role="textbox"]:active {
                outline: none !important;
                outline-style: none !important;
                outline-width: 0 !important;
                box-shadow: none !important;
              }
              /* Prevent browser autofill from rendering harsh yellow/black background boxes */
              input:-webkit-autofill,
              input:-webkit-autofill:hover,
              input:-webkit-autofill:focus,
              textarea:-webkit-autofill,
              textarea:-webkit-autofill:hover,
              textarea:-webkit-autofill:focus {
                -webkit-box-shadow: 0 0 0px 1000px #ffffff inset !important;
                box-shadow: 0 0 0px 1000px #ffffff inset !important;
                -webkit-text-fill-color: #1A1A1A !important;
                transition: background-color 5000s ease-in-out 0s;
              }
            `,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
