
import React from 'react';
import { cn } from '@/lib/utils';
import { MessageSquareQuote } from 'lucide-react';
import { format, formatDistanceToNow, isToday } from 'date-fns';

export interface ReviewItem {
  id: number;
  name: string;
  rating: number;
  comment: string;
  date: Date;
}

interface ReviewCardProps {
  review: ReviewItem;
  isHovered?: boolean;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ review, isHovered }) => {
  // Format the date to show relative time (today, 2 days ago, etc.)
  const formatRelativeDate = (date: Date): string => {
    if (isToday(date)) {
      return 'Today';
    }
    return formatDistanceToNow(date, { addSuffix: true });
  };

  return (
    <div 
      className={cn(
        "glass-card p-5 transition-all duration-300 animate-fade-in-up relative",
        isHovered && "scale-105"
      )}
    >
      <div className="flex justify-between items-center mb-3">
        <div className="flex">
          {Array(5).fill(0).map((_, i) => (
            <svg 
              key={i}
              className={cn(
                "w-4 h-4",
                i < review.rating ? "text-yellow-400" : "text-gray-600"
              )}
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24" 
              fill="currentColor"
            >
              <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
            </svg>
          ))}
        </div>
        <span className="text-xs text-white/60">{formatRelativeDate(review.date)}</span>
      </div>
      
      <p className="text-sm text-white/80 mb-3 line-clamp-2 h-10">{review.comment}</p>
      
      <div className="text-xs font-medium text-white/60">- {review.name}</div>
      
      <MessageSquareQuote className="absolute top-3 right-3 w-6 h-6 text-blue-500/10" />
    </div>
  );
};

export default ReviewCard;
