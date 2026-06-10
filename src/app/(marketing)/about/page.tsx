import Link from 'next/link';
import { ShieldAlert, Info, Globe, ChevronRight } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:py-16">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            About CarbonWise
          </h1>
          <p className="mt-4 text-lg text-slate-500 dark:text-slate-400">
            CarbonWise was founded on the belief that large-scale environmental change begins with individual actions. By helping you calculate, understand, and reduce your daily emission score, we empower you to lead a more sustainable life.
          </p>
        </div>

        {/* Vision Card */}
        <div className="bg-emerald-50 dark:bg-emerald-950/20 p-6 rounded-xl border border-emerald-100 dark:border-emerald-900/30 flex items-start space-x-4">
          <Globe className="h-6 w-6 text-emerald-600 dark:text-emerald-400 shrink-0 mt-1" />
          <div>
            <h3 className="font-bold text-slate-900 dark:text-emerald-300">The 2-Tonne Climate Target</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Currently, the average carbon footprint for a person in the United States is around 16 tonnes, while the global average is around 4.8 tonnes. To avoid a 2&deg;C rise in global temperatures, the average global carbon footprint per year needs to drop to under <strong>2 tonnes</strong> by 2050.
            </p>
          </div>
        </div>

        {/* Calculation Science */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Our Calculation Methodology</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            CarbonWise calculates your emissions in kilograms of carbon dioxide equivalent (kg CO2e) based on standard scientific conversion parameters published by the EPA and Carbon Trust:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-slate-200 dark:border-slate-800 p-4 rounded-lg">
              <h4 className="font-semibold text-slate-900 dark:text-white">Travel & Transportation</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Vehicle fuels generate direct CO2. Petrol cars average 0.18 kg/km, whereas electric vehicles produce roughly 0.05 kg/km from grid energy. Public buses release around 0.03 kg/km per passenger.
              </p>
            </div>
            <div className="border border-slate-200 dark:border-slate-800 p-4 rounded-lg">
              <h4 className="font-semibold text-slate-900 dark:text-white">Home Electricity & Utilities</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Electricity emission values are based on grid composition. We use a global baseline of 0.45 kg CO2 per kWh of grid electricity. Water heating and supply average 0.0003 kg CO2 per liter.
              </p>
            </div>
            <div className="border border-slate-200 dark:border-slate-800 p-4 rounded-lg">
              <h4 className="font-semibold text-slate-900 dark:text-white">Food & Diet</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Diets vary in impact due to agriculture methane and supply chain logistics. Meat-heavy diets average 7.2 kg CO2/day, whereas vegan diets average 2.9 kg CO2/day.
              </p>
            </div>
            <div className="border border-slate-200 dark:border-slate-800 p-4 rounded-lg">
              <h4 className="font-semibold text-slate-900 dark:text-white">Waste & Landfills</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Organic waste decaying in landfills produces methane, a potent greenhouse gas. General household waste produces roughly 0.5 kg CO2 equivalent per kilogram of waste.
              </p>
            </div>
          </div>
        </div>

        {/* Call to action */}
        <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
          <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Ready to take the first step?</span>
          <Link href="/register" className="inline-flex items-center space-x-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-5 rounded-lg text-sm transition-colors">
            <span>Calculate Now</span>
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
