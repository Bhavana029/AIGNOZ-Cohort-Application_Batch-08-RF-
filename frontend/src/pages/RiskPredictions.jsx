import DashboardLayout from "@/components/DashboardLayout";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { AlertTriangle, TrendingUp, Moon, UserX } from "lucide-react";
import API from "@/services/api";

const CircularProgress = ({ value, color, size = 100 }) => {
  const radius = (size - 10) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="hsl(210, 15%, 92%)"
          strokeWidth={6}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={6}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1 }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="font-bold text-lg">{value}%</span>
      </div>
    </div>
  );
};

const RiskPredictions = () => {
  const [risks, setRisks] = useState([]);
  const [loadingRisks, setLoadingRisks] = useState(true);

  const [selectedRisk, setSelectedRisk] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [modalData, setModalData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [reminderTime, setReminderTime] = useState("");

  useEffect(() => {
    const fetchRiskSummary = async () => {
      try {
        const res = await API.get("/risk-actions/summary");

        setRisks([
          {
            title: "24-hour Relapse Risk",
            value: res.data.relapseRisk,
            icon: AlertTriangle,
            color: "hsl(145, 60%, 42%)",
            explanation: "AI-predicted relapse probability.",
            action: "Review today's plan",
          },
          {
            title: "Morning Glucose Spike",
            value: res.data.glucoseSpike,
            icon: TrendingUp,
            color: "hsl(35, 90%, 55%)",
            explanation: "Risk influenced by diet patterns.",
            action: "Start morning walk",
          },
          {
            title: "Evening Instability",
            value: res.data.eveningInstability,
            icon: Moon,
            color: "hsl(205, 70%, 50%)",
            explanation: "Stress-related evening risk.",
            action: "Set evening reminder",
          },
          {
            title: "Dropout Risk",
            value: res.data.dropoutRisk,
            icon: UserX,
            color: "hsl(145, 60%, 42%)",
            explanation: "Engagement consistency score.",
            action: "View streak",
          },
        ]);
      } catch (error) {
        console.error("Risk summary fetch error:", error);
      } finally {
        setLoadingRisks(false);
      }
    };

    fetchRiskSummary();
  }, []);

  const handleConfirm = async () => {
    try {
      setLoading(true);

      if (selectedRisk.action === "Review today's plan") {
        const res = await API.get("/risk-actions/plan");
        setModalData(res.data.plan);
      }

      if (selectedRisk.action === "Start morning walk") {
        const res = await API.post("/risk-actions/walk");
        setModalData(res.data.message);
      }

      if (selectedRisk.action === "Set evening reminder") {
        const res = await API.post("/risk-actions/reminder", {
          time: reminderTime,
        });
        setModalData(res.data.message);
      }

      if (selectedRisk.action === "View streak") {
        const res = await API.get("/risk-actions/streak");
        setModalData(res.data);
      }
    } catch (error) {
      console.error(error);
      setModalData("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  if (loadingRisks) {
    return (
      <DashboardLayout>
        <div className="text-center mt-10">Loading AI risk predictions...</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Risk Predictions</h1>

        <div className="grid md:grid-cols-2 gap-4">
          {risks.map((risk, i) => (
            <motion.div
              key={risk.title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="health-card flex flex-col items-center text-center"
            >
              <CircularProgress value={risk.value} color={risk.color} />

              <risk.icon className="h-5 w-5 mt-3 text-primary" />

              <h3 className="font-semibold mt-2">{risk.title}</h3>

              <p className="text-xs text-muted-foreground mb-4">
                {risk.explanation}
              </p>

              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSelectedRisk(risk);
                  setModalData(null);
                  setIsOpen(true);
                }}
              >
                {risk.action}
              </Button>
            </motion.div>
          ))}
        </div>

        {isOpen && selectedRisk && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-[400px] shadow-xl">

              <h2 className="text-lg font-semibold mb-3">
                {selectedRisk.action}
              </h2>

              {!modalData && (
                <>
                  {selectedRisk.action === "Set evening reminder" && (
                    <input
                      type="time"
                      value={reminderTime}
                      onChange={(e) => setReminderTime(e.target.value)}
                      className="border rounded-md p-2 w-full mb-4"
                    />
                  )}

                  <Button
                    className="w-full"
                    onClick={handleConfirm}
                    disabled={loading}
                  >
                    {loading ? "Processing..." : "Confirm"}
                  </Button>
                </>
              )}

              {modalData && (
                <div className="mt-4 text-sm">
                  {Array.isArray(modalData) ? (
                    <ul className="list-disc list-inside">
                      {modalData.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  ) : typeof modalData === "object" ? (
                    <div>
                      🔥 Current Streak: {modalData.currentStreak} days <br />
                      🏆 Longest Streak: {modalData.longestStreak} days
                    </div>
                  ) : (
                    <p>{modalData}</p>
                  )}

                  <Button
                    className="w-full mt-4"
                    variant="outline"
                    onClick={() => setIsOpen(false)}
                  >
                    Close
                  </Button>
                </div>
              )}

            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default RiskPredictions;