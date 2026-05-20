'use client'

import { motion } from 'framer-motion'
import { Rocket, Zap, UserPlus, Trophy } from 'lucide-react'

const features = [
  {
    title: "Endless Runner",
    description: "Race through iconic Ben10 locations in stunning 3D. Dash, jump, and slide to avoid obstacles.",
    icon: <Rocket className="w-10 h-10 text-primary" />,
    color: "primary"
  },
  {
    title: "Alien Transformations",
    description: "Use the Omnitrix to transform into powerful aliens like Heatblast, Four Arms, and XLR8.",
    icon: <Zap className="w-10 h-10 text-secondary" />,
    color: "secondary"
  },
  {
    title: "Power-ups",
    description: "Collect shields, speed boosts, and score multipliers to dominate the leaderboard.",
    icon: <Trophy className="w-10 h-10 text-primary" />,
    color: "primary"
  },
  {
    title: "Unlock Rewards",
    description: "Complete daily challenges to unlock new skins, aliens, and special abilities.",
    icon: <UserPlus className="w-10 h-10 text-secondary" />,
    color: "secondary"
  }
]

export function Features() {
  return (
    <section className="py-24 relative overflow-hidden bg-background">
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-black text-white mb-4 uppercase"
          >
            Game <span className="text-primary text-glow-green">Features</span>
          </motion.h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Experience the next level of mobile gaming with these exciting features designed for Ben10 fans.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className="p-8 rounded-2xl bg-card/50 border border-border hover:border-primary/50 transition-all group scanline-effect relative overflow-hidden"
            >
              <div className="mb-6 p-4 rounded-xl bg-background/80 w-fit group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-4 uppercase tracking-wider">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
              
              {/* Decorative corner */}
              <div className="absolute top-0 right-0 w-8 h-8 pointer-events-none overflow-hidden">
                <div className="absolute top-[-20px] right-[-20px] w-10 h-10 bg-primary opacity-0 group-hover:opacity-100 transition-opacity rotate-45" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* Background Decorative Blob */}
      <div className="absolute -bottom-48 -left-48 w-96 h-96 bg-primary/5 rounded-full blur-[100px]" />
    </section>
  )
}
