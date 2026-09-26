import React from 'react';

export default function GenericPage({ title }: { title: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <h1 className="text-2xl font-bold text-slate-800 mb-2">{title}</h1>
      <p className="text-slate-500">This module is part of the mock implementation for the demonstration.</p>
    </div>
  );
}
