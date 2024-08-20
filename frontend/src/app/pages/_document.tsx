// src/pages/_document.tsx
import Document, { Head, Html, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <link
            rel='stylesheet'
            href='https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&family=Patrick+Hand&display=swap'
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
