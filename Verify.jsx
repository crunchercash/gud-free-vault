import React from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Shield, 
  Globe, 
  Lock, 
  Users, 
  CheckCircle2, 
  ArrowRight,
  Building2,
  GraduationCap,
  Briefcase,
  Award
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

const benefits = [
  {
    icon: GraduationCap,
    title: "For Candidates & Learners",
    items: [
      "Secure digital wallet for all your credentials",
      "Share verified documents instantly with employers",
      "Control who sees your information and for how long",
      "Build a lifelong portfolio of achievements"
    ]
  },
  {
    icon: Building2,
    title: "For Educational Institutions",
    items: [
      "Issue tamper-proof digital credentials",
      "Reduce administrative burden of verification requests",
      "Modernize student services with cloud technology",
      "Join a trusted network of verified issuers"
    ]
  },
  {
    icon: Briefcase,
    title: "For Employers",
    items: [
      "Verify credentials instantly, 24/7",
      "Eliminate manual background check processes",
      "Trust cryptographically signed documents",
      "Reduce hiring time and costs"
    ]
  }
];

const values = [
  {
    icon: Shield,
    title: "Security First",
    description: "Every credential is cryptographically signed, creating a tamper-evident record that ensures authenticity."
  },
  {
    icon: Lock,
    title: "Privacy by Design",
    description: "You control your data. Share selectively with time-limited access and revoke permissions anytime."
  },
  {
    icon: Globe,
    title: "Global Interoperability",
    description: "Our platform supports international standards, enabling credential exchange across borders."
  },
  {
    icon: Users,
    title: "Collaborative Ecosystem",
    description: "Built by industry leaders and institutions committed to advancing digital credentialing."
  }
];

export default function About() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-navy-700 via-navy-800 to-slate-900 text-white py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-coral-500 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-500 rounded-full blur-3xl" />
        </div>
        
        <div className="max-w-5xl mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              The Future of Credential Verification
            </h1>
            <p className="text-xl md:text-2xl text-white/70 max-w-3xl mx-auto leading-relaxed">
              RefsVault is a universal digital credential wallet that empowers individuals, 
              institutions, and employers worldwide to exchange verified records with ease.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-24">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">Our Mission</h2>
            <p className="text-xl text-slate-600 leading-relaxed max-w-3xl mx-auto">
              We're replacing traditional paper-based and email-reliant verification with a global, 
              tamper-evident network. RefsVault allows candidates to share their authenticated 
              history 24/7 with prospective employers or schools across borders—ensuring every 
              credential remains verifiable in real-time while maintaining the highest standards 
              of data integrity and privacy.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full border-0 shadow-sm hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-xl bg-coral-100 flex items-center justify-center mb-4">
                      <value.icon className="w-6 h-6 text-coral-600" />
                    </div>
                    <h3 className="font-semibold text-slate-900 mb-2">{value.title}</h3>
                    <p className="text-slate-600 text-sm">{value.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits by User Type */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Benefits for Everyone
            </h2>
            <p className="text-xl text-slate-600">
              RefsVault serves the entire credential ecosystem
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full border-0 shadow-lg">
                  <CardContent className="p-8">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-navy-600 to-navy-700 flex items-center justify-center mb-6">
                      <benefit.icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-4">{benefit.title}</h3>
                    <ul className="space-y-3">
                      {benefit.items.map((item, i) => (
                        <li key={i} className="flex items-start gap-3 text-slate-600">
                          <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              How It Works
            </h2>
          </motion.div>

          <div className="space-y-8">
            {[
              {
                step: "01",
                title: "Institutions Issue Credentials",
                description: "Verified organizations issue cryptographically signed digital credentials directly to recipients' wallets."
              },
              {
                step: "02",
                title: "Recipients Store & Manage",
                description: "Credential holders access their secure wallet to view, organize, and manage all their verified documents."
              },
              {
                step: "03",
                title: "Share With Control",
                description: "Generate time-limited share links to send credentials to employers, schools, or any verifier."
              },
              {
                step: "04",
                title: "Instant Verification",
                description: "Recipients verify credentials instantly using our portal—no manual checks required."
              }
            ].map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex gap-6 items-start"
              >
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-coral-500 to-coral-600 flex items-center justify-center flex-shrink-0 text-white font-bold text-xl">
                  {item.step}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">{item.title}</h3>
                  <p className="text-slate-600">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-gradient-to-br from-navy-700 via-navy-800 to-slate-900">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Award className="w-16 h-16 text-coral-400 mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to get started?
            </h2>
            <p className="text-xl text-white/70 mb-8 max-w-2xl mx-auto">
              Join thousands of individuals and institutions already using RefsVault 
              to manage and verify credentials securely.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to={createPageUrl('Dashboard')}>
                <Button 
                  size="lg"
                  className="bg-coral-500 hover:bg-coral-600 text-white px-8"
                >
                  Access Your Wallet
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link to={createPageUrl('Network')}>
                <Button 
                  size="lg"
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/10 px-8"
                >
                  View Network Members
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}