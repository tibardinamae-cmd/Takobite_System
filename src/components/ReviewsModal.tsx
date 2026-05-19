import React, { useState } from 'react';
import { X, Star, MessageSquare } from 'lucide-react';
import { Review, User } from '../types';

interface ReviewsModalProps {
  isOpen: boolean;
  onClose: () => void;
  reviews: Review[];
  onAddReview: (review: Review) => void;
  currentUser: User | null;
  onOpenAuth: () => void;
}

export const ReviewsModal: React.FC<ReviewsModalProps> = ({
  isOpen,
  onClose,
  reviews,
  onAddReview,
  currentUser,
  onOpenAuth
}) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [selectedItemName, setSelectedItemName] = useState('Classic Osaka Octopus');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      onOpenAuth();
      return;
    }
    if (!comment.trim()) return;

    const newRev: Review = {
      id: `rev_${Date.now()}`,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      rating,
      comment,
      date: 'Just now',
      itemName: selectedItemName
    };

    onAddReview(newRev);
    setComment('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden max-h-[90vh] flex flex-col border border-rose-100">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-rose-600 to-amber-500 p-6 text-white flex items-center justify-between flex-shrink-0">
          <div className="flex items-center space-x-2">
            <MessageSquare className="w-6 h-6" />
            <h2 className="text-xl font-black font-heading">Customer Satisfactions & Reviews</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 bg-black/20 hover:bg-black/30 rounded-full text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 no-scrollbar">
          
          {/* Write a Review Form */}
          <div className="bg-rose-50/60 p-4 rounded-2xl border border-rose-200">
            <h4 className="font-bold text-neutral-900 text-xs uppercase tracking-wider mb-2">Leave Your Feedback</h4>
            
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-neutral-600 font-semibold">Your Rating:</span>
                <div className="flex items-center space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="p-1 text-amber-400 focus:outline-none transition-transform hover:scale-125"
                    >
                      <Star className={`w-5 h-5 ${star <= rating ? 'fill-amber-400 text-amber-400' : 'text-neutral-300'}`} />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-neutral-600 mb-1">Takoyaki Flavor</label>
                <select
                  value={selectedItemName}
                  onChange={(e) => setSelectedItemName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-xs bg-white font-medium focus:outline-none focus:ring-2 focus:ring-rose-500"
                >
                  <option>Classic Osaka Octopus</option>
                  <option>Cheesy Bacon Overload</option>
                  <option>Spicy Ebi Tempura Crunch</option>
                  <option>Truffle Teriyaki Mushroom</option>
                  <option>Ultimate Samurai Party Feast</option>
                </select>
              </div>

              <div>
                <textarea
                  required
                  placeholder="Share your crispy & creamy experience! How was the Otafuku sauce?"
                  rows={3}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full p-3 rounded-xl border border-neutral-300 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-rose-500 font-medium"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs shadow-md shadow-rose-500/20 transition-transform active:scale-95"
              >
                {currentUser ? 'Submit Review' : 'Log In to Submit'}
              </button>
            </form>
          </div>

          {/* Reviews List */}
          <div className="space-y-4">
            <h4 className="font-bold font-heading text-neutral-800 text-sm">Recent Satisfied Customers ({reviews.length})</h4>
            
            <div className="space-y-3">
              {reviews.map((rev) => (
                <div key={rev.id} className="bg-white rounded-2xl p-4 border border-rose-100 shadow-sm space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <img src={rev.userAvatar} alt={rev.userName} className="w-8 h-8 rounded-full object-cover border border-rose-200" />
                      <div>
                        <h5 className="font-bold text-xs text-neutral-900">{rev.userName}</h5>
                        <span className="text-[10px] text-neutral-400">{rev.date} • {rev.itemName}</span>
                      </div>
                    </div>
                    <div className="flex items-center text-amber-400 text-xs font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-400 mr-1" />
                      <span>{rev.rating}.0</span>
                    </div>
                  </div>
                  <p className="text-xs text-neutral-600 leading-relaxed font-medium">"{rev.comment}"</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
