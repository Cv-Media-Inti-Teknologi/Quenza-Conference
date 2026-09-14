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
            'capacity' => ['required', 'integer', 'min:1'],
            'topic' => ['required', 'string', 'max:255'],
        ], [
            'capacity.required' => 'Kapasitas wajib diisi',
            'capacity.integer' => 'Kapasitas harus berupa bilangan bulat (tidak boleh desimal)',
            'capacity.numeric' => 'Kapasitas harus berupa angka',
            'capacity.gt' => 'Kapasitas harus lebih dari 0',
            'capacity.min' => 'Kapasitas harus lebih dari 0',
        ]);

        $validated['capacity'] = (int) $validated['capacity'];

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
            'capacity' => ['required', 'integer', 'min:1'],
            'topic' => ['required', 'string', 'max:255'],
        ], [
            'capacity.required' => 'Kapasitas wajib diisi',
            'capacity.integer' => 'Kapasitas harus berupa bilangan bulat (tidak boleh desimal)',
            'capacity.numeric' => 'Kapasitas harus berupa angka',
            'capacity.gt' => 'Kapasitas harus lebih dari 0',
            'capacity.min' => 'Kapasitas harus lebih dari 0',
        ]);

        $validated['capacity'] = (int) $validated['capacity'];

        $room->update($validated);

        return back()->with('success', 'Ruangan berhasil diperbarui');
    }

    /**
     * Remove the specified room from storage.
     */
    public function destroy(Room $room): RedirectResponse
    {
        $room->delete();

        return back()->with('success', 'Ruangan berhasil dihapus');
    }
}
