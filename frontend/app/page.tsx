import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function Home() {
  return (
    <div className="relative min-h-[90vh] flex flex-col items-center justify-center overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-green-50 to-white -z-10" />
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-green-200 rounded-full blur-[100px] opacity-30 animate-pulse" />

      <div className="container mx-auto px-4 text-center z-10">
        <Badge className="mb-6 bg-green-100 text-green-800 border-green-200 px-4 py-2 text-sm">
          🌱 Revolutionizing Agricultural Waste
        </Badge>

        <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 mb-6 leading-tight tracking-tight">
          Turn Waste into <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-500">Value</span>
        </h1>

        <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
          Connect directly with verified buyers. Sell your agricultural by-products and simplified stubble management while earning new revenue streams.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link href="/signup">
            <Button size="lg" className="rounded-full px-10 shadow-lg hover:shadow-green-500/20">
              Start Selling Now
            </Button>
          </Link>
          <Link href="/dashboard/company">
            <Button size="lg" variant="outline" className="rounded-full px-10">
              Browse Marketplace
            </Button>
          </Link>
        </div>

        <div className="mt-20 grid md:grid-cols-3 gap-8 text-left">
          <FeatureCard
            title="For Farmers"
            desc="List waste easily from your phone. Get fair prices and instant connection with buyers."
            icon="🌾"
          />
          <FeatureCard
            title="For Companies"
            desc="Source raw biomass efficiently. Track orders and manage supply chains seamlessly."
            icon="🏭"
          />
          <FeatureCard
            title="For Planet"
            desc="Reduce crop burning pollution. Promote circular economy and sustainable practices."
            icon="🌍"
          />
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ title, desc, icon }: { title: string, desc: string, icon: string }) {
  return (
    <div className="bg-white/60 backdrop-blur-sm p-8 rounded-2xl border border-gray-100 hover:border-green-200 transition-colors shadow-sm hover:shadow-md">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{desc}</p>
    </div>
  );
}

function Badge({ children, className }: any) {
  return <span className={`inline-block rounded-full ${className}`}>{children}</span>;
}
