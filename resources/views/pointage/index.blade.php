@extends('welcome')
@section('title', '| pointage')


@section('content')
<div class="row">

    <div class="col-12">
        <div class="page-title-box">
            <div class="page-title-right">
                <ol class="breadcrumb m-0">
                    <li class="breadcrumb-item"><a href="javascript: void(0);">Tableau de bord</a></li>
                    <li class="breadcrumb-item active"><a href="javascript: void(0);">Pointage </a></li>
                </ol>
            </div>
            <h4 class="page-title">Liste Pointage</h4>
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
            <div class="card-header">LISTE D'ENREGISTREMENT DES Départements</div>
            <div class="card-body">
              
                <table  id="datatable-buttons" class="table table-bordered table-responsive-md table-striped text-center datatable-buttons">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Numéro</th>
                            <th>lot</th>
                            <th>Commune</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                    @foreach ($pointages as $pointage)
                        <tr>
                            <td>{{ $pointage->id }}</td>
                            <td>{{ $pointage->numero }}</td>
                            <td>{{ $pointage->lot->numero }}</td>
                            <td>{{ $pointage->lot->commune->nom }}</td>
                            <td>
                                <a href="{{ route('pointage.edit', $pointage->id) }}" role="button" class="btn btn-primary"><i class="fas fa-edit"></i></a>
                                {!! Form::open(['method' => 'DELETE', 'route'=>['pointage.destroy', $pointage->id], 'style'=> 'display:inline', 'onclick'=>"if(!confirm('Êtes-vous sûr de vouloir supprimer cet enregistrement ?')) { return false; }"]) !!}
                                <button class="btn btn-danger"><i class="far fa-trash-alt"></i></button>
                                {!! Form::close() !!}



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
