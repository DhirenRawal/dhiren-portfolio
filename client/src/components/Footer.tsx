export function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-card border-t border-border py-12 pb-20">
      <div className="container mx-auto px-4 text-center">
        <p className="font-mono text-sm text-muted-foreground">
          © {currentYear} PORTFOLIO.FN // DEVELOPED WITH REACT & TANSTACK QUERY
        </p>
        <div className="mt-4 flex justify-center gap-6">
          <a href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm font-medium">GITHUB</a>
          <a href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm font-medium">LINKEDIN</a>
          <a href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm font-medium">TWITTER</a>
        </div>
      </div>
    </footer>
  );
}
