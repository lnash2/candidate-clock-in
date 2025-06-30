
import React from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { User, Phone, Mail, MapPin, Briefcase } from 'lucide-react';

interface Candidate {
  id: string;
  name: string;
  driverClass: string;
  phone?: string;
  email?: string;
  location?: string;
  jobCategories?: string[];
  available?: boolean;
}

interface CandidateInfoPopoverProps {
  candidate: Candidate;
  children: React.ReactNode;
  onOpenRecord?: (candidateId: string) => void;
}

const CandidateInfoPopover = ({ candidate, children, onOpenRecord }: CandidateInfoPopoverProps) => {
  const handleNameClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onOpenRecord) {
      onOpenRecord(candidate.id);
    }
  };

  const handlePhoneClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (candidate.phone) {
      window.open(`tel:${candidate.phone}`, '_self');
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        {children}
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4" side="right">
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <User className="w-4 h-4" />
            <button 
              onClick={handleNameClick}
              className="font-semibold text-blue-600 hover:text-blue-800 hover:underline cursor-pointer transition-colors"
            >
              {candidate.name}
            </button>
          </div>
          
          <div className="space-y-2">
            <Badge variant="outline" className="text-xs">
              {candidate.driverClass}
            </Badge>
            
            {candidate.phone && (
              <div className="flex items-center space-x-2 text-sm">
                <Phone className="w-3 h-3" />
                <button
                  onClick={handlePhoneClick}
                  className="text-blue-600 hover:text-blue-800 hover:underline cursor-pointer transition-colors"
                >
                  {candidate.phone}
                </button>
              </div>
            )}
            
            {candidate.email && (
              <div className="flex items-center space-x-2 text-sm">
                <Mail className="w-3 h-3" />
                <span>{candidate.email}</span>
              </div>
            )}
            
            {candidate.location && (
              <div className="flex items-center space-x-2 text-sm">
                <MapPin className="w-3 h-3" />
                <span>{candidate.location}</span>
              </div>
            )}
            
            {candidate.jobCategories && candidate.jobCategories.length > 0 && (
              <div className="space-y-1">
                <div className="flex items-center space-x-2 text-sm">
                  <Briefcase className="w-3 h-3" />
                  <span>Categories:</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {candidate.jobCategories.map((category, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {category}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default CandidateInfoPopover;
