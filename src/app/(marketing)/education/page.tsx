import { BookOpen, TreePine, Lightbulb, Compass } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

export default function EducationPage() {
  const articles = [
    {
      title: 'How to Reduce Your Household Energy Use',
      description: 'Simple and actionable strategies to lower your electricity bill and house carbon footprint.',
      category: 'Home & Energy',
      readTime: '5 min read',
      tips: [
        'Switch to LED lightbulbs (uses 75% less energy than incandescents).',
        'Install a smart thermostat to manage heating and cooling automatically.',
        'Unplug electronic devices when not in use to eliminate "phantom" loads.',
        'Wash clothes in cold water to save on water heating energy.'
      ]
    },
    {
      title: 'Sustainable Commuting: Beyond the Car',
      description: 'Understanding the impact of public transit, electric biking, and carpooling.',
      category: 'Transport & Travel',
      readTime: '6 min read',
      tips: [
        'Walk or bicycle for short trips under 3 kilometers.',
        'Utilize buses or trains instead of private cars for longer commutes.',
        'Transition to electric or hybrid vehicles if public transit is not feasible.',
        'Combine errands to reduce total vehicle travel distances.'
      ]
    },
    {
      title: 'Diet and Climate: The Carbon Cost of Food',
      description: 'How animal agriculture impacts global greenhouse gas emissions and how minor switches help.',
      category: 'Diet & Food',
      readTime: '7 min read',
      tips: [
        'Implement "Meatless Mondays" (reduces meat consumption by 15%).',
        'Prioritize locally grown and seasonal foods to cut food mile transport.',
        'Reduce food waste by planning meals and freezing leftovers.',
        'Choose plant-based milk alternatives over dairy products.'
      ]
    },
    {
      title: 'Zero-Waste Practices for Daily Living',
      description: 'A beginner-friendly guide to reducing landfill waste, composting, and shopping smart.',
      category: 'Waste & Consumption',
      readTime: '4 min read',
      tips: [
        'Carry reusable shopping bags, water bottles, and produce mesh.',
        'Set up a home compost system for fruit and vegetable food scraps.',
        'Buy grains and goods in bulk to minimize single-use packaging waste.',
        'Follow the 5 Rs: Refuse, Reduce, Reuse, Repurpose, Recycle.'
      ]
    }
  ];

  const quickFacts = [
    'Transportation is the largest source of carbon emissions in developed nations, followed closely by electricity generation.',
    'A single tree can absorb approximately 22 kilograms of carbon dioxide per year and store it in its wood.',
    'Meat production generates roughly double the greenhouse gases of plant-based foods.',
    'LED bulbs last up to 25 times longer than traditional incandescent bulbs.'
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8 space-y-12">
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <div className="inline-flex items-center space-x-1.5 text-emerald-600 dark:text-emerald-500 bg-emerald-50 dark:bg-emerald-950/20 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
          <BookOpen className="h-4 w-4" />
          <span>Education Hub</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white sm:text-4xl">
          Sustainability Guides & Articles
        </h1>
        <p className="text-slate-505 text-slate-600 dark:text-slate-400">
          Learn about the science of carbon footprints, find environmental tips, and explore ways to reduce your climate impact.
        </p>
      </div>

      {/* Facts Bar */}
      <div className="bg-emerald-600 rounded-2xl p-6 text-white grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickFacts.map((fact, idx) => (
          <div key={idx} className="flex gap-3 bg-emerald-700/35 p-4 rounded-xl backdrop-blur-sm">
            <Lightbulb className="h-5 w-5 text-emerald-350 shrink-0 text-emerald-300 mt-0.5" />
            <p className="text-xs leading-relaxed text-emerald-50">{fact}</p>
          </div>
        ))}
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {articles.map((art, idx) => (
          <Card key={idx} className="flex flex-col h-full border border-slate-205">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center text-xs font-semibold text-emerald-600 dark:text-emerald-500 mb-1">
                <span>{art.category}</span>
                <span className="text-slate-400 font-normal">{art.readTime}</span>
              </div>
              <CardTitle className="text-xl leading-snug">{art.title}</CardTitle>
              <CardDescription className="text-sm text-slate-500 mt-1">{art.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow flex flex-col justify-between">
              <div className="mt-4 bg-slate-50 dark:bg-slate-800/40 p-4 rounded-lg">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <TreePine className="h-4 w-4 text-emerald-600" />
                  <span>Actionable Eco Tips:</span>
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-650 text-slate-600 dark:text-slate-350">
                  {art.tips.map((tip, tIdx) => (
                    <li key={tIdx} className="flex items-start gap-1.5">
                      <span className="text-emerald-500 select-none font-bold mt-0.5">&bull;</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
