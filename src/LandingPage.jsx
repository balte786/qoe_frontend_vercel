
import React from 'react';

function LandingPage({ onContinue }) {
  return (
    <div className="p-8 max-w-2xl mx-auto text-center">
      <h1 className="text-4xl font-bold mb-4">Welcome to Acquisight QoE</h1>
      <p className="text-lg text-gray-700 mb-6">
        Upload your financial data and generate AI-powered Quality of Earnings (QoE) reports with Acquisight
        in seconds. This tool helps investment professionals automate financial diligence.
      </p>
      <button
        onClick={onContinue}
        className="bg-blue-600 text-white px-6 py-3 rounded-lg text-lg hover:bg-blue-700"
      >
        Get Started
      </button>
    </div>
  );
}

export default LandingPage;
