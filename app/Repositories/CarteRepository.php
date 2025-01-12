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

}
