import { ArrowDown, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
export function HeroSection() {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
      });
    }
  };
  return (
    <section className="relative min-h-screen flex items-start pt-20 md:pt-24 lg:pt-28 justify-center overflow-hidden">
      {/* Background with overlay */}
      <div
        className="absolute inset-0 bg-cover bg-no-repeat"
        style={{
          backgroundImage: `url('/lovable-uploads/6981c508-f88f-4bdf-baa6-6c416cf4c78d.png')`,
          backgroundPosition: "center 30%", // Adjust this value: 50% = center, higher % = image moves down
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-transparent to-background/60 my-0" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="max-w-4xl mx-auto my-[10px] mb-[10px] opacity-100 shadow-none pl-0 pt-0 pb-0">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-primary/80 backdrop-blur-sm px-4 py-2 rounded-full mb-6 animate-fade-in">
            <span className="text-primary-foreground text-sm font-medium">🌿 Licensed Plant Nursery</span>
          </div>

          {/* Main Heading */}
          <h1
            className="font-serif text-5xl md:text-7xl font-bold mb-6 animate-fade-in-up text-center lg:text-7xl text-secondary-foreground"
            style={{
              animationDelay: "0.1s",
            }}
          >
            Whattheficusthat
          </h1>

          {/* Tagline */}
          <p
            className="text-xl mb-8 animate-fade-in-up font-serif text-secondary-foreground md:text-3xl"
            style={{
              animationDelay: "0.2s",
            }}
          >
            Your Plant Plug 🔌🍀 — Rare & Exotic Plants, Shipped to Your Door
          </p>

          {/* CTA Buttons */}
          <div
            className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up"
            style={{
              animationDelay: "0.3s",
            }}
          >
            <Button
              size="lg"
              className="bg-accent hover:bg-accent/90 text-accent-foreground px-8 py-6 text-lg rounded-full"
              onClick={() => scrollToSection("shop")}
            >
              Shop Plants
            </Button>
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg rounded-full"
              onClick={() => scrollToSection("live")}
            >
              <Play className="mr-2 h-5 w-5" />
              Watch Live
            </Button>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <button
            onClick={() => scrollToSection("trust")}
            className="text-primary/70 hover:text-primary transition-colors"
            aria-label="Scroll down"
          >
            <ArrowDown className="h-8 w-8" />
          </button>
        </div>
      </div>
    </section>
  );
}
