
import React from 'react';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';

interface JobCategoriesFieldProps {
  jobCategories: string[];
  selectedCategories: string[];
  onToggleCategory: (category: string) => void;
}

const JobCategoriesField = ({ jobCategories, selectedCategories, onToggleCategory }: JobCategoriesFieldProps) => {
  return (
    <div>
      <Label>Job Categories</Label>
      <div className="flex flex-wrap gap-2 mt-2">
        {jobCategories.map(category => (
          <Badge
            key={category}
            variant={selectedCategories.includes(category) ? "default" : "outline"}
            className="cursor-pointer hover:bg-primary/80"
            onClick={() => onToggleCategory(category)}
          >
            {category}
          </Badge>
        ))}
      </div>
    </div>
  );
};

export default JobCategoriesField;
