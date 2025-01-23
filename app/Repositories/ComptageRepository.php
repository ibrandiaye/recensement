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
        if($user->role=="admin")
        {
            return DB::table("comptages")
            ->join("communes","comptages.commune_id","=","communes.id")
            ->select("communes.nom","comptages.*")
            ->get();
        }
        else
        {
            return DB::table("comptages")
            ->join("communes","comptages.commune_id","=","communes.id")
            ->select("communes.nom","comptages.*")
            ->where("communes.arrondissement_id",$user->arrondissement_id)
            ->get();
        }
    }
    public function nbGroupByInscription(){
        $user = Auth::user();
        if($user->role=="admin")
        {
            return  DB::table("comptages")
            ->sum("inscription");
        }
        elseif ($user->role=="sous_prefet") {
            return  DB::table("comptages")
            ->join("communes","comptages.commune_id","=","communes.id")
            ->sum("comptages.inscription"); 
        }

    }
    public function nbGroupByChangement(){
        $user = Auth::user();
        if($user->role=="admin")
        {
            return  DB::table("comptages")
            ->sum("changement");
        }
        elseif ($user->role=="sous_prefet") {
            return  DB::table("comptages")
            ->join("communes","comptages.commune_id","=","communes.id")
            ->sum("comptages.changement"); 
        }

    }
    public function nbGroupByModification(){
        $user = Auth::user();
        if($user->role=="admin")
        {
            return  DB::table("comptages")
            ->sum("modification");
        }
        elseif ($user->role=="sous_prefet") {
            return  DB::table("comptages")
            ->join("communes","comptages.commune_id","=","communes.id")
            ->sum("comptages.modification"); 
        }

    }
    public function nbGroupRadiation(){
        $user = Auth::user();
        if($user->role=="admin")
        {
        return  DB::table("comptages")
        ->sum("radiation");
        }
        elseif ($user->role=="sous_prefet") {
            return  DB::table("comptages")
            ->join("communes","comptages.commune_id","=","communes.id")
            ->sum("comptages.radiation"); 
        }

    }

    public function getLastByCommune($commune)
    {
        return DB::table("comptages")->where("commune_id",$commune)->orderBy("id","desc")->limit(1);
    }

}
