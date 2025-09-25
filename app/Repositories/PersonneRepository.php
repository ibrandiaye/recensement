<?php
namespace App\Repositories;

use App\Models\Personne;
use App\Repositories\RessourceRepository;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class PersonneRepository extends RessourceRepository{
    public function __construct(Personne $personne){
        $this->model = $personne;
    }

    public function get()
    {
        $user = Auth::user();
        if ($user->role=="sous_prefet") {
            return  DB::table("personnes")
            ->join("communes", "personnes.commune_id", "=", "communes.id")
            ->join("departements","communes.departement_id","=","departements.id")
            ->join("regions","departements.region_id","=","regions.id")
            ->select("personnes.*", "communes.nom as commune", "departements.nom as departement", "regions.nom as region","communes.arrondissement_id")
            ->where("communes.arrondissement_id",$user->arrondissement_id)
            ->get();
        }
        elseif ($user->role=="prefet") {
            return  DB::table("personnes")
            ->join("communes", "personnes.commune_id", "=", "communes.id")
            ->join("departements","communes.departement_id","=","departements.id")
            ->join("regions","departements.region_id","=","regions.id")
            ->select("personnes.*", "communes.nom as commune", "departements.nom as departement", "regions.nom as region","communes.arrondissement_id")
            ->where("communes.departement_id",$user->departement_id)
            ->get();
        }
        elseif ($user->role=="gouverneur") {
            return  DB::table("personnes")
            ->join("communes", "personnes.commune_id", "=", "communes.id")
            ->join("departements","communes.departement_id","=","departements.id")
            ->join("regions","departements.region_id","=","regions.id")
            ->select("personnes.*", "communes.nom as commune", "departements.nom as departement", "regions.nom as region","communes.arrondissement_id")
            ->where("departements.region_id",$user->region_id)
            ->get();
        }
        return DB::table("personnes")
        ->join("communes", "personnes.commune_id", "=", "communes.id")
        ->join("departements","communes.departement_id","=","departements.id")
        ->join("regions","departements.region_id","=","regions.id")
        ->select("personnes.*", "communes.nom as commune", "departements.nom as departement", "regions.nom as region","communes.arrondissement_id")
        ->get();

    }

     public function countPersonne($user){

        if($user->role=="admin" || $user->role=='superviseur' || $user->role=='correcteur')
        {
            return  DB::table("personnes")
            ->count();
        }
        elseif ($user->role=="sous_prefet") {
            return  DB::table("personnes")
            ->join("communes","personnes.commune_id","=","communes.id")
            ->where("communes.arrondissement_id",$user->arrondissement_id)
            ->count();
        }
        elseif ($user->role=="prefet") {
            return  DB::table("personnes")
            ->join("communes","personnes.commune_id","=","communes.id")
            ->where("communes.departement_id",$user->departement_id)
            ->count();
        }
        elseif ($user->role=="gouverneur") {
            return  DB::table("personnes")
            ->join("communes","personnes.commune_id","=","communes.id")
            ->join("departements","communes.departement_id","=","departements.id")

            ->where("departements.region_id",$user->region_id)
            ->count();
        }
    }


     public function countByRegion($id){

        return  DB::table("personnes")
        ->join("communes","personnes.commune_id","=","communes.id")
        ->join('departements',"communes.departement_id","=","departements.id")
        ->where("departements.region_id",$id)
        ->count();

    }
     public function countByDepartement($id){

            return  DB::table("personnes")
            ->join("communes","personnes.commune_id","=","communes.id")
            ->where("communes.departement_id",$id)
            ->count();


    }

     public function countByArrondissement($id){
        return  DB::table("personnes")
        ->join("communes","personnes.commune_id","=","communes.id")

        ->where("communes.arrondissement_id",$id)

        ->count();


    }
    public function countByCommune($id){

        return  DB::table("personnes")
        ->where("commune_id",$id)
        ->count();

    }

    public function countPersonneDecede($user){

        if($user->role=="admin" || $user->role=='superviseur' || $user->role=='correcteur')
        {
            return  DB::table("personnes")
            ->where("deces", "oui")
            ->count();
        }
        elseif ($user->role=="sous_prefet") {
            return  DB::table("personnes")
            ->join("communes","personnes.commune_id","=","communes.id")
            ->where("deces", "oui")
            ->where("communes.arrondissement_id",$user->arrondissement_id)
            ->count();
        }
        elseif ($user->role=="prefet") {
            return  DB::table("personnes")
            ->join("communes","personnes.commune_id","=","communes.id")
            ->where("deces", "oui")
            ->where("communes.departement_id",$user->departement_id)
            ->count();
        }
        elseif ($user->role=="gouverneur") {
            return  DB::table("personnes")
            ->join("communes","personnes.commune_id","=","communes.id")
            ->join("departements","communes.departement_id","=","departements.id")
            ->where("deces", "oui")
            ->where("departements.region_id",$user->region_id)
            ->count();
        }
    }

    public function countDeceByRegion($id){

        return  DB::table("personnes")
        ->join("communes","personnes.commune_id","=","communes.id")
        ->join('departements',"communes.departement_id","=","departements.id")
        ->where("departements.region_id",$id)
         ->where("deces", "oui")
        ->count();

    }
     public function countDeceByDepartement($id){

            return  DB::table("personnes")
            ->join("communes","personnes.commune_id","=","communes.id")
            ->where("communes.departement_id",$id)
             ->where("deces", "oui")
            ->count();


    }

     public function countDeceByArrondissement($id){
        return  DB::table("personnes")
        ->join("communes","personnes.commune_id","=","communes.id")

        ->where("communes.arrondissement_id",$id)
         ->where("deces", "oui")
        ->count();


    }
    public function countDeceByCommune($id){

        return  DB::table("personnes")
        ->where("commune_id",$id)
         ->where("deces", "oui")
        ->count();

    }

    public function getAllOnLy(){
        return DB::table("personnes")
        ->get();
    }



}
