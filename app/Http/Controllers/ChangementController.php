<?php

namespace App\Http\Controllers;

use App\Repositories\CentrevoteRepository;
use App\Repositories\ChangementRepository;
use App\Repositories\CommuneRepository;
use App\Repositories\DepartementRepository;
use App\Repositories\IdentificationRepository;
use App\Repositories\RegionRepository;
use Illuminate\Http\Request;
use SimpleSoftwareIO\QrCode\Facades\QrCode;

class ChangementController extends Controller
{
    protected $changementRepository;
    protected $departementRepository;
    protected $communeRepository;
    protected $regionRepository;


    protected $identificationRepository;

    public function __construct(ChangementRepository $changementRepository,RegionRepository $regionRepository,
   CommuneRepository $communeRepository,DepartementRepository $departementRepository,
   IdentificationRepository $identificationRepository){
        $this->changementRepository =$changementRepository;
        $this->communeRepository = $communeRepository;
        $this->departementRepository = $departementRepository;
        $this->identificationRepository = $identificationRepository;
        $this->regionRepository = $regionRepository;

    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $changements = $this->changementRepository->getWithIndentification();
        return view('changement.index',compact('changements'));
    }

    public function allChangementApi(){
        $changements = $this->changementRepository->getAll();
        return response()->json($changements);
    }
    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
       
      //  $communes = $this->communeRepository->getAllOnLy();
        $regions = $this->regionRepository->getAll();
        return view('changement.add',compact('regions'));
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
        $changements = $this->changementRepository->store($request->all());
        return redirect('changement/'.$changements->id);

    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
      //  $changement = $this->changementRepository->getById($id);
      $changement = $this->changementRepository->getByIdWithRelation($id);
      //dd($changement->identification_id);
      $identification = $this->identificationRepository->getByIdWithRelation($changement->identification_id);
      //dd($identification);
    //  $qrcode = QrCode::size(50)->generate(config('app.url')."/changement/".$changement->id);
    $qrcode = QrCode::size(50)->generate('https://drive.google.com/file/d/1QtgnjemtuAseHvmHJbReCRiFRbPOUWXe/view');

        return view('changement.show',compact('changement','identification','qrcode'));
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        $changement = $this->changementRepository->getById($id);
        return view('changement.edit',compact('changement'));
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
        $this->changementRepository->update($id, $request->all());
        return redirect('changement');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $this->changementRepository->destroy($id);
        return redirect('changement');
    }
}
