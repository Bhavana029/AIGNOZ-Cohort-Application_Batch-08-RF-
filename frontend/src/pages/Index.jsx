import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Brain, Moon, Activity, Heart, BarChart3, Shield, ArrowRight, CheckCircle, Star, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import heroImage from "@/assets/hero-bg.jpg";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }),
};

const Navbar = () => {
  const [open, setOpen] = useState(false);
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4 flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2">
          <Brain className="h-7 w-7 text-primary" />
          <span className="font-heading font-bold text-lg text-foreground">Behavioral Support AI</span>
        </Link>
        <div className="hidden md:flex items-center gap-6">
          <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Features</a>
          <a href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors">How It Works</a>
          <a href="#testimonials" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Testimonials</a>
          <Link to="/login"><Button variant="ghost" size="sm">Login</Button></Link>
          <Link to="/register"><Button size="sm">Get Started</Button></Link>
        </div>
        <button className="md:hidden" onClick={() => setOpen(!open)}>
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>
      {open && (
        <div className="md:hidden bg-card border-b border-border px-4 py-4 flex flex-col gap-3">
          <a href="#features" className="text-sm text-muted-foreground" onClick={() => setOpen(false)}>Features</a>
          <a href="#how-it-works" className="text-sm text-muted-foreground" onClick={() => setOpen(false)}>How It Works</a>
          <Link to="/login" onClick={() => setOpen(false)}><Button variant="ghost" size="sm" className="w-full">Login</Button></Link>
          <Link to="/register" onClick={() => setOpen(false)}><Button size="sm" className="w-full">Get Started</Button></Link>
        </div>
      )}
    </nav>
  );
};

const features = [
  { icon: Brain, title: "Stress Monitoring", desc: "Track and analyze your daily stress patterns with AI-powered assessments." },
  { icon: Moon, title: "Sleep Tracking", desc: "Monitor sleep quality and get personalized recommendations for better rest." },
  { icon: Activity, title: "Glucose Risk Prediction", desc: "AI predicts glucose spikes and behavioral relapse risks in advance." },
  { icon: Heart, title: "Personalized AI Nudges", desc: "Receive timely, context-aware micro-interventions throughout the day." },
  { icon: BarChart3, title: "Behavioral Insights", desc: "Understand your behavioral phenotype and emotional patterns deeply." },
  { icon: Shield, title: "Safety Alerts", desc: "Get immediate alerts when high-risk patterns are detected." },
];

const steps = [
  { step: "01", title: "Enter Daily Check-in", desc: "Complete a quick daily health check-in covering mood, sleep, stress, and activity." },
  { step: "02", title: "AI Analyzes Patterns", desc: "Our AI engine processes your data to identify trends, risks, and correlations." },
  { step: "03", title: "Get Personalized Plan", desc: "Receive tailored recommendations, nudges, and action plans for your wellbeing." },
];

const testimonials = [
  { name: "Dr. Sarah Chen", role: "Endocrinologist", text: "This platform has transformed how my patients manage their behavioral health alongside diabetes care.", rating: 5 },
  { name: "Michael Torres", role: "Patient", text: "The daily check-ins and AI nudges have helped me reduce my stress levels significantly over 3 months.", rating: 5 },
  { name: "Dr. Priya Patel", role: "Psychiatrist", text: "The behavioral phenotyping feature provides insights I've never seen in any other health platform.", rating: 5 },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <img src={heroImage} alt="" className="w-full h-full object-cover" />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0}>
              <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-6">
                <Brain className="h-4 w-4" /> AI-Powered Health Platform
              </span>
            </motion.div>
            <motion.h1
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              custom={1}
              className="font-heading text-4xl md:text-6xl font-bold text-foreground leading-tight mb-6"
            >
              Your AI-Powered{" "}
              <span className="gradient-text">Behavioral Health</span>{" "}
              Companion
            </motion.h1>
            <motion.p
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              custom={2}
              className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto"
            >
              Manage stress, improve sleep, track behavioral patterns, and predict diabetes risk — all with personalized AI guidance.
            </motion.p>
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              custom={3}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link to="/register">
                <Button size="lg" className="text-base px-8 gap-2">
                  Get Started <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline" className="text-base px-8">
                  Login
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 bg-card">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
              Intelligent Health Features
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Comprehensive AI-driven tools designed to support your behavioral health journey.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i}
                className="health-card group cursor-default"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <f.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-heading font-semibold text-lg text-foreground mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">How It Works</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Three simple steps to start improving your health outcomes.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {steps.map((s, i) => (
              <motion.div
                key={s.step}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i}
                className="text-center"
              >
                <div className="w-16 h-16 rounded-2xl gradient-hero flex items-center justify-center mx-auto mb-5">
                  <span className="font-heading font-bold text-xl text-primary-foreground">{s.step}</span>
                </div>
                <h3 className="font-heading font-semibold text-lg text-foreground mb-2">{s.title}</h3>
                <p className="text-sm text-muted-foreground">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 bg-card">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
              Trusted by Professionals
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i}
                className="health-card"
              >
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} className="h-4 w-4 fill-warning text-warning" />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground mb-4 italic">"{t.text}"</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Brain className="h-5 w-5 text-primary" />
                <span className="font-heading font-bold text-foreground">Behavioral Support AI</span>
              </div>
              <p className="text-xs text-muted-foreground">
                AI-powered behavioral health companion for stress management and diabetes prevention.
              </p>
            </div>
            <div>
              <h4 className="font-heading font-semibold text-sm text-foreground mb-3">Product</h4>
              <div className="flex flex-col gap-2 text-xs text-muted-foreground">
                <a href="#features" className="hover:text-foreground transition-colors">Features</a>
                <a href="#how-it-works" className="hover:text-foreground transition-colors">How It Works</a>
                <Link to="/register" className="hover:text-foreground transition-colors">Get Started</Link>
              </div>
            </div>
            <div>
              <h4 className="font-heading font-semibold text-sm text-foreground mb-3">Legal</h4>
              <div className="flex flex-col gap-2 text-xs text-muted-foreground">
                <span className="cursor-pointer hover:text-foreground transition-colors">Privacy Policy</span>
                <span className="cursor-pointer hover:text-foreground transition-colors">Terms of Service</span>
                <span className="cursor-pointer hover:text-foreground transition-colors">Medical Disclaimer</span>
              </div>
            </div>
            <div>
              <h4 className="font-heading font-semibold text-sm text-foreground mb-3">Support</h4>
              <div className="flex flex-col gap-2 text-xs text-muted-foreground">
                <span className="cursor-pointer hover:text-foreground transition-colors">Contact Us</span>
                <span className="cursor-pointer hover:text-foreground transition-colors">Help Center</span>
              </div>
            </div>
          </div>
          <div className="border-t border-border mt-8 pt-6 text-center">
            <p className="text-xs text-muted-foreground">
              © 2026 Behavioral Support AI. This platform does not replace professional medical advice.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;