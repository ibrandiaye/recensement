@extends('welcome')
@section('title', '| comptage')


@section('content')
<div class="row">

    <div class="col-12">
        <div class="page-title-box">
            <div class="page-title-right">
                <ol class="breadcrumb m-0">
                    <li class="breadcrumb-item"><a href="javascript: void(0);">Tableau de bord</a></li>
                    <li class="breadcrumb-item active"><a href="javascript: void(0);">Comptage </a></li>
                </ol>
            </div>
            <h4 class="page-title">Enregistrer un Comptage</h4>
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

    <div class="card ">
        <div class="card-header  text-center">LISTE D'ENREGISTREMENT DES Comptages</div>
            <div class="card-body">
              
                <table id="datatable-buttons" class="table table-striped table-bordered dt-responsive nowrap" style="border-collapse: collapse; border-spacing: 0; width: 100%;">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Commune</th>
                            <th>Periode</th>
                            <th>Inscription</th>
                            <th>Modification</th>
                            <th>Changement</th>
                            <th>Radiation</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                    @foreach ($comptages as $comptage)
                        <tr>
                            <td>{{ $comptage->id }}</td>
                            <td>{{ $comptage->nom }}</td>
                            <td> De {{ $comptage->debut }} à {{$comptage->fin}}</td>
                            <td>{{ $comptage->inscription }}</td>
                            <td>{{ $comptage->modification }}</td>
                            <td>{{ $comptage->changement }}</td>
                            <td>{{ $comptage->radiation }}</td>
                            <td>
                                <a href="{{ route('comptage.edit', $comptage->id) }}" role="button" class="btn btn-primary"><i class="fas fa-edit"></i></a>
                                {!! Form::open(['method' => 'DELETE', 'route'=>['comptage.destroy', $comptage->id], 'style'=> 'display:inline', 'onclick'=>"if(!confirm('Êtes-vous sûr de vouloir supprimer cet enregistrement ?')) { return false; }"]) !!}
                                <button class="btn btn-danger"><i class="far fa-trash-alt"></i></button>
                                {!! Form::close() !!}


                                <a href="{{ route('comptage.show', $comptage->id) }}" role="button" class="btn btn-warning"><i toolip="B" class="fas fa-file"></i></a>

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
