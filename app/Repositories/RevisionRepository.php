<?php
namespace App\Repositories;

use App\Models\Revision;
use App\Repositories\RessourceRepository;
use Illuminate\Support\Facades\DB;

class RevisionRepository extends RessourceRepository{
    public function __construct(Revision $revision){
        $this->model = $revision;
    }

    public function getRevisionAsc(){
        return DB::table("revisions")
        ->orderBy("nom","asc")
        ->get();

    }
    public function deleteAll(){
        return DB::table("revisions")
        ->delete();
       }

   public function getByDepartement($departement)
   {
        return DB::table("revisions")->where("departement_id",$departement)->get();
   }
   public function getByCommune($commune)
   {
        return DB::table("revisions")->where("commune_id",$commune)->get();
   }
   public function countByDepartement($departement)
   {
        return DB::table("revisions")->where("departement_id",$departement)->count();
   }
   public function countBycommune($commune)
   {
        return DB::table("revisions")->where("commune_id",$commune)->count();
   }

   public function countAll()
   {
        return DB::table("revisions")->count();
   }

   public function getByParametre($nom,$prenom,$nin)
   {
        return DB::table("revisions")
        ->where("nom", $nom)
        ->where("prenom", $prenom)
        ->where("numcni", $nin)
        ->first();
   }
    public function getByNinAndNom($nom,$nin)
   {
        return DB::table("revisions")
        ->where("nom", $nom)
        ->where("numcni", $nin)
        ->first();
   }
    public function getByNinAndPrenom($prenom,$nin)
   {
        return DB::table("revisions")
        ->where("prenom", $prenom)
        ->where("numcni", $nin)
        ->first();
   }

}
