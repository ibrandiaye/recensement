<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Departement extends Model
{
    use HasFactory;
    protected $fillable = [
        'nom','region_id'
    ];

    public function region()
    {
        return $this->belongsTo(Region::class);
    }
    public function arrondissements()
    {
        return $this->hasMany(Arrondissement::class);
    }
}
