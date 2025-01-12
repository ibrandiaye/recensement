<?php
namespace App\Repositories;

use App\Models\Arrondissement;
use App\Repositories\RessourceRepository;
use Illuminate\Support\Facades\DB;

class ArrondissementRepository extends RessourceRepository{
    public function __construct(Arrondissement $Arrondissement){
        $this->model = $Arrondissement;
    }
    public function getAllWithdepartement(){
        return Arrondissement::with(['departement','departement.region'])
        ->get();
    }
    public function getOneArrondissementWithdepartementAndRegion($id){
        return Arrondissement::with(['departement','departement.region'])
        ->where('id',$id)
        ->first();
    }
    public function getByDepartement($departement){
        return DB::table("arrondissements")
        ->where("departement_id",$departement)
        ->orderBy("nom","asc")
        ->get();
}
public function getByRegion($region){
    return DB::table("arrondissements")
    ->join("departements","arrondissements.departement_id","=","departements.id")
    ->where("departements.region_id",$region)
    ->select("arrondissements.*")
    ->orderBy("arrondissements.nom","asc")
    ->get();
}
public function getAllOnLy(){
    return DB::table("arrondissements")
    ->orderBy("nom","asc")
    ->get();
}
public function updateEtat($id){
    return DB::table("arrondissements")->where("id",$id)->update(["etat"=>true]);
}

public function getArrondissementByNom($nom){
    return DB::table("arrondissements")->where('nom', 'like', '%'.$nom.'%')->get();
}

public function getOneByName($nom)
{
    return DB::table("arrondissements")->where("nom",$nom)->first();
}

public function getOneOnly($id)
{
    return DB::table("arrondissements")->find($id);
}

}
