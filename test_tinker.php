<?php
$p = new App\Models\Paper();
$p->user_id = 2;
$p->title = 'Uji Coba Sistem Plagiat';
$p->abstract = 'Ini adalah abstrak unik yang belum pernah ada.';
$p->status = 'submitted';
$p->save();

// Jika Job dijalankan secara sinkronus (karena QUEUE_CONNECTION=sync), 
// similarity_score akan langsung terisi.
echo "\n==== HASIL TEST ====\n";
echo "ID Naskah Baru: " . $p->id . "\n";
echo "Score: " . $p->fresh()->similarity_score . "\n";
echo "====================\n";
