<?php
namespace App\Repositories;

use App\Models\Carte;
use App\Repositories\RessourceRepository;
use Illuminate\Support\Facades\DB;

class CarteRepository extends RessourceRepository{
    public function __construct(Carte $carte){
        $this->model = $carte;
    }

    public function getCarteAsc(){
        return DB::table("cartes")
        ->orderBy("nom","asc")
        ->get();

    }
    public function deleteAll(){
        return DB::table("cartes")
        ->delete();
       }

   public function getByDepartement($departement)
   {
        return DB::table("cartes")->where("departement_id",$departement)->get();
   }
   public function getByCommune($commune)
   {
        return DB::table("cartes")->where("commune_id",$commune)->get();
   }        
   public function countByDepartement($departement)
   {
        return DB::table("cartes")->where("departement_id",$departement)->count();
   } 
   public function countBycommune($commune)
   {
        return DB::table("cartes")->where("commune_id",$commune)->count();
   } 
   
   public function countAll()
   {
        return DB::table("cartes")->count();
   } 

   public function getByUserAndLocalisation($user,$localisation)
   {
        return DB::table("cartes")
        ->where("user_id",$user)
        ->where("localisation",$localisation)
        ->get();
   }
   public function countByUserAndLocalisation($user,$localisation)
   {
        return DB::table("cartes")
        ->where("user_id",$user)
        ->where("localisation",$localisation)
        ->count();
   }
}
