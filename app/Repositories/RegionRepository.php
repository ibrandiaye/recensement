<?php
namespace App\Repositories;

use App\Models\Region;
use App\Repositories\RessourceRepository;
use Illuminate\Support\Facades\DB;

class RegionRepository extends RessourceRepository{
    public function __construct(Region $region){
        $this->model = $region;
    }

    public function getRegionAsc(){
        return DB::table("regions")
        ->orderBy("nom","asc")
        ->get();

    }
    public function deleteAll(){
        return DB::table("regions")
        ->delete();
       }
       public function getOneWithRelation($id)
    {
        return Region::with(["departements","departements.arrondissements","departements.arrondissements.communes"])
        ->find($id);
    }
    public function getAllOnly(){
        return DB::table("regions")
        ->orderBy("nom","asc")

        ->get();
       }

       public function getALLWithRelation()
       {
           return Region::with(["departements","departements.arrondissements","departements.arrondissements.communes"])
           ->orderBy("nom")
           ->get();
       }
       

}
