<?php
$p1 = App\Models\Paper::find(1);
$p2 = new App\Models\Paper();
$p2->user_id = 3;
$p2->title = 'Salinan Identik';
$p2->abstract = $p1->abstract;
$p2->status = 'submitted';
$p2->save();
echo "Paper 4 dibuat!\n";
