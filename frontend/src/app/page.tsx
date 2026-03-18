import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center pt-12 pb-24">
      {/* Hero Section */}
      <section className="text-center max-w-4xl mx-auto px-4 mb-20 animate-fade-in">
        <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight">
          Plan trips with{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent">
            perfect precision
          </span>
        </h1>
        <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
          Trip Us Analyzer predicts exact fuel costs, engine strain, and 
          optimal driving speeds anywhere in the world.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link href="/setup" className="btn-primary text-lg px-8 py-4 w-full sm:w-auto">
            Start Planning
          </Link>
          <Link href="/login" className="btn-secondary text-lg px-8 py-4 w-full sm:w-auto">
            View History
          </Link>
        </div>
      </section>

      {/* Features Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl px-4">
        {[
          {
            title: "🌍 Global Fuel Pricing",
            desc: "Dynamic fuel cost calculation based on the destination country's live rates.",
          },
          {
            title: "🔥 Engine Heat Simulation",
            desc: "Predicts engine overheating risks based on your vehicle, distance, and speed.",
          },
          {
            title: "🏎️ Speed vs Efficiency",
            desc: "Visualizes exactly how much fuel and money you waste by speeding.",
          },
        ].map((feature, idx) => (
          <div key={idx} className="glass-panel p-8 flex flex-col items-center text-center hover:scale-105 transition-transform duration-300">
            <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
            <p className="text-gray-300 leading-relaxed">{feature.desc}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
