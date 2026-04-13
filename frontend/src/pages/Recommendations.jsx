import DashboardLayout from "@/components/DashboardLayout";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Zap, Wind, Salad, Moon, Footprints, CheckCircle } from "lucide-react";
import { useState, useEffect } from "react";



const iconMap = {
  stress: Wind,
  sleep: Moon,
  activity: Footprints,
  diet: Salad,
  positive: CheckCircle,
  default: Zap
};

const Recommendations = () => {
  const [recs, setRecs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [done, setDone] = useState(() => {
    const saved = localStorage.getItem("doneRecs");
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });

  const markDone = (title) => {
    setDone(prev => {
      const updated = new Set(prev).add(title);
      localStorage.setItem("doneRecs", JSON.stringify([...updated]));
      return updated;
    });
  };

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch(
          "https://aignoz-cohort-application-batch-08-rf.onrender.com/api/recommendations",
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        const data = await response.json();

        if (response.ok) {
          const newRecs = data.data || [];
          const newTitles = newRecs.map(r => r.title);

          const newSignature = JSON.stringify(newTitles);
          const oldSignature = localStorage.getItem("recSignature");

          if (oldSignature && oldSignature !== newSignature) {
            localStorage.removeItem("doneRecs");
            setDone(new Set());
          }

          localStorage.setItem("recSignature", newSignature);
          setRecs(newRecs);
        } else {
          console.error(data.message);
        }
      } catch (error) {
        console.error("Failed to fetch recommendations", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, []);

 
  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto">
        <h1 className="font-heading text-2xl font-bold text-foreground mb-1">
          Recommendations
        </h1>
        <p className="text-sm text-muted-foreground mb-6">
          Personalized suggestions based on your behavioral data
        </p>

        {loading && (
          <p className="text-muted-foreground">Loading recommendations...</p>
        )}

        {!loading && recs.length === 0 && (
          <p className="text-muted-foreground">
            No recommendations yet. Complete a check-in first.
          </p>
        )}

        <div className="space-y-4">
          {recs.map((rec, i) => {
            const Icon = iconMap[rec.type] || iconMap.default;
            const isDone = done.has(rec.title);

            return (
              <motion.div
                key={rec.title}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                className={`health-card transition-opacity ${isDone ? "opacity-60" : ""}`}
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="h-5 w-5 text-secondary" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-heading font-semibold text-foreground mb-1">
                      {rec.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                      {rec.description}
                    </p>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        disabled={isDone}
                        onClick={() => markDone(rec.title)}
                      >
                        {isDone ? "Done ✓" : "Start Now"}
                      </Button>

                      {!isDone && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => markDone(rec.title)}
                        >
                          Mark Done
                        </Button>
                      )}
                    </div>
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

export default Recommendations;
