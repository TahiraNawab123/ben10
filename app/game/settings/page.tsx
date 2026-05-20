import Link from 'next/link'
import { ArrowLeft, Volume2, Zap } from 'lucide-react'

export const metadata = {
  title: 'BEN10 - Settings',
  description: 'Adjust game settings and preferences',
}

export default function SettingsPage() {
  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-green-500 rounded-full mix-blend-multiply filter blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl" />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto">
        <Link
          href="/game/menu"
          className="flex items-center gap-2 text-gray-400 hover:text-gray-200 mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          BACK
        </Link>

        <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-cyan-400 mb-12">
          SETTINGS
        </h1>

        <div className="space-y-6">
          <div className="bg-slate-800 border-2 border-slate-600 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <Volume2 className="w-6 h-6 text-green-400" />
              <h2 className="text-xl font-black text-green-300">AUDIO</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="flex items-center justify-between mb-2">
                  <span className="text-gray-300">Master Volume</span>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    defaultValue="80"
                    className="w-32"
                  />
                </label>
              </div>
              <div>
                <label className="flex items-center justify-between">
                  <span className="text-gray-300">Sound Effects</span>
                  <input type="checkbox" defaultChecked className="w-5 h-5" />
                </label>
              </div>
              <div>
                <label className="flex items-center justify-between">
                  <span className="text-gray-300">Background Music</span>
                  <input type="checkbox" defaultChecked className="w-5 h-5" />
                </label>
              </div>
            </div>
          </div>

          <div className="bg-slate-800 border-2 border-slate-600 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <Zap className="w-6 h-6 text-cyan-400" />
              <h2 className="text-xl font-black text-cyan-300">GAMEPLAY</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="flex items-center justify-between">
                  <span className="text-gray-300">Show FPS Counter</span>
                  <input type="checkbox" className="w-5 h-5" />
                </label>
              </div>
              <div>
                <label className="flex items-center justify-between">
                  <span className="text-gray-300">Screen Shake</span>
                  <input type="checkbox" defaultChecked className="w-5 h-5" />
                </label>
              </div>
              <div>
                <label className="flex items-center justify-between">
                  <span className="text-gray-300">Difficulty</span>
                  <select className="bg-slate-700 text-gray-300 px-3 py-1 rounded">
                    <option>NORMAL</option>
                    <option>HARD</option>
                    <option>EXTREME</option>
                  </select>
                </label>
              </div>
            </div>
          </div>

          <button className="w-full px-6 py-3 bg-gradient-to-r from-green-500 to-cyan-500 text-slate-900 font-black rounded-lg hover:shadow-2xl hover:shadow-green-500/50 transition-all mt-8">
            RESET TO DEFAULTS
          </button>
        </div>
      </div>
    </div>
  )
}
