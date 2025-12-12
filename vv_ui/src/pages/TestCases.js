import React, { useEffect, useRef, useState } from 'react';
import { apiGet, apiPostJson } from '../api/client';

// PUBLIC_INTERFACE
export default function TestCases() {
  /** List test cases by SRS ID, trigger generation, and poll status. */
  const [srsId, setSrsId] = useState('');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [genLoading, setGenLoading] = useState(false);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('idle');
  const pollRef = useRef(null);

  const load = async () => {
    if (!srsId) return;
    setError('');
    setLoading(true);
    try {
      const data = await apiGet(`/testcases?srs_id=${encodeURIComponent(srsId)}`);
      setItems(Array.isArray(data) ? data : data?.items || []);
    } catch (e) {
      setError(e.message || 'Failed to load test cases.');
    } finally {
      setLoading(false);
    }
  };

  const trigger = async () => {
    if (!srsId) {
      setError('Provide SRS ID');
      return;
    }
    setGenLoading(true);
    setStatus('queued');
    try {
      await apiPostJson('/testcases/generate', { srs_id: srsId });
      startPolling();
    } catch (e) {
      setError(e.message || 'Failed to trigger generation');
      setStatus('idle');
    } finally {
      setGenLoading(false);
    }
  };

  const startPolling = () => {
    stopPolling();
    pollRef.current = setInterval(async () => {
      try {
        await load();
        setStatus('running');
      } catch {
        // ignore in polling
      }
    }, 2500);
  };
  const stopPolling = () => {
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
  };

  useEffect(() => {
    return () => stopPolling();
  }, []);

  return (
    <div>
      <div className="panel">
        <div className="panel-title">Test Cases</div>
        <div className="row">
          <div className="col">
            <input
              className="input"
              placeholder="SRS ID"
              value={srsId}
              onChange={(e) => setSrsId(e.target.value)}
            />
          </div>
          <div className="col" style={{ alignSelf: 'end' }}>
            <button className="btn" onClick={load} disabled={!srsId || loading}>
              {loading ? <span className="loading" /> : 'Load'}
            </button>
            {' '}
            <button className="btn success" onClick={trigger} disabled={!srsId || genLoading}>
              {genLoading ? <span className="loading" /> : 'Generate'}
            </button>
            {' '}
            <button className="btn" onClick={stopPolling} disabled={!pollRef.current}>
              Stop Poll
            </button>
            {status !== 'idle' && (
              <span className={`badge ${status === 'running' ? 'pending' : 'ok'}`} style={{ marginLeft: 8 }}>
                {status}
              </span>
            )}
          </div>
        </div>
        {error && <div className="alert error">{error}</div>}
      </div>

      <div className="panel">
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Title/Name</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {items?.length === 0 && (
              <tr>
                <td colSpan="3" className="helper">No test cases yet.</td>
              </tr>
            )}
            {items?.map((tc) => (
              <tr key={tc.id || tc.test_case_id}>
                <td>{tc.id || tc.test_case_id}</td>
                <td>{tc.title || tc.name || '-'}</td>
                <td>
                  <span className={`badge ${tc.status === 'pass' ? 'ok' : tc.status === 'fail' ? 'fail' : 'pending'}`}>
                    {tc.status || 'N/A'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
