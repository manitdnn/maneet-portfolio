<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\PublicPortfolioController;
use App\Models\Note;
use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Str;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/
Route::get('/', [PublicPortfolioController::class, 'index'])->name('home');
Route::get('/notes/{slug}', [PublicPortfolioController::class, 'showNote'])->name('notes.show');

/*
|--------------------------------------------------------------------------
| Authenticated Dashboard Routes
|--------------------------------------------------------------------------
*/
Route::get('/dashboard', function () {
    return Inertia::render('Dashboard', [
        'notes' => Note::latest()->get(),
        'projects' => Project::latest()->get(),
    ]);
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    /* --- Note Routes --- */
    Route::post('/admin/notes', function (Request $request) {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'category' => 'required|string',
            'content' => 'required|string',
            'video_url' => 'nullable|url',
        ]);

        Note::create([
            'title' => $validated['title'],
            'slug' => Str::slug($validated['title']),
            'category' => $validated['category'],
            'content' => $validated['content'],
            'video_url' => $validated['video_url'],
            'tags' => [$validated['category']],
            'is_published' => true,
        ]);

        return back()->with('message', 'Note created successfully!');
    })->name('admin.notes.store');

    Route::put('/admin/notes/{note}', function (Request $request, Note $note) {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'category' => 'required|string',
            'content' => 'required|string',
            'video_url' => 'nullable|url',
        ]);

        $note->update([
            'title' => $validated['title'],
            'slug' => Str::slug($validated['title']),
            'category' => $validated['category'],
            'content' => $validated['content'],
            'video_url' => $validated['video_url'],
            'tags' => [$validated['category']],
        ]);

        return back()->with('message', 'Note updated successfully!');
    })->name('admin.notes.update');

    Route::delete('/admin/notes/{note}', function (Note $note) {
        $note->delete();
        return back()->with('message', 'Note deleted successfully!');
    })->name('admin.notes.destroy');

    /* --- Project Routes --- */
    Route::post('/admin/projects', function (Request $request) {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'tags' => 'required|string',
            'is_featured' => 'boolean',
        ]);

        $tagsArray = array_map('trim', explode(',', $validated['tags']));

        Project::create([
            'title' => $validated['title'],
            'slug' => Str::slug($validated['title']),
            'description' => $validated['description'],
            'tags' => $tagsArray,
            'is_featured' => $request->boolean('is_featured', true),
        ]);

        return back()->with('message', 'Project created successfully!');
    })->name('admin.projects.store');

    Route::put('/admin/projects/{project}', function (Request $request, Project $project) {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'tags' => 'required|string',
            'is_featured' => 'boolean',
        ]);

        $tagsArray = array_map('trim', explode(',', $validated['tags']));

        $project->update([
            'title' => $validated['title'],
            'slug' => Str::slug($validated['title']),
            'description' => $validated['description'],
            'tags' => $tagsArray,
            'is_featured' => $request->boolean('is_featured', true),
        ]);

        return back()->with('message', 'Project updated successfully!');
    })->name('admin.projects.update');

    Route::delete('/admin/projects/{project}', function (Project $project) {
        $project->delete();
        return back()->with('message', 'Project deleted successfully!');
    })->name('admin.projects.destroy');
});

require __DIR__.'/auth.php';