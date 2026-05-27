import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus, Crown, Flame } from "lucide-react";
import { SectionHeading, Badge, Avatar } from "../../components/ui/index.jsx";
import { Panel } from "../../components/dashboard/shared.jsx";
import { leaderboard } from "../../data/mockData";

const trendIcon = { up: TrendingUp, down: TrendingDown, same: Minus };
const trendColor = { up: "text-emerald-400", down: "text-rose-400", same: "text-white/30" };

export default function StudentLeaderboard() {
  const podium = leaderboard.slice(0, 3);
  // reorder podium to 2-1-3 for visual
  const podiumOrder = [podium[1], podium[0], podium[2]];
  const heights = ["h-24", "h-32", "h-20"];

  return (
    <div className="space-y-7">
      <SectionHeading title="Leaderboard" subtitle="Compete with learners across ZUKKO AI."
        action={<Badge color="amber"><Flame className="h-3 w-3" /> Weekly</Badge>} />

      {/* Podium */}
      <Panel delay={0}>
        <div className="flex items-end justify-center gap-4 pt-6">
          {podiumOrder.map((p, i) => {
            const isFirst = p.rank === 1;
            return (
              <motion.div key={p.rank} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.12 }}
                className="flex w-24 flex-col items-center sm:w-32">
                {isFirst && <Crown className="mb-1 h-6 w-6 text-amber-400" />}
                <Avatar initials={p.avatar} size="lg" ring={isFirst} />
                <div className="mt-2 text-center">
                  <div className="truncate text-sm font-medium text-white">{p.name}</div>
                  <div className="text-xs text-secondary-400">Band {p.band}</div>
                </div>
                <div className={`mt-3 grid w-full ${heights[i]} place-items-start justify-center rounded-t-xl bg-gradient-to-t ${
                  isFirst ? "from-primary-600/30 to-primary-500/5" : "from-white/[0.06] to-transparent"
                } pt-3`}>
                  <span className="font-display text-2xl font-bold text-white/80">{p.rank}</span>
                </div>
                <div className="mt-1 text-xs font-medium text-white/60">{p.points.toLocaleString()} pts</div>
              </motion.div>
            );
          })}
        </div>
      </Panel>

      {/* Full ranking */}
      <Panel title="Full Ranking" delay={0.1}>
        <div className="space-y-2">
          {leaderboard.map((p, i) => {
            const TIcon = trendIcon[p.trend];
            return (
              <motion.div key={p.rank} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
                className={`flex items-center gap-4 rounded-xl p-3 transition-colors ${
                  p.me ? "border border-primary-500/40 bg-primary-500/[0.08]" : "hover:bg-white/[0.03]"
                }`}>
                <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-lg text-sm font-semibold ${
                  p.rank <= 3 ? "bg-amber-500/15 text-amber-400" : "bg-white/[0.04] text-white/50"
                }`}>{p.rank}</span>
                <Avatar initials={p.avatar} size="sm" ring={p.me} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="truncate text-sm font-medium text-white">{p.name}</span>
                    {p.me && <Badge color="primary">You</Badge>}
                  </div>
                  <div className="text-xs text-white/40">Band {p.band}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-white">{p.points.toLocaleString()}</div>
                  <div className={`flex items-center justify-end gap-0.5 text-[11px] ${trendColor[p.trend]}`}>
                    <TIcon className="h-3 w-3" /> {p.trend === "same" ? "—" : p.trend}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </Panel>
    </div>
  );
}
