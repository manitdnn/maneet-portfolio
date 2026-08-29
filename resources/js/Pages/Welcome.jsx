import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';

export default function Welcome({ projects = [], notes = [], totalViews = 0 }) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Categories extraction
  const categories = ['All', ...new Set(notes.map((n) => n.category).filter(Boolean))];

  // Live Filter Logic (Category + Live Search Keyword)
  const filteredNotes = notes.filter((n) => {
    const matchesCategory = selectedCategory === 'All' || n.category === selectedCategory;
    const matchesSearch =
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <>
      <Head title="Maneet | Portfolio & Knowledge Hub" />

      <div className="min-h-screen bg-slate-50 text-slate-800 font-sans relative">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-cyan-100/50 via-slate-100/30 to-transparent blur-3xl -z-10 pointer-events-none" />

        {/* Header / Navigation */}
        <header className="max-w-6xl mx-auto px-6 py-8 flex justify-between items-center border-b border-slate-200/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold font-mono text-lg shadow-md shadow-cyan-500/20">
              M
            </div>
            <div>
              <h1 className="text-base font-bold text-slate-900 leading-none">Maneet</h1>
              <p className="text-xs text-slate-500 font-mono mt-0.5">Full Stack Developer</p>
            </div>
          </div>

          <Link
            href="/dashboard"
            className="text-xs font-semibold px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-cyan-600 hover:border-cyan-300 shadow-xs transition-all"
          >
            Dashboard →
          </Link>
        </header>

        <main className="max-w-6xl mx-auto px-6 py-12 space-y-16">
          {/* Hero Section */}
          <section className="space-y-4 max-w-2xl">
            <span className="text-[11px] font-mono font-bold tracking-wider uppercase text-cyan-700 bg-cyan-50 border border-cyan-200/80 px-3 py-1 rounded-full">
              Personal Portfolio & Learning Hub
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Building Web & Mobile Apps with Modern Tech.
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed font-normal">
              Exploring React, React Native, Laravel, and Firebase. Here is my collection of featured projects, code snippets, and technical notes.
            </p>
          </section>

          {/* Featured Projects Section */}
          <section className="space-y-6">
            <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-slate-500">
              // Featured Projects
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {projects.length > 0 ? (
                projects.map((project) => (
                  <div
                    key={project.id}
                    className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs hover:shadow-md hover:border-cyan-200 transition-all flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <h4 className="text-lg font-bold text-slate-900">{project.title}</h4>
                      <p className="text-xs text-slate-600 leading-relaxed">{project.description}</p>
                    </div>
                    {project.tags && (
                      <div className="flex flex-wrap gap-1.5 mt-4">
                        {(Array.isArray(project.tags) ? project.tags : [project.tags]).map((tag, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] font-mono bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md border border-slate-200"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400 font-mono">No projects added yet.</p>
              )}
            </div>
          </section>

          {/* Technical Notes & Knowledge Hub */}
          <section className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-slate-500">
                // Technical Notes & Guides
              </h3>

              {/* Live Search Input */}
              <div className="relative max-w-xs w-full">
                <input
                  type="text"
                  placeholder="Search notes or code..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 shadow-xs font-mono transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-2 text-xs text-slate-400 hover:text-slate-600"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            {/* Category Filter Pills */}
            {categories.length > 1 && (
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`text-xs px-3 py-1.5 rounded-xl font-mono font-semibold transition-all ${
                      selectedCategory === cat
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}

            {/* Notes Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredNotes.length > 0 ? (
                filteredNotes.map((note) => (
                  <div
                    key={note.id}
                    className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs hover:shadow-md hover:border-cyan-200 transition-all flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono font-bold uppercase text-cyan-700 bg-cyan-50 px-2.5 py-0.5 rounded-md border border-cyan-200">
                          {note.category || 'Note'}
                        </span>
                      </div>
                      <h4 className="text-base font-bold text-slate-900">{note.title}</h4>
                      <p className="text-xs text-slate-600 line-clamp-3 font-mono bg-slate-50 p-3 rounded-xl border border-slate-100">
                        {note.content}
                      </p>
                    </div>

                    <Link
                      href={`/notes/${note.slug}`}
                      className="inline-flex items-center gap-1 text-xs font-bold text-cyan-600 hover:text-cyan-700 transition-colors pt-2"
                    >
                      Read Note & Watch Video →
                    </Link>
                  </div>
                ))
              ) : (
                <div className="col-span-full py-8 text-center bg-white border border-slate-200 rounded-2xl">
                  <p className="text-xs text-slate-400 font-mono">No notes found matching your search.</p>
                </div>
              )}
            </div>
          </section>
        </main>

        {/* Footer with Total Views Counter */}
        <footer className="border-t border-slate-200/80 py-8 bg-white/80 mt-20">
          <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500">
            <p>© {new Date().getFullYear()} Maneet. Built with Laravel & React.</p>
            <div className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-full font-mono font-semibold text-slate-700 border border-slate-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Total Views: {totalViews}
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}