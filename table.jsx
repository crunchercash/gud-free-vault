import React from 'react';
import { motion } from 'framer-motion';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GraduationCap, Building2, Briefcase, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

const userTypes = [
  {
    icon: GraduationCap,
    title: "Candidates & Learners",
    description: "Access your official transcripts, diplomas, references, and certifications securely from your digital wallet. Share verified credentials with employers worldwide.",
    image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600&q=80",
    link: "Dashboard",
    linkText: "Access Your Wallet"
  },
  {
    icon: Building2,
    title: "Institutions & Issuers",
    description: "Join our trusted network to issue tamper-evident digital credentials. Reduce administrative burden while maintaining the highest standards of verification.",
    image: "https://images.unsplash.com/photo-1562774053-701939374585?w=600&q=80",
    link: "Network",
    linkText: "Join the Network"
  },
  {
    icon: Briefcase,
    title: "Employers & Verifiers",
    description: "Instantly verify candidate credentials 24/7. Eliminate manual background checks with our real-time verification system trusted globally.",
    image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=600&q=80",
    link: "Verify",
    linkText: "Verify Credentials"
  }
];

export default function UserTypeCards() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            24/7 Access — Anytime, Anywhere
          </h2>
          <div className="w-16 h-1 bg-coral-500 mx-auto rounded-full" />
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {userTypes.map((type, index) => (
            <motion.div
              key={type.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="group h-full overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 bg-white">
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={type.image} 
                    alt={type.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />
                  <div className="absolute bottom-4 left-4">
                    <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <type.icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{type.title}</h3>
                  <p className="text-slate-600 mb-6 leading-relaxed">{type.description}</p>
                  <Link to={createPageUrl(type.link)}>
                    <Button 
                      variant="ghost" 
                      className="p-0 h-auto text-coral-600 hover:text-coral-700 hover:bg-transparent font-semibold group/btn"
                    >
                      {type.linkText}
                      <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                    </Button>
                  </Link>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}