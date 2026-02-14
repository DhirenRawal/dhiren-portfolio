import { motion } from "framer-motion";
import { useProjects } from "@/hooks/use-portfolio";
import { SectionHeader } from "@/components/SectionHeader";
import { ExternalLink, Code2, Layers, BarChart3 } from "lucide-react";

export default function Projects() {
  const { data: projects, isLoading } = useProjects();

  if (isLoading) {
    return (
      <div className="min-h-screen pt-24 flex justify-center">
        <div className="font-mono text-primary animate-pulse">LOADING PROJECTS...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-24 md:py-32">
      <SectionHeader 
        title="Project Portfolio" 
        subtitle="A collection of technical implementations and financial tools."
        align="center"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects?.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            viewport={{ once: true }}
            className="group relative bg-card border border-border rounded-xl overflow-hidden hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 flex flex-col"
          >
            {/* Header / "Terminal Bar" */}
            <div className="bg-muted/30 px-4 py-3 border-b border-border flex justify-between items-center group-hover:bg-primary/5 transition-colors">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-border group-hover:bg-red-500 transition-colors" />
                <div className="w-2.5 h-2.5 rounded-full bg-border group-hover:bg-yellow-500 transition-colors" />
                <div className="w-2.5 h-2.5 rounded-full bg-border group-hover:bg-green-500 transition-colors" />
              </div>
              <div className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider">
                {project.date || "2024"}
              </div>
            </div>

            <div className="p-6 flex flex-col flex-1">
              <div className="mb-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold font-display group-hover:text-primary transition-colors">
                    {project.title}
                  </h3>
                  <BarChart3 className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                {project.subtitle && (
                  <p className="text-sm font-mono text-muted-foreground">{project.subtitle}</p>
                )}
              </div>

              <div className="space-y-4 mb-6 flex-1">
                {project.description?.map((desc, i) => (
                  <p key={i} className="text-sm text-foreground/80 leading-relaxed">
                    {desc}
                  </p>
                ))}
              </div>

              <div className="space-y-4 pt-4 border-t border-border/50">
                <div className="flex flex-wrap gap-2">
                  {project.technologies?.map((tech) => (
                    <span 
                      key={tech} 
                      className="px-2 py-1 rounded bg-secondary/10 border border-secondary/20 text-secondary text-xs font-mono"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                
                <button className="w-full py-2 flex items-center justify-center gap-2 rounded bg-muted/50 hover:bg-primary text-foreground hover:text-primary-foreground font-medium text-sm transition-colors group/btn">
                  <span>View Case Study</span>
                  <ExternalLink className="w-3 h-3 group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
