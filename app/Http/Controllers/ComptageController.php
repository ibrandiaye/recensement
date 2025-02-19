<?php

namespace App\Http\Controllers;

use App\Repositories\CommuneRepository;
use App\Repositories\ComptageRepository;
use App\Repositories\RegionRepository;
use App\Repositories\RenseignementRepository;
use App\Repositories\SemaineRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ComptageController extends Controller
{
    protected $comptageRepository;
    protected $communeRepository;
    protected $semaineRepository;
    protected $renseignementRepository;
    protected $regionRepository;

    public function __construct(ComptageRepository $comptageRepository, CommuneRepository $communeRepository,
    SemaineRepository $semaineRepository, RenseignementRepository $renseignementRepository,RegionRepository $regionRepository){
        $this->comptageRepository =$comptageRepository;
        $this->communeRepository = $communeRepository;
        $this->semaineRepository = $semaineRepository;
        $this->renseignementRepository = $renseignementRepository;
        $this->regionRepository = $regionRepository;
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $comptages = $this->comptageRepository->get();
       // dd($comptages);
        return view('comptage.index',compact('comptages'));
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        $user = Auth::user();
        $semaines = $this->semaineRepository->getAll();
        if($user->role=="correcteur" || $user->role=="admin" )
        {
            $regions = $this->regionRepository->getAllOnLy();
            //  dd(Auth::user()->arrondissement_id);
              return view('comptage.addc',compact('regions','semaines'));
        }
        else
        {
            $communes = $this->communeRepository->getByArrondissement($user->arrondissement_id);
            //  dd(Auth::user()->arrondissement_id);
              return view('comptage.add',compact('communes','semaines'));
        }
     
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $this->validate($request, [
            'semaine_id' => 'required',
            'commune_id' => 'required',
            'inscription' => 'required|int',
            'modification' => 'required|int',
            'changement' => 'required|int',
            'radiation' => 'required|int',
        ]);
        $comptage = $this->comptageRepository->getOneBySemaineAndCommune($request->semaine_id,$request->commune_id);
       // dd($comptage);
        if($comptage)
        {
            return redirect()->back()->withErrors('Vous avez déja saisi la commune pour cette semaine ')->withInput();
        }
        $user = Auth::user();
        $comptages = $this->comptageRepository->store($request->all());
        if($user->role!="correcteur")
            $request->merge(["arrondissement_id"=>$user->arrondissement_id,"departement_id"=>$user->departement_id]);

        $this->renseignementRepository->store($request->all());
        return redirect('comptage');

    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $comptage = $this->comptageRepository->getById($id);
        $user = Auth::user();
        return view('comptage.bordereau',compact('comptage','user'));
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        $user = Auth::user();
        if($user->role=="prefet" || $user->role=="sous_prefet")
        {
            $communes = $this->communeRepository->getByArrondissement(Auth::user()->arrondissement_id);

        }
        else
        {
            $communes =$this->communeRepository->getAllOnLy();
        }
        $comptage = $this->comptageRepository->getById($id);
        $semaines = $this->semaineRepository->getAll();
        return view('comptage.edit',compact('comptage','communes','semaines'));
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
        $this->comptageRepository->update($id, $request->all());
        return redirect('comptage');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $comptage = $this->comptageRepository->getOne($id);
        $this->renseignementRepository->deleteBySemaineAndComptage($comptage->semaine_id,$comptage->commune_id);
        $this->comptageRepository->destroy($id);
        return redirect('comptage');
    }
    public function    byCommune($commune){
        $comptages = $this->comptageRepository->getByCommune($commune);
        return response()->json($comptages);
    }
}
