
import React, { useState } from 'react';
import axios from 'axios';
import LandingPage from './LandingPage';

function App() {
  const [showApp, setShowApp] = useState(false);
  const [file, setFile] = useState(null);
  const [summary, setSummary] = useState('');
  const [qoeText, setQoeText] = useState('');
  const [promptType, setPromptType] = useState('executive_summary');
  const [chartUrl, setChartUrl] = useState('');

  if (!showApp) {
    return <LandingPage onContinue={() => setShowApp(true)} />;
  }

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await axios.post('https://qoe-render-ready-2.onrender.com/upload', formData);
    setSummary(JSON.stringify(res.data.data, null, 2));
  };

  const handleGenerateQoe = async () => {
    const res = await axios.post('https://qoe-render-ready-2.onrender.com/generate_qoe', {
      financial_summary: summary,
      type: promptType
    });
    setQoeText(res.data.qoe_summary);
  };

  const handleExport = async () => {
    const res = await axios.get('https://qoe-render-ready-2.onrender.com/export_docx', {
      responseType: 'blob'
    });
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'QoE_Report.docx');
    document.body.appendChild(link);
    link.click();
  };

  const handleChart = async () => {
    const res = await axios.get('https://qoe-render-ready-2.onrender.com/revenue_chart', {
      responseType: 'blob'
    });
    const url = window.URL.createObjectURL(new Blob([res.data]));
    setChartUrl(url);
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Acquisight QoE</h1>
      <input type="file" onChange={handleFileChange} className="mb-4" />

      <div className="mb-4">
        <label className="block mb-2 font-semibold">Choose Prompt Type:</label>
        <select value={promptType} onChange={(e) => setPromptType(e.target.value)} className="border p-2 rounded w-full">
          <option value="executive_summary">Executive Summary</option>
          <option value="revenue_trends">Revenue Trends</option>
          <option value="addbacks">Add-Backs</option>
          <option value="working_capital">Working Capital</option>
        </select>
      </div>

      <button onClick={handleUpload} className="bg-blue-500 text-white px-4 py-2 rounded mr-2">Upload</button>
      <button onClick={handleGenerateQoe} className="bg-green-500 text-white px-4 py-2 rounded mr-2">Generate QoE</button>
      <button onClick={handleExport} className="bg-purple-500 text-white px-4 py-2 rounded mr-2">Export to Word</button>
      <button onClick={handleChart} className="bg-orange-500 text-white px-4 py-2 rounded">Show Revenue Chart</button>

      <div className="mt-6">
        <h2 className="text-xl font-semibold">Financial Data (preview):</h2>
        <pre className="bg-gray-100 p-4 mt-2 rounded whitespace-pre-wrap max-h-64 overflow-y-scroll">{summary}</pre>
      </div>

      <div className="mt-6">
        <h2 className="text-xl font-semibold">QoE Report Output:</h2>
        <pre className="bg-gray-100 p-4 mt-2 rounded whitespace-pre-wrap max-h-64 overflow-y-scroll">{qoeText}</pre>
      </div>

      {chartUrl && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold">Revenue Chart:</h2>
          <img src={chartUrl} alt="Revenue Chart" className="mt-2 rounded border shadow" />
        </div>
      )}
    </div>
  );
}

export default App;
