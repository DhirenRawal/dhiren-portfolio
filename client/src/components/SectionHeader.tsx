import { motion } from "framer-motion";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  align?: "left" | "center" | "right";
}

export function SectionHeader({ title, subtitle, align = "left" }: SectionHeaderProps) {
  return (
    <div className={`mb-12 ${align === "center" ? "text-center" : align === "right" ? "text-right" : "text-left"}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground relative inline-block">
          {title}
          <span className="absolute -bottom-2 left-0 w-1/3 h-1 bg-primary rounded-full shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
        </h2>
        {subtitle && (
          <p className="mt-4 text-muted-foreground font-mono text-sm md:text-base max-w-2xl mx-auto">
            {subtitle}
          </p>
        )}
      </motion.div>
    </div>
  );
}
