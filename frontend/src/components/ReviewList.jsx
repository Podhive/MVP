import React from 'react';
import { format } from 'date-fns';
import { Star, Edit, Trash } from 'lucide-react';
import useAuth from '../context/useAuth';

const ReviewList = ({ reviews, onEdit, onDelete }) => {
  const { user } = useAuth();
  
  if (!reviews || reviews.length === 0) {
    return (
      <div className="text-center py-6">
        <p className="text-gray-500">No reviews yet. Be the first to review this studio!</p>
      </div>
    );
  }

  const renderStars = (rating) => {
    const stars = [];
    
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(<Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />);
      } else {
        stars.push(<Star key={i} className="h-4 w-4 text-yellow-400" />);
      }
    }
    
    return stars;
  };

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold mb-4">Reviews ({reviews.length})</h3>
      
      {reviews.map((review) => (
        <div key={review._id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center mb-2">
                <span className="font-medium mr-2">{review.reviewer?.name || 'Anonymous'}</span>
                <div className="flex">{renderStars(review.rating)}</div>
              </div>
              
              <p className="text-gray-700">{review.description}</p>
              
              <p className="text-xs text-gray-500 mt-2">
                {review.createdAt && format(new Date(review.createdAt), 'MMMM d, yyyy')}
              </p>
            </div>
            
            {user && review.reviewer?._id === user._id && (
              <div className="flex space-x-2">
                <button 
                  onClick={() => onEdit(review)}
                  className="p-1 text-blue-600 hover:text-blue-800"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button 
                  onClick={() => onDelete(review._id)}
                  className="p-1 text-red-600 hover:text-red-800"
                >
                  <Trash className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ReviewList;