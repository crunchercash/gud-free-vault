import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, Loader2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const credentialTypes = [
  { value: 'transcript', label: 'Academic Transcript' },
  { value: 'diploma', label: 'Diploma / Degree' },
  { value: 'certificate', label: 'Certificate' },
  { value: 'reference_letter', label: 'Reference Letter' },
  { value: 'work_experience', label: 'Work Experience Letter' },
  { value: 'professional_license', label: 'Professional License' },
  { value: 'badge', label: 'Digital Badge' },
  { value: 'other', label: 'Other Document' }
];

export default function AddCredentialDialog({ open, onClose, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    type: '',
    issuer_name: '',
    issue_date: '',
    expiry_date: '',
    description: '',
    document_url: ''
  });

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      setFormData(prev => ({ ...prev, document_url: file_url }));
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const verificationHash = `RV-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      await base44.entities.Credential.create({
        ...formData,
        status: 'pending',
        verification_hash: verificationHash
      });
      
      onSuccess?.();
      onClose();
      setFormData({
        title: '',
        type: '',
        issuer_name: '',
        issue_date: '',
        expiry_date: '',
        description: '',
        document_url: ''
      });
    } catch (error) {
      console.error('Failed to create credential:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Add New Credential</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="title">Credential Title *</Label>
            <Input
              id="title"
              placeholder="e.g., Bachelor of Computer Science"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Credential Type *</Label>
              <Select 
                value={formData.type} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {credentialTypes.map(type => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="issuer">Issuing Organization *</Label>
              <Input
                id="issuer"
                placeholder="e.g., Harvard University"
                value={formData.issuer_name}
                onChange={(e) => setFormData(prev => ({ ...prev, issuer_name: e.target.value }))}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="issue_date">Issue Date</Label>
              <Input
                id="issue_date"
                type="date"
                value={formData.issue_date}
                onChange={(e) => setFormData(prev => ({ ...prev, issue_date: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="expiry_date">Expiry Date (if applicable)</Label>
              <Input
                id="expiry_date"
                type="date"
                value={formData.expiry_date}
                onChange={(e) => setFormData(prev => ({ ...prev, expiry_date: e.target.value }))}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Additional details about this credential..."
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label>Upload Document</Label>
            <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center hover:border-coral-300 transition-colors">
              <input
                type="file"
                id="document"
                className="hidden"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileUpload}
              />
              <label htmlFor="document" className="cursor-pointer">
                {uploading ? (
                  <div className="flex items-center justify-center gap-2 text-slate-500">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Uploading...
                  </div>
                ) : formData.document_url ? (
                  <div className="text-emerald-600 font-medium">Document uploaded ✓</div>
                ) : (
                  <div className="space-y-2">
                    <Upload className="w-8 h-8 mx-auto text-slate-400" />
                    <p className="text-sm text-slate-600">
                      Click to upload PDF, JPG, or PNG
                    </p>
                  </div>
                )}
              </label>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="flex-1 bg-coral-500 hover:bg-coral-600"
              disabled={loading || !formData.title || !formData.type || !formData.issuer_name}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Adding...
                </>
              ) : (
                'Add Credential'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}