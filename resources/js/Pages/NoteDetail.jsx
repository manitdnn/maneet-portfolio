import React from 'react';
import { Head, Link } from '@inertiajs/react';

export default function NoteDetail({ note }) {
  // Extract YouTube Embed URL if video link exists
  const getEmbedUrl = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11
      ? `https://www.youtube.com/embed/${match[2]}`
      : null;
  };

  const embedUrl = getEmbedUrl(note.video_url);

  return (
    <>
      <Head title={`${note.title} | Knowledge Hub`} />

      <div className="min-h-screen bg-slate-50 text-slate-800 font-sans relative">
        {/* Header / Navigation */}
        <nav className="max-w-4xl mx-auto px-6 py-6 flex justify-between items-center border-b border-slate-200/80">
          <Link
            href="/"
            className="text-xs font-semibold px-4 py-2 rounded-lg bg-white border border-slate-200 text-slate-700 hover:text-cyan-600 hover:border-cyan-300 shadow-sm transition-all flex items-center gap-1.5"
          >
            ← Back to Overview
          </Link>
          <span className="font-mono text-xs font-bold tracking-wider text-slate-500 uppercase">
            {note.category || 'Technical Note'}
          </span>
        </nav>

        {/* Note Content Section */}
        <main className="max-w-4xl mx-auto px-6 py-12 space-y-8">
          <div className="space-y-3">
            {note.category && (
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-700 bg-cyan-50 px-2.5 py-1 rounded-md border border-cyan-200 inline-block">
                {note.category}
              </span>
            )}
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              {note.title}
            </h1>
          </div>

          {/* Embedded YouTube Video Player */}
          {embedUrl && (
            <div className="aspect-video w-full rounded-2xl overflow-hidden border border-slate-200/80 shadow-md bg-slate-900">
              <iframe
                src={embedUrl}
                title={note.title}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          )}

          {/* Note Code Snippet & Content */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider font-mono">
              Note Content & Code Snippet
            </h2>
            <pre className="bg-slate-900 text-slate-100 p-5 rounded-xl font-mono text-xs overflow-x-auto border border-slate-800 whitespace-pre-wrap leading-relaxed">
              {note.content}
            </pre>
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-slate-200 py-6 text-center text-xs text-slate-500 bg-white/80">
          <p>© {new Date().getFullYear()} Maneet. Built with Laravel & React.</p>
        </footer>
      </div>
    </>
  );
}