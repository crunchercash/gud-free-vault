import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Plus, 
  Search, 
  Wallet, 
  Shield, 
  FileText, 
  GraduationCap,
  Award,
  Briefcase,
  LayoutGrid,
  List
} from 'lucide-react';
import CredentialCard from '@/components/dashboard/CredentialCard';
import AddCredentialDialog from '@/components/dashboard/AddCredentialDialog';
import ShareCredentialDialog from '@/components/dashboard/ShareCredentialDialog';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

const typeFilters = [
  { value: 'all', label: 'All', icon: Wallet },
  { value: 'transcript', label: 'Transcripts', icon: GraduationCap },
  { value: 'diploma', label: 'Diplomas', icon: Award },
  { value: 'certificate', label: 'Certificates', icon: Award },
  { value: 'reference_letter', label: 'References', icon: FileText },
  { value: 'work_experience', label: 'Experience', icon: Briefcase },
];

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [shareCredential, setShareCredential] = useState(null);
  
  const queryClient = useQueryClient();

  const { data: credentials = [], isLoading } = useQuery({
    queryKey: ['credentials'],
    queryFn: () => base44.entities.Credential.list('-created_date'),
  });

  const filteredCredentials = credentials.filter(cred => {
    const matchesSearch = cred.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          cred.issuer_name?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'all' || cred.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const stats = {
    total: credentials.length,
    verified: credentials.filter(c => c.status === 'verified').length,
    pending: credentials.filter(c => c.status === 'pending').length,
  };

  const handleViewCredential = (credential) => {
    window.location.href = createPageUrl(`CredentialDetail?id=${credential.id}`);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-navy-700 to-navy-800 text-white">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">My Credential Wallet</h1>
              <p className="text-white/70">Manage and share your verified credentials securely</p>
            </div>
            <Button 
              onClick={() => setShowAddDialog(true)}
              className="bg-coral-500 hover:bg-coral-600 text-white shadow-lg shadow-coral-500/25"
              size="lg"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Credential
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mt-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                  <Wallet className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{stats.total}</div>
                  <div className="text-white/70 text-sm">Total Credentials</div>
                </div>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/30 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-emerald-300" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{stats.verified}</div>
                  <div className="text-white/70 text-sm">Verified</div>
                </div>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-amber-500/30 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-amber-300" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{stats.pending}</div>
                  <div className="text-white/70 text-sm">Pending</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <Input
              placeholder="Search credentials..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white border-slate-200"
            />
          </div>
          
          <Tabs value={typeFilter} onValueChange={setTypeFilter}>
            <TabsList className="bg-white border border-slate-200">
              {typeFilters.map(filter => (
                <TabsTrigger 
                  key={filter.value} 
                  value={filter.value}
                  className="data-[state=active]:bg-navy-700 data-[state=active]:text-white"
                >
                  <filter.icon className="w-4 h-4 mr-1.5" />
                  <span className="hidden sm:inline">{filter.label}</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          <div className="flex border border-slate-200 rounded-lg overflow-hidden bg-white">
            <Button
              variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="rounded-none"
            >
              <LayoutGrid className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="rounded-none"
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Credentials Grid */}
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="bg-white rounded-xl p-6 animate-pulse">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 rounded-xl bg-slate-200" />
                  <div className="flex-1">
                    <div className="h-5 bg-slate-200 rounded w-3/4 mb-2" />
                    <div className="h-4 bg-slate-100 rounded w-1/2" />
                  </div>
                </div>
                <div className="h-20 bg-slate-100 rounded" />
              </div>
            ))}
          </div>
        ) : filteredCredentials.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-6">
              <Wallet className="w-10 h-10 text-slate-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">
              {searchQuery || typeFilter !== 'all' ? 'No credentials found' : 'Your wallet is empty'}
            </h3>
            <p className="text-slate-500 mb-6 max-w-md mx-auto">
              {searchQuery || typeFilter !== 'all' 
                ? 'Try adjusting your search or filters'
                : 'Start building your credential portfolio by adding your first document'
              }
            </p>
            {!searchQuery && typeFilter === 'all' && (
              <Button 
                onClick={() => setShowAddDialog(true)}
                className="bg-coral-500 hover:bg-coral-600"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Credential
              </Button>
            )}
          </motion.div>
        ) : (
          <motion.div 
            className={viewMode === 'grid' 
              ? "grid md:grid-cols-2 lg:grid-cols-3 gap-6" 
              : "space-y-4"
            }
            layout
          >
            <AnimatePresence mode="popLayout">
              {filteredCredentials.map((credential, index) => (
                <motion.div
                  key={credential.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.05 }}
                  layout
                >
                  <CredentialCard
                    credential={credential}
                    onShare={setShareCredential}
                    onView={handleViewCredential}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      {/* Dialogs */}
      <AddCredentialDialog
        open={showAddDialog}
        onClose={() => setShowAddDialog(false)}
        onSuccess={() => queryClient.invalidateQueries(['credentials'])}
      />

      <ShareCredentialDialog
        open={!!shareCredential}
        onClose={() => setShareCredential(null)}
        credential={shareCredential}
      />
    </div>
  );
}