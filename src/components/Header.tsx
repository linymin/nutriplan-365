import { Utensils } from 'lucide-react';

export const Header = () => {
  return (
    <header className="py-6 px-4 border-b border-border/50 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/20">
            <Utensils className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-bold text-xl">智膳规划</h1>
            <p className="text-xs text-muted-foreground">智能膳食管家</p>
          </div>
        </div>
        
        <nav className="hidden md:flex items-center gap-6 text-sm">
          <a href="#mode" className="text-muted-foreground hover:text-foreground transition-colors">饮食模式</a>
          <a href="#ingredients" className="text-muted-foreground hover:text-foreground transition-colors">食材选择</a>
          <a href="#plan" className="text-muted-foreground hover:text-foreground transition-colors">今日食谱</a>
          <a href="#grocery" className="text-muted-foreground hover:text-foreground transition-colors">采购清单</a>
        </nav>
      </div>
    </header>
  );
};
