<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Comptage extends Model
{
    use HasFactory;
    protected $fillable = [
        'debut','fin','inscription','modification','changement','radiation','commune_id',
        'arrondissement_id'];

        public function commune()
        {
            return $this->belongsTo(Commune::class);
        }
}
