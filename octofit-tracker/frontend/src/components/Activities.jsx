import { useEffect, useState } from 'react';
import { getApiUrl } from '../utils/api';

function Activities() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();

    async function loadActivities() {
      try {
        const response = await fetch(getApiUrl('activities'), { signal: controller.signal });
        if (!response.ok) {
          throw new Error('Unable to load activities');
        }

        const data = await response.json();
        const items = Array.isArray(data) ? data : data.results || [];
        setActivities(items);
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err.message || 'Unable to load activities');
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadActivities();

    return () => controller.abort();
  }, []);

  return (
    <section className="container py-4">
      <h2 className="mb-3">Activities</h2>
      {loading && <p>Loading activities...</p>}
      {error && <p className="text-danger">{error}</p>}
      {!loading && !error && (
        <div className="row row-cols-1 row-cols-md-2 g-3">
          {activities.map((activity) => (
            <div className="col" key={activity._id || activity.id || activity.date}>
              <div className="card h-100">
                <div className="card-body">
                  <h5 className="card-title">{activity.type}</h5>
                  <p className="card-text">Duration: {activity.duration} mins</p>
                  <p className="card-text">Calories: {activity.calories || 'N/A'}</p>
                  <p className="card-text">Date: {new Date(activity.date).toLocaleDateString()}</p>
                  <p className="card-text">User: {activity.user?.name || 'N/A'}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default Activities;
