'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

const aliens = [
  { name: "Heatblast", image: "/assets/Ben10.png", description: "Pyronite alien with fire manipulation powers." },
  { name: "Four Arms", image: "/assets/Ben10.png", description: "Tetramand alien with incredible super strength." },
  { name: "XLR8", image: "/assets/Ben10.png", description: "Kineceleran alien with extreme speed and reflexes." },
  { name: "Diamondhead", image: "/assets/Ben10.png", description: "Petrosapien alien with crystalline structure." },
]

export function Characters() {
  return (
    <section className="py-24 relative overflow-hidden bg-background/50">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[150px]" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-black text-white mb-4 uppercase"
          >
            Unlock <span className="text-primary text-glow-green">Aliens</span>
          </motion.h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Collect Omni-energy during your runs to unlock new transformations and unleash their unique abilities.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-12">
          {aliens.map((alien, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="flex flex-col items-center group cursor-pointer"
            >
              <div className="relative w-48 h-64 mb-6">
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl group-hover:bg-primary/40 transition-all opacity-0 group-hover:opacity-100" />
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="relative z-10 w-full h-full"
                >
                  <Image 
                    src="/assets/Ben10.png" // Using the provided Ben10 image for all as placeholders for now
                    alt={alien.name}
                    width={200}
                    height={300}
                    className="w-full h-full object-contain filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)] group-hover:drop-shadow-[0_0_20px_rgba(0,255,65,0.4)] transition-all"
                  />
                </motion.div>
                
                {/* Omnitrix Ring */}
                <div className="absolute bottom-[-10px] left-1/2 -translate-x-1/2 w-4/5 h-12 bg-primary/10 rounded-[100%] border border-primary/30 group-hover:border-primary/60 group-hover:bg-primary/20 transition-all" />
              </div>
              
              <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-primary transition-colors">{alien.name}</h3>
              <p className="text-muted-foreground text-sm text-center max-w-[150px]">{alien.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
