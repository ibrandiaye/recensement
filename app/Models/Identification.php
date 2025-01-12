<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Identification extends Model
{
    use HasFactory;
    protected $fillable = [
        'tel','commune_id','departement_id'/*,'electeur_id'*/,
        'prenom','nom','cni','lieunaiss','datenaiss','handicap'];
}
