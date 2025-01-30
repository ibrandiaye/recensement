<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Lot extends Model
{
    use HasFactory;
    protected $fillable = [
        'numero','nombre','commune_id'];

        public function commune()
        {
            return $this->belongsTo(Commune::class);
        }
}
