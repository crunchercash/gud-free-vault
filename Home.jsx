import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { 
  ArrowLeft, 
  Share2, 
  Download, 
  Shield, 
  Calendar, 
  Building2,
  ExternalLink,
  CheckCircle2,
  Clock,
  AlertCircle,
  Copy,
  FileText,
  QrCode
} from 'lucide-react';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import ShareCredentialDialog from '@/components/dashboard/ShareCredentialDialog';
import { toast } from 'sonner';

const statusConfig = {
  verified: { 
    icon: CheckCircle2, 
    color: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    bgColor: 'bg-emerald-50',
    label: 'Verified'
  },
  pending: { 
    icon: Clock, 
    color: 'bg-amber-100 text-amber-700 border-amber-200',
    bgColor: 'bg-amber-50',
    label: 'Pending Verification'
  },
  expired: { 
    icon: AlertCircle, 
    color: 'bg-slate-100 text-slate-600 border-slate-200',
    bgColor: 'bg-slate-50',
    label: 'Expired'
  },
  revoked: { 
    icon: AlertCircle, 
    color: 'bg-red-100 text-red-700 border-red-200',
    bgColor: 'bg-red-50',
    label: 'Revoked'
  }
};

export default function CredentialDetail() {
  const [showShareDialog, setShowShareDialog] = useState(false);
  
  const urlParams = new URLSearchParams(window.location.search);
  const credentialId = urlParams.get('id');

  const { data: credential, isLoading } = useQuery({
    queryKey: ['credential', credentialId],
    queryFn: async () => {
      const credentials = await base44.entities.Credential.filter({ id: credentialId });
      return credentials[0];
    },
    enabled: !!credentialId
  });

  const copyVerificationHash = () => {
    if (credential?.verification_hash) {
      navigator.clipboard.writeText(credential.verification_hash);
      toast.success('Verification hash copied');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-slate-200 rounded w-1/4 mb-8" />
            <div className="bg-white rounded-2xl p-8">
              <div className="h-10 bg-slate-200 rounded w-3/4 mb-4" />
              <div className="h-6 bg-slate-100 rounded w-1/2 mb-8" />
              <div className="space-y-4">
                <div className="h-24 bg-slate-100 rounded" />
                <div className="h-24 bg-slate-100 rounded" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!credential) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-slate-900 mb-2">Credential not found</h2>
          <p className="text-slate-500 mb-6">The credential you're looking for doesn't exist.</p>
          <Link to={createPageUrl('Dashboard')}>
            <Button className="bg-coral-500 hover:bg-coral-600">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Wallet
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const status = statusConfig[credential.status] || statusConfig.pending;
  const StatusIcon = status.icon;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-navy-700 to-navy-800">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <Link 
            to={createPageUrl('Dashboard')}
            className="inline-flex items-center text-white/70 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Wallet
          </Link>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
                {credential.title}
              </h1>
              <div className="flex items-center gap-3 text-white/70">
                <Building2 className="w-4 h-4" />
                <span>{credential.issuer_name}</span>
              </div>
            </div>
            
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                className="border-white/30 text-white hover:bg-white/10"
                onClick={() => credential.document_url && window.open(credential.document_url, '_blank')}
                disabled={!credential.document_url}
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
              <Button 
                className="bg-coral-500 hover:bg-coral-600"
                onClick={() => setShowShareDialog(true)}
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="grid md:grid-cols-3 gap-6">
          {/* Main Info */}
          <div className="md:col-span-2 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <h2 className="text-lg font-semibold text-slate-900 mb-4">Credential Details</h2>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between py-3 border-b border-slate-100">
                      <span className="text-slate-500">Status</span>
                      <Badge variant="outline" className={`${status.color} flex items-center gap-1.5`}>
                        <StatusIcon className="w-3.5 h-3.5" />
                        {status.label}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between py-3 border-b border-slate-100">
                      <span className="text-slate-500">Type</span>
                      <span className="font-medium text-slate-900 capitalize">
                        {credential.type?.replace(/_/g, ' ')}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between py-3 border-b border-slate-100">
                      <span className="text-slate-500">Issue Date</span>
                      <span className="font-medium text-slate-900">
                        {credential.issue_date 
                          ? format(new Date(credential.issue_date), 'MMMM d, yyyy')
                          : 'Not specified'
                        }
                      </span>
                    </div>
                    
                    {credential.expiry_date && (
                      <div className="flex items-center justify-between py-3 border-b border-slate-100">
                        <span className="text-slate-500">Expiry Date</span>
                        <span className="font-medium text-slate-900">
                          {format(new Date(credential.expiry_date), 'MMMM d, yyyy')}
                        </span>
                      </div>
                    )}
                    
                    {credential.description && (
                      <div className="py-3">
                        <span className="text-slate-500 block mb-2">Description</span>
                        <p className="text-slate-900">{credential.description}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Verification Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-navy-100 flex items-center justify-center">
                      <Shield className="w-5 h-5 text-navy-700" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-slate-900">Verification</h2>
                      <p className="text-sm text-slate-500">Cryptographic proof of authenticity</p>
                    </div>
                  </div>
                  
                  {credential.verification_hash && (
                    <div className="bg-slate-50 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-slate-500">Verification Hash</span>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={copyVerificationHash}
                          className="h-8"
                        >
                          <Copy className="w-3.5 h-3.5 mr-1.5" />
                          Copy
                        </Button>
                      </div>
                      <code className="text-sm font-mono text-slate-700 break-all">
                        {credential.verification_hash}
                      </code>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-slate-900 mb-4">Issuer Information</h3>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-navy-600 to-navy-700 flex items-center justify-center text-white font-bold text-xl">
                      {credential.issuer_name?.charAt(0)}
                    </div>
                    <div>
                      <div className="font-medium text-slate-900">{credential.issuer_name}</div>
                      <div className="text-sm text-slate-500">Verified Issuer</div>
                    </div>
                  </div>
                  <Link to={createPageUrl('Network')}>
                    <Button variant="outline" size="sm" className="w-full">
                      View in Trust Registry
                      <ExternalLink className="w-3.5 h-3.5 ml-2" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="border-0 shadow-lg bg-gradient-to-br from-coral-500 to-coral-600">
                <CardContent className="p-6 text-white">
                  <QrCode className="w-8 h-8 mb-4" />
                  <h3 className="font-semibold mb-2">Quick Share</h3>
                  <p className="text-white/80 text-sm mb-4">
                    Generate a shareable link or QR code for instant verification
                  </p>
                  <Button 
                    variant="secondary" 
                    className="w-full bg-white text-coral-600 hover:bg-white/90"
                    onClick={() => setShowShareDialog(true)}
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    Share Credential
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>

      <ShareCredentialDialog
        open={showShareDialog}
        onClose={() => setShowShareDialog(false)}
        credential={credential}
      />
    </div>
  );
}