import DashboardLayout from "@/components/DashboardLayout";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Download, TrendingDown, Moon, Heart, Activity } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import { useEffect, useState } from "react";
import API from "@/services/api";

const ProgressReport = () => {
  const [weeklyData, setWeeklyData] = useState([]);
  const [stats, setStats] = useState(null);
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await API.get("/progress/weekly");
        setWeeklyData(res.data.weeklyData);
        setStats(res.data.stats);
        setSummary(res.data.summary);
      } catch (error) {
        console.error("Failed to fetch weekly report:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="p-10 text-muted-foreground">
          Loading weekly report...
        </div>
      </DashboardLayout>
    );
  }

  if (!stats) {
    return (
      <DashboardLayout>
        <div className="p-10 text-muted-foreground">
          No weekly data available.
        </div>
      </DashboardLayout>
    );
  }

  const statCards = [
    { title: "Weekly Stress Average", value: `${stats.weeklyStressAvg}/10`, icon: TrendingDown },
    { title: "Sleep Consistency", value: `${stats.sleepConsistency}%`, icon: Moon },
    { title: "Adherence Rate", value: `${stats.adherenceRate}%`, icon: Heart },
    { title: "Risk Improvement", value: stats.riskImprovement, icon: Activity }
  ];

  const handleDownloadPDF = async () => {
    try {
      const response = await API.get("/progress/weekly/pdf", {
        responseType: "blob"
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "weekly_report.pdf");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">

        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-heading text-2xl font-bold text-foreground mb-1">
              Weekly Progress
            </h1>
            <p className="text-sm text-muted-foreground">Last 7 Days Overview</p>
          </div>

          <Button variant="outline" size="sm" className="gap-2" onClick={handleDownloadPDF}>
            <Download className="h-4 w-4" />
            Download PDF
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {statCards.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="health-card"
            >
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                <s.icon className="h-4 w-4 text-primary" />
              </div>
              <p className="font-heading font-bold text-xl text-foreground">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.title}</p>
            </motion.div>
          ))}
        </div>

        {/* Chart */}
        <div className="health-card mb-6">
          <h3 className="font-heading font-semibold text-sm text-foreground mb-4">
            Weekly Overview
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(210, 15%, 90%)" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="adherence" fill="hsl(205, 70%, 50%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* AI Summary */}
        <div className="health-card">
          <h3 className="font-heading font-semibold text-sm text-foreground mb-3">
            AI-Generated Summary
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">{summary}</p>
        </div>

      </div>
    </DashboardLayout>
  );
};

export default ProgressReport;