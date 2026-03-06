import { AlertTriangle, Award, Calendar, Clock, Copy, CreditCard, Heart, Home, Image, Layout, List, Lock, Mail, MapPin, Package, Palette, Phone, Search, Shield, Smartphone, Star, TrendingUp, User, Users, Zap, Calculator } from "lucide-react";
import type { PainPoint } from "@/data/seo/types";

const iconMap: Record<string, React.ElementType> = {
  "alert-triangle": AlertTriangle,
  award: Award,
  calculator: Calculator,
  calendar: Calendar,
  clock: Clock,
  copy: Copy,
  "credit-card": CreditCard,
  heart: Heart,
  home: Home,
  image: Image,
  layout: Layout,
  list: List,
  lock: Lock,
  mail: Mail,
  "map-pin": MapPin,
  package: Package,
  palette: Palette,
  phone: Phone,
  search: Search,
  shield: Shield,
  smartphone: Smartphone,
  star: Star,
  "trending-up": TrendingUp,
  user: User,
  users: Users,
  zap: Zap,
};

interface PainPointsProps {
  painPoints: PainPoint[];
  industryName: string;
}

export default function PainPoints({ painPoints, industryName }: PainPointsProps) {
  return (
    <section className="max-w-5xl mx-auto px-6 py-16">
      <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-4">
        Is your {industryName.toLowerCase()} website holding you back?
      </h2>
      <p className="text-center text-white/40 mb-14 max-w-xl mx-auto">
        These common website problems cost {industryName.toLowerCase()} businesses customers every single day.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {painPoints.map((point) => {
          const Icon = iconMap[point.icon] || AlertTriangle;
          return (
            <div
              key={point.title}
              className="flex items-start gap-4 p-5 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:border-white/10 transition-all"
            >
              <div className="w-9 h-9 shrink-0 rounded-lg bg-red-500/10 flex items-center justify-center mt-0.5">
                <Icon size={16} className="text-red-400" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white mb-1">{point.title}</h3>
                <p className="text-sm text-white/40 leading-relaxed">{point.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
