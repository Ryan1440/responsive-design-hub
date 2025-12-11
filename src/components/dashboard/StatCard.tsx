import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  className?: string;
}

const StatCard = ({ title, value, icon: Icon, change, changeType = 'neutral', className }: StatCardProps) => {
  return (
    <div className={cn('bg-card rounded-2xl p-6 border border-border shadow-soft', className)}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground mb-1">{title}</p>
          <h3 className="font-display text-2xl font-bold text-foreground">{value}</h3>
          {change && (
            <p
              className={cn(
                'text-sm mt-2',
                changeType === 'positive' && 'text-green-600',
                changeType === 'negative' && 'text-destructive',
                changeType === 'neutral' && 'text-muted-foreground'
              )}
            >
              {change}
            </p>
          )}
        </div>
        <div className="w-12 h-12 rounded-xl bg-pink-soft flex items-center justify-center">
          <Icon className="w-6 h-6 text-pink-dark" />
        </div>
      </div>
    </div>
  );
};

export default StatCard;
