import React, { useState } from 'react';
import { apiGet } from '../api/client';

// PUBLIC_INTERFACE
export default function Reports() {
  /** Show latest report by SRS ID and detailed run results. */
  const [srsId, setSrsId] = useState('');
  const [latest, setLatest] = useState(null);
  const [results, setResults] = useState([]);
  const [runId, setRunId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const loadLatest = async () => {
    if (!srsId) return;
    setLoading(true);
    setError('');
    try {
      const rep = await apiGet(`/reports/latest?srs_id=${encodeURIComponent(srsId)}`);
      setLatest(rep || {});
      const id = rep?.run_id || rep?.id;
      setRunId(id || '');
      if (id) {
        const data = await apiGet(`/runs/${encodeURIComponent(id)}/results`);
        setResults(Array.isArray(data) ? data : data?.items || []);
      } else {
        setResults([]);
      }
    } catch (e) {
      setError(e.message || 'Failed to load report.');
    } finally {
      setLoading(false);
    }
  };

  const pass = results.filter((r) => (r.status || '').toLowerCase() === 'pass').length;
  const fail = results.filter((r) => (r.status || '').toLowerCase() === 'fail').length;
  const total = results.length || 0;
  const passPct = total ? Math.round((pass / total) * 100) : 0;

  return (
    <div>
      <div className="panel">
        <div className="panel-title">Reports</div>
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
            <button className="btn" onClick={loadLatest} disabled={!srsId || loading}>
              {loading ? <span className="loading" /> : 'Load'}
            </button>
          </div>
        </div>
        {error && <div className="alert error">{error}</div>}
      </div>

      {latest && (
        <div className="panel">
          <div className="panel-title">Latest Run Summary</div>
          {!runId && <div className="helper">No recent run found.</div>}
          {runId && (
            <>
              <div className="row">
                <div className="col">Run ID: <strong>{runId}</strong></div>
                <div className="col">Status: <span className={`badge ${latest.status === 'completed' ? 'ok' : latest.status === 'failed' ? 'fail' : 'pending'}`}>{latest.status || 'N/A'}</span></div>
                <div className="col">Total: <strong>{total}</strong></div>
                <div className="col">Pass: <strong style={{ color: 'var(--success)' }}>{pass}</strong></div>
                <div className="col">Fail: <strong style={{ color: 'var(--error)' }}>{fail}</strong></div>
              </div>
              <div className="panel">
                <div className="panel-title">Pass Rate</div>
                <div style={{ background: '#F3F4F6', borderRadius: 12, overflow: 'hidden', border: '1px solid var(--border)' }}>
                  <div style={{ width: `${passPct}%`, background: 'linear-gradient(90deg, var(--success), #34D399)', color: '#fff', padding: '8px 12px' }}>
                    {passPct}% Passed
                  </div>
                </div>
              </div>

              <div className="panel">
                <div className="panel-title">Results</div>
                <table className="table">
                  <thead>
                    <tr>
                      <th>Test Case ID</th>
                      <th>Name</th>
                      <th>Status</th>
                      <th>Message</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.length === 0 && (
                      <tr><td colSpan="4" className="helper">No results yet.</td></tr>
                    )}
                    {results.map((r, idx) => (
                      <tr key={r.id || r.test_case_id || idx}>
                        <td>{r.test_case_id || r.id}</td>
                        <td>{r.name || r.title || '-'}</td>
                        <td>
                          <span className={`badge ${r.status === 'pass' ? 'ok' : r.status === 'fail' ? 'fail' : 'pending'}`}>
                            {r.status || 'N/A'}
                          </span>
                        </td>
                        <td>{r.message || r.error || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
