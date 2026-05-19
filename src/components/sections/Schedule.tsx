import { useEffect, useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

type ClassRow = {
  id: string;
  day: string;
  time: string;
  class_name: string;
  trainer: string;
  duration: string;
  spots_left: number;
  sort_order: number;
};

export function Schedule() {
  const [rows, setRows] = useState<ClassRow[]>([]);

  async function load() {
    const { data } = await (supabase.from as any)("class_schedule")
      .select("*")
      .order("sort_order", { ascending: true });
    setRows((data ?? []) as ClassRow[]);
  }

  useEffect(() => {
    load();
    const ch = supabase
      .channel("public-class-schedule")
      .on("postgres_changes", { event: "*", schema: "public", table: "class_schedule" }, () => load())
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, []);

  return (
    <section id="schedule" className="py-24 bg-card/30">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs uppercase tracking-[0.3em] neon-text">Schedule</span>
          <h2 className="text-display text-4xl md:text-6xl mt-3">Weekly <span className="neon-text">Class Schedule</span></h2>
        </div>

        <Tabs defaultValue="Mon">
          <TabsList className="bg-card border border-border w-full overflow-x-auto justify-start md:justify-center h-auto p-1 rounded-full">
            {days.map((d) => (
              <TabsTrigger key={d} value={d} className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-5">{d}</TabsTrigger>
            ))}
          </TabsList>
          {days.map((d) => {
            const dayRows = rows.filter((r) => r.day === d);
            return (
              <TabsContent key={d} value={d} className="mt-8">
                <div className="bg-card border border-border rounded-2xl overflow-hidden">
                  <div className="hidden md:grid grid-cols-5 gap-4 px-6 py-4 border-b border-border text-xs uppercase tracking-wider text-muted-foreground">
                    <div>Time</div><div>Class</div><div>Trainer</div><div>Duration</div><div>Spots Left</div>
                  </div>
                  {dayRows.length === 0 ? (
                    <div className="px-6 py-10 text-center text-muted-foreground text-sm">No classes scheduled.</div>
                  ) : dayRows.map((r) => (
                    <div key={r.id} className="grid grid-cols-2 md:grid-cols-5 gap-2 md:gap-4 px-6 py-4 border-b border-border last:border-0 hover:bg-background/40 transition-colors">
                      <div className="font-bold neon-text md:text-foreground md:font-medium">{r.time}</div>
                      <div className="font-bold">{r.class_name}</div>
                      <div className="text-muted-foreground text-sm">{r.trainer}</div>
                      <div className="text-muted-foreground text-sm">{r.duration}</div>
                      <div className="text-sm">
                        <span className={`inline-block rounded-full px-3 py-0.5 text-xs ${r.spots_left > 0 ? "bg-primary/10 text-primary" : "bg-destructive/10 text-destructive"}`}>
                          {r.spots_left > 0 ? `${r.spots_left} spots` : "Full"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            );
          })}
        </Tabs>

        <div className="text-center mt-8">
          <Button asChild variant="neon" size="lg"><a href="#inquiry">Book a Class</a></Button>
        </div>
      </div>
    </section>
  );
}
