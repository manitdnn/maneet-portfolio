<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\Note;
use App\Models\VisitorStat;
use Inertia\Inertia;

class PublicPortfolioController extends Controller
{
    public function index()
    {
        // Visitor views count increment karna
        $stat = VisitorStat::firstOrCreate(['page' => 'home']);
        $stat->increment('views');

        return Inertia::render('Welcome', [
            'projects' => Project::where('is_featured', true)->latest()->get(),
            'notes' => Note::where('is_published', true)->latest()->get(),
            'totalViews' => $stat->views,
        ]);
    }

    public function showNote($slug)
    {
        $note = Note::where('slug', $slug)->firstOrFail();

        return Inertia::render('NoteDetail', [
            'note' => $note
        ]);
    }
}