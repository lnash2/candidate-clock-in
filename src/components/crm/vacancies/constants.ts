export const vacancyStatuses = [
  'Open',
  'On Hold',
  'Filled',
  'Closed',
  'Pending'
];

export const getVacancyStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'open':
    case 'open ( ready to fill )':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
    case 'on hold':
    case 'perm - on hold':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
    case 'filled':
    case 'filled - perm':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
    case 'closed':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
    case 'pending':
    case 'perm - pending':
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
    case 'missed':
    case 'perm - missed':
      return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
  }
};