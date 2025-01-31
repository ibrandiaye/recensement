<?php

namespace App\Http\Controllers;

use App\Repositories\LotRepository;
use App\Repositories\PointageRepository;
use Illuminate\Http\Request;

class PointageController extends Controller
{
    protected $pointageRepository;
    protected $lotRepository;

    public function __construct(PointageRepository $pointageRepository, LotRepository $lotRepository){
        $this->pointageRepository =$pointageRepository;
        $this->lotRepository = $lotRepository;
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $pointages = $this->pointageRepository->getAll();
        return view('pointage.index',compact('pointages'));
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        $lots = $this->lotRepository->getAll();
        return view('pointage.add',compact('lots'));
    }

    public function create_lot($lot)
    {
        $oneLot = $this->lotRepository->getBiId($lot);
        $nbPointage = $this->pointageRepository->countByLot($lot);
        return view('pointage.lot_add',compact('lot','oneLot','nbPointage'));
    }
    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $rawBarcode = $request->input('barcode');

        // Correction des caractères
        $correctedBarcode = strtr($rawBarcode, [
            '&' => '1',
            'é' => '2',
            '"' => '3',
            "'" => '4',
            '(' => '5',
            '-' => '6',
            'è' => '7',
            '_' => '8',
            'ç' => '9',
            'à' => '0',
        ]);
        $request->merge(["numero"=>$correctedBarcode]);
        $pointages = $this->pointageRepository->store($request->all());
        return redirect('pointage/create/'.$request->lot_id)->with("success","Enregistrement avec succées");

    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $pointage = $this->pointageRepository->getById($id);
        return view('pointage.show',compact('pointage'));
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        $lots = $this->lotRepository->getAll();
        $pointage = $this->pointageRepository->getById($id);
        return view('pointage.edit',compact('pointage','lots'));
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
        $this->pointageRepository->update($id, $request->all());
        return redirect('pointage');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $this->pointageRepository->destroy($id);
        return redirect('pointage');
    }
    public function    byLot($lot){
        $pointages = $this->pointageRepository->getByLot($lot);
        return response()->json($pointages);
    }

}
