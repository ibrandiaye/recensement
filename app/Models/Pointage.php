<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Pointage extends Model
{
    use HasFactory;
    protected $fillable = [
        'numero','lot_id'];
        public function lot()
        {
            return $this->belongsTo(Lot::class);
        }
}
