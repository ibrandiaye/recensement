<?php

namespace App\Http\Controllers;

use App\Repositories\CommuneRepository;
use App\Repositories\LotRepository;
use Illuminate\Http\Request;

class LotController extends Controller
{
    protected $lotRepository;
    protected $communeRepository;

    public function __construct(LotRepository $lotRepository, CommuneRepository $communeRepository){
        $this->lotRepository =$lotRepository;
        $this->communeRepository = $communeRepository;
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $lots = $this->lotRepository->getAllWithCommune();
        return view('lot.index',compact('lots'));
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        $communes = $this->communeRepository->getAll();
        return view('lot.add',compact('communes'));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $lots = $this->lotRepository->store($request->all());
        return redirect('lot');

    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $lot = $this->lotRepository->getById($id);
        return view('lot.show',compact('lot'));
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        $communes = $this->communeRepository->getAll();
        $lot = $this->lotRepository->getById($id);
        return view('lot.edit',compact('lot','communes'));
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
        $this->lotRepository->update($id, $request->all());
        return redirect('lot');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $this->lotRepository->destroy($id);
        return redirect('lot');
    }
    public function    byCommune($commune){
        $lots = $this->lotRepository->getByCommune($commune);
        return response()->json($lots);
    }

}
