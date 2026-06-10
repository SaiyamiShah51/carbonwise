import Link from 'next/link';
import { 
  Leaf, 
  Calculator, 
  Lightbulb, 
  Target, 
  Trophy, 
  LineChart, 
  ShieldCheck, 
  Award,
  Globe
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="relative overflow-hidden bg-white dark:bg-slate-900 transition-colors">
      {/* Hero Section */}
      <div className="relative pt-16 pb-20 px-4 sm:px-6 lg:pt-24 lg:pb-28 lg:px-8">
        <div className="absolute inset-0">
          <div className="h-1/3 bg-emerald-50/30 dark:bg-emerald-950/10 sm:h-2/3" />
        </div>
        <div className="relative max-w-7xl mx-auto">
          <div className="text-center">
            <div className="inline-flex items-center space-x-2 bg-emerald-100/80 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase mb-6 animate-pulse">
              <Leaf className="h-3.5 w-3.5" />
              <span>Climate Action Platform</span>
            </div>
            
            <h1 className="text-4xl tracking-tight font-extrabold text-slate-900 dark:text-white sm:text-5xl md:text-6xl">
              <span className="block xl:inline">Track your footprint.</span>{' '}
              <span className="block text-emerald-600 dark:text-emerald-500 xl:inline">Preserve our planet.</span>
            </h1>
            
            <p className="mt-3 max-w-md mx-auto text-base text-slate-500 dark:text-slate-400 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              CarbonWise helps you calculate your carbon emissions, track your daily and monthly progress, participate in sustainable challenges, and leverage Google Gemini AI to get personalized eco-friendly reduction guides.
            </p>
            
            <div className="mt-8 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
              <div className="rounded-md shadow">
                <Link
                  href="/register"
                  className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-bold rounded-lg text-white bg-emerald-600 hover:bg-emerald-700 md:py-4 md:text-lg md:px-10 transition-colors"
                >
                  Start Calculator
                </Link>
              </div>
              <div className="mt-3 rounded-md sm:mt-0 sm:ml-3">
                <Link
                  href="/about"
                  className="w-full flex items-center justify-center px-8 py-3 border border-slate-300 dark:border-slate-700 text-base font-semibold rounded-lg text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 md:py-4 md:text-lg md:px-10 transition-colors"
                >
                  Learn More
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Grid */}
      <div className="py-12 bg-slate-50 dark:bg-slate-950/30 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-emerald-600 dark:text-emerald-500 font-semibold tracking-wide uppercase">Core Platform Features</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              Everything you need to go green
            </p>
          </div>

          <div className="mt-10">
            <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
              {/* Feature 1 */}
              <div className="relative bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm transition-all hover:-translate-y-1">
                <dt>
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-lg bg-emerald-500 text-white">
                    <Calculator className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <p className="ml-16 text-lg leading-6 font-bold text-slate-900 dark:text-white">Smart Carbon Calculator</p>
                </dt>
                <dd className="mt-2 ml-16 text-base text-slate-500 dark:text-slate-400">
                  Quickly calculate travel, housing, and dietary emissions. Automatically scales to daily, monthly, and annual calculations.
                </dd>
              </div>

              {/* Feature 2 */}
              <div className="relative bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm transition-all hover:-translate-y-1">
                <dt>
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-lg bg-emerald-500 text-white">
                    <Lightbulb className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <p className="ml-16 text-lg leading-6 font-bold text-slate-900 dark:text-white">AI Sustainability Insights</p>
                </dt>
                <dd className="mt-2 ml-16 text-base text-slate-500 dark:text-slate-400">
                  Leverages Google Gemini AI to analyze your footprint, pinpoint emission hotspots, and generate actionable reduction plans.
                </dd>
              </div>

              {/* Feature 3 */}
              <div className="relative bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm transition-all hover:-translate-y-1">
                <dt>
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-lg bg-emerald-500 text-white">
                    <Target className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <p className="ml-16 text-lg leading-6 font-bold text-slate-900 dark:text-white">Goal & Progress Tracker</p>
                </dt>
                <dd className="mt-2 ml-16 text-base text-slate-500 dark:text-slate-400">
                  Set target values, track deadlines, and monitor your current stats across energy, transport, food, and water habits.
                </dd>
              </div>

              {/* Feature 4 */}
              <div className="relative bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm transition-all hover:-translate-y-1">
                <dt>
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-lg bg-emerald-500 text-white">
                    <Trophy className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <p className="ml-16 text-lg leading-6 font-bold text-slate-900 dark:text-white">Eco Challenges & Badges</p>
                </dt>
                <dd className="mt-2 ml-16 text-base text-slate-500 dark:text-slate-400">
                  Join structured challenges like "No-Car Day" and "Plastic Free Week" to build green habits, and track completion progress.
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      {/* Info Stats Section */}
      <div className="py-16 bg-white dark:bg-slate-900 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-emerald-600 rounded-2xl shadow-xl overflow-hidden lg:grid lg:grid-cols-2 lg:gap-4">
            <div className="pt-10 pb-12 px-6 sm:pt-16 sm:px-16 lg:py-16 lg:pr-0 xl:py-20 xl:px-20">
              <div className="lg:self-center">
                <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
                  <span className="block">Ready to understand your impact?</span>
                </h2>
                <p className="mt-4 text-lg leading-6 text-emerald-100">
                  Global targets require halving carbon emissions by 2030 to prevent dangerous heating. Every action starts with understanding your individual score.
                </p>
                <Link
                  href="/register"
                  className="mt-8 bg-white border border-transparent rounded-lg shadow px-6 py-3 inline-flex items-center text-base font-bold text-emerald-700 hover:bg-emerald-50 transition-colors"
                >
                  Join CarbonWise
                </Link>
              </div>
            </div>
            <div className="relative -mt-6 aspect-w-5 aspect-h-3 md:aspect-w-2 md:aspect-h-1 lg:aspect-none">
              <div className="absolute inset-0 flex items-center justify-center p-8 bg-emerald-700/50">
                <div className="grid grid-cols-2 gap-4 text-center text-white">
                  <div className="bg-emerald-850 bg-emerald-800/40 p-6 rounded-lg backdrop-blur-sm">
                    <Globe className="h-8 w-8 mx-auto text-emerald-300 mb-2" />
                    <span className="block text-2xl font-bold">4.8 Tonnes</span>
                    <span className="text-xs text-emerald-200">Avg Global footprint/person</span>
                  </div>
                  <div className="bg-emerald-850 bg-emerald-800/40 p-6 rounded-lg backdrop-blur-sm">
                    <LineChart className="h-8 w-8 mx-auto text-emerald-300 mb-2" />
                    <span className="block text-2xl font-bold">2.0 Tonnes</span>
                    <span className="text-xs text-emerald-200">Target global footprint/person</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
