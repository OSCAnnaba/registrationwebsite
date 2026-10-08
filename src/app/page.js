"use client";

import Image from "next/image";
import { useState, useRef, useEffect } from "react";

const initialFormData = {
  fullName: "",
  email: "",
  studentId: "",
  telegram: "",
  clubExperience: "",
  year: "",
  skills: "",
  additionalSkills: "",
  interests: "",
  motivation: "",
  comment: "",
};

// Club photos drifting in the background (evenly spread over a grid)
const galleryPhotos = [
  { src: "/gallery/1.jpg", size: "w-40 md:w-52", cell: "items-start justify-center", rot: "-6deg", duration: "15s", delay: "0s" },
  { src: "/gallery/2.jpg", size: "w-36 md:w-48", cell: "items-center justify-end", rot: "5deg", duration: "17s", delay: "1.5s" },
  { src: "/gallery/3.jpg", size: "w-40 md:w-52", cell: "items-end justify-center", rot: "4deg", duration: "16s", delay: "0.8s" },
  { src: "/gallery/4.jpg", size: "w-36 md:w-48", cell: "items-center justify-start", rot: "-5deg", duration: "18s", delay: "2.2s" },
  { src: "/gallery/5.jpg", size: "w-32 md:w-44", cell: "items-center justify-center", rot: "8deg", duration: "14s", delay: "1s" },
  { src: "/gallery/6.jpg", size: "w-36 md:w-48", cell: "items-start justify-end", rot: "-8deg", duration: "19s", delay: "0.4s" },
  { src: "/gallery/7.jpg", size: "w-32 md:w-44", cell: "items-end justify-start", rot: "-3deg", duration: "15s", delay: "2.8s" },
  { src: "/gallery/8.jpg", size: "w-32 md:w-44", cell: "items-center justify-center", rot: "6deg", duration: "17s", delay: "1.2s" },
  { src: "/gallery/9.jpg", size: "w-36 md:w-48", cell: "items-start justify-center", rot: "7deg", duration: "16s", delay: "0.6s" },
  { src: "/gallery/10.png", size: "w-32 md:w-44", cell: "items-end justify-end", rot: "-6deg", duration: "18s", delay: "1.8s" },
  { src: "/gallery/11.jpg", size: "w-36 md:w-48", cell: "items-center justify-start", rot: "-8deg", duration: "15s", delay: "2.4s" },
  { src: "/gallery/12.png", size: "w-32 md:w-44", cell: "items-start justify-end", rot: "7deg", duration: "17s", delay: "0.2s" },
];

