<?php
namespace App\Repositories;

use App\Models\Centrevote;
use App\Repositories\RessourceRepository;
use Illuminate\Support\Facades\DB;

class CentrevoteRepository extends RessourceRepository{
    public function __construct(Centrevote $centrevote){
        $this->model = $centrevote;
    }
    public function nbCentreVote(){
        return   DB::table('centrevotes')
        ->count();
        //->get();


    }
    public function getAllCentre(){
        return Centrevote::with('commune')
        ->get();
    }
    public function getByCommune($commune){
        return DB::table("centrevotes")
        ->join("communes","centrevotes.commune_id","=","communes.id")
        ->join("arrondissements","communes.arrondissement_id","=","arrondissements.id")
        ->join("departements","arrondissements.departement_id","=","departements.id")
        ->join("regions","departements.region_id","=","regions.id")

        ->select("centrevotes.*","communes.nom as commune","arrondissements.nom as arrondissement","departements.nom as departement","regions.nom as region")
        ->where([["commune_id",$commune],["niveau",false]])
        ->orderBy("nom","asc")
        ->get();
}
public function getOnlyByCommune($commune){
    return DB::table("centrevotes")
    ->where("commune_id",$commune)
    ->orderBy("nom","asc")
    ->get();
}



public function getAllOnly(){
    return DB::table("centrevotes")->get();
}

public function updateNiveau($id){
    return DB::table("centrevotes")->where("id",$id)->update(["niveau"=>true]);
}



public function getByArrondissement($id){
    return DB::table("centrevotes")
    ->join("communes","centrevotes.commune_id","=","communes.id")
    ->join("arrondissements","communes.arrondissement_id","=","arrondissements.id")
    ->join("departements","arrondissements.departement_id","=","departements.id")
    ->join("regions","departements.region_id","=","regions.id")

    ->select("centrevotes.*","communes.nom as commune","arrondissements.nom as arrondissement","departements.nom as departement","regions.nom as region")
    ->where("communes.arrondissement_id",$id)
    ->orderBy("communes.nom",'asc')
    ->get();
}

public function getByDepartement($id){
    return DB::table("centrevotes")
    ->join("communes","centrevotes.commune_id","=","communes.id")
    ->join("arrondissements","communes.arrondissement_id","=","arrondissements.id")
    ->join("departements","arrondissements.departement_id","=","departements.id")
    ->join("regions","departements.region_id","=","regions.id")
    ->select("centrevotes.*","communes.nom as commune","arrondissements.nom as arrondissement","departements.nom as departement","regions.nom as region")
    ->where("arrondissements.departement_id",$id)
    ->orderBy("communes.nom",'asc')
    ->get();
}
public function getByRegion($id){
    return DB::table("centrevotes")
    ->join("communes","centrevotes.commune_id","=","communes.id")
    ->join("arrondissements","communes.arrondissement_id","=","arrondissements.id")
    ->join("departements","arrondissements.departement_id","=","departements.id")
    ->join("regions","departements.region_id","=","regions.id")
    ->select("centrevotes.*","communes.nom as commune","arrondissements.nom as arrondissement","departements.nom as departement","regions.nom as region")
    ->where("departements.region_id",$id)
    ->orderBy("communes.nom",'asc')
    ->get();
}

public function allCentre(){
    return DB::table("centrevotes")
    ->join("communes","centrevotes.commune_id","=","communes.id")
    ->join("arrondissements","communes.arrondissement_id","=","arrondissements.id")
    ->join("departements","arrondissements.departement_id","=","departements.id")
    ->join("regions","departements.region_id","=","regions.id")
    ->select("centrevotes.*","communes.nom as commune","arrondissements.nom as arrondissement","departements.nom as departement","regions.nom as region")
    ->orderBy("communes.nom",'asc')
    ->get();
}

    public function getBureauByCentre($id)
    {
        return Centrevote::with(["lieuvotes","lieuvotes.bureaus","commune"])
        ->where("id",$id)
        ->first();
    }

    public function countByCommune($id){
        return DB::table("centrevotes")
        //->join("communes","centrevotes.commune_id","=","communes.id")
       // ->select("centrevotes.*","communes.nom as commune")
        ->where("centrevotes.commune_id",$id)
        ->count();
    }
    public function countByArrondissement($id){
        return DB::table("centrevotes")
        ->join("communes","centrevotes.commune_id","=","communes.id")
       // ->select("centrevotes.*","communes.nom as commune")
        ->where("communes.arrondissement_id",$id)
        ->count();
    }
    public function countByDepartement($id){
        return DB::table("centrevotes")
        ->join("communes","centrevotes.commune_id","=","communes.id")
      //  ->select("centrevotes.*","communes.nom as commune")
        ->where("communes.departement_id",$id)
        ->count();
    }
    public function countByRegion($id){
        return DB::table("centrevotes")
        ->join("communes","centrevotes.commune_id","=","communes.id")
        ->join("departements","communes.departement_id","=","departements.id")

     //   ->select("centrevotes.*","communes.nom as commune")
        ->where("departements.region_id",$id)
        ->count();
    }


    public function getOneOnly($id)
    {
        return DB::table("centrevotes")->find($id);
    }
}
