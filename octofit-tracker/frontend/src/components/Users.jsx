import { useEffect, useState } from 'react';
import { getApiBaseUrl, getApiUrl } from '../utils/api';

function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const apiUrl = import.meta.env.VITE_CODESPACE_NAME?.trim()
    ? `https://${import.meta.env.VITE_CODESPACE_NAME.trim()}-8000.app.github.dev/api/users/`
    : getApiUrl('users');

  useEffect(() => {
    const controller = new AbortController();

    async function loadUsers() {
      try {
        const response = await fetch(apiUrl, { signal: controller.signal });
        if (!response.ok) {
          throw new Error('Unable to load users');
        }

        const data = await response.json();
        const items = Array.isArray(data) ? data : data.results || [];
        setUsers(items);
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err.message || 'Unable to load users');
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadUsers();

    return () => controller.abort();
  }, []);

  return (
    <section className="container py-4">
      <h2 className="mb-3">Users</h2>
      <p className="text-muted">API base: {getApiBaseUrl()}</p>
      {loading && <p>Loading users...</p>}
      {error && <p className="text-danger">{error}</p>}
      {!loading && !error && (
        <div className="row row-cols-1 row-cols-md-2 g-3">
          {users.map((user) => (
            <div className="col" key={user._id || user.id || user.email}>
              <div className="card h-100">
                <div className="card-body">
                  <h5 className="card-title">{user.name}</h5>
                  <p className="card-text mb-1">{user.email}</p>
                  <p className="card-text mb-1">Role: {user.role}</p>
                  <p className="card-text">Fitness: {user.fitnessLevel || 'N/A'}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default Users;
