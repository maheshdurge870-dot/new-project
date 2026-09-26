import React from 'react';
import { Award, Search } from 'lucide-react';

export default function CertificatesPage() {
  const certificates = [
    { id: 'CERT-001', student: 'Alice Johnson', event: 'Web Dev Bootcamp', date: '2026-10-21', type: 'Completion' },
    { id: 'CERT-002', student: 'Alice Johnson', event: 'Hackathon 2026', date: '2026-11-10', type: 'Participation' }
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-slate-900">Certificates</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {certificates.map((cert) => (
          <div key={cert.id} className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-md transition">
            <div className="flex items-center justify-center w-12 h-12 bg-amber-100 rounded-full mb-4">
              <Award className="h-6 w-6 text-amber-600" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">{cert.event}</h3>
            <p className="text-sm text-slate-500 mb-4">Issued: {cert.date}</p>
            <div className="bg-slate-50 p-3 rounded-lg text-sm border border-slate-100 mb-4">
              <div className="text-slate-500 text-xs uppercase font-semibold mb-1">Type</div>
              <div className="font-medium">{cert.type} Certificate</div>
            </div>
            <button className="w-full text-center text-blue-600 font-medium py-2 border border-blue-200 rounded-lg hover:bg-blue-50 transition">
              Download PDF
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
