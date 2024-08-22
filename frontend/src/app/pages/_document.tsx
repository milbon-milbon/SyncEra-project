// src/pages/_document.tsx
import Document, { Head, Html, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  render() {
    return (
      <Html lang='ja'>
        <Head>
          <meta name='viewport' content='width=device-width, initial-scale=1.0' />
          <link
            rel='stylesheet'
            href='https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&family=Patrick+Hand&display=swap'
          />
        </Head>
        <body>
          <Main />
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
