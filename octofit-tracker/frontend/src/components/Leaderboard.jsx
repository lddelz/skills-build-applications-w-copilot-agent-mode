import { useEffect, useState } from 'react';
import { getApiUrl } from '../utils/api';

function Leaderboard() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const apiUrl = import.meta.env.VITE_CODESPACE_NAME?.trim()
    ? `https://${import.meta.env.VITE_CODESPACE_NAME.trim()}-8000.app.github.dev/api/leaderboard/`
    : getApiUrl('leaderboard');

  useEffect(() => {
    const controller = new AbortController();

    async function loadLeaderboard() {
      try {
        const response = await fetch(apiUrl, { signal: controller.signal });
        if (!response.ok) {
          throw new Error('Unable to load leaderboard');
        }

        const data = await response.json();
        const items = Array.isArray(data) ? data : data.results || [];
        setEntries(items);
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err.message || 'Unable to load leaderboard');
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadLeaderboard();

    return () => controller.abort();
  }, []);

  return (
    <section className="container py-4">
      <h2 className="mb-3">Leaderboard</h2>
      {loading && <p>Loading leaderboard...</p>}
      {error && <p className="text-danger">{error}</p>}
      {!loading && !error && (
        <div className="list-group">
          {entries.map((entry) => (
            <div className="list-group-item d-flex justify-content-between align-items-center" key={entry._id || entry.rank}>
              <div>
                <strong>#{entry.rank}</strong> {entry.user?.name || entry.name || 'N/A'}
              </div>
              <span className="badge bg-primary rounded-pill">{entry.points} pts</span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default Leaderboard;
