<?php
namespace App\Repositories;

use App\Models\Identification;
use App\Repositories\RessourceRepository;
use Illuminate\Support\Facades\DB;

class IdentificationRepository extends RessourceRepository{
    public function __construct(Identification $identification){
        $this->model = $identification;
    }

    public function getByIdWithRelation($id)
    {
        return DB::table("identifications")
        ->join("communes","identifications.commune_id","=","communes.id")
        ->join("departements","communes.departement_id","=","departements.id")
        ->leftJoin("regions","departements.region_id","=","regions.id")

        ->select("identifications.*","communes.nom as commune","departements.nom as departement","regions.nom as region")
        ->where("identifications.id",$id)
        ->first();
    }


}
