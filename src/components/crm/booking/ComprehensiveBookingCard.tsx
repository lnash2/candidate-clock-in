
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  DollarSign, 
  User, 
  Building2, 
  Phone, 
  Mail,
  Edit,
  MoreVertical,
  Star,
  AlertCircle
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface ComprehensiveBookingCardProps {
  booking: {
    id: string;
    candidate_name?: string;
    customer_name?: string;
    role?: string;
    job_categories?: string[];
    booking_type?: string;
    booking_status?: string;
    start_date?: string;
    start_time?: string;
    end_date?: string;
    end_time?: string;
    day_type?: string;
    driver_class?: string;
    pay_rate?: number;
    amended_pay_rate?: number;
    charge_rate?: number;
    holiday_accrual?: boolean;
    expenses?: number;
    notes?: string;
    pickup_location?: string;
    dropoff_location?: string;
    contact_name?: string;
    contact_phone?: string;
    contact_email?: string;
    work_location?: string;
    rate_preview?: any;
  };
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onViewDetails?: (id: string) => void;
}

const ComprehensiveBookingCard = ({ booking, onEdit, onDelete, onViewDetails }: ComprehensiveBookingCardProps) => {
  const getStatusColor = (status?: string) => {
    switch (status?.toLowerCase()) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'open': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getShiftTypeColor = (type?: string) => {
    return type === 'night_shift' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800';
  };

  const calculateDuration = () => {
    if (!booking.start_date || !booking.end_date || !booking.start_time || !booking.end_time) {
      return 0;
    }
    
    const startDateTime = new Date(`${booking.start_date}T${booking.start_time}`);
    const endDateTime = new Date(`${booking.end_date}T${booking.end_time}`);
    
    return (endDateTime.getTime() - startDateTime.getTime()) / (1000 * 60 * 60);
  };

  const duration = calculateDuration();
  const effectivePayRate = booking.amended_pay_rate || booking.pay_rate || 0;
  const chargeRate = booking.charge_rate || 0;
  const expenses = booking.expenses || 0;

  const totalPay = effectivePayRate * duration + expenses;
  const totalCharge = chargeRate * duration + expenses;
  const totalMargin = totalCharge - totalPay;

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-lg flex items-center space-x-2">
              <User className="w-5 h-5 text-blue-600" />
              <span>{booking.candidate_name || 'Unassigned'}</span>
              {booking.holiday_accrual && <Star className="w-4 h-4 text-yellow-500" />}
            </CardTitle>
            <div className="flex items-center space-x-2 mt-1">
              <Building2 className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">{booking.customer_name}</span>
              {booking.work_location && (
                <>
                  <span className="text-gray-400">•</span>
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">{booking.work_location}</span>
                </>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge className={getStatusColor(booking.booking_status)}>
              {booking.booking_status || 'Pending'}
            </Badge>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => onViewDetails?.(booking.id)}>
                  View Details
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onEdit?.(booking.id)}>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onDelete?.(booking.id)} className="text-red-600">
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Job Details */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-sm font-medium text-gray-500">Role</div>
            <div className="text-sm">{booking.role || 'Not specified'}</div>
          </div>
          <div>
            <div className="text-sm font-medium text-gray-500">Driver Class</div>
            <div className="text-sm">
              <Badge variant="outline">{booking.driver_class}</Badge>
            </div>
          </div>
        </div>

        {/* Job Categories */}
        {booking.job_categories && booking.job_categories.length > 0 && (
          <div>
            <div className="text-sm font-medium text-gray-500 mb-1">Categories</div>
            <div className="flex flex-wrap gap-1">
              {booking.job_categories.map((category, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {category}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Date and Time */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="flex items-center space-x-1 text-sm font-medium text-gray-500">
              <Calendar className="w-4 h-4" />
              <span>Start</span>
            </div>
            <div className="text-sm">
              {booking.start_date} at {booking.start_time}
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-1 text-sm font-medium text-gray-500">
              <Calendar className="w-4 h-4" />
              <span>End</span>
            </div>
            <div className="text-sm">
              {booking.end_date} at {booking.end_time}
            </div>
          </div>
        </div>

        {/* Shift Information */}
        <div className="flex items-center space-x-4">
          <Badge className={getShiftTypeColor(booking.booking_type)}>
            {booking.booking_type === 'night_shift' ? 'Night Shift' : 'Day Shift'}
          </Badge>
          <Badge variant="outline">
            {booking.day_type}
          </Badge>
          {duration > 0 && (
            <div className="flex items-center space-x-1 text-sm text-gray-600">
              <Clock className="w-4 h-4" />
              <span>{duration.toFixed(1)} hours</span>
            </div>
          )}
        </div>

        {/* Contact Information */}
        {(booking.contact_name || booking.contact_phone || booking.contact_email) && (
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="text-sm font-medium text-gray-500 mb-1">Contact</div>
            <div className="space-y-1">
              {booking.contact_name && (
                <div className="text-sm">{booking.contact_name}</div>
              )}
              {booking.contact_phone && (
                <div className="flex items-center space-x-1 text-sm text-gray-600">
                  <Phone className="w-3 h-3" />
                  <span>{booking.contact_phone}</span>
                </div>
              )}
              {booking.contact_email && (
                <div className="flex items-center space-x-1 text-sm text-gray-600">
                  <Mail className="w-3 h-3" />
                  <span>{booking.contact_email}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Rate Information */}
        {(booking.pay_rate || booking.charge_rate) && (
          <div className="bg-blue-50 p-3 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <DollarSign className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-800">Rate Information</span>
            </div>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div className="text-center">
                <div className="font-semibold text-green-600">£{chargeRate}</div>
                <div className="text-xs text-gray-500">Charge/hour</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-blue-600">
                  £{effectivePayRate}
                  {booking.amended_pay_rate && (
                    <span className="text-xs text-orange-600 ml-1">(amended)</span>
                  )}
                </div>
                <div className="text-xs text-gray-500">Pay/hour</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-purple-600">£{(chargeRate - effectivePayRate).toFixed(2)}</div>
                <div className="text-xs text-gray-500">Margin/hour</div>
              </div>
            </div>
            {duration > 0 && (
              <div className="mt-2 pt-2 border-t border-blue-200">
                <div className="flex justify-between text-sm">
                  <span>Total Charge:</span>
                  <span className="font-semibold">£{totalCharge.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Total Pay:</span>
                  <span className="font-semibold">£{totalPay.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm font-semibold text-purple-600">
                  <span>Total Margin:</span>
                  <span>£{totalMargin.toFixed(2)}</span>
                </div>
                {expenses > 0 && (
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Expenses:</span>
                    <span>£{expenses.toFixed(2)}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Locations */}
        {(booking.pickup_location || booking.dropoff_location) && (
          <div className="space-y-2">
            {booking.pickup_location && (
              <div className="flex items-start space-x-2 text-sm">
                <MapPin className="w-4 h-4 text-green-600 mt-0.5" />
                <div>
                  <span className="text-gray-500">Pickup:</span>
                  <div>{booking.pickup_location}</div>
                </div>
              </div>
            )}
            {booking.dropoff_location && (
              <div className="flex items-start space-x-2 text-sm">
                <MapPin className="w-4 h-4 text-red-600 mt-0.5" />
                <div>
                  <span className="text-gray-500">Dropoff:</span>
                  <div>{booking.dropoff_location}</div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Notes */}
        {booking.notes && (
          <div className="bg-yellow-50 p-3 rounded-lg">
            <div className="flex items-center space-x-2 mb-1">
              <AlertCircle className="w-4 h-4 text-yellow-600" />
              <span className="text-sm font-medium text-yellow-800">Notes</span>
            </div>
            <div className="text-sm text-gray-700">{booking.notes}</div>
          </div>
        )}

        {/* Special Indicators */}
        <div className="flex items-center space-x-2">
          {booking.holiday_accrual && (
            <Badge variant="outline" className="text-xs">
              <Star className="w-3 h-3 mr-1" />
              Holiday Accrual
            </Badge>
          )}
          {booking.amended_pay_rate && (
            <Badge variant="outline" className="text-xs text-orange-600">
              Amended Rate
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ComprehensiveBookingCard;
