import React, { useState } from 'react';
import { apiGet, apiPostJson } from '../api/client';

// PUBLIC_INTERFACE
export default function Scripts() {
  /** View or generate scripts for a given SRS ID. Show previews. */
  const [srsId, setSrsId] = useState('');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [genLoading, setGenLoading] = useState(false);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState(null);

  const load = async () => {
    if (!srsId) return;
    setError('');
    setLoading(true);
    try {
      const data = await apiGet(`/scripts?srs_id=${encodeURIComponent(srsId)}`);
      setItems(Array.isArray(data) ? data : data?.items || []);
    } catch (e) {
      setError(e.message || 'Failed to load scripts.');
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
    setError('');
    try {
      await apiPostJson('/scripts/generate', { srs_id: srsId });
      await load();
    } catch (e) {
      setError(e.message || 'Failed to generate scripts');
    } finally {
      setGenLoading(false);
    }
  };

  return (
    <div>
      <div className="panel">
        <div className="panel-title">Scripts</div>
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
          </div>
        </div>
        {error && <div className="alert error">{error}</div>}
      </div>

      <div className="panel">
        <table className="table">
          <thead>
            <tr>
              <th>Script ID</th>
              <th>Test Case ID</th>
              <th>Name</th>
              <th>Preview</th>
            </tr>
          </thead>
          <tbody>
            {items?.length === 0 && (
              <tr>
                <td colSpan="4" className="helper">No scripts yet.</td>
              </tr>
            )}
            {items?.map((sc) => (
              <tr key={sc.id || sc.script_id}>
                <td>{sc.id || sc.script_id}</td>
                <td>{sc.test_case_id || '-'}</td>
                <td>{sc.name || sc.filename || '-'}</td>
                <td>
                  <button className="btn" onClick={() => setPreview(sc)}>
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {preview && (
        <div className="panel">
          <div className="panel-title">Script Preview</div>
          <pre style={{ whiteSpace: 'pre-wrap' }}>
            {(preview.code || preview.content || preview.preview || '').slice(0, 4000) || 'No content'}
          </pre>
          <button className="btn" onClick={() => setPreview(null)}>Close</button>
        </div>
      )}
    </div>
  );
}
