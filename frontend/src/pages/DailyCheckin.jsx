import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, Loader2, CheckCircle2 } from "lucide-react";
import API from "@/services/api";

const moods = [
  { emoji: "😫", label: "Terrible" },
  { emoji: "😟", label: "Bad" },
  { emoji: "😐", label: "Okay" },
  { emoji: "🙂", label: "Good" },
  { emoji: "😄", label: "Great" },
];

const DailyCheckin = () => {
  const [stress, setStress] = useState([5]);
  const [mood, setMood] = useState(2);
  const [sleep, setSleep] = useState("");
  const [activity, setActivity] = useState("");
  const [diet, setDiet] = useState([7]);
  const [lateEating, setLateEating] = useState(false);
  const [medication, setMedication] = useState(true);
  const [phase, setPhase] = useState("form");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPhase("analyzing");

    try {
      const response = await API.post("/checkin/submit", {
        stress: stress[0],
        mood,
        sleep,
        activity,
        diet: diet[0],
        lateEating,
        medication,
      });

      console.log(response.data);
      setPhase("done");
    } catch (error) {
      console.error(error);
      setPhase("form");
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto">
        <h1 className="font-heading text-2xl font-bold text-foreground mb-1">
          Daily Check-in
        </h1>
        <p className="text-sm text-muted-foreground mb-6">
          Complete your daily health assessment
        </p>

        <AnimatePresence mode="wait">
          {phase === "form" && (
            <motion.form
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              {/* Stress */}
              <div className="health-card space-y-3">
                <Label className="font-heading font-semibold">
                  Stress Level: {stress[0]}/10
                </Label>
                <Slider
                  value={stress}
                  onValueChange={setStress}
                  min={1}
                  max={10}
                  step={1}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Low</span>
                  <span>High</span>
                </div>
              </div>

              {/* Mood */}
              <div className="health-card space-y-3">
                <Label className="font-heading font-semibold">Mood</Label>
                <div className="flex gap-3 justify-center">
                  {moods.map((m, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setMood(i)}
                      className={`flex flex-col items-center gap-1 p-3 rounded-xl transition-all ${
                        mood === i
                          ? "bg-primary/10 ring-2 ring-primary"
                          : "hover:bg-muted"
                      }`}
                    >
                      <span className="text-2xl">{m.emoji}</span>
                      <span className="text-xs text-muted-foreground">
                        {m.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Sleep & Activity */}
              <div className="grid grid-cols-2 gap-4">
                <div className="health-card space-y-2">
                  <Label htmlFor="sleep" className="font-heading font-semibold">
                    Sleep Hours
                  </Label>
                  <Input
                    id="sleep"
                    type="number"
                    step="0.5"
                    placeholder="7.5"
                    value={sleep}
                    onChange={(e) => setSleep(e.target.value)}
                  />
                </div>
                <div className="health-card space-y-2">
                  <Label
                    htmlFor="activity"
                    className="font-heading font-semibold"
                  >
                    Activity (min)
                  </Label>
                  <Input
                    id="activity"
                    type="number"
                    placeholder="30"
                    value={activity}
                    onChange={(e) => setActivity(e.target.value)}
                  />
                </div>
              </div>

              {/* Diet Adherence */}
              <div className="health-card space-y-3">
                <Label className="font-heading font-semibold">
                  Diet Adherence: {diet[0]}/10
                </Label>
                <Slider
                  value={diet}
                  onValueChange={setDiet}
                  min={1}
                  max={10}
                  step={1}
                />
              </div>

              {/* Toggles */}
              <div className="health-card space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="late-eating" className="text-sm">
                    Late Night Eating?
                  </Label>
                  <Switch
                    id="late-eating"
                    checked={lateEating}
                    onCheckedChange={setLateEating}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="medication" className="text-sm">
                    Medication Taken?
                  </Label>
                  <Switch
                    id="medication"
                    checked={medication}
                    onCheckedChange={setMedication}
                  />
                </div>
              </div>

              <Button type="submit" className="w-full" size="lg">
                <Brain className="h-4 w-4 mr-2" /> Analyze My Day
              </Button>
            </motion.form>
          )}

          {phase === "analyzing" && (
            <motion.div
              key="analyzing"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="health-card text-center py-16"
            >
              <div className="relative inline-flex">
                <Loader2 className="h-12 w-12 text-primary animate-spin" />
                <div className="absolute inset-0 rounded-full border-2 border-primary/30 animate-pulse_ring" />
              </div>
              <p className="font-heading font-semibold text-foreground mt-6">
                AI analyzing your behavioral patterns…
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Processing stress, sleep, and activity data
              </p>
            </motion.div>
          )}

          {phase === "done" && (
            <motion.div
              key="done"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="health-card text-center py-16"
            >
              <CheckCircle2 className="h-12 w-12 text-success mx-auto" />
              <p className="font-heading font-semibold text-foreground mt-6">
                Analysis Complete!
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Your insights have been updated. Check your AI Insights page.
              </p>
              <Button
                className="mt-6"
                onClick={() => setPhase("form")}
                variant="outline"
              >
                Submit Another Check-in
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
};

export default DailyCheckin;