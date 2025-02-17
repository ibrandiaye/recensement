<?php

namespace App\Http\Controllers;

use App\Repositories\ArrondissementRepository;
use App\Repositories\CommuneRepository;
use App\Repositories\DepartementRepository;
use App\Repositories\IdentificationRepository;
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


    protected $identificationRepository;

    public function __construct(RenseignementRepository $renseignementRepository,ArrondissementRepository $arrondissementRepository,
    SemaineRepository $semaineRepository,CommuneRepository $communeRepository,DepartementRepository $departementRepository,
   IdentificationRepository $identificationRepository){
        $this->renseignementRepository =$renseignementRepository;
        $this->semaineRepository =$semaineRepository;
        $this->communeRepository = $communeRepository;
        $this->departementRepository = $departementRepository;
        $this->identificationRepository = $identificationRepository;
        $this->arrondissementRepository = $arrondissementRepository;

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
       return view('renseigne.index',compact('communes'));

    }
}
