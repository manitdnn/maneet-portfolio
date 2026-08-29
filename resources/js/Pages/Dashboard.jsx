import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';

export default function Dashboard({ auth, notes = [], projects = [] }) {
  const [activeTab, setActiveTab] = useState('notes');
  const [editingItem, setEditingItem] = useState(null);

  // Form hook for Notes
  const {
    data: noteData,
    setData: setNoteData,
    post: postNote,
    put: putNote,
    reset: resetNote,
    clearErrors: clearNoteErrors,
    processing: noteProcessing,
    errors: noteErrors,
  } = useForm({
    title: '',
    category: '',
    video_url: '',
    content: '',
  });

  // Form hook for Projects
  const {
    data: projectData,
    setData: setProjectData,
    post: postProject,
    put: putProject,
    reset: resetProject,
    clearErrors: clearProjectErrors,
    processing: projectProcessing,
    errors: projectErrors,
  } = useForm({
    title: '',
    description: '',
    tags: '',
  });

  // Handle switching tabs and resetting forms
  const handleTabSwitch = (tab) => {
    setActiveTab(tab);
    handleCancelEdit();
  };

  // Populate form for Editing
  const handleEditNote = (note) => {
    setEditingItem({ type: 'note', id: note.id });
    clearNoteErrors();
    setNoteData({
      title: note.title || '',
      category: note.category || '',
      video_url: note.video_url || '',
      content: note.content || '',
    });
  };

  const handleEditProject = (project) => {
    setEditingItem({ type: 'project', id: project.id });
    clearProjectErrors();
    setProjectData({
      title: project.title || '',
      description: project.description || '',
      tags: Array.isArray(project.tags) ? project.tags.join(', ') : project.tags || '',
    });
  };

  const handleCancelEdit = () => {
    setEditingItem(null);
    resetNote();
    clearNoteErrors();
    resetProject();
    clearProjectErrors();
  };

  // Form Submissions
  const handleNoteSubmit = (e) => {
    e.preventDefault();
    if (editingItem && editingItem.type === 'note') {
      putNote(`/admin/notes/${editingItem.id}`, {
        onSuccess: () => handleCancelEdit(),
      });
    } else {
      postNote('/admin/notes', {
        onSuccess: () => resetNote(),
      });
    }
  };

  const handleProjectSubmit = (e) => {
    e.preventDefault();
    if (editingItem && editingItem.type === 'project') {
      putProject(`/admin/projects/${editingItem.id}`, {
        onSuccess: () => handleCancelEdit(),
      });
    } else {
      postProject('/admin/projects', {
        onSuccess: () => resetProject(),
      });
    }
  };

  // Deletions
  const handleDeleteNote = (id) => {
    if (confirm('Are you sure you want to delete this note?')) {
      router.delete(`/admin/notes/${id}`, {
        onSuccess: () => {
          if (editingItem?.id === id) handleCancelEdit();
        },
      });
    }
  };

  const handleDeleteProject = (id) => {
    if (confirm('Are you sure you want to delete this project?')) {
      router.delete(`/admin/projects/${id}`, {
        onSuccess: () => {
          if (editingItem?.id === id) handleCancelEdit();
        },
      });
    }
  };

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-2">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Admin Dashboard <span className="text-cyan-600 font-bold">— Portfolio Hub</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 font-semibold">
              Manage your portfolio showcase projects and video technical notes.
            </p>
          </div>

          {/* Navigation Tabs */}
          <div className="inline-flex p-1 bg-slate-900 border border-slate-800 rounded-xl shadow-lg">
            <button
              type="button"
              onClick={() => handleTabSwitch('notes')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'notes'
                  ? 'bg-cyan-600 text-white shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              Notes & Videos ({notes.length})
            </button>
            <button
              type="button"
              onClick={() => handleTabSwitch('projects')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'projects'
                  ? 'bg-cyan-600 text-white shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              Projects ({projects.length})
            </button>
          </div>
        </div>
      }
    >
      <Head title="Admin Dashboard" />

      {/* Main Container */}
      <div className="min-h-screen bg-[#070b19] text-slate-100 p-6 sm:p-10">
        <div className="max-w-6xl mx-auto space-y-8">

          {/* ================= TAB 1: NOTES & VIDEOS ================= */}
          {activeTab === 'notes' && (
            <>
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-md">
                <div className="flex justify-between items-center mb-6 border-b border-slate-800 pb-4">
                  <h2 className="text-2xl font-bold text-cyan-400">
                    {editingItem?.type === 'note' ? 'Edit Note' : 'Add New Note / Video'}
                  </h2>
                  {editingItem?.type === 'note' && (
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold px-3 py-1.5 rounded-lg border border-slate-700 transition-all"
                    >
                      Cancel Edit
                    </button>
                  )}
                </div>

                <form onSubmit={handleNoteSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-200 mb-2">Title</label>
                    <input
                      type="text"
                      value={noteData.title}
                      onChange={(e) => setNoteData('title', e.target.value)}
                      placeholder="e.g. React Custom Hooks Guide"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-slate-100 placeholder-slate-500 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 font-medium"
                      required
                    />
                    {noteErrors.title && <p className="text-rose-400 text-xs mt-1">{noteErrors.title}</p>}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-slate-200 mb-2">Category</label>
                      <input
                        type="text"
                        value={noteData.category}
                        onChange={(e) => setNoteData('category', e.target.value)}
                        placeholder="React, C Language, Laravel..."
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-slate-100 placeholder-slate-500 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 font-medium"
                      />
                      {noteErrors.category && <p className="text-rose-400 text-xs mt-1">{noteErrors.category}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-slate-200 mb-2">YouTube URL (Optional)</label>
                      <input
                        type="url"
                        value={noteData.video_url}
                        onChange={(e) => setNoteData('video_url', e.target.value)}
                        placeholder="https://www.youtube.com/watch?v=..."
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-slate-100 placeholder-slate-500 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 font-medium"
                      />
                      {noteErrors.video_url && <p className="text-rose-400 text-xs mt-1">{noteErrors.video_url}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-200 mb-2">Content / Code Snippet</label>
                    <textarea
                      rows="6"
                      value={noteData.content}
                      onChange={(e) => setNoteData('content', e.target.value)}
                      placeholder="Write your guide or paste markdown/code..."
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl p-4 text-slate-100 placeholder-slate-500 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 font-mono text-xs"
                      required
                    />
                    {noteErrors.content && <p className="text-rose-400 text-xs mt-1">{noteErrors.content}</p>}
                  </div>

                  <button
                    type="submit"
                    disabled={noteProcessing}
                    className="px-6 py-3 rounded-xl bg-cyan-600 text-white font-bold text-sm hover:bg-cyan-500 shadow-lg shadow-cyan-600/30 transition-all disabled:opacity-50"
                  >
                    {noteProcessing ? 'Saving...' : editingItem?.type === 'note' ? 'Update Note' : 'Publish Note'}
                  </button>
                </form>
              </div>

              {/* Existing Notes List */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-md">
                <h3 className="text-lg font-bold mb-4 text-slate-200">Manage Notes ({notes.length})</h3>
                <div className="divide-y divide-slate-800">
                  {notes.length === 0 ? (
                    <p className="text-slate-500 text-sm py-4">No notes created yet.</p>
                  ) : (
                    notes.map((note) => (
                      <div key={note.id} className="py-4 flex items-center justify-between gap-4">
                        <div className="min-w-0 flex-1">
                          {note.category && (
                            <span className="text-[10px] bg-cyan-950 text-cyan-400 px-2 py-0.5 rounded-full font-semibold border border-cyan-800/80 uppercase tracking-wider mr-2 inline-block">
                              {note.category}
                            </span>
                          )}
                          <span className="font-medium text-slate-200 text-sm truncate inline-block align-middle">
                            {note.title}
                          </span>
                        </div>
                        <div className="flex gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={() => handleEditNote(note)}
                            className="text-xs bg-slate-800 hover:bg-slate-700 text-cyan-400 px-3 py-1.5 rounded-lg border border-slate-700 font-medium transition-all"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteNote(note.id)}
                            className="text-xs bg-rose-950/40 hover:bg-rose-900/60 text-rose-400 px-3 py-1.5 rounded-lg border border-rose-900/50 font-medium transition-all"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </>
          )}

          {/* ================= TAB 2: PROJECTS ================= */}
          {activeTab === 'projects' && (
            <>
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-md">
                <div className="flex justify-between items-center mb-6 border-b border-slate-800 pb-4">
                  <h2 className="text-2xl font-bold text-cyan-400">
                    {editingItem?.type === 'project' ? 'Edit Project' : 'Add New Project'}
                  </h2>
                  {editingItem?.type === 'project' && (
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold px-3 py-1.5 rounded-lg border border-slate-700 transition-all"
                    >
                      Cancel Edit
                    </button>
                  )}
                </div>

                <form onSubmit={handleProjectSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-200 mb-2">Project Title</label>
                    <input
                      type="text"
                      value={projectData.title}
                      onChange={(e) => setProjectData('title', e.target.value)}
                      placeholder="e.g. Route Tracker Mobile App"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-slate-100 placeholder-slate-500 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 font-medium"
                      required
                    />
                    {projectErrors.title && <p className="text-rose-400 text-xs mt-1">{projectErrors.title}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-200 mb-2">Description</label>
                    <textarea
                      rows="4"
                      value={projectData.description}
                      onChange={(e) => setProjectData('description', e.target.value)}
                      placeholder="Brief summary of features, tech stack, and goals..."
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl p-4 text-slate-100 placeholder-slate-500 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-sm"
                      required
                    />
                    {projectErrors.description && <p className="text-rose-400 text-xs mt-1">{projectErrors.description}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-200 mb-2">Tags (comma separated)</label>
                    <input
                      type="text"
                      value={projectData.tags}
                      onChange={(e) => setProjectData('tags', e.target.value)}
                      placeholder="React Native, Firebase, Tailwind"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-slate-100 placeholder-slate-500 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 font-medium"
                    />
                    {projectErrors.tags && <p className="text-rose-400 text-xs mt-1">{projectErrors.tags}</p>}
                  </div>

                  <button
                    type="submit"
                    disabled={projectProcessing}
                    className="px-6 py-3 rounded-xl bg-cyan-600 text-white font-bold text-sm hover:bg-cyan-500 shadow-lg shadow-cyan-600/30 transition-all disabled:opacity-50"
                  >
                    {projectProcessing ? 'Saving...' : editingItem?.type === 'project' ? 'Update Project' : 'Publish Project'}
                  </button>
                </form>
              </div>

              {/* Existing Projects List */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-md">
                <h3 className="text-lg font-bold mb-4 text-slate-200">Manage Projects ({projects.length})</h3>
                <div className="divide-y divide-slate-800">
                  {projects.length === 0 ? (
                    <p className="text-slate-500 text-sm py-4">No showcase projects added yet.</p>
                  ) : (
                    projects.map((project) => (
                      <div key={project.id} className="py-4 flex items-center justify-between gap-4">
                        <div className="min-w-0 flex-1">
                          <h4 className="font-semibold text-slate-200 text-sm truncate">{project.title}</h4>
                          <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">{project.description}</p>
                        </div>
                        <div className="flex gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={() => handleEditProject(project)}
                            className="text-xs bg-slate-800 hover:bg-slate-700 text-cyan-400 px-3 py-1.5 rounded-lg border border-slate-700 font-medium transition-all"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteProject(project.id)}
                            className="text-xs bg-rose-950/40 hover:bg-rose-900/60 text-rose-400 px-3 py-1.5 rounded-lg border border-rose-900/50 font-medium transition-all"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </>
          )}

        </div>
      </div>
    </AuthenticatedLayout>
  );
}