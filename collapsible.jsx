import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Globe, Lock, Zap, CheckCircle2, FileCheck } from 'lucide-react';

const features = [
  {
    icon: Shield,
    title: "Tamper-Evident Security",
    description: "Every credential is cryptographically signed, ensuring authenticity and preventing fraud."
  },
  {
    icon: Globe,
    title: "Global Recognition",
    description: "Share your verified credentials with institutions and employers across borders, 24/7."
  },
  {
    icon: Lock,
    title: "Privacy-First Design",
    description: "You control who sees your credentials. Share selectively with time-limited access links."
  },
  {
    icon: Zap,
    title: "Instant Verification",
    description: "Employers can verify credentials in seconds, eliminating weeks of manual checks."
  },
  {
    icon: CheckCircle2,
    title: "Verified Issuers",
    description: "Only accredited institutions can issue credentials, ensuring trust in every document."
  },
  {
    icon: FileCheck,
    title: "Lifetime Portfolio",
    description: "Build a comprehensive record of achievements that travels with you throughout your career."
  }
];

export default function FeaturesSection() {
  return (
    <section className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Why Choose RefsVault?
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Built with security, privacy, and interoperability at its core
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="group"
            >
              <div className="h-full p-8 bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-navy-600 to-navy-700 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}