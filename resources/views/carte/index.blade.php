@extends('welcome')
@section('title', '| carte')


@section('content')
<div class="row">
    <div class="col-sm-12">
        <div class="page-title-box">
            <div class="btn-group float-right">

                                <ol class="breadcrumb hide-phone p-0 m-0">
                                <li class="breadcrumb-item"><a href="{{ route('home') }}" >ACCUEIL</a></li>

                                </ol>
                            </div>

                        </div>
                    </div>
                    <div class="clearfix"></div>
                </div>

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

<div class="col-12">
    <div class="card ">
        <div class="card-header">DEMANDE D'ENREGISTREMENT DES CARTE</div>
            <div class="card-body">

                <table id="example1" class="table table-bordered table-responsive-md table-striped text-center">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Prenom </th>
                            <th>Nom</th>
                            <th>Sexe</th>
                            <th>Date Naiss </th>
                            <th>NIN </th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                    @foreach ($cartes as $carte)
                        <tr>
                            <td>{{ $carte->id }}</td>
                            <td>{{ $carte->prenom }}</td>
                            <td>{{ $carte->nom}}</td>
                            <td>{{ $carte->sexe }}</td>
                            <td>{{ $carte->date_naiss }} à  {{$carte->lieu_naiss}}</td>
                            <td>{{ $carte->nin}}</td>
                            <td>
                                <a href="{{ route('carte.edit', $carte->id) }}" role="button" class="btn btn-primary"><i class="fa fa-edit"></i></a>
                                {!! Form::open(['method' => 'DELETE', 'route'=>['carte.destroy', $carte->id], 'style'=> 'display:inline', 'onclick'=>"if(!confirm('Êtes-vous sûr de vouloir supprimer cet enregistrement ?')) { return false; }"]) !!}
                                <button class="btn btn-danger"><i class="fa fa-trash"></i></button>
                                {!! Form::close() !!}

                            </td>

                        </tr>
                        @endforeach

                    </tbody>
                </table>

            </div>
    </div>
</div>

@endsection
