// src/pages/Dashboard/components/ActivityItem.tsx
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface ActivityItemProps {
  icon: LucideIcon;
  iconColor: string;
  title: string;
  time: string;
}

const ActivityItem: React.FC<ActivityItemProps> = ({ icon: Icon, iconColor, title, time }) => {
  const getBgColor = () => {
    switch(iconColor) {
      case 'blue': return 'bg-blue-100';
      case 'green': return 'bg-green-100';
      case 'yellow': return 'bg-yellow-100';
      default: return 'bg-gray-100';
    }
  };

  const getTextColor = () => {
    switch(iconColor) {
      case 'blue': return 'text-blue-600';
      case 'green': return 'text-green-600';
      case 'yellow': return 'text-yellow-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <li className="py-3">
      <div className="flex items-center space-x-4">
        <div className="flex-shrink-0">
          <div className={`h-8 w-8 rounded-full ${getBgColor()} flex items-center justify-center`}>
            <Icon className={`h-5 w-5 ${getTextColor()}`} />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900">{title}</p>
          <p className="text-sm text-gray-500">{time}</p>
        </div>
      </div>
    </li>
  );
};

export default ActivityItem;
