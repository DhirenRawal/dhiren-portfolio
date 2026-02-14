import { useMarketData } from "@/hooks/use-portfolio";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

export function MarketTicker() {
  const { data: marketData } = useMarketData();

  if (!marketData || marketData.length === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 w-full bg-card/80 backdrop-blur-md border-t border-border z-40 overflow-hidden py-2 shadow-[0_-4px_10px_rgba(0,0,0,0.1)]">
      <div className="flex w-max ticker-animation hover:[animation-play-state:paused]">
        {[...marketData, ...marketData].map((item, idx) => {
          const isPositive = parseFloat(item.change) >= 0;
          return (
            <div
              key={`${item.symbol}-${idx}`}
              className="flex items-center gap-4 px-8 border-r border-border/50 min-w-[220px]"
            >
              <div className="flex flex-col">
                <span className="font-mono font-bold text-sm text-foreground tracking-tighter">
                  {item.symbol}
                </span>
                <span className="text-[10px] text-muted-foreground uppercase font-mono">
                  {item.category}
                </span>
              </div>
              
              <div className="flex flex-col items-end">
                <span className="font-mono font-bold text-sm">
                  {item.price}
                </span>
                <span
                  className={`flex items-center gap-1 text-[11px] font-mono font-bold ${
                    isPositive ? "text-primary" : "text-destructive"
                  }`}
                >
                  {isPositive ? "+" : ""}{item.changePercent}%
                  {isPositive ? (
                    <ArrowUpRight className="w-3 h-3" />
                  ) : (
                    <ArrowDownRight className="w-3 h-3" />
                  )}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
