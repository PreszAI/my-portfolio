'use client'

import { useEffect, useState } from 'react'

const newsLayouts = [
  {
    name: 'Community News',
    color: 'from-blue-600 to-cyan-500',
    layout: 'community1',
    accent: 'bg-blue-500',
  },
  {
    name: 'Public Safety Times',
    color: 'from-purple-600 to-pink-500',
    layout: 'community2',
    accent: 'bg-purple-500',
  },
  {
    name: 'TechDaily',
    color: 'from-blue-600 to-cyan-500',
    layout: 'modern',
    accent: 'bg-blue-500',
  },
  {
    name: 'Digital Times',
    color: 'from-purple-600 to-pink-500',
    layout: 'classic',
    accent: 'bg-purple-500',
  },
  {
    name: 'Innovation News',
    color: 'from-green-600 to-emerald-500',
    layout: 'minimal',
    accent: 'bg-green-500',
  },
  {
    name: 'Tech Chronicle',
    color: 'from-orange-600 to-red-500',
    layout: 'bold',
    accent: 'bg-orange-500',
  },
  {
    name: 'Future Press',
    color: 'from-indigo-600 to-violet-500',
    layout: 'grid',
    accent: 'bg-indigo-500',
  },
  {
    name: 'AI Weekly',
    color: 'from-teal-600 to-blue-500',
    layout: 'magazine',
    accent: 'bg-teal-500',
  },
]

