@extends('welcome')
@section('title', '| radiation')


@section('content')
<nav class="hk-breadcrumb" aria-label="breadcrumb">
    <ol class="breadcrumb breadcrumb-light bg-transparent">
        <li class="breadcrumb-item"><a href="#">radiation</a></li>
        <li class="breadcrumb-item active" aria-current="page">MODIFICATION D'UN radiation</li>
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
        <div class="card-header">LISTE D'ENREGISTREMENT DES radiations</div>
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
                    @foreach ($radiations as $radiation)
                        <tr>
                            <td>{{ $radiation->id }}</td>
                            <td>{{ $radiation->prenom }}</td>
                            <td>{{ $radiation->nom }}</td>
                            <td>{{ $radiation->cni }}</td>
                            <td>
                                {{-- <a href="{{ route('radiation.edit', $radiation->id) }}" role="button" class="btn btn-primary"><i class="fa fa-edit"></i></a> --}}
                                <a href="{{ route('radiation.show', $radiation->radiation) }}" role="button" class="btn btn-info"><i class="fa fa-file"></i></a>
{{--                                 {!! Form::open(['method' => 'DELETE', 'route'=>['radiation.destroy', $radiation->id], 'style'=> 'display:inline', 'onclick'=>"if(!confirm('Êtes-vous sûr de vouloir supprimer cet enregistrement ?')) { return false; }"]) !!}
                                <a class="btn btn-danger" href="{{ route('radiation.destroy', $radiation->id) }}" onclick="if(!confirm('Êtes-vous sûr de vouloir supprimer cet enregistrement ?')) { return false; }"]><i class="fa fa-trash"><i class="far fa-trash-alt"></i></button>
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
