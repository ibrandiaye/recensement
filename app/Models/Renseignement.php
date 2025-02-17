<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Renseignement extends Model
{
    use HasFactory;
    protected $fillable = [
        'commune_id','departement_id',"arrondissement_id","semaine_id"];

}