// One drifting photo card used by the background layers
function FloatingPhoto({ photo, wrapperClass = "", sizeClass }) {
  return (
    <div
      className={`flex animate-float-photo ${wrapperClass}`}
      style={{
        "--rot": photo.rot,
        animationDuration: photo.duration,
        animationDelay: photo.delay,
      }}
    >
      <div
        className={`relative overflow-hidden rounded-2xl border border-slate-300/50 opacity-25 shadow-[0_0_30px_-12px_rgba(59,130,246,0.3)] blur-[1.5px] dark:border-blue-400/20 ${sizeClass}`}
      >
        <Image
          src={photo.src}
          alt=""
          width={400}
          height={300}
          className="h-auto w-full"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-white/70 via-transparent to-indigo-100/70 dark:from-blue-950/70 dark:via-transparent dark:to-[#03045e]/60" />
      </div>
    </div>
  );
}

export default function Registration() {
  const [formData, setFormData] = useState(initialFormData);

  const [status, setStatus] = useState("idle"); // idle, loading, success, error
  const [errorMessage, setErrorMessage] = useState("");

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);

  // Theme: dark by default, persisted in localStorage
  const [dark, setDark] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("osca-theme");
    if (stored) setDark(stored === "dark");
  }, []);

  const toggleTheme = () => {
    setDark((prev) => {
      localStorage.setItem("osca-theme", prev ? "light" : "dark");
      return !prev;
    });
  };

  // About-us popup
  const [aboutOpen, setAboutOpen] = useState(false);

  useEffect(() => {
    if (!aboutOpen) return;
    const onKey = (e) => {
      if (e.key === "Escape") setAboutOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [aboutOpen]);

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
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    try {
      const response = await fetch("/api/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      setStatus("success");
      setFormData(initialFormData);

      // Reset success message after 5 seconds
      setTimeout(() => setStatus("idle"), 5000);
    } catch (error) {
      console.error("Submission error:", error);
      setStatus("error");
      setErrorMessage(error.message);
    }
  };

  const inputClass =
    "w-full rounded-lg border border-slate-300 bg-white/70 px-4 py-3 text-slate-800 placeholder-slate-400 transition-all duration-300 focus:border-sky-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/25 disabled:cursor-not-allowed disabled:opacity-50 dark:border-blue-900/60 dark:bg-blue-950/30 dark:text-white dark:placeholder-blue-300/30 dark:focus:border-blue-400 dark:focus:bg-blue-950/50 dark:focus:ring-blue-500/30";

  const labelClass =
    "text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-blue-300/80";

  return (
    <div
      className={`relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-sky-50 via-white to-indigo-100 text-slate-800 selection:bg-sky-200/60 dark:from-blue-950 dark:via-[#0a1128] dark:to-[#03045e] dark:text-blue-100 dark:selection:bg-blue-500/30 ${
        dark ? "dark" : ""
      }`}
    >
      {/* Floating club photos */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Below lg: loose grid behind the scrollable form */}
        <div className="grid h-full grid-cols-2 grid-rows-6 gap-3 p-3 lg:hidden">
          {galleryPhotos.map((photo) => (
            <FloatingPhoto
              key={photo.src}
              photo={photo}
              wrapperClass={photo.cell}
              sizeClass={photo.size}
            />
          ))}
        </div>

        {/* lg+: two side rails so photos never sit behind the form */}
        <div className="absolute inset-y-0 left-0 hidden w-[17%] flex-col justify-around py-6 lg:flex">
          {galleryPhotos.slice(0, 6).map((photo, i) => (
            <FloatingPhoto
              key={photo.src}
              photo={photo}
              wrapperClass={i % 2 === 0 ? "self-start" : "self-end"}
              sizeClass="w-[14vw] max-w-[13rem]"
            />
          ))}
        </div>
        <div className="absolute inset-y-0 right-0 hidden w-[17%] flex-col justify-around py-6 lg:flex">
          {galleryPhotos.slice(6).map((photo, i) => (
            <FloatingPhoto
              key={photo.src}
              photo={photo}
              wrapperClass={i % 2 === 0 ? "self-end" : "self-start"}
              sizeClass="w-[14vw] max-w-[13rem]"
            />
          ))}
        </div>
      </div>

      {/* Animated gradient blobs */}
      <div className="pointer-events-none absolute -top-32 -left-32 h-96 w-96 rounded-full bg-blue-400/20 blur-3xl animate-blob dark:bg-blue-600/30" />
      <div className="pointer-events-none absolute top-1/3 -right-32 h-96 w-96 rounded-full bg-sky-400/15 blur-3xl animate-blob animation-delay-2000 dark:bg-sky-500/20" />
      <div className="pointer-events-none absolute -bottom-32 left-1/3 h-96 w-96 rounded-full bg-indigo-400/15 blur-3xl animate-blob animation-delay-4000 dark:bg-indigo-600/25" />

      {/* Subtle grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#3b82f60a_1px,transparent_1px),linear-gradient(to_bottom,#3b82f60a_1px,transparent_1px)] bg-size-[32px_32px]" />

      <div className="relative z-10 flex min-h-screen items-center justify-center p-4 py-12">
        <div
          ref={containerRef}
          onMouseMove={handleMouseMove}
          className="group relative w-full max-w-2xl rounded-3xl border border-slate-200/80 bg-white/70 p-8 shadow-[0_0_55px_-25px_rgba(56,189,248,0.25)] backdrop-blur-xl md:p-12 dark:border-blue-800/40 dark:bg-blue-950/40 dark:shadow-[0_0_55px_-25px_rgba(59,130,246,0.22)]"
        >
          {/* About us trigger */}
          <button
            type="button"
            onClick={() => setAboutOpen(true)}
            className="absolute left-5 top-5 z-20 flex h-10 items-center gap-1.5 rounded-full border border-slate-300/70 bg-white/80 px-3.5 text-xs font-semibold text-slate-500 shadow-sm backdrop-blur transition-all duration-300 hover:scale-105 hover:text-sky-600 dark:border-blue-700/50 dark:bg-blue-950/60 dark:text-blue-300 dark:hover:text-sky-300"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.8}
              stroke="currentColor"
              className="h-4 w-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.852l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
              />
            </svg>
            About us
          </button>

          {/* Theme toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
            className="absolute right-5 top-5 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-slate-300/70 bg-white/80 text-slate-500 shadow-sm backdrop-blur transition-all duration-300 hover:scale-110 hover:text-amber-500 dark:border-blue-700/50 dark:bg-blue-950/60 dark:text-blue-300 dark:hover:text-sky-300"
          >
            {dark ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.8}
                stroke="currentColor"
                className="h-5 w-5"
              >
                <circle cx="12" cy="12" r="4" />
                <path
                  strokeLinecap="round"
                  d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41m11.32-11.32l1.41-1.41"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.8}
                stroke="currentColor"
                className="h-5 w-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"
                />
              </svg>
            )}
          </button>
          {/* Spotlight effect */}
          <div
            className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 transition duration-300 group-hover:opacity-100"
            style={{
              background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(59,130,246,0.10), transparent 40%)`,
            }}
          />

          {/* Header */}
          <div className="relative z-10 mb-10 text-center">
            <div className="mb-6 flex justify-center">
              <Image
                src={dark ? "/logo-white.png" : "/logo.png"}
                alt="OSCA Logo"
                width={80}
                height={80}
                className="h-20 w-20 object-contain drop-shadow-[0_0_20px_rgba(59,130,246,0.45)]"
              />
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-blue-600 dark:text-blue-300">
              OSCA Registration
            </h1>
            <p className="mt-2 text-slate-500 dark:text-blue-300/70">
              Join the community — we can&apos;t wait to have you aboard
            </p>
            <div className="mx-auto mt-4 h-1 w-24 rounded-full bg-gradient-to-r from-blue-500 to-sky-400" />
          </div>

          {/* Success Message */}
          {status === "success" && (
            <div className="relative z-10 mb-8 flex items-center gap-2 rounded-lg border border-emerald-300 bg-emerald-50 p-4 text-sm text-emerald-600 animate-in fade-in slide-in-from-top-2 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="h-5 w-5 shrink-0"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              🎉 Registration successful! Welcome to the club.
            </div>
          )}

          {/* Error Message */}
          {status === "error" && (
            <div className="relative z-10 mb-8 flex items-center gap-2 rounded-lg border border-red-300 bg-red-50 p-4 text-sm text-red-600 animate-in fade-in slide-in-from-top-2 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="h-5 w-5 shrink-0"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
                />
              </svg>
              {errorMessage || "Failed to submit. Please try again."}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="relative z-10 space-y-6">
            {/* Section: About you */}
            <div>
              <h2 className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-sky-600 dark:text-sky-400">
                <span className="h-4 w-1 rounded bg-sky-600 dark:bg-sky-400" />
                About You
              </h2>
              <div className="space-y-5">
                {/* Full Name */}
                <div className="space-y-2">
                  <label htmlFor="fullName" className={labelClass}>
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    required
                    disabled={status === "loading"}
                    value={formData.fullName}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder="Enter your full name"
                  />
                </div>

                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  {/* Email */}
                  <div className="space-y-2">
                    <label htmlFor="email" className={labelClass}>
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      disabled={status === "loading"}
                      value={formData.email}
                      onChange={handleChange}
                      className={inputClass}
                      placeholder="you@example.com"
                    />
                  </div>

                  {/* Student ID */}
                  <div className="space-y-2">
                    <label htmlFor="studentId" className={labelClass}>
                      Student ID
                    </label>
                    <input
                      type="text"
                      id="studentId"
                      name="studentId"
                      required
                      disabled={status === "loading"}
                      value={formData.studentId}
                      onChange={handleChange}
                      className={inputClass}
                      placeholder="e.g. 20241234"
                    />
                  </div>
                </div>

                {/* Telegram / Phone */}
                <div className="space-y-2">
                  <label htmlFor="telegram" className={labelClass}>
                    Telegram / Phone
                  </label>
                  <input
                    type="tel"
                    id="telegram"
                    name="telegram"
                    required
                    disabled={status === "loading"}
                    value={formData.telegram}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder="@username or 055..."
                  />
                </div>
              </div>
            </div>

            {/* Section: Studies */}
            <div>
              <h2 className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-sky-600 dark:text-sky-400">
                <span className="h-4 w-1 rounded bg-sky-600 dark:bg-sky-400" />
                Your Studies
              </h2>
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                {/* Club Experience */}
                <div className="space-y-2 md:col-span-2">
                  <label className={labelClass}>
                    Do you have additional skills in similar clubs or
                    organisations?
                  </label>
                  <div className="flex gap-3">
                    {[
                      { value: "Yes", id: "clubExperienceYes" },
                      { value: "No", id: "clubExperienceNo" },
                    ].map((option) => (
                      <label
                        key={option.value}
                        htmlFor={option.id}
                        className={`flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg border px-4 py-3 text-sm font-medium transition-all duration-300 ${
                          formData.clubExperience === option.value
                            ? "border-blue-500 bg-blue-500/10 text-slate-900 ring-2 ring-blue-500/20 dark:border-blue-400 dark:bg-blue-500/20 dark:text-white dark:ring-blue-500/30"
                            : "border-slate-300 bg-white/60 text-slate-600 hover:border-blue-400 dark:border-blue-900/60 dark:bg-blue-950/30 dark:text-blue-300/70 dark:hover:border-blue-500/60"
                        }`}
                      >
                        <input
                          type="radio"
                          id={option.id}
                          name="clubExperience"
                          value={option.value}
                          required
                          disabled={status === "loading"}
                          checked={formData.clubExperience === option.value}
                          onChange={handleChange}
                          className="h-4 w-4 accent-blue-500"
                        />
                        {option.value}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Current Year */}
                <div className="space-y-2">
                  <label htmlFor="year" className={labelClass}>
                    Current Year
                  </label>
                  <div className="relative">
                    <select
                      id="year"
                      name="year"
                      required
                      disabled={status === "loading"}
                      value={formData.year}
                      onChange={handleChange}
                      className={`${inputClass} appearance-none pr-10`}
                    >
                      <option value="" disabled className="bg-white dark:bg-blue-950">
                        Select Year
                      </option>
                      <option value="L1" className="bg-white dark:bg-blue-950">
                        L1
                      </option>
                      <option value="L2" className="bg-white dark:bg-blue-950">
                        L2
                      </option>
                      <option value="L3" className="bg-white dark:bg-blue-950">
                        L3
                      </option>
                      <option value="M1" className="bg-white dark:bg-blue-950">
                        M1
                      </option>
                      <option value="M2" className="bg-white dark:bg-blue-950">
                        M2
                      </option>
                    </select>
                    <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-blue-400">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        className="h-4 w-4"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Section: Skills & Interests */}
            <div>
              <h2 className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-sky-600 dark:text-sky-400">
                <span className="h-4 w-1 rounded bg-sky-600 dark:bg-sky-400" />
                Skills &amp; Interests
              </h2>
              <div className="space-y-5">
                {/* Primary Skills */}
                <div className="space-y-2">
                  <label htmlFor="skills" className={labelClass}>
                     Skills
                  </label>
                  <input
                    type="text"
                    id="skills"
                    name="skills"
                    disabled={status === "loading"}
                    value={formData.skills}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder="What are you good at? e.g. Python, design, public speaking"
                  />
                </div>

                {/* Additional Skills */}
                <div className="space-y-2">
                  <label htmlFor="additionalSkills" className={labelClass}>
                    Additional Skills{" "}
                    <span className="normal-case text-slate-400 dark:text-blue-400/60">
                      (optional)
                    </span>
                  </label>
                  <input
                    type="text"
                    id="additionalSkills"
                    name="additionalSkills"
                    disabled={status === "loading"}
                    value={formData.additionalSkills}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder="Anything else you've got up your sleeve? e.g. video editing, event planning, a second language"
                  />
                </div>

                {/* Primary Interests / Hobbies */}
                <div className="space-y-2">
                  <label htmlFor="interests" className={labelClass}>
                    What are your primary interests or hobbies relevant to this
                    club?
                  </label>
                  <input
                    type="text"
                    id="interests"
                    name="interests"
                    disabled={status === "loading"}
                    value={formData.interests}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder="e.g. coding projects, design, public speaking"
                  />
                </div>

                {/* Motivation */}
                <div className="space-y-2">
                  <label htmlFor="motivation" className={labelClass}>
                    Why do you want to join?
                  </label>
                  <textarea
                    id="motivation"
                    name="motivation"
                    rows="2"
                    required
                    disabled={status === "loading"}
                    value={formData.motivation}
                    onChange={handleChange}
                    className={`${inputClass} resize-none`}
                    placeholder="Tell us what excites you about OSCA!"
                  ></textarea>
                </div>
              </div>
            </div>

            {/* Comments */}
            <div className="space-y-2">
              <label htmlFor="comment" className={labelClass}>
                Anything else to add?{" "}
                <span className="normal-case text-slate-400 dark:text-blue-400/60">(optional)</span>
              </label>
              <textarea
                id="comment"
                name="comment"
                rows="2"
                disabled={status === "loading"}
                value={formData.comment}
                onChange={handleChange}
                className={`${inputClass} resize-none`}
                placeholder="Questions, notes, anything in mind"
              ></textarea>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={status === "loading"}
                className="group relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 via-blue-500 to-sky-500 px-8 py-4 font-semibold text-white shadow-lg shadow-blue-500/40 transition-all duration-300 hover:scale-[1.01] hover:shadow-xl hover:shadow-blue-500/50 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {status === "loading" ? (
                    <>
                      <svg
                        className="h-5 w-5 animate-spin text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Submitting...
                    </>
                  ) : (
                    <>
                      Submit Application
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2.5}
                        stroke="currentColor"
                        className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                        />
                      </svg>
                    </>
                  )}
                </span>
                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-sky-400 to-blue-400 transition-transform duration-300 ease-out group-hover:translate-x-0" />
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* About us popup */}
      {aboutOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label="About OSCA"
        >
          <div
            className="absolute inset-0 bg-slate-900/30 backdrop-blur-sm dark:bg-blue-950/60"
            onClick={() => setAboutOpen(false)}
          />
          <div className="relative w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl md:p-8 dark:border-blue-800/50 dark:bg-[#0a1128]">
            <button
              type="button"
              onClick={() => setAboutOpen(false)}
              aria-label="Close"
              className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:text-blue-400 dark:hover:bg-blue-900/50 dark:hover:text-blue-200"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="h-4 w-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <h2 className="text-lg font-bold text-blue-600 dark:text-blue-300">
              About OSCA
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-blue-100/70">
              OSCA is a student-led community in Annaba that learns by building
              in the open. Whether you&apos;re writing your first line of code
              or your thousandth, you&apos;re welcome here.
            </p>

            <h3 className="mt-5 text-xs font-bold uppercase tracking-widest text-sky-600 dark:text-sky-400">
              What we do
            </h3>
            <ul className="mt-2.5 space-y-2 text-sm text-slate-600 dark:text-blue-100/70">
              {[
                "Workshops across different fields",
                "Hackathons and coding sessions",
                "Talks and mentoring from experienced developers",
                "Help for beginners at every level",
              ].map((item) => (
                <li key={item}>
                  - {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
