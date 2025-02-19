<?php
/**
 * Created by PhpStorm.
 * User: ibra8
 * Date: 07/11/2019
 * Time: 09:42
 */

namespace App\Repositories;


use App\Models\Renseignement;
use Illuminate\Support\Facades\DB;

class RenseignementRepository extends RessourceRepository{

    public function __construct(Renseignement $renseignement){
        $this->model =$renseignement;
    }

    public function getBySemaine($semaine)
    {
        return DB::table("renseignements")
        ->where("semaine_id", $semaine) // Filtre par une date spécifique
        ->get();
    }
    public function deleteBySemaineAndComptage($semaine,$commune)
    {
        return DB::table("renseignements")
        ->where("semaine_id", $semaine) // Filtre par une date spécifique
        ->where("commune_id", $commune)
        ->delete();
    }
}
