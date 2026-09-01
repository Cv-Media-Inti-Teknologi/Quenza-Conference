<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Models\Room;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class RoomController extends Controller
{
    /**
     * Store a newly created room in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'location' => ['required', 'string', 'max:255'],
            'capacity' => ['required'],
            'topic' => ['required', 'string', 'max:255'],
        ]);

        if (is_string($validated['capacity'])) {
            $validated['capacity'] = (int) (preg_replace('/\D/', '', $validated['capacity']) ?: 0);
        }

        Room::create($validated);

        return back()->with('success', 'Ruangan berhasil ditambahkan');
    }

    /**
     * Update the specified room in storage.
     */
    public function update(Request $request, Room $room): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'location' => ['required', 'string', 'max:255'],
            'capacity' => ['required'],
            'topic' => ['required', 'string', 'max:255'],
        ]);

        if (is_string($validated['capacity'])) {
            $validated['capacity'] = (int) (preg_replace('/\D/', '', $validated['capacity']) ?: 0);
        }

        $room->update($validated);

        return back()->with('success', 'Ruangan berhasil diperbarui');
    }

    /**
     * Remove the specified room from storage.
     */
    public function destroy(int|string $id): RedirectResponse
    {
        $room = Room::findOrFail($id);
        $room->delete();

        return back()->with('success', 'Ruangan berhasil dihapus');
    }
}
