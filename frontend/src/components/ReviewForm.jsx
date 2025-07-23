import React, { useState } from 'react';
import { Star } from 'lucide-react';

const ReviewForm = ({ studioId, onSubmit, initialValues = null }) => {
  const [rating, setRating] = useState(initialValues?.rating || 0);
  const [description, setDescription] = useState(initialValues?.description || '');
  const [hoveredRating, setHoveredRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (rating === 0) {
      alert('Please select a rating');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await onSubmit({
        studio: studioId,
        rating,
        description
      });
      
      // Reset form if not editing
      if (!initialValues) {
        setRating(0);
        setDescription('');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-4">
        {initialValues ? 'Edit Your Review' : 'Write a Review'}
      </h3>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
        <div className="flex">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onMouseEnter={() => setHoveredRating(star)}
              onMouseLeave={() => setHoveredRating(0)}
              onClick={() => setRating(star)}
              className="p-1 focus:outline-none"
            >
              <Star 
                className={`h-6 w-6 ${
                  (hoveredRating || rating) >= star 
                    ? 'fill-yellow-400 text-yellow-400' 
                    : 'text-gray-300'
                }`} 
              />
            </button>
          ))}
        </div>
      </div>
      
      <div className="mb-4">
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
          Your Review
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows="4"
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="Share your experience with this studio..."
          required
        ></textarea>
      </div>
      
      <button
        type="submit"
        disabled={isSubmitting || rating === 0}
        className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-indigo-300"
      >
        {isSubmitting 
          ? 'Submitting...' 
          : initialValues 
            ? 'Update Review' 
            : 'Submit Review'
        }
      </button>
    </form>
  );
};

export default ReviewForm;