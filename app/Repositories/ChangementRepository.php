<?php
namespace App\Repositories;

use App\Models\Changement;
use App\Repositories\RessourceRepository;
use Illuminate\Support\Facades\DB;

class ChangementRepository extends RessourceRepository{
    public function __construct(Changement $changement){
        $this->model = $changement;
    }

    public function getWithIndentification()
    {
        return DB::table("changements")
        ->join("identifications","changements.identification_id","=","identifications.id")
        ->select("identifications.*","changements.id as changement")
        ->get();
    }

    
    public function getByIdWithRelation($id)
    {
        return DB::table("changements")
        ->join("identifications","changements.identification_id","=","identifications.id")

        ->join("communes","identifications.commune_id","=","communes.id")
        ->join("departements","communes.departement_id","=","departements.id")
        ->leftJoin("regions","departements.region_id","=","regions.id")

        ->select("changements.*","communes.nom as commune","departements.nom as departement","regions.nom as region","identifications.nom as identification")
        ->where("changements.id",$id)
        ->first();
    }

    public function count()
    {
        return DB::table("changements")
      
        ->count();
    }


}
