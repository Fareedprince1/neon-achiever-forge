import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const baseRows = [
  ["6:00 AM", "HIIT Burn", "Alex Power", "45 min", "8 spots"],
  ["8:00 AM", "Strength Build", "Logan Steel", "60 min", "5 spots"],
  ["10:00 AM", "Mobility Flow", "Priya Sharma", "40 min", "10 spots"],
  ["6:00 PM", "Zumba", "Maya Cruz", "45 min", "12 spots"],
  ["7:00 PM", "Hypertrophy", "Logan Steel", "60 min", "6 spots"],
  ["8:00 PM", "Yoga & Stretch", "Priya Sharma", "30 min", "Open"],
];

export function Schedule() {
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
          {days.map((d) => (
            <TabsContent key={d} value={d} className="mt-8">
              <div className="bg-card border border-border rounded-2xl overflow-hidden">
                <div className="hidden md:grid grid-cols-5 gap-4 px-6 py-4 border-b border-border text-xs uppercase tracking-wider text-muted-foreground">
                  <div>Time</div><div>Class</div><div>Trainer</div><div>Duration</div><div>Spots Left</div>
                </div>
                {baseRows.map((r, i) => (
                  <div key={i} className="grid grid-cols-2 md:grid-cols-5 gap-2 md:gap-4 px-6 py-4 border-b border-border last:border-0 hover:bg-background/40 transition-colors">
                    <div className="font-bold neon-text md:text-foreground md:font-medium">{r[0]}</div>
                    <div className="font-bold">{r[1]}</div>
                    <div className="text-muted-foreground text-sm">{r[2]}</div>
                    <div className="text-muted-foreground text-sm">{r[3]}</div>
                    <div className="text-sm"><span className="inline-block bg-primary/10 text-primary rounded-full px-3 py-0.5 text-xs">{r[4]}</span></div>
                  </div>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>

        <div className="text-center mt-8">
          <Button asChild variant="neon" size="lg"><a href="#trial">Book a Class</a></Button>
        </div>
      </div>
    </section>
  );
}
