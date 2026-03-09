import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, 
  Building2, 
  GraduationCap, 
  Briefcase, 
  Award,
  Globe,
  CheckCircle2,
  ExternalLink,
  Users,
  FileText
} from 'lucide-react';

const typeConfig = {
  university: { icon: GraduationCap, label: 'University', color: 'bg-blue-100 text-blue-700' },
  college: { icon: GraduationCap, label: 'College', color: 'bg-indigo-100 text-indigo-700' },
  employer: { icon: Briefcase, label: 'Employer', color: 'bg-emerald-100 text-emerald-700' },
  certification_body: { icon: Award, label: 'Certification Body', color: 'bg-purple-100 text-purple-700' },
  government: { icon: Building2, label: 'Government', color: 'bg-slate-100 text-slate-700' },
  professional_association: { icon: Users, label: 'Professional Association', color: 'bg-amber-100 text-amber-700' }
};

export default function Network() {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  const { data: issuers = [], isLoading } = useQuery({
    queryKey: ['issuers'],
    queryFn: () => base44.entities.Issuer.list('-credentials_issued'),
  });

  const filteredIssuers = issuers.filter(issuer => {
    const matchesSearch = issuer.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          issuer.country?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'all' || issuer.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const stats = {
    total: issuers.length,
    verified: issuers.filter(i => i.verified).length,
    countries: [...new Set(issuers.map(i => i.country).filter(Boolean))].length,
    credentials: issuers.reduce((sum, i) => sum + (i.credentials_issued || 0), 0)
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-navy-700 to-navy-800 text-white">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Trust Registry</h1>
            <p className="text-xl text-white/70 mb-8">
              Explore our network of verified institutions and organizations issuing 
              trusted credentials worldwide
            </p>
            
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="text-3xl font-bold">{stats.total}</div>
                <div className="text-white/70 text-sm">Network Members</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="text-3xl font-bold">{stats.verified}</div>
                <div className="text-white/70 text-sm">Verified Issuers</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="text-3xl font-bold">{stats.countries}</div>
                <div className="text-white/70 text-sm">Countries</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="text-3xl font-bold">{stats.credentials.toLocaleString()}</div>
                <div className="text-white/70 text-sm">Credentials Issued</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <Input
              placeholder="Search institutions by name or country..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white border-slate-200"
            />
          </div>
          
          <Tabs value={typeFilter} onValueChange={setTypeFilter}>
            <TabsList className="bg-white border border-slate-200 flex-wrap">
              <TabsTrigger 
                value="all"
                className="data-[state=active]:bg-navy-700 data-[state=active]:text-white"
              >
                All
              </TabsTrigger>
              <TabsTrigger 
                value="university"
                className="data-[state=active]:bg-navy-700 data-[state=active]:text-white"
              >
                Universities
              </TabsTrigger>
              <TabsTrigger 
                value="college"
                className="data-[state=active]:bg-navy-700 data-[state=active]:text-white"
              >
                Colleges
              </TabsTrigger>
              <TabsTrigger 
                value="employer"
                className="data-[state=active]:bg-navy-700 data-[state=active]:text-white"
              >
                Employers
              </TabsTrigger>
              <TabsTrigger 
                value="certification_body"
                className="data-[state=active]:bg-navy-700 data-[state=active]:text-white"
              >
                Certifications
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Grid */}
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <Card key={i} className="animate-pulse border-0 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 rounded-xl bg-slate-200" />
                    <div className="flex-1">
                      <div className="h-5 bg-slate-200 rounded w-3/4 mb-2" />
                      <div className="h-4 bg-slate-100 rounded w-1/2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredIssuers.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-6">
              <Building2 className="w-10 h-10 text-slate-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">
              {searchQuery || typeFilter !== 'all' ? 'No institutions found' : 'No network members yet'}
            </h3>
            <p className="text-slate-500 max-w-md mx-auto">
              {searchQuery || typeFilter !== 'all' 
                ? 'Try adjusting your search or filters'
                : 'Verified institutions will appear here once they join the network'
              }
            </p>
          </motion.div>
        ) : (
          <motion.div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredIssuers.map((issuer, index) => {
                const config = typeConfig[issuer.type] || typeConfig.employer;
                const TypeIcon = config.icon;
                
                return (
                  <motion.div
                    key={issuer.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: index * 0.05 }}
                    layout
                  >
                    <Card className="group h-full border-0 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4 mb-4">
                          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-navy-600 to-navy-700 flex items-center justify-center flex-shrink-0 text-white font-bold text-xl">
                            {issuer.logo_url ? (
                              <img 
                                src={issuer.logo_url} 
                                alt={issuer.name}
                                className="w-full h-full object-cover rounded-xl"
                              />
                            ) : (
                              issuer.name?.charAt(0)
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold text-slate-900 truncate">
                                {issuer.name}
                              </h3>
                              {issuer.verified && (
                                <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className={config.color}>
                                <TypeIcon className="w-3 h-3 mr-1" />
                                {config.label}
                              </Badge>
                            </div>
                          </div>
                        </div>

                        {issuer.description && (
                          <p className="text-slate-600 text-sm mb-4 line-clamp-2">
                            {issuer.description}
                          </p>
                        )}

                        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                          <div className="flex items-center gap-4 text-sm text-slate-500">
                            {issuer.country && (
                              <div className="flex items-center gap-1">
                                <Globe className="w-3.5 h-3.5" />
                                {issuer.country}
                              </div>
                            )}
                            <div className="flex items-center gap-1">
                              <FileText className="w-3.5 h-3.5" />
                              {issuer.credentials_issued?.toLocaleString() || 0}
                            </div>
                          </div>
                          {issuer.website && (
                            <a 
                              href={issuer.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-coral-500 hover:text-coral-600"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      {/* CTA */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-slate-900 to-slate-800 overflow-hidden">
          <CardContent className="p-12 text-center relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-coral-500/10 rounded-full blur-3xl" />
            <div className="relative z-10">
              <h2 className="text-3xl font-bold text-white mb-4">
                Want to join the network?
              </h2>
              <p className="text-slate-300 mb-8 max-w-2xl mx-auto">
                Become a verified issuer on RefsVault and empower your students, 
                employees, and members with trusted digital credentials
              </p>
              <Button className="bg-coral-500 hover:bg-coral-600 text-white px-8">
                Apply for Membership
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}