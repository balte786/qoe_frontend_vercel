
import React, { useState } from "react";

export default function AdbacksUploader() {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFileName(selectedFile.name);
    }
  };

  const handleUpload = () => {
    alert("Adbacks file uploaded: " + fileName);
  };

  const handleDownloadSample = () => {
    const csvContent = `Date,Description,Amount,Justification\n2024-01-15,Legal settlement,15000,One-time legal expense\n2024-03-10,Office relocation costs,10000,Non-recurring moving expense\n2024-05-20,Redundancy payouts,20000,One-time severance payments`;
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "sample_adbacks.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="border p-4 rounded shadow">
      <h2 className="text-lg font-bold mb-2">Adbacks Upload</h2>
      <p className="text-sm text-gray-600 mb-2">
        Upload your adbacks as a .csv or .xlsx file with columns:
        Date, Description, Amount, Justification.
      </p>
      <input type="file" accept=".csv, .xlsx" onChange={handleFileChange} />
      {fileName && <p className="mt-2 text-green-600">Selected: {fileName}</p>}
      <div className="mt-4 flex gap-2">
        <button onClick={handleUpload} disabled={!file} className="bg-blue-600 text-white px-4 py-2 rounded">
          Upload
        </button>
        <button onClick={handleDownloadSample} className="bg-gray-300 px-4 py-2 rounded">
          Download Sample CSV
        </button>
      </div>
    </div>
  );
}
