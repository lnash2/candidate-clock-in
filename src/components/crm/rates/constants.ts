
export const driverClasses = ['Class 1', 'Class 2', 'Class 3', 'Specialist', 'Trainee'];

export const rateCategories = [
  { value: 'days', label: 'Days', icon: 'Calendar' },
  { value: 'nights', label: 'Nights', icon: 'Clock' },
  { value: 'saturday', label: 'Saturday', icon: 'Calendar' },
  { value: 'sunday', label: 'Sunday', icon: 'Calendar' }
];

export const getCategoryColor = (category: string) => {
  switch (category) {
    case 'days': return 'bg-blue-100 text-blue-800';
    case 'nights': return 'bg-purple-100 text-purple-800';
    case 'saturday': return 'bg-green-100 text-green-800';
    case 'sunday': return 'bg-orange-100 text-orange-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};
