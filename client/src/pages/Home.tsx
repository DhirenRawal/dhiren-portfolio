import { motion } from "framer-motion";
import { ArrowRight, Download, ChevronRight, Activity, Database, Globe } from "lucide-react";
import { useProfile } from "@/hooks/use-portfolio";
import { Link } from "wouter";

export default function Home() {
  const { data: profile, isLoading } = useProfile();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="font-mono text-primary animate-pulse">INITIALIZING SYSTEM...</div>
      </div>
    );
  }

  return (
    <div className="relative pt-20">
      {/* Background Decorative Elements */}
      <div className="absolute top-20 right-0 w-1/2 h-1/2 bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-secondary/5 blur-[100px] rounded-full pointer-events-none" />

      <section className="container mx-auto px-4 py-20 md:py-32 flex flex-col md:flex-row items-center gap-12">
        <div className="flex-1 space-y-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-mono font-bold mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              AVAILABLE FOR HIRE
            </div>
            
            <h1 className="text-5xl md:text-7xl font-display font-bold leading-tight">
              Building the <br />
              <span className="text-gradient">Financial Future</span>
            </h1>
            
            <p className="mt-6 text-xl text-muted-foreground max-w-lg leading-relaxed">
              {profile?.summary || "I craft high-performance financial interfaces and robust backend systems tailored for the modern economy."}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="flex flex-wrap gap-4"
          >
            <Link href="/projects">
              <button className="px-8 py-4 bg-primary text-primary-foreground font-bold rounded hover:bg-primary/90 transition-all flex items-center gap-2 group shadow-[0_0_20px_rgba(34,197,94,0.3)] hover:shadow-[0_0_30px_rgba(34,197,94,0.5)]">
                View Projects
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
            
            <button className="px-8 py-4 bg-transparent border border-border text-foreground font-bold rounded hover:bg-card hover:border-primary/50 transition-all flex items-center gap-2">
              <Download className="w-4 h-4" />
              Download CV
            </button>
          </motion.div>

          <div className="pt-8 flex items-center gap-8 text-muted-foreground">
            <div className="flex flex-col">
              <span className="font-display font-bold text-2xl text-foreground">5+</span>
              <span className="text-xs font-mono">YEARS EXP.</span>
            </div>
            <div className="w-px h-10 bg-border" />
            <div className="flex flex-col">
              <span className="font-display font-bold text-2xl text-foreground">20+</span>
              <span className="text-xs font-mono">PROJECTS</span>
            </div>
            <div className="w-px h-10 bg-border" />
            <div className="flex flex-col">
              <span className="font-display font-bold text-2xl text-foreground">100%</span>
              <span className="text-xs font-mono">COMMITMENT</span>
            </div>
          </div>
        </div>

        {/* Hero Visual - Abstract Data Cube */}
        <div className="flex-1 relative hidden md:block">
          <div className="relative w-full aspect-square max-w-md mx-auto">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-secondary/20 rounded-3xl rotate-6 backdrop-blur-sm border border-white/5" />
            <div className="absolute inset-0 bg-card rounded-3xl -rotate-3 border border-border shadow-2xl overflow-hidden flex flex-col">
              {/* Fake Terminal UI */}
              <div className="bg-muted/50 p-3 border-b border-border flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <div className="ml-4 px-3 py-1 bg-black/20 rounded text-xs font-mono text-muted-foreground w-full">root@portfolio:~/deploy</div>
              </div>
              <div className="p-6 font-mono text-sm space-y-4 text-green-400">
                <div className="flex justify-between">
                  <span>&gt; npm run build</span>
                  <span className="text-muted-foreground">200ms</span>
                </div>
                <div className="text-white">
                  Building frontend... <br/>
                  <span className="text-primary">✔ Compiled successfully</span>
                </div>
                <div className="space-y-2 mt-4">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Performance</span>
                    <span>98/100</span>
                  </div>
                  <div className="w-full bg-muted/50 h-2 rounded-full overflow-hidden">
                    <div className="w-[98%] h-full bg-primary" />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Accessibility</span>
                    <span>100/100</span>
                  </div>
                  <div className="w-full bg-muted/50 h-2 rounded-full overflow-hidden">
                    <div className="w-full h-full bg-secondary" />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className="p-4 bg-muted/30 rounded border border-border hover:border-primary/50 transition-colors group/item">
                    <Activity className="w-5 h-5 text-primary mb-2 group-hover/item:scale-110 transition-transform" />
                    <div className="text-xs text-muted-foreground">Market Latency</div>
                    <div className="text-lg font-bold text-white">4.2ms</div>
                  </div>
                  <div className="p-4 bg-muted/30 rounded border border-border hover:border-secondary/50 transition-colors group/item">
                    <Database className="w-5 h-5 text-secondary mb-2 group-hover/item:scale-110 transition-transform" />
                    <div className="text-xs text-muted-foreground">Data Feed</div>
                    <div className="text-lg font-bold text-white">Active</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Links / Features */}
      <section className="bg-card/30 border-y border-border backdrop-blur-sm">
        <div className="container mx-auto px-4 py-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 rounded-xl border border-border/50 hover:border-primary/50 transition-colors group bg-background/50">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Activity className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-display font-bold mb-2">High Frequency</h3>
            <p className="text-muted-foreground text-sm">Optimized for speed and performance. Every millisecond counts in user experience.</p>
          </div>
          <div className="p-6 rounded-xl border border-border/50 hover:border-secondary/50 transition-colors group bg-background/50">
            <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Database className="w-6 h-6 text-secondary" />
            </div>
            <h3 className="text-xl font-display font-bold mb-2">Data Centric</h3>
            <p className="text-muted-foreground text-sm">Complex data visualization and handling. Turning raw numbers into actionable insights.</p>
          </div>
          <div className="p-6 rounded-xl border border-border/50 hover:border-primary/50 transition-colors group bg-background/50">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Globe className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-display font-bold mb-2">Global Scale</h3>
            <p className="text-muted-foreground text-sm">Built to handle traffic from around the world. Scalable architecture by default.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
