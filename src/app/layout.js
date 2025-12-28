import "./globals.css";

export const metadata = {
  title: "Document AI Workflow Builder",
  description: "Visually build and run document processing workflows.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
