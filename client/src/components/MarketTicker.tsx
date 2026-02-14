import { useSkills } from "@/hooks/use-portfolio";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

export function MarketTicker() {
  const { data: skills } = useSkills();

  // Flatten skills for the ticker
  const tickerItems = skills
    ? skills.flatMap((s) =>
        s.items.map((item) => ({
          symbol: item.toUpperCase().slice(0, 4),
          name: item,
          change: (Math.random() * 5).toFixed(2),
          isPositive: Math.random() > 0.2, // Mostly positive skills!
        }))
      )
    : [];

  if (tickerItems.length === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 w-full bg-card border-t border-border z-40 overflow-hidden py-2">
      <div className="flex w-max ticker-animation hover:[animation-play-state:paused]">
        {[...tickerItems, ...tickerItems].map((item, idx) => (
          <div
            key={`${item.name}-${idx}`}
            className="flex items-center gap-3 px-6 border-r border-border/50 min-w-[180px]"
          >
            <span className="font-mono font-bold text-sm text-foreground">
              {item.symbol}
            </span>
            <span
              className={`flex items-center gap-1 text-xs font-mono ${
                item.isPositive ? "text-primary" : "text-destructive"
              }`}
            >
              {item.change}%
              {item.isPositive ? (
                <ArrowUpRight className="w-3 h-3" />
              ) : (
                <ArrowDownRight className="w-3 h-3" />
              )}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