export default function NewsFlash() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isVisible, setIsVisible] = useState(true)
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    // Don't start interval if hovered
    if (isHovered) {
      return
    }

    const interval = setInterval(() => {
      setIsVisible(false)
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % newsLayouts.length)
        setIsVisible(true)
      }, 100) // Brief fade for transition effect
    }, 2000) // Slower cuts every 2 seconds for better readability

    return () => clearInterval(interval)
  }, [isHovered])

  const currentLayout = newsLayouts[currentIndex]

  const renderLayout = () => {
    switch (currentLayout.layout) {
      case 'community1':
        return (
          <div className="relative h-full w-full overflow-hidden rounded-lg bg-blue-950 p-6">
            <div className="mb-4 flex items-center justify-between border-b border-blue-700 pb-3">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 flex items-center justify-center rounded-lg bg-blue-600 border-2 border-blue-400">
                  <svg className="h-7 w-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2L3 7v5c0 4.55 2.89 8.74 7.39 11.15L12 24l1.61-.85C18.11 20.74 21 16.55 21 12V7l-9-5z"/>
                  </svg>
                </div>
                <span className="text-lg font-black uppercase tracking-wider text-blue-300">COMMUNITY NEWS</span>
              </div>
              <div className="flex gap-1.5">
                <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                <div className="h-2 w-2 rounded-full bg-cyan-400"></div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="h-36 w-48 flex-shrink-0 rounded-lg overflow-hidden relative">
                  <img 
                    src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&h=300&fit=crop&q=80" 
                    alt="Community Policing" 
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <div className="text-base font-bold text-blue-300">AI-Powered Community Policing Initiative Launches</div>
                  <div className="mt-2 text-sm text-blue-200">Police departments adopt intelligent systems to enhance neighborhood safety through predictive analytics and community engagement programs</div>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-3">
                <div className="space-y-1 rounded bg-blue-900 p-3 relative overflow-hidden">
                  <div className="text-xs font-bold text-cyan-400">NEIGHBORHOOD</div>
                  <div className="text-xs text-blue-300">Watch programs expand</div>
                </div>
                <div className="space-y-1 rounded bg-blue-900 p-3 relative overflow-hidden">
                  <div className="text-xs font-bold text-blue-400">OUTREACH</div>
                  <div className="text-xs text-blue-300">Youth engagement rises</div>
                </div>
                <div className="space-y-1 rounded bg-blue-900 p-3 relative overflow-hidden">
                  <div className="text-xs font-bold text-purple-400">SAFETY</div>
                  <div className="text-xs text-blue-300">Crime rates drop 40%</div>
                </div>
              </div>
            </div>
          </div>
        )

      case 'community2':
        return (
          <div className="relative h-full w-full overflow-hidden rounded-lg bg-indigo-950 p-6 shadow-xl">
            <div className="mb-4 border-b-4 border-indigo-700 pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 flex items-center justify-center rounded bg-indigo-700 border-2 border-indigo-500">
                    <svg className="h-7 w-7 text-indigo-200" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
                    </svg>
                  </div>
                  <span className="text-xl font-serif font-black text-indigo-300">PUBLIC SAFETY TIMES</span>
                </div>
                <div className="text-sm font-serif text-indigo-400">EST. 2024</div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="text-base font-serif font-bold text-indigo-200">Officers Deploy Smart Technology for Better Community Relations</div>
              <div className="text-sm font-serif text-indigo-300">Law enforcement agencies integrate AI tools to improve response times and strengthen trust with local residents through transparent communication platforms</div>
              <div className="text-sm font-serif text-indigo-400">By Maria Rodriguez • 2 hours ago</div>
              <div className="mt-4 flex gap-4 border-t border-indigo-700 pt-4">
                <div className="h-36 w-48 flex-shrink-0 rounded border-2 border-indigo-600 overflow-hidden relative">
                  <img 
                    src="https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=400&h=300&fit=crop&q=80" 
                    alt="Community Engagement" 
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex-1 space-y-2">
                  <div className="text-sm font-bold text-indigo-200">Digital Patrol Units Enhance Visibility</div>
                  <div className="text-sm text-indigo-300">Real-time data sharing platforms connect officers with community members, enabling faster emergency response and proactive crime prevention strategies</div>
                </div>
              </div>
            </div>
          </div>
        )

      case 'modern':
        return (
          <div className="relative h-full w-full overflow-hidden rounded-lg bg-slate-900 p-6">
            <div className="mb-4 flex items-center justify-between border-b border-slate-700 pb-3">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 flex items-center justify-center rounded-lg bg-blue-600 border-2 border-blue-400">
                  <svg className="h-7 w-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                </div>
                <span className="text-lg font-black uppercase tracking-wider text-slate-300">TECHDAILY</span>
              </div>
              <div className="flex gap-1.5">
                <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                <div className="h-2 w-2 rounded-full bg-cyan-400"></div>
                <div className="h-2 w-2 rounded-full bg-slate-600"></div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="h-36 w-48 flex-shrink-0 rounded-lg overflow-hidden relative">
                  <img 
                    src="https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=300&fit=crop&q=80" 
                    alt="AI Neural Network" 
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <div className="text-base font-semibold text-blue-400">Breaking: AI Models Achieve Human-Level Reasoning</div>
                  <div className="mt-2 text-sm text-slate-400">New neural architecture processes complex logic 10x faster than previous systems</div>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-3">
                <div className="space-y-1 rounded bg-slate-700 p-3 relative overflow-hidden">
                  <div className="text-xs font-bold text-cyan-400">QUANTUM</div>
                  <div className="text-xs text-slate-500">Computing breakthrough</div>
                </div>
                <div className="space-y-1 rounded bg-slate-700 p-3 relative overflow-hidden">
                  <div className="text-xs font-bold text-blue-400">ROBOTICS</div>
                  <div className="text-xs text-slate-500">Humanoid AI debut</div>
                </div>
                <div className="space-y-1 rounded bg-slate-700 p-3 relative overflow-hidden">
                  <div className="text-xs font-bold text-purple-400">NEURAL</div>
                  <div className="text-xs text-slate-500">Brain-computer link</div>
                </div>
              </div>
            </div>
          </div>
        )

      case 'classic':
        return (
          <div className="relative h-full w-full overflow-hidden rounded-lg bg-white p-6 shadow-xl">
            <div className="mb-4 border-b-4 border-gray-900 pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 flex items-center justify-center rounded bg-gray-900 border-2 border-gray-700">
                    <svg className="h-7 w-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
                    </svg>
                  </div>
                  <span className="text-xl font-serif font-black text-gray-900">DIGITAL TIMES</span>
                </div>
                <div className="text-sm font-serif text-gray-600">EST. 2024</div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="text-base font-serif font-bold text-gray-900">Tech Giants Unveil Next-Gen AI Assistant</div>
              <div className="text-sm font-serif text-gray-700">Leading companies announce revolutionary artificial intelligence capable of real-time translation across 200 languages...</div>
              <div className="text-sm font-serif text-gray-600">By Sarah Chen • 3 hours ago</div>
              <div className="mt-4 flex gap-4 border-t border-gray-300 pt-4">
                <div className="h-36 w-48 flex-shrink-0 rounded border-2 border-gray-400 overflow-hidden relative">
                  <img 
                    src="https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=300&fit=crop&q=80" 
                    alt="Quantum Computing" 
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex-1 space-y-2">
                  <div className="text-sm font-bold text-gray-900">Quantum Processors Hit Milestone</div>
                  <div className="text-sm text-gray-600">Scientists achieve stable quantum entanglement for 24 hours, paving way for practical quantum computing...</div>
                </div>
              </div>
            </div>
          </div>
        )

      case 'minimal':
        return (
          <div className="relative h-full w-full overflow-hidden rounded-lg bg-gray-50 p-6">
            <div className="mb-4 flex items-center gap-3">
              <div className="h-12 w-12 flex items-center justify-center rounded-full bg-green-600 border-2 border-green-400">
                <svg className="h-7 w-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 21c0 .5.4 1 1 1h4c.6 0 1-.5 1-1v-1H9v1zm3-19C8.1 2 5 5.1 5 9c0 2.4 1.2 4.5 3 5.7V17c0 .5.4 1 1 1h6c.6 0 1-.5 1-1v-2.3c1.8-1.3 3-3.4 3-5.7 0-3.9-3.1-7-7-7z"/>
                </svg>
              </div>
              <span className="text-lg font-black text-gray-700">INNOVATION NEWS</span>
            </div>
            <div className="space-y-4">
              <div className="flex gap-4 border-l-2 border-green-500 pl-3">
                <div className="h-28 w-40 flex-shrink-0 rounded overflow-hidden relative">
                  <img 
                    src="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=300&fit=crop&q=80" 
                    alt="Data Center" 
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900">Machine Learning Model Reduces Energy Consumption by 85%</div>
                  <div className="mt-2 text-sm text-gray-600">New algorithm optimizes data center operations using predictive analytics</div>
                </div>
              </div>
              <div className="flex gap-4 border-l-2 border-emerald-400 pl-3">
                <div className="h-28 w-40 flex-shrink-0 rounded overflow-hidden relative">
                  <img 
                    src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop&q=80" 
                    alt="Autonomous Vehicle" 
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900">Autonomous Vehicles Pass Safety Threshold</div>
                  <div className="mt-2 text-sm text-gray-600">Self-driving technology achieves 99.9% accuracy in urban environments</div>
                </div>
              </div>
            </div>
          </div>
        )

      case 'bold':
        return (
          <div className="relative h-full w-full overflow-hidden rounded-lg bg-orange-900 p-6">
            <div className="mb-4 flex items-center justify-between border-b-2 border-orange-500 pb-3">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 flex items-center justify-center rounded-lg bg-orange-600 border-2 border-orange-400">
                  <svg className="h-7 w-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.67v-1.93c-1.71-.36-3.16-1.46-3.27-3.4h1.96c.1 1.05.82 1.87 2.65 1.87 1.96 0 2.4-.98 2.4-1.59 0-.83-.44-1.61-2.67-2.14-2.48-.6-4.18-1.62-4.18-3.67 0-1.72 1.39-2.84 3.11-3.21V4h2.67v1.95c1.86.45 2.79 1.86 2.85 3.39H14.3c-.05-1.11-.64-1.87-2.22-1.87-1.5 0-2.4.68-2.4 1.64 0 .84.65 1.39 2.67 1.91s4.18 1.39 4.18 3.91c-.01 1.83-1.38 2.83-3.12 3.16z"/>
                  </svg>
                </div>
                <span className="text-xl font-black uppercase tracking-widest text-white">TECH CHRONICLE</span>
              </div>
              <div className="flex gap-2">
                <div className="h-4 w-4 rounded-full bg-orange-400 animate-pulse"></div>
                <div className="h-4 w-4 rounded-full bg-red-400"></div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="h-36 w-48 flex-shrink-0 rounded-lg overflow-hidden relative">
                  <img 
                    src="https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=300&fit=crop&q=80" 
                    alt="AI Neural Networks" 
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <div className="text-base font-black uppercase text-orange-300">AI BREAKTHROUGH: NEURAL NETWORKS MATCH HUMAN CREATIVITY</div>
                  <div className="mt-2 text-sm text-orange-200">Researchers demonstrate artificial intelligence generating original art, music, and literature indistinguishable from human works</div>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-lg border-2 border-orange-500 bg-orange-800 p-3 relative overflow-hidden">
                  <div className="text-sm font-bold text-orange-300">BLOCKCHAIN</div>
                  <div className="mt-1 text-xs text-orange-200">Crypto AI tokens surge 300%</div>
                </div>
                <div className="rounded-lg border-2 border-red-500 bg-red-800 p-3 relative overflow-hidden">
                  <div className="text-sm font-bold text-red-300">BIOTECH</div>
                  <div className="mt-1 text-xs text-red-200">AI-designed drugs enter trials</div>
                </div>
              </div>
            </div>
          </div>
        )

      case 'grid':
        return (
          <div className="relative h-full w-full overflow-hidden rounded-lg bg-indigo-950 p-6">
            <div className="mb-4 flex items-center justify-between border-b border-indigo-800 pb-3">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 flex items-center justify-center rounded-lg bg-indigo-700 border-2 border-indigo-500">
                  <svg className="h-7 w-7 text-indigo-200" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                </div>
                <span className="text-lg font-black uppercase tracking-wider text-indigo-400">FUTURE PRESS</span>
              </div>
              <div className="flex gap-2">
                <div className="text-center text-xs font-bold text-indigo-400">AI</div>
                <div className="text-center text-xs font-bold text-indigo-400">TECH</div>
                <div className="text-center text-xs font-bold text-indigo-400">FUTURE</div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="h-36 w-48 flex-shrink-0 rounded-lg overflow-hidden relative">
                  <img 
                    src="https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=300&fit=crop&q=80" 
                    alt="AI Robot" 
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <div className="text-base font-bold text-indigo-300">Synthetic Intelligence Reaches Sentience Threshold</div>
                  <div className="mt-2 text-sm text-indigo-400">Advanced AI systems demonstrate self-awareness markers in controlled laboratory environments. Ethical debates intensify.</div>
                </div>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-3">
                <div className="text-xs text-indigo-500 relative overflow-hidden rounded bg-indigo-900 p-3">
                  <div className="font-semibold text-indigo-400">• VR Revolution</div>
                  <div>Meta-reality headsets</div>
                </div>
                <div className="text-xs text-indigo-500 relative overflow-hidden rounded bg-indigo-900 p-3">
                  <div className="font-semibold text-indigo-400">• Smart Cities</div>
                  <div>IoT infrastructure expands</div>
                </div>
              </div>
            </div>
          </div>
        )

      case 'magazine':
        return (
          <div className="relative h-full w-full overflow-hidden rounded-lg bg-teal-50 p-6">
            <div className="mb-4 flex items-center gap-3 border-l-4 border-teal-500 pl-3">
              <div className="h-12 w-12 flex items-center justify-center rounded-lg bg-teal-600 border-2 border-teal-400">
                <svg className="h-7 w-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                </svg>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-black uppercase tracking-wider text-teal-700">AI WEEKLY</span>
                <span className="text-sm font-bold text-teal-600">ISSUE 47</span>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="h-36 w-48 flex-shrink-0 rounded-lg overflow-hidden relative">
                  <img 
                    src="https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=400&h=300&fit=crop&q=80" 
                    alt="Medical AI" 
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <div className="text-base font-bold text-teal-900">Deep Learning Transforms Medical Diagnostics</div>
                  <div className="mt-2 text-sm text-teal-700">AI algorithms now detect diseases earlier than human specialists with 98% accuracy rates in preliminary studies</div>
                </div>
              </div>
              <div className="mt-4 flex gap-3 border-t border-teal-200 pt-4">
                <div className="h-28 w-40 flex-shrink-0 rounded overflow-hidden relative">
                  <img 
                    src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=300&fit=crop&q=80" 
                    alt="Edge Computing" 
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="text-sm font-semibold text-teal-800">Edge Computing Meets AI</div>
                  <div className="text-xs text-teal-600">On-device processing eliminates cloud dependency</div>
                </div>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div 
      className="relative h-64 w-full overflow-hidden rounded-2xl border border-border bg-surface md:h-80 dark:border-white dark:bg-surface"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Rapidly Changing Background UI */}
      <div
        className={`absolute inset-0 z-10 transition-opacity duration-150 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ transitionTimingFunction: 'ease-in-out' }}
      >
        {renderLayout()}
      </div>
    </div>
  )
}

