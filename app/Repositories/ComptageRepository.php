<?php
namespace App\Repositories;

use App\Models\Comptage;
use App\Repositories\RessourceRepository;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class ComptageRepository extends RessourceRepository{
    public function __construct(Comptage $comptage){
        $this->model = $comptage;
    }
    public function get()
    {
        $user = Auth::user();
        if($user->role=="admin" || $user->role=="correcteur")
        {
            return DB::table("comptages")
            ->join("communes","comptages.commune_id","=","communes.id")
            ->join("semaines","comptages.semaine_id","=","semaines.id")

            ->select("communes.nom","semaines.debut","semaines.fin","comptages.*")
            ->get();
        }
        else
        {
            return DB::table("comptages")
            ->join("communes","comptages.commune_id","=","communes.id")
            ->join("semaines","comptages.semaine_id","=","semaines.id")

            ->select("communes.nom","semaines.debut","semaines.fin","comptages.*")            ->where("communes.arrondissement_id",$user->arrondissement_id)
            ->get();
        }
    }
    public function statByComune($commune)
    {
        return  DB::table("comptages")
        ->join("semaines","comptages.semaine_id","=","semaines.id")

        ->select("semaines.debut","semaines.fin","comptages.*")            
        ->where("comptages.commune_id",$commune)
        ->orderBy("comptages.id","desc")
        ->first();
    }
    public function nbGroupByInscription(){
        $user = Auth::user();
        if($user->role=="admin" || $user->role=='superviseur' || $user->role=='correcteur')
        {
            return  DB::table("comptages")
            ->sum("inscription");
        }
        elseif ($user->role=="sous_prefet") {
            return  DB::table("comptages")
            ->join("communes","comptages.commune_id","=","communes.id")
            ->where("communes.arrondissement_id",$user->arrondissement_id)
            ->sum("comptages.inscription"); 
        }
        elseif ($user->role=="prefet") {
            return  DB::table("comptages")
            ->join("communes","comptages.commune_id","=","communes.id")
            ->where("communes.departement_id",$user->departement_id)
            ->sum("comptages.inscription"); 
        }
        elseif ($user->role=="gouverneur") {
            return  DB::table("comptages")
            ->join("communes","comptages.commune_id","=","communes.id")
            ->join("departements","communes.departement_id","=","departements.id")

            ->where("departements.region_id",$user->region_id)
            ->sum("comptages.inscription"); 
        }

    }
    public function nbGroupByChangement(){
        $user = Auth::user();
        if($user->role=="admin" || $user->role=='superviseur' || $user->role=='correcteur')
        {
            return  DB::table("comptages")
            ->sum("changement");
        }
        elseif ($user->role=="sous_prefet") {
            return  DB::table("comptages")
            ->join("communes","comptages.commune_id","=","communes.id")
            ->where("communes.arrondissement_id",$user->arrondissement_id)            
            ->sum("comptages.changement"); 
        }
        elseif ($user->role=="prefet") {
            return  DB::table("comptages")
            ->join("communes","comptages.commune_id","=","communes.id")
            ->where("communes.departement_id",$user->departement_id)
            ->sum("comptages.changement"); 
        }
        elseif ($user->role=="gouverneur") {
            return  DB::table("comptages")
            ->join("communes","comptages.commune_id","=","communes.id")
            ->join("departements","communes.departement_id","=","departements.id")
            ->where("departements.region_id",$user->region_id)            
            ->sum("comptages.changement"); 
        }

    }
    public function nbGroupByModification(){
        $user = Auth::user();
        if($user->role=="admin" || $user->role=='superviseur' || $user->role=='correcteur')
        {
            return  DB::table("comptages")
            ->sum("modification");
        }
        elseif ($user->role=="sous_prefet") {
            return  DB::table("comptages")
            ->join("communes","comptages.commune_id","=","communes.id")
            ->where("communes.arrondissement_id",$user->arrondissement_id)
            ->sum("comptages.modification"); 
        }
        elseif ($user->role=="prefet") {
            return  DB::table("comptages")
            ->join("communes","comptages.commune_id","=","communes.id")
            ->where("communes.departement_id",$user->departement_id)
            ->sum("comptages.modification"); 
        }
        elseif ($user->role=="gouverneur") {
            return  DB::table("comptages")
            ->join("communes","comptages.commune_id","=","communes.id")
           // ->where("communes.departement_id",$user->departement_id)
            ->join("departements","communes.departement_id","=","departements.id")

            ->where("departements.region_id",$user->region_id)
            ->sum("comptages.modification"); 
        }

    }
    public function nbGroupRadiation(){
        $user = Auth::user();
        if($user->role=="admin" || $user->role=='superviseur' || $user->role=='correcteur')
        {
        return  DB::table("comptages")
        ->sum("radiation");
        }
        elseif ($user->role=="sous_prefet") {
            return  DB::table("comptages")
            ->join("communes","comptages.commune_id","=","communes.id")
            ->where("communes.arrondissement_id",$user->arrondissement_id)
            ->sum("comptages.radiation"); 
        }
        elseif ($user->role=="prefet") {
            return  DB::table("comptages")
            ->join("communes","comptages.commune_id","=","communes.id")
            ->where("communes.departement_id",$user->departement_id)
            ->sum("comptages.radiation"); 
        }
        elseif ($user->role=="gouverneur") {
            return  DB::table("comptages")
            ->join("communes","comptages.commune_id","=","communes.id")
            ->join("departements","communes.departement_id","=","departements.id")

            ->where("departements.region_id",$user->region_id)
            ->sum("comptages.radiation"); 
        }

    }

    public function getLastByCommune($commune)
    {
        return DB::table("comptages")->where("commune_id",$commune)->orderBy("id","desc")->limit(1);
    }

    //By Region

    public function nbGroupByInscriptionByRegion($id){
      
        return  DB::table("comptages")
        ->join("communes","comptages.commune_id","=","communes.id")
        ->join('departements',"communes.departement_id","=","departements.id")
        ->where("departements.region_id",$id)
        ->sum("comptages.inscription"); 
      
    }
    public function nbGroupByChangementByRegion($id){
        return  DB::table("comptages")
        ->join("communes","comptages.commune_id","=","communes.id")
        ->join('departements',"communes.departement_id","=","departements.id")
        ->where("departements.region_id",$id)
        ->sum("comptages.changement"); 
       

    }
    public function nbGroupByModificationByRegion($id){
        return  DB::table("comptages")
        ->join("communes","comptages.commune_id","=","communes.id")
        ->join('departements',"communes.departement_id","=","departements.id")
        ->where("departements.region_id",$id)
        ->sum("comptages.modification"); 
       

    }
    public function nbGroupRadiationByRegion($id){
      
        return  DB::table("comptages")
        ->join("communes","comptages.commune_id","=","communes.id")
        ->join('departements',"communes.departement_id","=","departements.id")
        ->where("departements.region_id",$id)
        ->sum("comptages.radiation"); 
      

    }
    //By departement
    public function nbGroupByInscriptionByDeoartement($id){
       
            return  DB::table("comptages")
            ->join("communes","comptages.commune_id","=","communes.id")
            ->where("communes.departement_id",$id)
            ->sum("comptages.inscription"); 
    

    }
    public function nbGroupByChangementByDepartement($id){
        return  DB::table("comptages")
        ->join("communes","comptages.commune_id","=","communes.id")
        ->where("communes.departement_id",$id)

        ->sum("comptages.changement"); 

    }
    public function nbGroupByModificationByDepartement($id){
        return  DB::table("comptages")
        ->join("communes","comptages.commune_id","=","communes.id")
        ->where("communes.departement_id",$id)

        ->sum("comptages.modification"); 
       

    }
    public function nbGroupRadiationByDepartement($id){
       
        return  DB::table("comptages")
        ->join("communes","comptages.commune_id","=","communes.id")
        ->where("communes.departement_id",$id)

        ->sum("comptages.radiation"); 
       

    }
    //arrondissement
    public function nbGroupByInscriptionByArrondissement($id){
        return  DB::table("comptages")
        ->join("communes","comptages.commune_id","=","communes.id")

        ->where("communes.arrondissement_id",$id)

        ->sum("comptages.inscription"); 
       

    }
    public function nbGroupByChangementByArrondissement($id){
        return  DB::table("comptages")
        ->join("communes","comptages.commune_id","=","communes.id")

        ->where("communes.arrondissement_id",$id)        ->sum("comptages.changement"); 
        

    }
    public function nbGroupByModificationByArrondissement($id){
      
        return  DB::table("comptages")
        ->join("communes","comptages.commune_id","=","communes.id")

        ->where("communes.arrondissement_id",$id)        ->sum("comptages.modification"); 
        

    }
    public function nbGroupRadiationByArrondissement($id){
        return  DB::table("comptages")
        ->join("communes","comptages.commune_id","=","communes.id")

        ->where("communes.arrondissement_id",$id)        ->sum("comptages.radiation"); 
       

    }
    //By Commune 
    public function nbGroupByInscriptionByCommune($id){
      
        return  DB::table("comptages")
        ->where("commune_id",$id)
        ->sum("comptages.inscription"); 

    }
    public function nbGroupByChangementByCommune($id){
      
        return  DB::table("comptages")
        ->where("commune_id",$id)
        ->sum("comptages.changement"); 

    }
    public function nbGroupByModificationByCommune($id){
       
        return  DB::table("comptages")
        ->where("commune_id",$id)
        ->sum("comptages.modification"); 

    }
    public function nbGroupRadiationByCommune($id){

        return  DB::table("comptages")
        ->where("commune_id",$id)
        ->sum("comptages.radiation"); 
       

    }


    public function situationAncieneByArrondissement($arrondissement,$semaine)
    {
        return DB::table("comptages")
        ->join("communes","comptages.commune_id","=","communes.id")
        ->join("semaines","comptages.semaine_id","=","semaines.id")

        ->select(
            'communes.nom',
            DB::raw('SUM(comptages.inscription) as inscription'),
            DB::raw('SUM(comptages.modification) as modification'),
            DB::raw('SUM(comptages.changement) as changement'),
            DB::raw('SUM(comptages.radiation) as radiation')
        )
        ->where("communes.arrondissement_id",$arrondissement)
        ->whereDate("semaines.debut","<", $semaine) // Filtre par une date spécifique
        ->groupBy('communes.nom')
        ->get();
    }
    public function situationActuelleByArrondissement($arrondissement,$semaine)
    {
        return DB::table("comptages")
        ->join("communes", "comptages.commune_id", "=", "communes.id")
        ->join("semaines","comptages.semaine_id","=","semaines.id")

        ->select(
            'communes.nom',
            DB::raw('SUM(comptages.inscription) as inscription'),
            DB::raw('SUM(comptages.modification) as modification'),
            DB::raw('SUM(comptages.changement) as changement'),
            DB::raw('SUM(comptages.radiation) as radiation')
        )
        ->where("communes.arrondissement_id", $arrondissement)
        ->whereDate("semaines.debut", $semaine) // Filtre par une date spécifique
        ->groupBy('communes.nom')
        ->get();
    }

    public function situationAncieneByDepartement($departement,$semaine)
    {
        return DB::table("comptages")
        ->join("communes","comptages.commune_id","=","communes.id")
        ->join("arrondissements","communes.arrondissement_id","=","arrondissements.id")
        ->join("semaines","comptages.semaine_id","=","semaines.id")

        ->select(
            'communes.nom',
            DB::raw('SUM(comptages.inscription) as inscription'),
            DB::raw('SUM(comptages.modification) as modification'),
            DB::raw('SUM(comptages.changement) as changement'),
            DB::raw('SUM(comptages.radiation) as radiation')
        )
        ->where("arrondissements.departement_id",$departement)
        ->whereDate("semaines.debut","<", $semaine) // Filtre par une date spécifique

        ->groupBy('communes.nom')
        ->get();
    }
    public function situationActuelleByDepartement($departement,$semaine)
    {
        return DB::table("comptages")
        ->join("communes", "comptages.commune_id", "=", "communes.id")
        ->join("arrondissements","communes.arrondissement_id","=","arrondissements.id")
        ->join("semaines","comptages.semaine_id","=","semaines.id")

        ->select(
            'communes.nom',
            DB::raw('SUM(comptages.inscription) as inscription'),
            DB::raw('SUM(comptages.modification) as modification'),
            DB::raw('SUM(comptages.changement) as changement'),
            DB::raw('SUM(comptages.radiation) as radiation')
        )
        ->where("arrondissements.departement_id",$departement)
        ->whereDate("semaines.debut", $semaine) // Filtre par une date spécifique
        ->groupBy('communes.nom')
        ->get();
    }

    public function getOneBySemaineAndCommune($semaine,$commune)
    {
        return DB::table("comptages")
        ->where("semaine_id",$semaine)
        ->where("commune_id",$commune)
        ->first();
    }

    public function situationAncieneByRegion($region,$semaine)
    {
        return DB::table("comptages")
        ->join("communes","comptages.commune_id","=","communes.id")
        ->join("arrondissements","communes.arrondissement_id","=","arrondissements.id")
        ->join("departements","arrondissements.departement_id","=","departements.id")
        ->join("semaines","comptages.semaine_id","=","semaines.id")

        ->select(
            'communes.nom',
            DB::raw('SUM(comptages.inscription) as inscription'),
            DB::raw('SUM(comptages.modification) as modification'),
            DB::raw('SUM(comptages.changement) as changement'),
            DB::raw('SUM(comptages.radiation) as radiation')
        )
        ->where("departements.region_id",$region)
        ->whereDate("semaines.debut","<", $semaine) // Filtre par une date spécifique

        ->groupBy('communes.nom')
        ->get();
    }
    public function situationActuelleByRegion($region,$semaine)
    {
        return DB::table("comptages")
        ->join("communes", "comptages.commune_id", "=", "communes.id")
        ->join("arrondissements","communes.arrondissement_id","=","arrondissements.id")        
        ->join("departements","arrondissements.departement_id","=","departements.id")

        ->join("semaines","comptages.semaine_id","=","semaines.id")

        ->select(
            'communes.nom',
            DB::raw('SUM(comptages.inscription) as inscription'),
            DB::raw('SUM(comptages.modification) as modification'),
            DB::raw('SUM(comptages.changement) as changement'),
            DB::raw('SUM(comptages.radiation) as radiation')
        )
        ->where("departements.region_id",$region)
        ->whereDate("semaines.debut", $semaine) // Filtre par une date spécifique
        ->groupBy('communes.nom')
        ->get();
    }

    public function situationAncieneByNational($semaine)
    {
        return DB::table("comptages")
        ->join("communes","comptages.commune_id","=","communes.id")
        ->join("arrondissements","communes.arrondissement_id","=","arrondissements.id")
        ->join("departements","arrondissements.departement_id","=","departements.id")
        ->join("semaines","comptages.semaine_id","=","semaines.id")

        ->select(
            'communes.nom',
            DB::raw('SUM(comptages.inscription) as inscription'),
            DB::raw('SUM(comptages.modification) as modification'),
            DB::raw('SUM(comptages.changement) as changement'),
            DB::raw('SUM(comptages.radiation) as radiation')
        )
        ->whereDate("semaines.debut","<", $semaine) // Filtre par une date spécifique

        ->groupBy('communes.nom')
        ->get();
    }
    public function situationActuelleByNational($semaine)
    {
        return DB::table("comptages")
        ->join("communes", "comptages.commune_id", "=", "communes.id")
        ->join("arrondissements","communes.arrondissement_id","=","arrondissements.id")        
        ->join("departements","arrondissements.departement_id","=","departements.id")

        ->join("semaines","comptages.semaine_id","=","semaines.id")

        ->select(
            'communes.nom',
            DB::raw('SUM(comptages.inscription) as inscription'),
            DB::raw('SUM(comptages.modification) as modification'),
            DB::raw('SUM(comptages.changement) as changement'),
            DB::raw('SUM(comptages.radiation) as radiation')
        )
        ->whereDate("semaines.debut", $semaine) // Filtre par une date spécifique
        ->groupBy('communes.nom')
        ->get();
    }
    public function getOneBySemaine($semaine)
    {
        return DB::table("comptages")->where("semaine_id",$semaine)->first();
    }
    public function getOne($id)
    {
        return DB::table("comptages")->find($id);
    }

    public function situationGroupByDepartement()
    {
        return DB::table("comptages")
        ->join("communes","comptages.commune_id","=","communes.id")
        ->join("departements","communes.departement_id","=","departements.id")
      //  ->join("regions","departements.region_id","=","regions.id")

        ->select(
            'departements.nom',
            DB::raw('SUM(comptages.inscription) as inscription'),
            DB::raw('SUM(comptages.modification) as modification'),
            DB::raw('SUM(comptages.changement) as changement'),
            DB::raw('SUM(comptages.radiation) as radiation')
        )
        ->groupBy('departements.nom')
      //  ->orderBy("regions.nom")
        ->get();
    }
    public function situationGroupByDepartementBySemaine($semaine)
    {
        return DB::table("comptages")
        ->join("communes","comptages.commune_id","=","communes.id")
        ->join("departements","communes.departement_id","=","departements.id")
        ->join("semaines","comptages.semaine_id","=","semaines.id")


        ->select(
            'departements.nom',
            DB::raw('SUM(comptages.inscription) as inscription'),
            DB::raw('SUM(comptages.modification) as modification'),
            DB::raw('SUM(comptages.changement) as changement'),
            DB::raw('SUM(comptages.radiation) as radiation')
        )
        ->where("semaines.id","<=",$semaine)
        ->groupBy('departements.nom')
      //  ->orderBy("regions.nom")
        ->get();
    }
        
/*
        public function situationGroupByDepartement()
    {
        return DB::table("regions")
        ->join("departements","departements.region_id","=","regions.id")
        ->join("communes","communes.departement_id","=","departements.id")
        ->join("comptages", "comptages.commune_id","=","communes.id")

        ->select(
            'departements.nom',
            DB::raw('SUM(comptages.inscription) as inscription'),
            DB::raw('SUM(comptages.modification) as modification'),
            DB::raw('SUM(comptages.changement) as changement'),
            DB::raw('SUM(comptages.radiation) as radiation')
        )
        ->groupBy('departements.nom')
        ->orderBy("regions.nom")
        ->get();
    }*/
}
