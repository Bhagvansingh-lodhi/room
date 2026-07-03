import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import useAuth from '../hooks/useAuth.js';

export default function RoomDetailPage() {
  const { id } = useParams();
  const { api, user } = useAuth();
  const [room, setRoom] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    fetchRoom();
    fetchReviews();
    if (user) {
      checkIfSaved();
    }
  }, [id, user]);

  const fetchRoom = async () => {
    try {
      const response = await api.get(`/rooms/${id}`);
      setRoom(response.data.data.room);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const response = await api.get(`/reviews/${id}`);
      if (response.data.success) {
        setReviews(response.data.data.reviews);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const checkIfSaved = async () => {
    try {
      const response = await api.get('/saved');
      if (response.data.success) {
        setIsSaved(response.data.data.savedRooms.some(r => r._id === id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveRoom = async () => {
    try {
      if (isSaved) {
        await api.delete(`/saved/${id}`);
        setIsSaved(false);
      } else {
        await api.post(`/saved/${id}`);
        setIsSaved(true);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmitReview = async e => {
    e.preventDefault();
    if (!user) {
      alert('Please login to submit a review');
      return;
    }
    setSubmittingReview(true);
    try {
      const res = await api.post('/reviews', {
        room: id,
        rating: reviewForm.rating,
        comment: reviewForm.comment,
      });
      if (res.data.success) {
        alert('Review submitted!');
        setReviewForm({ rating: 5, comment: '' });
        fetchReviews();
        fetchRoom();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error submitting review');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) return <div className="rounded-lg bg-white p-8 shadow-sm">Loading room details...</div>;
  if (!room) return <div className="rounded-lg bg-white p-8 shadow-sm">Room not found.</div>;

  return (
    <div className="space-y-8">
      <div className="rounded-lg bg-white p-8 shadow-sm">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-4xl font-bold">{room.title}</h1>
            <p className="mt-2 text-slate-600">{room.city} • {room.roomType}</p>
          </div>
          {user?.role === 'student' && (
            <button
              onClick={handleSaveRoom}
              className={`px-6 py-3 rounded-lg font-medium ${
                isSaved ? 'bg-red-100 text-red-700' : 'bg-sky-100 text-sky-700'
              }`}
            >
              {isSaved ? '❤️ Saved' : '🤍 Save'}
            </button>
          )}
        </div>
        
        {room.images && room.images.length > 0 && (
          <div className="mt-6 rounded-lg overflow-hidden h-96 bg-slate-200">
            <img src={room.images[0].url} alt={room.title} className="w-full h-full object-cover" />
          </div>
        )}

        <p className="mt-6 text-slate-700 text-lg">{room.description}</p>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          <div className="rounded-lg bg-slate-50 p-6">
            <p className="text-sm uppercase tracking-wide text-slate-500 font-medium">Rent</p>
            <p className="mt-2 text-3xl font-bold text-sky-600">₹{room.rent}</p>
            <p className="text-sm text-slate-600">per month</p>
          </div>
          <div className="rounded-lg bg-slate-50 p-6">
            <p className="text-sm uppercase tracking-wide text-slate-500 font-medium">Type</p>
            <p className="mt-2 text-xl font-semibold">{room.roomType}</p>
          </div>
          <div className="rounded-lg bg-slate-50 p-6">
            <p className="text-sm uppercase tracking-wide text-slate-500 font-medium">Rating</p>
            <p className="mt-2 text-xl font-semibold">{room.averageRating ? room.averageRating.toFixed(1) : 'N/A'}/5</p>
          </div>
        </div>
      </div>

      {room.amenities && room.amenities.length > 0 && (
        <div className="rounded-lg bg-white p-8 shadow-sm">
          <h2 className="text-2xl font-semibold mb-4">Amenities</h2>
          <div className="flex flex-wrap gap-3">
            {room.amenities.map(item => (
              <span key={item} className="rounded-full bg-sky-100 px-4 py-2 text-sm text-sky-700 font-medium">
                ✓ {item}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="rounded-lg bg-white p-8 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold">Owner</h2>
        </div>
        <div className="p-4 bg-slate-50 rounded-lg">
          <p className="font-medium">{room.owner.name}</p>
          <p className="text-slate-600">{room.owner.email}</p>
        </div>
      </div>

      <div className="rounded-lg bg-white p-8 shadow-sm">
        <h2 className="text-2xl font-semibold mb-6">Reviews ({reviews.length})</h2>
        
        {user?.role === 'student' && (
          <form onSubmit={handleSubmitReview} className="mb-8 p-6 bg-slate-50 rounded-lg">
            <h3 className="font-semibold mb-4">Leave a Review</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Rating</label>
                <select
                  value={reviewForm.rating}
                  onChange={e => setReviewForm({ ...reviewForm, rating: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg"
                >
                  <option value="5">5 Stars - Excellent</option>
                  <option value="4">4 Stars - Good</option>
                  <option value="3">3 Stars - Average</option>
                  <option value="2">2 Stars - Poor</option>
                  <option value="1">1 Star - Terrible</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Comment</label>
                <textarea
                  value={reviewForm.comment}
                  onChange={e => setReviewForm({ ...reviewForm, comment: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg"
                  rows="3"
                  placeholder="Share your experience..."
                />
              </div>
              <button
                type="submit"
                disabled={submittingReview}
                className="px-6 py-2 rounded-lg bg-sky-600 text-white hover:bg-sky-700 disabled:opacity-50 font-medium"
              >
                {submittingReview ? 'Submitting...' : 'Submit Review'}
              </button>
            </div>
          </form>
        )}

        <div className="space-y-4">
          {reviews.length === 0 ? (
            <p className="text-slate-600">No reviews yet. Be the first to review!</p>
          ) : (
            reviews.map(review => (
              <div key={review._id} className="p-4 border border-slate-200 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <p className="font-semibold">{review.user.name}</p>
                  <span className="text-yellow-500">{'⭐'.repeat(review.rating)}</span>
                </div>
                <p className="text-slate-700">{review.comment}</p>
                <p className="text-xs text-slate-500 mt-2">
                  {new Date(review.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
