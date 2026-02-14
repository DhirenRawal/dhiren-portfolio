import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { insertContactMessageSchema } from "@shared/schema";
import { useContact } from "@/hooks/use-portfolio";
import { SectionHeader } from "@/components/SectionHeader";
import { motion } from "framer-motion";
import { Send, CheckCircle2, AlertCircle, Mail, MapPin, Phone } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

const formSchema = insertContactMessageSchema.extend({
  email: z.string().email("Invalid email address"),
});

type FormValues = z.infer<typeof formSchema>;

export default function Contact() {
  const { mutateAsync: sendMessage, isPending } = useContact();
  const { toast } = useToast();
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    try {
      await sendMessage(data);
      setIsSuccess(true);
      toast({
        title: "Message Sent",
        description: "Thank you for reaching out. I'll get back to you shortly.",
        variant: "default",
      });
      form.reset();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-24 md:py-32">
      <SectionHeader 
        title="Get In Touch" 
        subtitle="Open for opportunities, collaborations, and technical discussions."
        align="center"
      />

      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Contact Info Card */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-card border border-border rounded-xl p-8 shadow-xl"
        >
          <h3 className="text-2xl font-display font-bold mb-6 text-foreground">Contact Information</h3>
          <p className="text-muted-foreground mb-8 leading-relaxed">
            I'm currently available for freelance work and full-time positions. 
            If you have a project that needs some creative technical direction, 
            I'd love to hear about it.
          </p>

          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded bg-primary/10 flex items-center justify-center text-primary shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <div className="font-mono text-sm text-muted-foreground mb-1">EMAIL</div>
                <a href="mailto:hello@example.com" className="text-lg font-medium hover:text-primary transition-colors">
                  dhiren.rawal@example.com
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded bg-primary/10 flex items-center justify-center text-primary shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <div className="font-mono text-sm text-muted-foreground mb-1">LOCATION</div>
                <div className="text-lg font-medium">New York, NY</div>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded bg-primary/10 flex items-center justify-center text-primary shrink-0">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <div className="font-mono text-sm text-muted-foreground mb-1">PHONE</div>
                <div className="text-lg font-medium">+1 (555) 123-4567</div>
              </div>
            </div>
          </div>

          <div className="mt-12 p-4 rounded bg-muted/30 border border-border/50">
            <div className="flex items-center gap-2 text-primary font-mono text-xs font-bold mb-2">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              CURRENT STATUS
            </div>
            <p className="text-sm text-muted-foreground">
              Open to new opportunities starting Q3 2025.
            </p>
          </div>
        </motion.div>

        {/* Form Card */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-8 relative overflow-hidden"
        >
          {isSuccess ? (
            <div className="absolute inset-0 z-10 bg-card flex flex-col items-center justify-center text-center p-8 animate-in fade-in zoom-in duration-300">
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center text-primary mb-4">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Message Sent!</h3>
              <p className="text-muted-foreground mb-6">
                Thanks for reaching out. I'll be in touch with you shortly.
              </p>
              <button 
                onClick={() => setIsSuccess(false)}
                className="px-6 py-2 bg-muted hover:bg-muted/80 rounded font-medium transition-colors"
              >
                Send Another
              </button>
            </div>
          ) : null}

          <h3 className="text-2xl font-display font-bold mb-6 text-foreground">Send a Message</h3>
          
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium text-muted-foreground font-mono">
                NAME
              </label>
              <Input
                {...form.register("name")}
                placeholder="John Doe"
                className="bg-background border-border focus:border-primary font-sans h-12"
              />
              {form.formState.errors.name && (
                <div className="text-destructive text-xs flex items-center gap-1 mt-1">
                  <AlertCircle className="w-3 h-3" />
                  {form.formState.errors.name.message}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-muted-foreground font-mono">
                EMAIL
              </label>
              <Input
                {...form.register("email")}
                placeholder="john@company.com"
                type="email"
                className="bg-background border-border focus:border-primary font-sans h-12"
              />
              {form.formState.errors.email && (
                <div className="text-destructive text-xs flex items-center gap-1 mt-1">
                  <AlertCircle className="w-3 h-3" />
                  {form.formState.errors.email.message}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="message" className="text-sm font-medium text-muted-foreground font-mono">
                MESSAGE
              </label>
              <Textarea
                {...form.register("message")}
                placeholder="Tell me about your project..."
                className="bg-background border-border focus:border-primary font-sans min-h-[150px] resize-none"
              />
              {form.formState.errors.message && (
                <div className="text-destructive text-xs flex items-center gap-1 mt-1">
                  <AlertCircle className="w-3 h-3" />
                  {form.formState.errors.message.message}
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full py-4 bg-primary text-primary-foreground font-bold rounded hover:bg-primary/90 transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? (
                "Sending..."
              ) : (
                <>
                  Transmit Message <Send className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
