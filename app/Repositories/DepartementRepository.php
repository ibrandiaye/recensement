<?php
namespace App\Repositories;

use App\Models\Departement;
use App\Repositories\RessourceRepository;
use Illuminate\Support\Facades\DB;

class DepartementRepository extends RessourceRepository{
    public function __construct(Departement $departement){
        $this->model = $departement;
    }
    public function getAllWithRegion(){
        return Departement::with('region')
        ->get();
    }
    public function getOneWithRegion($id){
        return Departement::with('region')
        ->where('id',$id)
        ->first();
    }
    public function getByRegion($region){
            return DB::table("departements")
            ->where("region_id",$region)
            ->orderBy("nom","asc")

            ->get();
    }
    public function deleteAll(){
        return DB::table("departements")
        ->delete();
       }
       public function getOrbyRegion()
       {
        return DB::table('departements')
        ->join("regions","departements.region_id","=","regions.id")
        ->select("departements.*") ->orderBy("departements.is_diaspora",'asc')
        ->orderBy("regions.nom",'asc')->orderBy("departements.nom","asc")->get();
       }
}
