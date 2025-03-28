// src/pages/Dashboard/components/StatCard.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  color: string;
  link: {
    text: string;
    href: string;
  };
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, color, link }) => {
  const getBgColor = () => {
    switch(color) {
      case 'blue': return 'bg-blue-500';
      case 'green': return 'bg-green-500';
      case 'indigo': return 'bg-indigo-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="p-5">
        <div className="flex items-center">
          <div className={`flex-shrink-0 ${getBgColor()} rounded-md p-3`}>
            <Icon className="h-6 w-6 text-white" />
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
              <dd>
                <div className="text-lg font-medium text-gray-900">{value}</div>
              </dd>
            </dl>
          </div>
        </div>
      </div>
      <div className="bg-gray-50 px-5 py-3">
        <div className="text-sm">
          <Link to={link.href} className="font-medium text-blue-600 hover:text-blue-500">
            {link.text}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default StatCard;
