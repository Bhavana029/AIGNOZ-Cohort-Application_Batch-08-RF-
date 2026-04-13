import DashboardLayout from "@/components/DashboardLayout";
import { motion } from "framer-motion";
import { Brain, Moon, Activity, Heart, Gauge } from "lucide-react";
import { useEffect, useState } from "react";
import API from "@/services/api";

const riskColors = {
  low: { bg: "status-green", label: "Low Risk" },
  medium: { bg: "status-yellow", label: "Medium Risk" },
  high: { bg: "status-red", label: "High Risk" },
};

const AIInsights = () => {
  const [insights, setInsights] = useState(null);

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        console.log("Calling API...");
        const res = await API.get("/insights");
        setInsights(res.data.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchInsights();
  }, []);

  if (!insights) {
    return <div>Loading insights...</div>;
  }

  const cards = [
    {
      title: "Behavioral Phenotype",
      icon: Brain,
      text: insights.behavioralPhenotype?.text,
      risk: insights.behavioralPhenotype?.risk,
    },
    {
      title: "Emotional Pattern",
      icon: Heart,
      text: insights.emotionalPattern?.text,
      risk: insights.emotionalPattern?.risk,
    },
    {
      title: "Stress–Sleep Correlation",
      icon: Moon,
      text: insights.stressSleepCorrelation?.text,
      risk: insights.stressSleepCorrelation?.risk,
    },
    {
      title: "Lifestyle Stability Score",
      icon: Activity,
      text: `Lifestyle Score: ${insights.lifestyleScore?.score}/100`,
      risk: insights.lifestyleScore?.risk,
    },
    {
      title: "Personalized Risk Explanation",
      icon: Gauge,
      text: insights.riskExplanation?.text,
      risk: insights.riskExplanation?.risk,
    },
  ];

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto">
        <h1 className="font-heading text-2xl font-bold text-foreground mb-1">
          AI Insights
        </h1>

        <p className="text-sm text-muted-foreground mb-6">
          AI-generated analysis of your behavioral patterns
        </p>

        <div className="space-y-4">
          {cards.map((card, i) => {
            const Icon = card.icon;

            return (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                className="health-card"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <h3 className="font-heading font-semibold text-foreground">
                        {card.title}
                      </h3>

                      <span
                        className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${
                          card.risk === "High Risk"
                            ? "status-red"
                            : card.risk === "Medium Risk"
                            ? "status-yellow"
                            : "status-green"
                        }`}
                      >
                        {card.risk}
                      </span>
                    </div>

                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {card.text}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AIInsights;
