<?php

namespace App\Http\Controllers;

use App\Repositories\CommuneRepository;
use App\Repositories\ComptageRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ComptageController extends Controller
{
    protected $comptageRepository;
    protected $communeRepository;

    public function __construct(ComptageRepository $comptageRepository, CommuneRepository $communeRepository){
        $this->comptageRepository =$comptageRepository;
        $this->communeRepository = $communeRepository;
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $comptages = $this->comptageRepository->get();
        return view('comptage.index',compact('comptages'));
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        $communes = $this->communeRepository->getByArrondissement(Auth::user()->arrondissement_id);
      //  dd(Auth::user()->arrondissement_id);
        return view('comptage.add',compact('communes'));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $comptages = $this->comptageRepository->store($request->all());
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
        $communes = $this->communeRepository->getByArrondissement(Auth::user()->arrondissement_id);
        $comptage = $this->comptageRepository->getById($id);
        return view('comptage.edit',compact('comptage','communes'));
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
        $this->comptageRepository->destroy($id);
        return redirect('comptage');
    }
    public function    byCommune($commune){
        $comptages = $this->comptageRepository->getByCommune($commune);
        return response()->json($comptages);
    }
}
