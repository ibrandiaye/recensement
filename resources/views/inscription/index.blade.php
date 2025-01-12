@extends('welcome')
@section('title', '| inscription')


@section('content')
<nav class="hk-breadcrumb" aria-label="breadcrumb">
    <ol class="breadcrumb breadcrumb-light bg-transparent">
        <li class="breadcrumb-item"><a href="#">inscription</a></li>
        <li class="breadcrumb-item active" aria-current="page">MODIFICATION D'UN inscription</li>
    </ol>
</nav>
<!-- /Breadcrumb -->

<!-- Container -->
<div class="container">
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
        <div class="card-header">LISTE D'ENREGISTREMENT DES inscriptions</div>
            <div class="card-body">

                <table id="example1" class="table table-bordered table-responsive-md table-striped text-center">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Prenom</th>
                            <th>Nom</th>
                            <th>CNI</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                    @foreach ($inscriptions as $inscription)
                        <tr>
                            <td>{{ $inscription->id }}</td>
                            <td>{{ $inscription->prenom }}</td>
                            <td>{{ $inscription->nom }}</td>
                            <td>{{ $inscription->cni }}</td>
                            <td>
                                {{-- <a href="{{ route('inscription.edit', $inscription->id) }}" role="button" class="btn btn-primary"><i class="fa fa-edit"></i></a> --}}
                                <a href="{{ route('inscription.show', $inscription->inscription) }}" role="button" class="btn btn-info"><i class="fa fa-file"></i></a>
{{--                                 {!! Form::open(['method' => 'DELETE', 'route'=>['inscription.destroy', $inscription->id], 'style'=> 'display:inline', 'onclick'=>"if(!confirm('Êtes-vous sûr de vouloir supprimer cet enregistrement ?')) { return false; }"]) !!}
                                <a class="btn btn-danger" href="{{ route('inscription.destroy', $inscription->id) }}" onclick="if(!confirm('Êtes-vous sûr de vouloir supprimer cet enregistrement ?')) { return false; }"]><i class="fa fa-trash"><i class="far fa-trash-alt"></i></button>
                                {{-- {!! Form::close() !!} --}}



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
