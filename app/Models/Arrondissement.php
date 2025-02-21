<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Arrondissement extends Model
{
    use HasFactory;
    protected $fillable = [
        'nom','departement_id','is_arrondissement'
    ];
    public function departement()
    {
        return $this->belongsTo(Departement::class);
    }
    public function communes()
    {
        return $this->hasMany(Commune::class);
    }
}
