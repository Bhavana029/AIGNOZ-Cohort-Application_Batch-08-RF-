import DashboardLayout from "@/components/DashboardLayout";
import { motion } from "framer-motion";
import {
  Brain,
  Moon,
  Activity,
  Heart,
  TrendingUp,
  TrendingDown,
  Minus,
  AlertTriangle,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useEffect, useState } from "react";
import API from "@/services/api";

const statusColors = {
  green: "status-green",
  yellow: "status-yellow",
  red: "status-red",
};

const TrendIcon = ({ trend }) => {
  if (trend === "up") return <TrendingUp className="h-3 w-3 text-success" />;
  if (trend === "down") return <TrendingDown className="h-3 w-3 text-primary" />;
  return <Minus className="h-3 w-3 text-muted-foreground" />;
};

const Dashboard = () => {
  const [summary, setSummary] = useState(null);
  const [trendData, setTrendData] = useState([]);
  const [trendInfo, setTrendInfo] = useState(null);
  const [riskLevel, setRiskLevel] = useState("Low Risk");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await API.get("/dashboard");
        setSummary(res.data.summary);
        setTrendData(res.data.trends);
        setTrendInfo(res.data.trendInfo);
        setRiskLevel(res.data.riskLevel);
      } catch (error) {
        console.error(error);
      }
    };

    fetchDashboard();
  }, []);

  if (!summary) {
    return (
      <DashboardLayout>
        <div className="p-10 text-muted-foreground">
          No check-in data available yet. Submit your first daily check-in.
        </div>
      </DashboardLayout>
    );
  }

  const summaryCards = [
    {
      title: "Stress Level",
      value: `${summary.stress}/10`,
      icon: Brain,
      status: summary.stress > 6 ? "red" : "green",
      trend: trendInfo?.stress?.direction || "stable",
      trendText: `${trendInfo?.stress?.percent || 0}%`,
    },
    {
      title: "Sleep Hours",
      value: `${summary.sleep}h`,
      icon: Moon,
      status: summary.sleep < 6 ? "red" : "green",
      trend: trendInfo?.sleep?.direction || "stable",
      trendText: `${trendInfo?.sleep?.percent || 0}%`,
    },
    {
      title: "Activity (min)",
      value: `${summary.activity} min`,
      icon: Activity,
      status: summary.activity < 30 ? "yellow" : "green",
      trend: trendInfo?.activity?.direction || "stable",
      trendText: `${trendInfo?.activity?.percent || 0}%`,
    },
    {
      title: "Diet Score",
      value: `${summary.diet}%`,
      icon: Heart,
      status: summary.diet < 60 ? "yellow" : "green",
      trend: trendInfo?.diet?.direction || "stable",
      trendText: `${trendInfo?.diet?.percent || 0}%`,
    },
    {
      title: "Phenotype",
      value: summary.phenotype,
      icon: Brain,
      status: riskLevel === "High Risk" ? "red" : "green",
      trend: "stable",
      trendText: "",
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">
            Dashboard
          </h1>
          <p className="text-sm text-muted-foreground">
            Your behavioral health overview
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {summaryCards.map((card, i) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="health-card"
            >
              <div className="flex items-center justify-between mb-3">
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center ${statusColors[card.status]}`}
                >
                  <card.icon className="h-4 w-4" />
                </div>

                <div className="flex items-center gap-1 text-xs">
                  {card.trendText && (
                    <>
                      <TrendIcon trend={card.trend} />
                      <span className="text-muted-foreground">
                        {card.trendText}
                      </span>
                    </>
                  )}
                </div>
              </div>

              <p className="font-heading font-bold text-xl text-foreground">
                {card.value}
              </p>

              <p className="text-xs text-muted-foreground mt-0.5">
                {card.title}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Alert */}
        {riskLevel !== "Low Risk" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`rounded-xl p-4 flex items-start gap-3 ${
              riskLevel === "High Risk"
                ? "border border-red-400 bg-red-50"
                : "border border-yellow-400 bg-yellow-50"
            }`}
          >
            <AlertTriangle
              className={`h-5 w-5 mt-0.5 flex-shrink-0 ${
                riskLevel === "High Risk" ? "text-red-500" : "text-yellow-500"
              }`}
            />
            <div>
              <p className="text-sm font-medium text-foreground">
                {riskLevel === "High Risk"
                  ? "High Risk Pattern Detected"
                  : "Mild Risk Pattern Detected"}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {riskLevel === "High Risk"
                  ? "Your behavioral data suggests elevated health risk. Immediate lifestyle adjustments recommended."
                  : "Your behavioral patterns show mild imbalance. Consider small improvements."}
              </p>
            </div>
          </motion.div>
        )}

        {/* Charts */}
        <div className="grid md:grid-cols-2 gap-6">
          {[
            { title: "Stress Trend (7 days)", key: "stress", color: "hsl(205,70%,50%)" },
            { title: "Sleep Trend", key: "sleep", color: "hsl(175,55%,42%)" },
            { title: "Activity Trend (min)", key: "activity", color: "hsl(145,60%,42%)" },
            { title: "Risk Score Trend", key: "risk", color: "hsl(35,90%,55%)" },
          ].map((chart) => (
            <div key={chart.title} className="health-card">
              <h3 className="font-heading font-semibold text-sm text-foreground mb-4">
                {chart.title}
              </h3>

              <ResponsiveContainer width="100%" height={180}>
                <LineChart data={trendData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="hsl(210, 15%, 90%)"
                  />
                  <XAxis
                    dataKey="day"
                    tick={{ fontSize: 12 }}
                    stroke="hsl(210, 10%, 50%)"
                  />
                  <YAxis
                    tick={{ fontSize: 12 }}
                    stroke="hsl(210, 10%, 50%)"
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "0.5rem",
                      border: "1px solid hsl(210, 15%, 90%)",
                      fontSize: "12px",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey={chart.key}
                    stroke={chart.color}
                    strokeWidth={2}
                    dot={{ r: 3 }}
                    activeDot={{ r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;