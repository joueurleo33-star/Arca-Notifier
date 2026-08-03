import './globals.css';

export const metadata = {
  title: 'Arca Notifier',
  description: 'Scanner de logs pour animaux',
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
