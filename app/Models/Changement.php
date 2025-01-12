<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Changement extends Model
{
    use HasFactory;

    protected $fillable = [
        'statut','identification_id'];
}
