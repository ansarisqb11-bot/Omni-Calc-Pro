import { Link, useLocation } from "wouter";
import { Star, ChevronRight, Trash2, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { useFavorites } from "@/hooks/use-favorites";
import {
  Calculator, Wallet, Heart, Ruler, Calendar, MessageSquare, StickyNote, Hash,
  FlaskConical, HardHat, Plane, GraduationCap, Stethoscope, Home as HomeIcon,
  Car, Leaf, Code, ShoppingCart, Globe, ShoppingBag, Palette, Shirt,
  Users, BarChart3, Proportions, Binary, Compass
} from "lucide-react";

const iconMap: Record<string, any> = {
  calculator: Calculator, finance: Wallet, health: Heart, units: Ruler,
  "date-time": Calendar, math: Binary, numbers: Hash, geometry: Compass,
  science: FlaskConical, construction: HardHat, travel: Plane,
  education: GraduationCap, medical: Stethoscope, lifestyle: HomeIcon,
  automobile: Car, agriculture: Leaf, developer: Code, ecommerce: ShoppingCart,
  environment: Globe, "smart-life": ShoppingBag, "size-converter": Shirt,
  "color-tools": Palette, population: Users, development: BarChart3,
  designer: Proportions, "ai-tools": MessageSquare, notes: StickyNote,
};

export default function Favorites() {
  const { favorites, removeFavorite } = useFavorites();
  const [, navigate] = useLocation();

  return (
    <div className="min-h-full bg-background">
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-border/50 px-6 py-4 flex items-center gap-3">
        <button
          onClick={() => window.history.back()}
          className="p-2 hover:bg-muted rounded-xl transition-colors"
          data-testid="button-back"
        >
          <ArrowLeft className="w-4 h-4 text-muted-foreground" />
        </button>
        <div>
          <h1 className="font-bold text-lg text-foreground flex items-center gap-2">
            <Star className="w-5 h-5 fill-primary text-primary" />
            Favorites
          </h1>
          <p className="text-xs text-muted-foreground">{favorites.length} pinned tools</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-6">
        {favorites.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Star className="w-8 h-8 text-muted-foreground/50" />
            </div>
            <h2 className="text-xl font-semibold text-foreground mb-2">No favorites yet</h2>
            <p className="text-muted-foreground mb-6">Pin your most-used tools here for quick access</p>
            <button
              onClick={() => navigate("/")}
              className="px-6 py-2.5 bg-primary text-primary-foreground rounded-xl font-medium hover:opacity-90 transition-opacity"
              data-testid="button-go-home"
            >
              Browse Tools
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {favorites.map((item) => {
              const Icon = iconMap[item.id] || Calculator;
              return (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-card border border-border/60 rounded-2xl p-5 hover:shadow-md transition-all group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className={`w-10 h-10 rounded-xl ${item.color} flex items-center justify-center`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <button
                      onClick={() => removeFavorite(item.id)}
                      className="p-1.5 hover:bg-red-500/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                      data-testid={`button-remove-fav-${item.id}`}
                    >
                      <Trash2 className="w-3.5 h-3.5 text-red-400" />
                    </button>
                  </div>
                  <p className="font-semibold text-sm text-foreground">{item.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5 mb-4 line-clamp-2">{item.description}</p>
                  <Link href={item.href}>
                    <button
                      className="w-full text-center py-2 text-sm font-semibold text-foreground border border-border/60 rounded-xl hover:bg-muted transition-colors flex items-center justify-center gap-1.5"
                      data-testid={`button-open-${item.id}`}
                    >
                      Open Tool <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
