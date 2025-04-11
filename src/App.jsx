
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
      <div className="flex items-center space-x-4 mb-4"><img src="/logo.png" alt="Acquisight QoE Logo" className="h-10"/><h1 className="text-2xl font-bold">Acquisight QoE</h1></div>

      <div className="mb-6 bg-blue-50 border-l-4 border-blue-500 text-blue-700 p-4 rounded">
        <h2 className="font-bold mb-2">📂 File Upload Instructions</h2>
<div className="relative group inline-block mb-2 ml-2 align-middle">
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline-block text-blue-500 cursor-pointer" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M18 10A8 8 0 11.003 10.001 8 8 0 0118 10zm-8 3a1 1 0 100-2 1 1 0 000 2zm-.25-6.75a.75.75 0 00-1.5 0v.5a.75.75 0 001.5 0v-.5zm0 2.5a.75.75 0 00-1.5 0v3a.75.75 0 001.5 0v-3z" clipRule="evenodd" />
  </svg>
  <div className="absolute hidden group-hover:block w-72 z-10 mt-1 rounded shadow-lg bg-white border p-3 text-left text-sm text-gray-700">
    <p className="font-semibold mb-2">Example Excel Format:</p>
    <img src="/sample-preview.png" alt="Sample Excel Format" className="w-full rounded border" />
    <ul className="list-disc list-inside mt-2">
      <li>Date (YYYY-MM-DD)</li>
      <li>Revenue</li>
      <li>COGS</li>
      <li>SG&A</li>
    </ul>
  </div>
</div>

        <p className="mb-1">Please upload an Excel (.xlsx) file that includes at least the following columns:</p>
        <ul className="list-disc list-inside text-sm mb-2">
          <li><strong>Date</strong> — Format: YYYY-MM-DD (e.g., 2024-01-01)</li>
          <li><strong>Revenue</strong> — Monthly revenue figures</li>
          <li><strong>COGS</strong> — Cost of goods sold</li>
          <li><strong>SG&A</strong> — Selling, General & Admin expenses</li>
        </ul>
        <p className="mb-1">✔️ The file must be in <strong>.xlsx</strong> format (Excel)</p>
        <p className="mb-1">✔️ Upload only one file at a time</p>
        <p className="mb-1">📌 Ensure your file has data spanning at least 3–12 months for best results</p>
      </div>

      <input type="file" onChange={handleFileChange} className="mb-4" title="Upload a .xlsx file with Date, Revenue, COGS, and SG&A columns" />

      <div className="mb-4">
        <label className="block mb-2 font-semibold">Choose Prompt Type:</label>
        <select value={promptType} onChange={(e) => setPromptType(e.target.value)} className="border p-2 rounded w-full" title="Select the section of the QoE report you want to generate">
          <option value="executive_summary">Executive Summary</option>
          <option value="revenue_trends">Revenue Trends</option>
          <option value="addbacks">Add-Backs</option>
          <option value="working_capital">Working Capital</option>
        </select>
      </div>

      <button onClick={handleUpload} title="Upload your financial Excel file to prepare for analysis" className="bg-blue-500 text-white px-4 py-2 rounded mr-2">Upload</button>
      <button onClick={handleGenerateQoe} title="Use AI to generate insights based on the uploaded data" className="bg-green-500 text-white px-4 py-2 rounded mr-2">Generate QoE</button>
      <button onClick={handleExport} title="Download the generated QoE summary as a Word document" className="bg-purple-500 text-white px-4 py-2 rounded mr-2">Export to Word</button>
      <button onClick={handleChart} title="View a chart of monthly revenue trends from your data" className="bg-orange-500 text-white px-4 py-2 rounded">Show Revenue Chart</button>

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
