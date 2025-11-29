'use client';

import Image from "next/image";
import { useState, useRef } from "react";

export default function Registration() {
  const [formData, setFormData] = useState({
    fullName: "",
    telegram: "",
    year: "",
    skills: "",
    comment: ""
  });
  
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [errorMessage, setErrorMessage] = useState('');

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);

  const handleMouseMove = (e) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setMousePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    try {
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      setStatus('success');
      setFormData({
        fullName: "",
        telegram: "",
        year: "",
        skills: "",
        comment: ""
      });
      
      // Reset success message after 5 seconds
      setTimeout(() => setStatus('idle'), 5000);

    } catch (error) {
      console.error('Submission error:', error);
      setStatus('error');
      setErrorMessage(error.message);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-zinc-950 text-zinc-200 selection:bg-zinc-800">
      {/* Subtle Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      
      <div 
        ref={containerRef}
        onMouseMove={handleMouseMove}
        className="relative z-10 w-full max-w-xl group rounded-2xl border border-zinc-800 bg-zinc-900/50 p-8 md:p-12 shadow-2xl overflow-hidden"
      >
        {/* Spotlight Effect */}
        <div 
          className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 group-hover:opacity-100"
          style={{
            background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255,255,255,0.06), transparent 40%)`
          }}
        />

        {/* Header */}
        <div className="relative z-10 mb-12">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-zinc-800 rounded-xl flex items-center justify-center border border-zinc-700">
              <Image 
                src="/globe.svg" 
                alt="OSCA Logo" 
                width={24} 
                height={24} 
                className="invert opacity-80"
              />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-white tracking-tight">
                OSCA Registration
              </h1>
              <p className="text-zinc-500 text-sm">
                Join the community
              </p>
            </div>
          </div>
        </div>

        {/* Success Message */}
        {status === 'success' && (
          <div className="relative z-10 mb-8 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-400 text-sm flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Registration successful! Welcome to the club.
          </div>
        )}

        {/* Error Message */}
        {status === 'error' && (
          <div className="relative z-10 mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
            {errorMessage || 'Failed to submit. Please try again.'}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="relative z-10 space-y-8">
          
          {/* Full Name */}
          <div className="space-y-2">
            <label htmlFor="fullName" className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
              Full Name
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              required
              disabled={status === 'loading'}
              value={formData.fullName}
              onChange={handleChange}
              className="w-full bg-transparent border-b border-zinc-800 py-3 text-lg text-white placeholder-zinc-700 focus:border-white focus:outline-none transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="Enter your full name"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Telegram */}
            <div className="space-y-2">
              <label htmlFor="telegram" className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
                Telegram / Phone
              </label>
              <input
                type="tel"
                id="telegram"
                name="telegram"
                required
                disabled={status === 'loading'}
                value={formData.telegram}
                onChange={handleChange}
                className="w-full bg-transparent border-b border-zinc-800 py-3 text-lg text-white placeholder-zinc-700 focus:border-white focus:outline-none transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="@username or 055..."
              />
            </div>

            {/* Current Year */}
            <div className="space-y-2">
              <label htmlFor="year" className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
                Current Year
              </label>
              <div className="relative">
                <select
                  id="year"
                  name="year"
                  required
                  disabled={status === 'loading'}
                  value={formData.year}
                  onChange={handleChange}
                  className="w-full bg-transparent border-b border-zinc-800 py-3 text-lg text-white appearance-none focus:border-white focus:outline-none transition-colors duration-300 [&>option]:bg-zinc-900 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="" disabled>Select Year</option>
                  <option value="L1">L1</option>
                  <option value="L2">L2</option>
                  <option value="L3">L3</option>
                  <option value="M1">M1</option>
                  <option value="M2">M2</option>
                </select>
                <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-600">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Skills */}
          <div className="space-y-2">
            <label htmlFor="skills" className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
              Skills & Interests
            </label>
            <input
              type="text"
              id="skills"
              name="skills"
              disabled={status === 'loading'}
              value={formData.skills}
              onChange={handleChange}
              className="w-full bg-transparent border-b border-zinc-800 py-3 text-lg text-white placeholder-zinc-700 focus:border-white focus:outline-none transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="What are you good at?"
            />
          </div>

          {/* Comments */}
          <div className="space-y-2">
            <label htmlFor="comment" className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
              Comments
            </label>
            <textarea
              id="comment"
              name="comment"
              rows="2"
              disabled={status === 'loading'}
              value={formData.comment}
              onChange={handleChange}
              className="w-full bg-transparent border-b border-zinc-800 py-3 text-lg text-white placeholder-zinc-700 focus:border-white focus:outline-none transition-colors duration-300 resize-none disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="Anything else?"
            ></textarea>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={status === 'loading'}
              className="group relative w-full overflow-hidden rounded-lg bg-white px-8 py-4 text-zinc-950 transition-all hover:bg-zinc-200 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <span className="relative z-10 font-semibold flex items-center justify-center gap-2">
                {status === 'loading' ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-zinc-950" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting...
                  </>
                ) : (
                  'Submit Application'
                )}
              </span>
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-0 bg-zinc-300 transition-transform duration-300 ease-out" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
