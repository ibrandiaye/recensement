<?php

namespace App\Http\Controllers;

use App\Repositories\CommuneRepository;
use App\Repositories\DepartementRepository;
use App\Repositories\IdentificationRepository;
use App\Repositories\RadiationRepository;
use App\Repositories\RegionRepository;
use Illuminate\Http\Request;
use SimpleSoftwareIO\QrCode\Facades\QrCode;

class RadiationController extends Controller
{
    protected $radiationRepository;
    protected $departementRepository;
    protected $communeRepository;
    protected $regionRepository;


    protected $identificationRepository;

    public function __construct(RadiationRepository $radiationRepository,RegionRepository $regionRepository,
   CommuneRepository $communeRepository,DepartementRepository $departementRepository,
   IdentificationRepository $identificationRepository){
        $this->radiationRepository =$radiationRepository;
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
        $radiations = $this->radiationRepository->getWithIndentification();
        return view('radiation.index',compact('radiations'));
    }

    public function allRadiationApi(){
        $radiations = $this->radiationRepository->getAll();
        return response()->json($radiations);
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
        return view('radiation.add',compact('regions'));
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
        $radiations = $this->radiationRepository->store($request->all());
        return redirect('radiation/'.$radiations->id);

    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
      //  $radiation = $this->radiationRepository->getById($id);
      $radiation = $this->radiationRepository->getByIdWithRelation($id);
      //dd($radiation->identification_id);
      $identification = $this->identificationRepository->getByIdWithRelation($radiation->identification_id);
      //dd($identification);
    //  $qrcode = QrCode::size(50)->generate(config('app.url')."/radiation/".$radiation->id);
    $qrcode = QrCode::size(50)->generate('https://drive.google.com/file/d/1QtgnjemtuAseHvmHJbReCRiFRbPOUWXe/view');

        return view('radiation.show',compact('radiation','identification','qrcode'));
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        $radiation = $this->radiationRepository->getById($id);
        return view('radiation.edit',compact('radiation'));
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
        $this->radiationRepository->update($id, $request->all());
        return redirect('radiation');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $this->radiationRepository->destroy($id);
        return redirect('radiation');
    }
}
