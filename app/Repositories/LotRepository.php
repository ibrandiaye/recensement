<?php
namespace App\Repositories;

use App\Models\Lot;
use App\Repositories\RessourceRepository;
use Illuminate\Support\Facades\DB;

class LotRepository extends RessourceRepository{
    public function __construct(Lot $lot){
        $this->model = $lot;
    }

    public function getBiId($id)
    {
        return DB::table("lots")->where("id",$id)->first();
    }
    public function updateVerif($id,$etat)
    {
        return DB::table("lots")
        ->where("id",$id)
        ->update(["verification"=>$etat]);
    }
    public function updateretour($id,$etat)
    {
        return DB::table("lots")
        ->where("id",$id)
        ->update(["retour"=>$etat]);
    }
    public function updateValidation($id,$etat)
    {
        return DB::table("lots")
        ->where("id",$id)
        ->update(["validation"=>$etat]);
    }
    public function updateCommentaire($id,$commentaire)
    {
        return DB::table("lots")
        ->where("id",$id)
        ->update(["commentaire"=>$commentaire]);
    }


}
