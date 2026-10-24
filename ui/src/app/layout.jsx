import './globals.css';
import { Providers } from './providers';

export const metadata = {
  title: 'PixTale - Visual Social Platform',
  description: 'Share your visual moments with the world on PixTale',
  icons: {
    icon: '/favicon.svg',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.svg" />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
