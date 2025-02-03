<?php
/**
 * Created by PhpStorm.
 * User: ibra8
 * Date: 07/11/2019
 * Time: 09:42
 */

namespace App\Repositories;


use App\Models\Semaine;
use Illuminate\Support\Facades\DB;

class SemaineRepository extends RessourceRepository{

    public function __construct(Semaine $semaine){
        $this->model =$semaine;
    }

    public function getOneByDebut($semaine)
    {
        return DB::table("semaines")->whereDate("semaines.debut", $semaine) // Filtre par une date spécifique
        ->first();
    }
}
