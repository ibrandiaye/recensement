<?php

namespace App\Http\Controllers;

use App\Repositories\CentrevoteRepository;
use App\Repositories\CommuneRepository;
use App\Repositories\DepartementRepository;
use App\Repositories\IdentificationRepository;
use App\Repositories\ModificationRepository;
use App\Repositories\RegionRepository;
use Illuminate\Http\Request;
use SimpleSoftwareIO\QrCode\Facades\QrCode;

class ModificationController extends Controller
{
    protected $modificationRepository;
    protected $centrevoteRepository;
    protected $departementRepository;
    protected $communeRepository;
    protected $regionRepository;


    protected $identificationRepository;

    public function __construct(ModificationRepository $modificationRepository,RegionRepository $regionRepository,
    CentrevoteRepository $centrevoteRepository,CommuneRepository $communeRepository,DepartementRepository $departementRepository,
   IdentificationRepository $identificationRepository){
        $this->modificationRepository =$modificationRepository;
        $this->centrevoteRepository =$centrevoteRepository;
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
        $modifications = $this->modificationRepository->getWithIndentification();
        return view('modification.index',compact('modifications'));
    }

    public function allModificationApi(){
        $modifications = $this->modificationRepository->getAll();
        return response()->json($modifications);
    }
    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        $centrevotes = $this->centrevoteRepository->getAll();
      //  $communes = $this->communeRepository->getAllOnLy();
        $regions = $this->regionRepository->getAll();
        return view('modification.add',compact('centrevotes','regions'));
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
        $modifications = $this->modificationRepository->store($request->all());
        return redirect('modification/'.$modifications->id);

    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
      //  $modification = $this->modificationRepository->getById($id);
      $modification = $this->modificationRepository->getByIdWithRelation($id);
      //dd($modification->identification_id);
      $identification = $this->identificationRepository->getByIdWithRelation($modification->identification_id);
      //dd($identification);
    //  $qrcode = QrCode::size(50)->generate(config('app.url')."/modification/".$modification->id);
    $qrcode = QrCode::size(50)->generate('https://drive.google.com/file/d/1QtgnjemtuAseHvmHJbReCRiFRbPOUWXe/view');

        return view('modification.show',compact('modification','identification','qrcode'));
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        $centrevotes = $this->centrevoteRepository->getAll();
        $modification = $this->modificationRepository->getById($id);
        return view('modification.edit',compact('modification','centrevotes'));
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
        $this->modificationRepository->update($id, $request->all());
        return redirect('modification');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $this->modificationRepository->destroy($id);
        return redirect('modification');
    }
}
