<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Revision extends Model
{
    use HasFactory;
    protected $fillable = [
        'nom','prenom','datenaiss','lieunaiss','numelec','numcni','departement_id','commune','region_id',
        'sexe','commune_id','type','motif'
    ];
}
