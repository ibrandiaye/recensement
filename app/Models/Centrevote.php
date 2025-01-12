<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Centrevote extends Model
{
    use HasFactory;
    use HasFactory;
    protected $fillable = ["nom","commune_id"] ;
    public function commune(){
        return $this->belongsTo(Commune::class);
    }
}
