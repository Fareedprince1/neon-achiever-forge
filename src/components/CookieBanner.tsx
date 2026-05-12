import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export function CookieBanner() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    if (typeof window !== "undefined" && !localStorage.getItem("ag_cookies")) setShow(true);
  }, []);
  if (!show) return null;
  const accept = () => { localStorage.setItem("ag_cookies", "1"); setShow(false); };
  return (
    <div className="fixed bottom-0 inset-x-0 z-40 bg-card/95 backdrop-blur border-t border-border">
      <div className="container mx-auto max-w-7xl px-4 py-3 flex flex-col sm:flex-row items-center gap-3 justify-between">
        <p className="text-sm text-muted-foreground">We use cookies to improve your experience.</p>
        <div className="flex gap-2">
          <Button variant="neon-outline" size="sm" onClick={accept}>Manage Preferences</Button>
          <Button variant="neon" size="sm" onClick={accept}>Accept All</Button>
        </div>
      </div>
    </div>
  );
}
