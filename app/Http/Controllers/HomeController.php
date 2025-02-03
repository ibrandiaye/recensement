<?php

namespace App\Http\Controllers;

use App\Repositories\ArrondissementRepository;
use App\Repositories\CommuneRepository;
use App\Repositories\ComptageRepository;
use App\Repositories\DepartementRepository;
use App\Repositories\RegionRepository;
use App\Repositories\SemaineRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class HomeController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */

    protected $comptageRepository; 
    protected $regionRepository;
    protected $communeRepository;
    protected $departementRepository;
    protected $arrondissementRepository;
    protected $semaineRepository;

    public function __construct(ComptageRepository $comptageRepository,RegionRepository $regionRepository,CommuneRepository $communeRepository,
    DepartementRepository $departementRepository,ArrondissementRepository $arrondissementRepository,
    SemaineRepository $semaineRepository)
    {
        $this->middleware('auth');
        $this->comptageRepository = $comptageRepository;
        $this->regionRepository = $regionRepository;
        $this->communeRepository = $communeRepository;
        $this->departementRepository = $departementRepository;
        $this->arrondissementRepository= $arrondissementRepository;
        $this->semaineRepository  = $semaineRepository;
    }

    /**
     * Show the application dashboard.
     *
     * @return \Illuminate\Contracts\Support\Renderable
     */
    public function index()
    {
        $regions =[];
        $departements =[];
        $arrondissements =[];
        $communes =[];
        $user = Auth::user();
        $inscription = $this->comptageRepository->nbGroupByInscription();
        $modification = $this->comptageRepository->nbGroupByModification();

        $changement = $this->comptageRepository->nbGroupByChangement();

        $radiation = $this->comptageRepository->nbGroupRadiation();
        if($user->role=="admin")
        {
            $regions = $this->regionRepository->getAll();

        }
        else if($user->role=="gouverneur")
        {
            $departements = $this->departementRepository->getByRegion($user->region_id);
        }
        else if($user->role=="prefet")
        {
            $arrondissements = $this->arrondissementRepository->getByDepartement($user->departement_id);
        }
        else if($user->role=="sous_prefet")
        {
            $communes = $this->communeRepository->getByArrondissement($user->arrondissement_id);

        }
       

        return view('home',compact("inscription","modification","changement","radiation","regions",
    "departements","arrondissements","communes"));
    }

    public function statByCommune($commune)
    {
       $data = $this->comptageRepository->statByComune($commune);
        return response()->json($data);
    }

    public function byRegion($id)
    {
        $inscription = $this->comptageRepository->nbGroupByInscriptionByRegion($id);
        $modification = $this->comptageRepository->nbGroupByModificationByRegion($id);

        $changement = $this->comptageRepository->nbGroupByChangementByRegion($id);

        $radiation = $this->comptageRepository->nbGroupRadiationByRegion($id);
        $data = array('inscription'=>$inscription,'modification'=>$modification,'changement'=>$changement,'radiation'=>$radiation);
        return response()->json($data);

    }
    public function byDepartement($id)
    {
        $inscription = $this->comptageRepository->nbGroupByInscriptionByDeoartement($id);
        $modification = $this->comptageRepository->nbGroupByModificationByDepartement($id);

        $changement = $this->comptageRepository->nbGroupByChangementByDepartement($id);

        $radiation = $this->comptageRepository->nbGroupRadiationByDepartement($id);
        $data = array('inscription'=>$inscription,'modification'=>$modification,'changement'=>$changement,'radiation'=>$radiation);
        return response()->json($data);
       
    }
    public function byArrondissement($id)
    {
        $inscription = $this->comptageRepository->nbGroupByInscriptionByArrondissement($id);
        $modification = $this->comptageRepository->nbGroupByModificationByArrondissement($id);

        $changement = $this->comptageRepository->nbGroupByChangementByArrondissement($id);

        $radiation = $this->comptageRepository->nbGroupRadiationByArrondissement($id);
        $data = array('inscription'=>$inscription,'modification'=>$modification,'changement'=>$changement,'radiation'=>$radiation);
        return response()->json($data);
       
    }
    public function byCommune($id)
    {
        $inscription = $this->comptageRepository->nbGroupByInscriptionByCommune($id);
        $modification = $this->comptageRepository->nbGroupByModificationByCommune($id);

        $changement = $this->comptageRepository->nbGroupByChangementByCommune($id);

        $radiation = $this->comptageRepository->nbGroupRadiationByCommune($id);
        $data = array('inscription'=>$inscription,'modification'=>$modification,'changement'=>$changement,'radiation'=>$radiation);
        return response()->json($data);

       
    }

    public function messageByArrondissement($id,$date)
    {
        $communes = $this->communeRepository->getByArrondissement($id);
        $situationSemaine = $this->comptageRepository->situationActuelleByArrondissement($id,$date);
        $situationAncienne = $this->comptageRepository->situationAncieneByArrondissement($id,$date);
        $data=array();
        $index = 0;
        foreach ($communes as $key => $value) {
           $ligne = new \stdClass;
           $ligne->insant = 0;
           $ligne->inssem = 0;
           $ligne->cumulins = 0;

           $ligne->modant = 0;
           $ligne->modsem = 0;
           $ligne->cumulmod = 0;

           $ligne->chanant = 0;
           $ligne->chansem = 0;
           $ligne->cumulchan = 0;

           $ligne->radant = 0;
           $ligne->radsem = 0;
           $ligne->cumulrad = 0;

           $ligne->commune = $value->nom;

           foreach ($situationAncienne as $key => $situAnc) {
                if($situAnc->nom==$value->nom)
                {
                    $ligne->insant = $situAnc->inscription;
                    $ligne->modant = $situAnc->modification;
                    $ligne->chanant = $situAnc->changement;
                    $ligne->radant = $situAnc->radiation;
                    $ligne->cumulins =  $ligne->cumulins + $situAnc->inscription;
                    $ligne->cumulmod =  $ligne->cumulmod + $situAnc->modification;
                    $ligne->cumulchan =  $ligne->cumulchan + $situAnc->changement;
                    $ligne->cumulrad =  $ligne->cumulrad + $situAnc->radiation;


                }

            }
            foreach ($situationSemaine as $key => $situSem) {
                if($situSem->nom==$value->nom)
                {
                    $ligne->inssem = $situSem->inscription;
                    $ligne->modsem = $situSem->modification;
                    $ligne->chansem = $situSem->changement;
                    $ligne->radsem = $situSem->radiation;
                    $ligne->cumulins =  $ligne->cumulins + $situSem->inscription;
                    $ligne->cumulmod =  $ligne->cumulmod + $situSem->modification;
                    $ligne->cumulchan =  $ligne->cumulchan + $situSem->changement;
                    $ligne->cumulrad =  $ligne->cumulrad + $situSem->radiation;


                }

            }
            $data[]=$ligne;
        }
        //dd($data);
      //  return view("situation.par_arrondissement",compact("data"));
      $arrondissement = $this->arrondissementRepository->getOneArrondissementWithdepartementAndRegion($id);
      $semaine = $this->semaineRepository->getOneByDebut($date);

      return view("situation.impression_arrondissement",compact("data","arrondissement","semaine"));
      

    }

    public function messageByDepartement($id,$date)
    {
        $departement = $this->departementRepository->getOneWithRelation($id);
        $situationSemaine = $this->comptageRepository->situationActuelleByDepartement($id,$date);
        $situationAncienne = $this->comptageRepository->situationAncieneByDepartement($id,$date);
       $semaine = $this->semaineRepository->getOneByDebut($date);
        $data=array($situationSemaine,$situationAncienne);
        $index = 0;
     //  dd($situationSemaine,$situationSemaine,$departement);
        foreach ($departement->arrondissements as $keya => $arrondissement) {
            foreach ($arrondissement->communes as $keyc => $commune) {
                $ligne = new \stdClass;
                $ligne->insant = 0;
                $ligne->inssem = 0;
                $ligne->cumulins = 0;

                $ligne->modant = 0;
                $ligne->modsem = 0;
                $ligne->cumulmod = 0;

                $ligne->chanant = 0;
                $ligne->chansem = 0;
                $ligne->cumulchan = 0;

                $ligne->radant = 0;
                $ligne->radsem = 0;
                $ligne->cumulrad = 0;

                $ligne->commune = $commune->nom;

                foreach ($situationAncienne as $keysa => $situAnc) {
                    if($situAnc->nom==$commune->nom)
                    {
                        $ligne->insant = $situAnc->inscription;
                        $ligne->modant = $situAnc->modification;
                        $ligne->chanant = $situAnc->changement;
                        $ligne->radant = $situAnc->radiation;
                        $ligne->cumulins =  $ligne->cumulins + $situAnc->inscription;
                        $ligne->cumulmod =  $ligne->cumulmod + $situAnc->modification;
                        $ligne->cumulchan =  $ligne->cumulchan + $situAnc->changement;
                        $ligne->cumulrad =  $ligne->cumulrad + $situAnc->radiation;


                    }

                }
                foreach ($situationSemaine as $keyss => $situSem) {
                    if($situSem->nom==$commune->nom)
                    {
                        $ligne->inssem = $situSem->inscription;
                        $ligne->modsem = $situSem->modification;
                        $ligne->chansem = $situSem->changement;
                        $ligne->radsem = $situSem->radiation;
                        $ligne->cumulins =  $ligne->cumulins + $situSem->inscription;
                        $ligne->cumulmod =  $ligne->cumulmod + $situSem->modification;
                        $ligne->cumulchan =  $ligne->cumulchan + $situSem->changement;
                        $ligne->cumulrad =  $ligne->cumulrad + $situSem->radiation;


                    }

                }
               // $data[]=$ligne;
                $departement->arrondissements[$keya]->communes[$keyc]->data = $ligne;
            }
           
        }
        //dd($departement);
        return view("situation.impression_departement",compact("departement","semaine"));

    }
}
