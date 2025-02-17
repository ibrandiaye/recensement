@extends('welcome')
@section('title', '| renseigne')


@section('content')
<div class="row">

    <div class="col-12">
        <div class="page-title-box">
            <div class="page-title-right">
                <ol class="breadcrumb m-0">
                    <li class="breadcrumb-item"><a href="javascript: void(0);">Tableau de bord</a></li>
                    <li class="breadcrumb-item active"><a href="javascript: void(0);">Departement </a></li>
                </ol>
            </div>
            <h4 class="page-title">Liste Renseigne</h4>
        </div>
    </div>
</div>
<div class="row">
    <div class="col-12">
        @if ($message = Session::get('success'))
            <div class="alert alert-success">
                <p>{{ $message }}</p>
            </div>
        @endif
        @if ($message = Session::get('error'))
            <div class="alert alert-danger">
                <p>{{ $message }}</p>
            </div>
        @endif
        @php
         $user = Auth::user();
        @endphp

        <div class="card ">
            <div class="card-header">LISTE D'ENREGISTREMENT DES Renseignes</div>
            <div class="card-body">
              
                <table id="datatable-buttons" class="table table-striped table-bordered dt-responsive nowrap" style="border-collapse: collapse; border-spacing: 0; width: 100%;">
                    <thead>
                        <tr>
                            <th>Region </th>
                            <th>Departement </th>
                            <th>Arrondissement</th>
                            <th>commune</th>
                            <th>Etant</th>
                        </tr>
                    </thead>
                    <tbody>
                    @foreach ($communes as $renseigne)
                        <tr>
                            <td>{{ $renseigne->region }}</td>
                            <td>{{ $renseigne->departement }}</td>
                            <td>{{ $renseigne->arrondissement }}</td>
                            <td>{{ $renseigne->nom }}</td>

                            <td>
                                @if ($renseigne->renseigne)
                                
                                  <span class=" alert-success">Renseigner</span>
                                @else
                                <span class=" alert-danger">Non Renseigner</span>
                                @endif

                            

                            </td>

                        </tr>
                        @endforeach

                    </tbody>
                </table>



            </div>

        </div>
    </div>
</div>


@endsection
