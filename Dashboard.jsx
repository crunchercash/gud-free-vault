import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Shield, 
  Search, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  FileText,
  Building2,
  Calendar,
  AlertTriangle,
  Loader2,
  ArrowRight
} from 'lucide-react';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function Verify() {
  const [verificationCode, setVerificationCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState(null);
  
  const urlParams = new URLSearchParams(window.location.search);
  const codeFromUrl = urlParams.get('code');

  useEffect(() => {
    if (codeFromUrl) {
      setVerificationCode(codeFromUrl);
      handleVerify(codeFromUrl);
    }
  }, [codeFromUrl]);

  const handleVerify = async (code = verificationCode) => {
    if (!code.trim()) return;
    
    setIsVerifying(true);
    setVerificationResult(null);

    try {
      // First try to find by share code
      const shareLinks = await base44.entities.ShareLink.filter({ share_code: code });
      
      if (shareLinks.length > 0) {
        const shareLink = shareLinks[0];
        
        // Check if link is expired
        if (new Date(shareLink.expires_at) < new Date()) {
          setVerificationResult({ status: 'expired', message: 'This share link has expired' });
          return;
        }
        
        if (!shareLink.active) {
          setVerificationResult({ status: 'inactive', message: 'This share link is no longer active' });
          return;
        }
        
        // Get the credential
        const credentials = await base44.entities.Credential.filter({ id: shareLink.credential_id });
        
        if (credentials.length > 0) {
          // Update view count
          await base44.entities.ShareLink.update(shareLink.id, { 
            views: (shareLink.views || 0) + 1 
          });
          
          setVerificationResult({ 
            status: 'success', 
            credential: credentials[0],
            shareLink
          });
          return;
        }
      }
      
      // Try to find by verification hash
      const credentials = await base44.entities.Credential.filter({ verification_hash: code });
      
      if (credentials.length > 0) {
        setVerificationResult({ 
          status: 'success', 
          credential: credentials[0],
          direct: true
        });
        return;
      }
      
      setVerificationResult({ status: 'not_found', message: 'No credential found with this code' });
      
    } catch (error) {
      console.error('Verification error:', error);
      setVerificationResult({ status: 'error', message: 'Verification failed. Please try again.' });
    } finally {
      setIsVerifying(false);
    }
  };

  const statusConfig = {
    verified: { 
      icon: CheckCircle2, 
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      label: 'Verified'
    },
    pending: { 
      icon: Clock, 
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
      label: 'Pending'
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-navy-700 to-navy-800 text-white">
        <div className="max-w-4xl mx-auto px-6 py-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center mx-auto mb-6">
              <Shield className="w-10 h-10" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Credential Verification</h1>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              Enter a share code or verification hash to instantly verify the authenticity of a credential
            </p>
          </motion.div>
        </div>
      </div>

      {/* Search Box */}
      <div className="max-w-2xl mx-auto px-6 -mt-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="border-0 shadow-xl">
            <CardContent className="p-6">
              <form onSubmit={(e) => { e.preventDefault(); handleVerify(); }} className="flex gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <Input
                    placeholder="Enter share code or verification hash..."
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    className="pl-12 h-14 text-lg border-slate-200"
                  />
                </div>
                <Button 
                  type="submit"
                  className="h-14 px-8 bg-coral-500 hover:bg-coral-600"
                  disabled={isVerifying || !verificationCode.trim()}
                >
                  {isVerifying ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      Verify
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Results */}
      <div className="max-w-2xl mx-auto px-6 py-8">
        {isVerifying && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Loader2 className="w-12 h-12 animate-spin text-coral-500 mx-auto mb-4" />
            <p className="text-slate-600">Verifying credential...</p>
          </motion.div>
        )}

        {verificationResult && !isVerifying && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {verificationResult.status === 'success' ? (
              <Card className="border-0 shadow-lg overflow-hidden">
                <div className="bg-emerald-500 p-6 text-white">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">Credential Verified</h2>
                      <p className="text-emerald-100">This credential is authentic and valid</p>
                    </div>
                  </div>
                </div>
                
                <CardContent className="p-6">
                  <div className="mb-6">
                    <h3 className="text-xl font-bold text-slate-900 mb-1">
                      {verificationResult.credential.title}
                    </h3>
                    <div className="flex items-center gap-2 text-slate-500">
                      <Building2 className="w-4 h-4" />
                      {verificationResult.credential.issuer_name}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-slate-50 rounded-xl p-4">
                      <div className="text-sm text-slate-500 mb-1">Type</div>
                      <div className="font-medium text-slate-900 capitalize">
                        {verificationResult.credential.type?.replace(/_/g, ' ')}
                      </div>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-4">
                      <div className="text-sm text-slate-500 mb-1">Issue Date</div>
                      <div className="font-medium text-slate-900">
                        {verificationResult.credential.issue_date 
                          ? format(new Date(verificationResult.credential.issue_date), 'MMM d, yyyy')
                          : 'N/A'
                        }
                      </div>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-4">
                      <div className="text-sm text-slate-500 mb-1">Status</div>
                      <Badge variant="outline" className="bg-emerald-100 text-emerald-700 border-emerald-200">
                        <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                        {verificationResult.credential.status === 'verified' ? 'Verified' : 'Authentic'}
                      </Badge>
                    </div>
                    {verificationResult.credential.expiry_date && (
                      <div className="bg-slate-50 rounded-xl p-4">
                        <div className="text-sm text-slate-500 mb-1">Expiry Date</div>
                        <div className="font-medium text-slate-900">
                          {format(new Date(verificationResult.credential.expiry_date), 'MMM d, yyyy')}
                        </div>
                      </div>
                    )}
                  </div>

                  {verificationResult.credential.description && (
                    <div className="mb-6">
                      <div className="text-sm text-slate-500 mb-1">Description</div>
                      <p className="text-slate-700">{verificationResult.credential.description}</p>
                    </div>
                  )}

                  <div className="pt-4 border-t border-slate-100">
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      <Shield className="w-4 h-4" />
                      <span>Verification powered by RefsVault</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="border-0 shadow-lg">
                <CardContent className="p-8 text-center">
                  <div className={`w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center ${
                    verificationResult.status === 'expired' ? 'bg-amber-100' : 'bg-red-100'
                  }`}>
                    {verificationResult.status === 'expired' ? (
                      <Clock className="w-8 h-8 text-amber-600" />
                    ) : verificationResult.status === 'not_found' ? (
                      <XCircle className="w-8 h-8 text-red-600" />
                    ) : (
                      <AlertTriangle className="w-8 h-8 text-red-600" />
                    )}
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">
                    {verificationResult.status === 'expired' ? 'Link Expired' : 
                     verificationResult.status === 'not_found' ? 'Not Found' : 'Verification Failed'}
                  </h3>
                  <p className="text-slate-500 mb-6">{verificationResult.message}</p>
                  <Button 
                    variant="outline"
                    onClick={() => {
                      setVerificationResult(null);
                      setVerificationCode('');
                    }}
                  >
                    Try Another Code
                  </Button>
                </CardContent>
              </Card>
            )}
          </motion.div>
        )}

        {!verificationResult && !isVerifying && !codeFromUrl && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center py-12"
          >
            <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-6">
              <FileText className="w-10 h-10 text-slate-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">
              Enter a verification code
            </h3>
            <p className="text-slate-500 max-w-md mx-auto">
              Share codes and verification hashes can be obtained from credential holders 
              or through shared links
            </p>
          </motion.div>
        )}
      </div>

      {/* Info Section */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6 text-center">
              <Shield className="w-10 h-10 text-coral-500 mx-auto mb-4" />
              <h3 className="font-semibold text-slate-900 mb-2">Instant Verification</h3>
              <p className="text-sm text-slate-500">
                Verify credentials in seconds, 24/7, from anywhere in the world
              </p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6 text-center">
              <CheckCircle2 className="w-10 h-10 text-coral-500 mx-auto mb-4" />
              <h3 className="font-semibold text-slate-900 mb-2">Tamper-Proof</h3>
              <p className="text-sm text-slate-500">
                Cryptographic signatures ensure credentials cannot be altered
              </p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6 text-center">
              <Building2 className="w-10 h-10 text-coral-500 mx-auto mb-4" />
              <h3 className="font-semibold text-slate-900 mb-2">Verified Issuers</h3>
              <p className="text-sm text-slate-500">
                Only accredited institutions can issue credentials on RefsVault
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}