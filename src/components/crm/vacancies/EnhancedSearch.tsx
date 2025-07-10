import React, { useState, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, X } from 'lucide-react';

interface EnhancedSearchProps {
  searchTerm: string;
  onSearch: (term: string) => void;
  onClearSearch: () => void;
}

export const EnhancedSearch: React.FC<EnhancedSearchProps> = ({
  searchTerm,
  onSearch,
  onClearSearch
}) => {
  const [inputValue, setInputValue] = useState(searchTerm);

  const handleSearch = useCallback((value: string) => {
    setInputValue(value);
    // Debounce search
    const timeoutId = setTimeout(() => {
      onSearch(value);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [onSearch]);

  const handleClear = () => {
    setInputValue('');
    onClearSearch();
  };

  const searchFields = [
    'Title', 'Description', 'Company', 'Contact', 'Address', 'Postcode'
  ];

  return (
    <div className="space-y-2">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search vacancies by title, company, contact, address..."
          value={inputValue}
          onChange={(e) => handleSearch(e.target.value)}
          className="pl-10 pr-10"
        />
        {searchTerm && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      
      {searchTerm && (
        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">Searching:</span>
          <Badge variant="secondary" className="flex items-center gap-1">
            "{searchTerm}"
            <X 
              className="h-3 w-3 cursor-pointer" 
              onClick={handleClear}
            />
          </Badge>
        </div>
      )}
      
      <div className="flex flex-wrap gap-1">
        <span className="text-xs text-muted-foreground">Search includes:</span>
        {searchFields.map((field) => (
          <Badge key={field} variant="outline" className="text-xs">
            {field}
          </Badge>
        ))}
      </div>
    </div>
  );
};