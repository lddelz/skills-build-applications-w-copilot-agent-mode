import { useEffect, useState } from 'react';
import { getApiUrl } from '../utils/api';

function Teams() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const apiUrl = import.meta.env.VITE_CODESPACE_NAME?.trim()
    ? `https://${import.meta.env.VITE_CODESPACE_NAME.trim()}-8000.app.github.dev/api/teams/`
    : getApiUrl('teams');

  useEffect(() => {
    const controller = new AbortController();

    async function loadTeams() {
      try {
        const response = await fetch(apiUrl, { signal: controller.signal });
        if (!response.ok) {
          throw new Error('Unable to load teams');
        }

        const data = await response.json();
        const items = Array.isArray(data) ? data : data.results || [];
        setTeams(items);
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err.message || 'Unable to load teams');
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadTeams();

    return () => controller.abort();
  }, []);

  return (
    <section className="container py-4">
      <h2 className="mb-3">Teams</h2>
      {loading && <p>Loading teams...</p>}
      {error && <p className="text-danger">{error}</p>}
      {!loading && !error && (
        <div className="row row-cols-1 row-cols-md-2 g-3">
          {teams.map((team) => (
            <div className="col" key={team._id || team.id || team.name}>
              <div className="card h-100">
                <div className="card-body">
                  <h5 className="card-title">{team.name}</h5>
                  <p className="card-text">Sport: {team.sport}</p>
                  <p className="card-text">Members: {team.members?.length || team.members || 0}</p>
                  <p className="card-text">Captain: {team.captain?.name || team.captain || 'N/A'}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default Teams;
