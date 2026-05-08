import { useEffect } from "react";
import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { Navigation } from "@/components/Navigation";
import { AnimatePresence, motion } from "framer-motion";
import { initAnalytics, trackPageView } from "@/lib/analytics";

// Pages
import Home from "@/pages/Home";
import Experience from "@/pages/Experience";
import Projects from "@/pages/Projects";
import Contact from "@/pages/Contact";
import NotFound from "@/pages/not-found";

function Router() {
  const [location] = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Switch location={location} key={location}>
        <Route path="/">
          <PageWrapper>
            <Home />
          </PageWrapper>
        </Route>
        <Route path="/experience">
          <PageWrapper>
            <Experience />
          </PageWrapper>
        </Route>
        <Route path="/projects">
          <PageWrapper>
            <Projects />
          </PageWrapper>
        </Route>
        <Route path="/contact">
          <PageWrapper>
            <Contact />
          </PageWrapper>
        </Route>
        <Route component={NotFound} />
      </Switch>
    </AnimatePresence>
  );
}

function AnalyticsTracker() {
  const [location] = useLocation();

  useEffect(() => {
    initAnalytics();
  }, []);

  useEffect(() => {
    trackPageView(`${location}${window.location.hash}`);
  }, [location]);

  useEffect(() => {
    const handleHashChange = () => {
      trackPageView(`${window.location.pathname}${window.location.hash}`);
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  return null;
}

function PageWrapper({ children }: { children: React.ReactNode }) {
  return (
    <motion.main
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen pb-12"
    >
      {children}
    </motion.main>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AnalyticsTracker />
      <Navigation />
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
