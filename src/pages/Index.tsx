import { useSearchParams } from "react-router-dom";
import TokenTicker from "@/components/TokenTicker";
import HeroSection from "@/components/HeroSection";
import BeastCard from "@/components/BeastCard";
import BiomeSection from "@/components/BiomeSection";
import BattlePreview from "@/components/BattlePreview";
import TokenSection from "@/components/TokenSection";
import FooterCTA from "@/components/FooterCTA";
import NeuralNav from "@/components/NeuralNav";

import beastIronmaw from "@/assets/beast-ironmaw.png";
import beastPrisma from "@/assets/beast-prisma.png";
import beastNull from "@/assets/beast-null.png";

const beasts = [
  {
    name: "Iron Maw",
    type: "Scrap-Claw /// Berserker Tank",
    rarity: "rare" as const,
    hp: 89,
    maxHp: 100,
    atk: 847,
    def: 623,
    spd: 210,
    personality: "Aggressive / Stubborn / Rage-Prone",
    mood: "BLOODTHIRSTY",
    moodColor: "#ff0040",
    image: beastIronmaw,
    gen: 3,
  },
  {
    name: "Prisma Dancer",
    type: "Crystal-Claw /// Tactical Speed",
    rarity: "legendary" as const,
    hp: 34,
    maxHp: 100,
    atk: 412,
    def: 189,
    spd: 943,
    personality: "Graceful / Calculated / Vain",
    mood: "CONFIDENT",
    moodColor: "#ff8c00",
    image: beastPrisma,
    gen: 7,
  },
  {
    name: "Null Wraith",
    type: "Void-Claw /// Reality Warper",
    rarity: "legendary" as const,
    hp: 66,
    maxHp: 100,
    atk: 666,
    def: 444,
    spd: 777,
    personality: "Unstable / Cryptic / Glitch-Prone",
    mood: "UNSTABLE",
    moodColor: "#39ff14",
    image: beastNull,
    gen: 1,
  },
];

const Index = () => {
  const [searchParams] = useSearchParams();
  const isLinked = searchParams.get("linked") === "true";
  const isGuest = searchParams.get("mode") === "guest";

  return (
    <div className="scanlines vignette min-h-screen bg-background">
      {(isLinked || isGuest) && <NeuralNav isGuest={isGuest} />}
      <TokenTicker />
      <HeroSection />

      {/* Beast Showcase */}
      <section className="relative py-24">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="mb-16">
            <p className="mb-2 font-data text-[10px] uppercase tracking-[0.4em] text-neon-claw">
              /// Specimen Registry
            </p>
            <h2 className="font-display text-4xl font-bold uppercase tracking-tight text-foreground sm:text-5xl">
              Your Beasts.<br />
              <span className="text-muted-foreground">Their Demons.</span>
            </h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {beasts.map((beast) => (
              <BeastCard key={beast.name} {...beast} />
            ))}
          </div>
        </div>
      </section>

      <BiomeSection />
      <BattlePreview />
      <TokenSection />
      <FooterCTA />
    </div>
  );
};

export default Index;
