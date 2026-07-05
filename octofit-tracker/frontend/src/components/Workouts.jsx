import { useEffect, useState } from 'react';
import { getApiUrl } from '../utils/api';

function Workouts() {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const apiUrl = import.meta.env.VITE_CODESPACE_NAME?.trim()
    ? `https://${import.meta.env.VITE_CODESPACE_NAME.trim()}-8000.app.github.dev/api/workouts/`
    : getApiUrl('workouts');

  useEffect(() => {
    const controller = new AbortController();

    async function loadWorkouts() {
      try {
        const response = await fetch(apiUrl, { signal: controller.signal });
        if (!response.ok) {
          throw new Error('Unable to load workouts');
        }

        const data = await response.json();
        const items = Array.isArray(data) ? data : data.results || [];
        setWorkouts(items);
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err.message || 'Unable to load workouts');
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadWorkouts();

    return () => controller.abort();
  }, []);

  return (
    <section className="container py-4">
      <h2 className="mb-3">Workouts</h2>
      {loading && <p>Loading workouts...</p>}
      {error && <p className="text-danger">{error}</p>}
      {!loading && !error && (
        <div className="row row-cols-1 row-cols-md-2 g-3">
          {workouts.map((workout) => (
            <div className="col" key={workout._id || workout.id || workout.name}>
              <div className="card h-100">
                <div className="card-body">
                  <h5 className="card-title">{workout.name}</h5>
                  <p className="card-text">Difficulty: {workout.difficulty}</p>
                  <p className="card-text">Duration: {workout.duration} mins</p>
                  <p className="card-text">Focus: {workout.focus}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default Workouts;
