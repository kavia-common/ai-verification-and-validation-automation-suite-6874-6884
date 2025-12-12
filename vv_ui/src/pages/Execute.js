import React, { useEffect, useRef, useState } from 'react';
import { apiGet, apiPostJson } from '../api/client';

// PUBLIC_INTERFACE
export default function Execute() {
  /** Execute selected tests; poll run status and display live logs. */
  const [srsId, setSrsId] = useState('');
  const [testCaseIds, setTestCaseIds] = useState('');
  const [headless, setHeadless] = useState(true);
  const [runId, setRunId] = useState('');
  const [logs, setLogs] = useState('');
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [starting, setStarting] = useState(false);
  const pollRef = useRef(null);

  const startRun = async () => {
    setError('');
    if (!srsId) {
      setError('SRS ID is required');
      return;
    }
    setStarting(true);
    try {
      const ids = testCaseIds
        ? testCaseIds.split(',').map((s) => s.trim()).filter(Boolean)
        : [];
      const resp = await apiPostJson('/runs', {
        srs_id: srsId,
        test_case_ids: ids,
        headless,
      });
      const id = resp?.id || resp?.run_id;
      setRunId(id);
      setStatus('queued');
      startPolling(id);
    } catch (e) {
      setError(e.message || 'Failed to start run');
    } finally {
      setStarting(false);
    }
  };

  const startPolling = (id) => {
    stopPolling();
    pollRef.current = setInterval(async () => {
      try {
        const data = await apiGet(`/runs/${encodeURIComponent(id)}`);
        setStatus(data?.status || '');
        const newLogs = data?.logs || data?.output || '';
        setLogs((prev) => {
          if (!newLogs || newLogs === prev) return prev;
          return newLogs;
        });
        if (['completed', 'failed', 'cancelled'].includes((data?.status || '').toLowerCase())) {
          stopPolling();
        }
      } catch (e) {
        // keep polling unless critical
      }
    }, 2000);
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
        <div className="panel-title">Execute Tests</div>
        <div className="row">
          <div className="col">
            <input
              className="input"
              placeholder="SRS ID"
              value={srsId}
              onChange={(e) => setSrsId(e.target.value)}
            />
          </div>
          <div className="col">
            <input
              className="input"
              placeholder="Test Case IDs (comma-separated, optional)"
              value={testCaseIds}
              onChange={(e) => setTestCaseIds(e.target.value)}
            />
          </div>
          <div className="col" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <input
              id="headless"
              type="checkbox"
              checked={headless}
              onChange={(e) => setHeadless(e.target.checked)}
            />
            <label htmlFor="headless">Headless</label>
          </div>
          <div className="col" style={{ alignSelf: 'end' }}>
            <button className="btn primary" onClick={startRun} disabled={starting}>
              {starting ? <span className="loading" /> : 'Start'}
            </button>
          </div>
        </div>
        {error && <div className="alert error">{error}</div>}
      </div>

      {runId && (
        <div className="panel">
          <div className="panel-title">Run Status</div>
          <div className="row">
            <div className="col">
              Run ID: <strong>{runId}</strong>
            </div>
            <div className="col">
              Status:{' '}
              <span className={`badge ${status === 'completed' ? 'ok' : status === 'failed' ? 'fail' : 'pending'}`}>
                {status || 'N/A'}
              </span>
            </div>
            <div className="col" style={{ alignSelf: 'end' }}>
              <button className="btn" onClick={stopPolling} disabled={!pollRef.current}>
                Stop Poll
              </button>
            </div>
          </div>
          <div className="panel" style={{ background: '#0b1220', color: '#E5E7EB' }}>
            <div className="panel-title">Logs</div>
            <pre style={{ whiteSpace: 'pre-wrap', maxHeight: 320, overflow: 'auto' }}>
{logs || 'Waiting for logs...'}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
