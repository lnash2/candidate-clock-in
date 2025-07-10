import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, X } from 'lucide-react';

interface EnhancedSearchProps {
  onSearch: (term: string) => void;
  searchTerm: string;
  resultsCount?: number;
  loading?: boolean;
}

export const EnhancedSearch: React.FC<EnhancedSearchProps> = ({
  onSearch,
  searchTerm,
  resultsCount,
  loading
}) => {
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localSearchTerm !== searchTerm) {
        onSearch(localSearchTerm);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [localSearchTerm, onSearch, searchTerm]);

  // Update local state when external searchTerm changes
  useEffect(() => {
    setLocalSearchTerm(searchTerm);
  }, [searchTerm]);

  const clearSearch = () => {
    setLocalSearchTerm('');
    onSearch('');
  };

  return (
    <div className="space-y-3">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Search candidates by name, email, phone, address, postcode, NI number, or job title..."
          value={localSearchTerm}
          onChange={(e) => setLocalSearchTerm(e.target.value)}
          className="pl-10 pr-10"
        />
        {localSearchTerm && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
            onClick={clearSearch}
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>

      {/* Search Results Info */}
      {searchTerm && (
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Badge variant="outline">
              Search: "{searchTerm}"
            </Badge>
            {resultsCount !== undefined && (
              <span className="text-sm text-muted-foreground">
                {loading ? 'Searching...' : `${resultsCount} results`}
              </span>
            )}
          </div>
          <Button variant="ghost" size="sm" onClick={clearSearch}>
            Clear search
          </Button>
        </div>
      )}

      {/* Search Help */}
      {!searchTerm && (
        <p className="text-xs text-muted-foreground">
          Search across: Name, Email, Phone, Address, Postcode, NI Number, Job Title
        </p>
      )}
    </div>
  );
};