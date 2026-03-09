import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Copy, Mail, Link as LinkIcon, Loader2, Check, Share2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

export default function ShareCredentialDialog({ open, onClose, credential }) {
  const [loading, setLoading] = useState(false);
  const [shareLink, setShareLink] = useState('');
  const [copied, setCopied] = useState(false);
  const [formData, setFormData] = useState({
    recipient_email: '',
    recipient_name: '',
    expires_in: '7'
  });

  const generateShareLink = async () => {
    setLoading(true);
    try {
      const shareCode = `${Date.now().toString(36)}-${Math.random().toString(36).substr(2, 8)}`;
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + parseInt(formData.expires_in));

      await base44.entities.ShareLink.create({
        credential_id: credential.id,
        share_code: shareCode,
        recipient_email: formData.recipient_email,
        recipient_name: formData.recipient_name,
        expires_at: expiresAt.toISOString(),
        max_views: 10,
        active: true
      });

      const link = `${window.location.origin}/Verify?code=${shareCode}`;
      setShareLink(link);

      if (formData.recipient_email) {
        await base44.integrations.Core.SendEmail({
          to: formData.recipient_email,
          subject: `${credential.title} - Verified Credential Shared via RefsVault`,
          body: `
Hello${formData.recipient_name ? ` ${formData.recipient_name}` : ''},

A verified credential has been shared with you via RefsVault.

Credential: ${credential.title}
Issued by: ${credential.issuer_name}

Click here to view and verify: ${link}

This link will expire in ${formData.expires_in} days.

Best regards,
RefsVault - Secure Credential Verification
          `.trim()
        });
        toast.success('Share link sent to recipient');
      }
    } catch (error) {
      console.error('Failed to create share link:', error);
      toast.error('Failed to create share link');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(shareLink);
    setCopied(true);
    toast.success('Link copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClose = () => {
    setShareLink('');
    setFormData({ recipient_email: '', recipient_name: '', expires_in: '7' });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <Share2 className="w-5 h-5 text-coral-500" />
            Share Credential
          </DialogTitle>
        </DialogHeader>

        {credential && (
          <div className="bg-slate-50 rounded-xl p-4 mb-4">
            <h4 className="font-semibold text-slate-900">{credential.title}</h4>
            <p className="text-sm text-slate-500">{credential.issuer_name}</p>
          </div>
        )}

        {!shareLink ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="recipient_name">Recipient Name (optional)</Label>
              <Input
                id="recipient_name"
                placeholder="e.g., HR Department, Acme Corp"
                value={formData.recipient_name}
                onChange={(e) => setFormData(prev => ({ ...prev, recipient_name: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="recipient_email">Recipient Email (optional)</Label>
              <Input
                id="recipient_email"
                type="email"
                placeholder="hr@company.com"
                value={formData.recipient_email}
                onChange={(e) => setFormData(prev => ({ ...prev, recipient_email: e.target.value }))}
              />
              <p className="text-xs text-slate-500">
                If provided, we'll send the link directly to this email
              </p>
            </div>

            <div className="space-y-2">
              <Label>Link Expires In</Label>
              <Select 
                value={formData.expires_in} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, expires_in: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 day</SelectItem>
                  <SelectItem value="7">7 days</SelectItem>
                  <SelectItem value="30">30 days</SelectItem>
                  <SelectItem value="90">90 days</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button 
              onClick={generateShareLink} 
              className="w-full bg-coral-500 hover:bg-coral-600"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <LinkIcon className="w-4 h-4 mr-2" />
                  Generate Share Link
                </>
              )}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
              <div className="flex items-center gap-2 text-emerald-700 mb-2">
                <Check className="w-5 h-5" />
                <span className="font-medium">Share link created!</span>
              </div>
              <div className="flex gap-2">
                <Input 
                  value={shareLink} 
                  readOnly 
                  className="bg-white text-sm"
                />
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={copyToClipboard}
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
            </div>

            {formData.recipient_email && (
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Mail className="w-4 h-4" />
                Email sent to {formData.recipient_email}
              </div>
            )}

            <Button variant="outline" onClick={handleClose} className="w-full">
              Done
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}