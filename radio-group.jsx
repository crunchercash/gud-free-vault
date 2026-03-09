import React from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  GraduationCap, 
  Award, 
  FileText, 
  Briefcase, 
  Shield, 
  ExternalLink,
  Share2,
  MoreVertical,
  CheckCircle2,
  Clock,
  AlertCircle
} from 'lucide-react';
import { format } from 'date-fns';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const typeIcons = {
  transcript: GraduationCap,
  diploma: Award,
  certificate: Award,
  reference_letter: FileText,
  work_experience: Briefcase,
  professional_license: Shield,
  badge: Award,
  other: FileText
};

const statusConfig = {
  verified: { 
    icon: CheckCircle2, 
    color: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    label: 'Verified'
  },
  pending: { 
    icon: Clock, 
    color: 'bg-amber-100 text-amber-700 border-amber-200',
    label: 'Pending'
  },
  expired: { 
    icon: AlertCircle, 
    color: 'bg-slate-100 text-slate-600 border-slate-200',
    label: 'Expired'
  },
  revoked: { 
    icon: AlertCircle, 
    color: 'bg-red-100 text-red-700 border-red-200',
    label: 'Revoked'
  }
};

export default function CredentialCard({ credential, onShare, onView }) {
  const TypeIcon = typeIcons[credential.type] || FileText;
  const status = statusConfig[credential.status] || statusConfig.pending;
  const StatusIcon = status.icon;

  return (
    <Card className="group overflow-hidden border border-slate-200 hover:border-slate-300 hover:shadow-lg transition-all duration-300 bg-white">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-navy-600 to-navy-700 flex items-center justify-center flex-shrink-0">
              <TypeIcon className="w-7 h-7 text-white" />
            </div>
            <div className="min-w-0">
              <h3 className="font-semibold text-slate-900 text-lg truncate">{credential.title}</h3>
              <p className="text-slate-500 text-sm">{credential.issuer_name}</p>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onView?.(credential)}>
                <ExternalLink className="w-4 h-4 mr-2" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onShare?.(credential)}>
                <Share2 className="w-4 h-4 mr-2" />
                Share Credential
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex items-center gap-3 mb-4">
          <Badge variant="outline" className={`${status.color} flex items-center gap-1.5`}>
            <StatusIcon className="w-3.5 h-3.5" />
            {status.label}
          </Badge>
          <Badge variant="outline" className="bg-slate-50 text-slate-600 border-slate-200 capitalize">
            {credential.type?.replace(/_/g, ' ')}
          </Badge>
        </div>

        {credential.description && (
          <p className="text-slate-600 text-sm mb-4 line-clamp-2">
            {credential.description}
          </p>
        )}

        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <div className="text-sm text-slate-500">
            Issued: {credential.issue_date ? format(new Date(credential.issue_date), 'MMM d, yyyy') : 'N/A'}
          </div>
          <div className="flex gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => onView?.(credential)}
              className="text-slate-600 hover:text-slate-900"
            >
              <ExternalLink className="w-4 h-4 mr-1.5" />
              View
            </Button>
            <Button 
              size="sm" 
              onClick={() => onShare?.(credential)}
              className="bg-coral-500 hover:bg-coral-600 text-white"
            >
              <Share2 className="w-4 h-4 mr-1.5" />
              Share
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}