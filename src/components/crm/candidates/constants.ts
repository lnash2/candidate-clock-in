
export const registrationStatuses = [
  'Pre-Registered',
  'Registered',
  'Interview Scheduled',
  'Interview Complete',
  'Background Check',
  'Approved',
  'Rejected'
];

export const onboardingStatuses = [
  'Pending',
  'In Progress',
  'Documents Required',
  'Training Required',
  'Complete'
];

export const activeStatuses = [
  'Active',
  'Inactive',
  'On Hold',
  'Suspended'
];

export const preferredShifts = [
  'Day Shift',
  'Night Shift',
  'Weekend',
  'Flexible'
];

export const payrollTypes = [
  'PAYE',
  'Umbrella',
  'CIS',
  'Self-Employed'
];

export const communicationTypes = [
  { value: 'email', label: 'Email', icon: 'Mail' },
  { value: 'phone', label: 'Phone', icon: 'Phone' },
  { value: 'meeting', label: 'Meeting', icon: 'Users' },
  { value: 'note', label: 'Note', icon: 'FileText' }
];

export const documentTypes = [
  { value: 'compliance', label: 'Compliance', icon: 'Shield' },
  { value: 'contract', label: 'Contract', icon: 'FileText' },
  { value: 'cv', label: 'CV/Resume', icon: 'User' },
  { value: 'certificate', label: 'Certificate', icon: 'Award' },
  { value: 'identification', label: 'ID Document', icon: 'CreditCard' }
];

export const getStatusColor = (status: string, type: 'registration' | 'onboarding' | 'active') => {
  switch (type) {
    case 'registration':
      switch (status) {
        case 'Pre-Registered': return 'bg-gray-100 text-gray-800';
        case 'Registered': return 'bg-blue-100 text-blue-800';
        case 'Interview Scheduled': return 'bg-yellow-100 text-yellow-800';
        case 'Interview Complete': return 'bg-purple-100 text-purple-800';
        case 'Background Check': return 'bg-orange-100 text-orange-800';
        case 'Approved': return 'bg-green-100 text-green-800';
        case 'Rejected': return 'bg-red-100 text-red-800';
        default: return 'bg-gray-100 text-gray-800';
      }
    case 'onboarding':
      switch (status) {
        case 'Pending': return 'bg-gray-100 text-gray-800';
        case 'In Progress': return 'bg-blue-100 text-blue-800';
        case 'Documents Required': return 'bg-yellow-100 text-yellow-800';
        case 'Training Required': return 'bg-orange-100 text-orange-800';
        case 'Complete': return 'bg-green-100 text-green-800';
        default: return 'bg-gray-100 text-gray-800';
      }
    case 'active':
      switch (status) {
        case 'Active': return 'bg-green-100 text-green-800';
        case 'Inactive': return 'bg-gray-100 text-gray-800';
        case 'On Hold': return 'bg-yellow-100 text-yellow-800';
        case 'Suspended': return 'bg-red-100 text-red-800';
        default: return 'bg-gray-100 text-gray-800';
      }
  }
};
