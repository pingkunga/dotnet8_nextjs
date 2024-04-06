
export default function AdminLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    return (
      <html lang="en">
        <body>
          <nav>header admin</nav>
          <section>sidebar admin</section>
          {children}
          <nav>footer admin</nav>
        </body>
      </html>
    );
  }
  