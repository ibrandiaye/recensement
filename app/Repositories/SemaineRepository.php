<?php
/**
 * Created by PhpStorm.
 * User: ibra8
 * Date: 07/11/2019
 * Time: 09:42
 */

namespace App\Repositories;


use App\Models\Semaine;

class SemaineRepository extends RessourceRepository{

    public function __construct(Semaine $semaine){
        $this->model =$semaine;
    }
}
