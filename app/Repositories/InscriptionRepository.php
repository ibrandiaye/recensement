<?php
namespace App\Repositories;

use App\Models\Inscription;
use App\Repositories\RessourceRepository;
use Illuminate\Support\Facades\DB;

class InscriptionRepository extends RessourceRepository{
    public function __construct(Inscription $inscription){
        $this->model = $inscription;
    }

    public function getWithIndentification()
    {
        return DB::table("inscriptions")
        ->join("identifications","inscriptions.identification_id","=","identifications.id")
        ->select("identifications.*","inscriptions.id as inscription")
        ->get();
    }

    
    public function getByIdWithRelation($id)
    {
        return DB::table("inscriptions")
        ->join("centrevotes","inscriptions.centrevote_id","=","centrevotes.id")

        ->join("communes","centrevotes.commune_id","=","communes.id")
        ->join("departements","communes.departement_id","=","departements.id")
        ->leftJoin("regions","departements.region_id","=","regions.id")

        ->select("inscriptions.*","communes.nom as commune","departements.nom as departement","regions.nom as region","centrevotes.nom as centrevote")
        ->where("inscriptions.id",$id)
        ->first();
    }

    public function count()
    {
        return DB::table("inscriptions")
      
        ->count();
    }


}
