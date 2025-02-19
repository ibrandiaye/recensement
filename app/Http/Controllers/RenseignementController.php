<?php

namespace App\Http\Controllers;

use App\Repositories\ArrondissementRepository;
use App\Repositories\CommuneRepository;
use App\Repositories\DepartementRepository;
use App\Repositories\IdentificationRepository;
use App\Repositories\RegionRepository;
use App\Repositories\RenseignementRepository;
use App\Repositories\SemaineRepository;
use Illuminate\Http\Request;

class RenseignementController extends Controller
{
    protected $renseignementRepository;
    protected $semaineRepository;
    protected $departementRepository;
    protected $communeRepository;
    protected $arrondissementRepository;

    protected $regionRepository;
    protected $identificationRepository;

    public function __construct(RenseignementRepository $renseignementRepository,ArrondissementRepository $arrondissementRepository,
    SemaineRepository $semaineRepository,CommuneRepository $communeRepository,DepartementRepository $departementRepository,
   IdentificationRepository $identificationRepository,RegionRepository $regionRepository){
        $this->renseignementRepository =$renseignementRepository;
        $this->semaineRepository =$semaineRepository;
        $this->communeRepository = $communeRepository;
        $this->departementRepository = $departementRepository;
        $this->identificationRepository = $identificationRepository;
        $this->arrondissementRepository = $arrondissementRepository;
        $this->regionRepository = $regionRepository;

    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $renseignements = $this->renseignementRepository->getWithIndentification();
        return view('renseignement.index',compact('renseignements'));
    }

    public function allRenseignementApi(){
        $renseignements = $this->renseignementRepository->getAll();
        return response()->json($renseignements);
    }
    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        $semaines = $this->semaineRepository->getAll();
      //  $communes = $this->communeRepository->getAllOnLy();
        $arrondissements = $this->arrondissementRepository->getAll();
        return view('renseignement.add',compact('semaines','arrondissements'));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $identification = $this->identificationRepository->store($request->all());
        $request->merge(["identification_id"=>$identification->id]);
        $renseignements = $this->renseignementRepository->store($request->all());
        return redirect('renseignement/'.$renseignements->id);

    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $renseignement = $this->renseignementRepository->getById($id);
      

        return view('renseignement.show',compact('renseigneme'));
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        $semaines = $this->semaineRepository->getAll();
        $renseignement = $this->renseignementRepository->getById($id);
        return view('renseignement.edit',compact('renseignement','semaines'));
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $this->renseignementRepository->update($id, $request->all());
        return redirect('renseignement');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $this->renseignementRepository->destroy($id);
        return redirect('renseignement');
    }

    public function communeRenseigne($semaine)
    {
        $region_id = null;
        $departement_id = null;
        $arrondissement_id = null;
        $commune_id = null;
        $regions = $this->regionRepository->getAllOnly();
        $departements =$this->departementRepository->getAllOnly();
        $arrondissements =$this->arrondissementRepository->getAllOnLy();
        $communes =[];
        $communes = $this->communeRepository->getWithRelation();
        $semaines = $this->renseignementRepository->getBySemaine($semaine);
        foreach ($communes as $key => $value) {
            $communes[$key]->renseigne = false;
            foreach ($semaines as $key1 => $semaine) {
                if($semaine->commune_id==$value->id)
                {
                    $communes[$key]->renseigne = true;
                }
            }
        }

       // dd($communes);
       return view('renseigne.index',compact('communes',"regions",
       "departements","arrondissements","region_id","departement_id","arrondissement_id","commune_id",'semaine'));

    }

    public function seaerchCommuneRenseigne(Request $request)
    {
        $region_id = $request->region_id;
        $departement_id = $request->departement_id;
        $arrondissement_id = $request->arrondissement_id;
        $commune_id = $request->commune_id;
        $regions = $this->regionRepository->getAllOnly();
        $departements =$this->departementRepository->getAllOnly();
        $arrondissements =$this->arrondissementRepository->getAllOnLy();
        $communes =[];

        $semaines = $this->renseignementRepository->getBySemaine($request->semaine);
        if($request->commune_id)
        {
            $communes = $this->communeRepository->getWithRelationByCommune($request->commune_id);
        }
        else if($request->arrondissement_id)
        {
            $communes = $this->communeRepository->getWithRelationByArondissement($request->arrondissement_id);
        }
        else if($request->departement_id)
        {
            $communes = $this->communeRepository->getWithRelationByDepartement($request->departement_id);
        }    
        else if($request->region_id)
        {
            $communes = $this->communeRepository->getWithRelationByRegion($request->region_id);
        }
        
       
          
        foreach ($communes as $key => $value) {
            $communes[$key]->renseigne = false;
            foreach ($semaines as $key1 => $semaine) {
                if($semaine->commune_id==$value->id)
                {
                    $communes[$key]->renseigne = true;
                }
            }
        }

       // dd($communes);
       return view('renseigne.index',compact('communes',"regions",
       "departements","arrondissements","region_id","departement_id","arrondissement_id","commune_id"));

    }
}
