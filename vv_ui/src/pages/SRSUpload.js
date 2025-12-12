import React, { useState } from 'react';
import { apiPostMultipart, apiPostJson } from '../api/client';

// PUBLIC_INTERFACE
export default function SRSUpload() {
  /** Upload SRS and trigger test case generation. Shows srs_id and errors. */
  const [file, setFile] = useState(null);
  const [srsId, setSrsId] = useState('');
  const [loading, setLoading] = useState(false);
  const [genLoading, setGenLoading] = useState(false);
  const [error, setError] = useState('');

  const onFileChange = (e) => setFile(e.target.files?.[0] || null);

  const upload = async () => {
    setError('');
    if (!file) {
      setError('Please select a file (.pdf, .docx, .txt, .md, .csv, .xlsx, .xls).');
      return;
    }
    setLoading(true);
    try {
      const form = new FormData();
      form.append('file', file);
      const res = await apiPostMultipart('/srs', form);
      setSrsId(res?.srs_id || res?.id || '');
    } catch (e) {
      setError(e.message || 'Failed to upload SRS.');
    } finally {
      setLoading(false);
    }
  };

  const generateTestCases = async () => {
    if (!srsId) {
      setError('No SRS ID available. Upload first.');
      return;
    }
    setGenLoading(true);
    setError('');
    try {
      await apiPostJson('/testcases/generate', { srs_id: srsId });
    } catch (e) {
      setError(e.message || 'Failed to trigger test case generation.');
    } finally {
      setGenLoading(false);
    }
  };

  return (
    <div>
      <div className="panel">
        <div className="panel-title">Upload SRS</div>
        <div className="row">
          <div className="col">
            <input
              aria-label="SRS file"
              className="input"
              type="file"
              accept=".pdf,.docx,.txt,.md,.csv,.xlsx,.xls"
              onChange={onFileChange}
            />
            <div className="helper">
              Accepted: .pdf, .docx, .txt, .md, .csv, .xlsx, .xls
            </div>
          </div>
          <div className="col" style={{ alignSelf: 'end' }}>
            <button className="btn primary" onClick={upload} disabled={loading}>
              {loading ? <span className="loading" /> : 'Upload'}
            </button>
          </div>
        </div>
        {srsId && (
          <div className="alert success">
            Uploaded successfully. SRS ID: <strong>{srsId}</strong>
          </div>
        )}
        {error && <div className="alert error">{error}</div>}
      </div>

      <div className="panel">
        <div className="panel-title">Generate Test Cases</div>
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
            <button
              className="btn success"
              onClick={generateTestCases}
              disabled={!srsId || genLoading}
            >
              {genLoading ? <span className="loading" /> : 'Generate'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
