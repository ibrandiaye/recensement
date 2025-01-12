<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Radiation extends Model
{
    use HasFactory;
    protected $fillable = [
        'motif','identification_id','nin'];
}
