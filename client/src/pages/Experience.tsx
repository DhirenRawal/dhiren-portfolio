import { motion } from "framer-motion";
import { useExperience, useEducation } from "@/hooks/use-portfolio";
import { SectionHeader } from "@/components/SectionHeader";
import { Briefcase, GraduationCap, Calendar, MapPin } from "lucide-react";

export default function Experience() {
  const { data: experience, isLoading: expLoading } = useExperience();
  const { data: education, isLoading: eduLoading } = useEducation();

  if (expLoading || eduLoading) {
    return (
      <div className="min-h-screen pt-24 flex justify-center">
        <div className="font-mono text-primary animate-pulse">LOADING DATA...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-24 md:py-32">
      <SectionHeader 
        title="Career Trajectory" 
        subtitle="A timeline of professional growth and academic achievements."
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Experience Column */}
        <div>
          <div className="flex items-center gap-3 mb-8">
            <Briefcase className="text-primary w-6 h-6" />
            <h3 className="text-2xl font-display font-bold">Experience</h3>
          </div>

          <div className="relative border-l border-border ml-3 space-y-12">
            {experience?.map((job, index) => (
              <motion.div 
                key={job.id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="pl-8 relative group"
              >
                {/* Timeline Dot */}
                <div className="absolute -left-[5px] top-2 w-2.5 h-2.5 rounded-full bg-border group-hover:bg-primary transition-colors" />
                
                <div className="bg-card/50 border border-border p-6 rounded-xl hover:border-primary/50 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                    <h4 className="text-lg font-bold text-foreground">{job.role}</h4>
                    <span className="inline-block px-2 py-1 bg-primary/10 text-primary text-xs font-mono font-bold rounded mt-2 sm:mt-0 w-max">
                      {job.company}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-4 text-xs font-mono text-muted-foreground mb-4">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {job.startDate} - {job.endDate || "Present"}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {job.location}
                    </span>
                  </div>

                  <ul className="space-y-2">
                    {job.description?.map((desc, i) => (
                      <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                        <span className="text-primary mt-1.5 text-[10px]">▶</span>
                        {desc}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Education Column */}
        <div>
          <div className="flex items-center gap-3 mb-8">
            <GraduationCap className="text-secondary w-6 h-6" />
            <h3 className="text-2xl font-display font-bold">Education</h3>
          </div>

          <div className="relative border-l border-border ml-3 space-y-12">
            {education?.map((edu, index) => (
              <motion.div 
                key={edu.id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="pl-8 relative group"
              >
                {/* Timeline Dot */}
                <div className="absolute -left-[5px] top-2 w-2.5 h-2.5 rounded-full bg-border group-hover:bg-secondary transition-colors" />
                
                <div className="bg-card/50 border border-border p-6 rounded-xl hover:border-secondary/50 transition-colors">
                  <h4 className="text-lg font-bold text-foreground">{edu.degree}</h4>
                  <div className="text-secondary font-medium mt-1">{edu.institution}</div>
                  
                  <div className="flex items-center gap-4 text-xs font-mono text-muted-foreground my-4">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {edu.graduationDate}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {edu.location}
                    </span>
                  </div>

                  {edu.courses && (
                    <div className="mt-4">
                      <div className="text-xs font-mono text-muted-foreground mb-2">RELEVANT COURSEWORK</div>
                      <p className="text-sm text-foreground/80 leading-relaxed">
                        {edu.courses}
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
