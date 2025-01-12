<?php
namespace App\Repositories;

use App\Models\Modification;
use App\Repositories\RessourceRepository;
use Illuminate\Support\Facades\DB;

class ModificationRepository extends RessourceRepository{
    public function __construct(Modification $modification){
        $this->model = $modification;
    }

    public function getWithIndentification()
    {
        return DB::table("modifications")
        ->join("identifications","modifications.identification_id","=","identifications.id")
        ->select("identifications.*","modifications.id as modification")
        ->get();
    }

    
    public function getByIdWithRelation($id)
    {
        return DB::table("modifications")
        ->join("centrevotes","modifications.centrevote_id","=","centrevotes.id")

        ->join("communes","centrevotes.commune_id","=","communes.id")
        ->join("departements","communes.departement_id","=","departements.id")
        ->leftJoin("regions","departements.region_id","=","regions.id")

        ->select("modifications.*","communes.nom as commune","departements.nom as departement","regions.nom as region","centrevotes.nom as centrevote")
        ->where("modifications.id",$id)
        ->first();
    }

    public function count()
    {
        return DB::table("modifications")
      
        ->count();
    }


}
