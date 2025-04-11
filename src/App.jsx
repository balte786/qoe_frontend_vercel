
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import LandingPage from './LandingPage';

function App() {
  const [showApp, setShowApp] = useState(false);
  const [pnlFile, setPnlFile] = useState(null);
  const [balanceSheetFile, setBalanceSheetFile] = useState(null);
  const [summary, setSummary] = useState('');
  const [executive, setExecutive] = useState('');
  const [revenue, setRevenue] = useState('');
  const [workingCapital, setWorkingCapital] = useState('');
  const [chartUrl, setChartUrl] = useState('');

  useEffect(() => {
    if (summary) {
      autoGenerate();
    }
  }, [summary]);

  const handlePnlFileChange = (e) => {
    setPnlFile(e.target.files[0]);
  };

  const handleBalanceSheetFileChange = (e) => {
    setBalanceSheetFile(e.target.files[0]);
  };

  const uploadBothFiles = async () => {
    const formData = new FormData();
    formData.append('file', pnlFile);
    const res = await axios.post('https://qoe-render-ready-3.onrender.com/upload', formData);
    setSummary(JSON.stringify(res.data.data, null, 2));

    if (balanceSheetFile) {
      const bsForm = new FormData();
      bsForm.append('file', balanceSheetFile);
      await axios.post('https://qoe-render-ready-3.onrender.com/upload?type=balance_sheet', bsForm);
    }
  };

  const autoGenerate = async () => {
    const [executiveRes, revenueRes, wcRes] = await Promise.all([
      axios.post('https://qoe-render-ready-3.onrender.com/generate_qoe', {
        financial_summary: summary,
        type: 'executive_summary'
      }),
      axios.post('https://qoe-render-ready-3.onrender.com/generate_qoe', {
        financial_summary: summary,
        type: 'revenue_trends'
      }),
      axios.post('https://qoe-render-ready-3.onrender.com/generate_qoe', {
        financial_summary: summary,
        type: 'working_capital'
      }),
    ]);
    setExecutive(executiveRes.data.qoe_summary);
    setRevenue(revenueRes.data.qoe_summary);
    setWorkingCapital(wcRes.data.qoe_summary);
    handleChart();
  };

  const handleExport = async () => {
    const res = await axios.get('https://qoe-render-ready-3.onrender.com/export_docx', {
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
    const res = await axios.get('https://qoe-render-ready-3.onrender.com/revenue_chart', {
      responseType: 'blob'
    });
    const url = window.URL.createObjectURL(new Blob([res.data]));
    setChartUrl(url);
  };

  if (!showApp) return <LandingPage onContinue={() => setShowApp(true)} />;

  return (
    <div className="p-6 max-w-xl mx-auto">
      <div className="flex items-center space-x-4 mb-4">
        <img src="/logo.png" alt="Acquisight QoE Logo" className="h-10"/>
        <h1 className="text-2xl font-bold">Acquisight QoE</h1>
      </div>

      <div className="mb-6 bg-blue-50 border-l-4 border-blue-500 text-blue-700 p-4 rounded">
        <h2 className="font-bold mb-2">📂 Upload Your Financial Files</h2>
        <p><strong>Step 1:</strong> Upload your <code>Profit & Loss</code> Excel (.xlsx) file.</p>
        <p><strong>Step 2:</strong> Optionally upload your <code>Balance Sheet</code> Excel (.xlsx) file for Working Capital analysis.</p>
        <p className="mt-2 text-sm text-gray-600">Your P&L file should include: <code>Date, Revenue, COGS, SG&A</code><br/>Your Balance Sheet file should include: <code>Accounts Receivable, Inventory, Accounts Payable</code></p>
      </div>

      <input type="file" onChange={handlePnlFileChange} className="mb-4" />
      <input type="file" onChange={handleBalanceSheetFileChange} className="mb-6" />

      <button onClick={uploadBothFiles} className="bg-blue-600 text-white px-4 py-2 rounded mr-2">Upload & Generate Report</button>
      <button onClick={handleExport} className="bg-purple-600 text-white px-4 py-2 rounded">Export Word Report</button>

      <div className="mt-6">
        <h2 className="text-xl font-semibold">📊 Executive Summary</h2>
        <pre className="bg-gray-100 p-4 mt-2 rounded whitespace-pre-wrap max-h-64 overflow-y-scroll">{executive}</pre>

        <h2 className="text-xl font-semibold mt-6">📈 Revenue Trends</h2>
        <pre className="bg-gray-100 p-4 mt-2 rounded whitespace-pre-wrap max-h-64 overflow-y-scroll">{revenue}</pre>

        {chartUrl && (
          <div className="mt-4">
            <img src={chartUrl} alt="Revenue Chart" className="w-full rounded border shadow" />
          </div>
        )}

        <h2 className="text-xl font-semibold mt-6">💼 Working Capital Analysis</h2>
        <pre className="bg-gray-100 p-4 mt-2 rounded whitespace-pre-wrap max-h-64 overflow-y-scroll">{workingCapital}</pre>
      </div>
    </div>
  );
}

export default App;
