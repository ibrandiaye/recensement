{{-- \resources\views\permissions\create.blade.php --}}
@extends('welcome')

@section('title', '| Modifier Région')

@section('content')

<div class="row">

    <div class="col-12">
        <div class="page-title-box">
            <div class="page-title-right">
                <ol class="breadcrumb m-0">
                    <li class="breadcrumb-item"><a href="javascript: void(0);">Tableau de bord</a></li>
                    <li class="breadcrumb-item active"><a href="javascript: void(0);">Arrondissement </a></li>
                </ol>
            </div>
            <h4 class="page-title">MODIFICATION D'UN ARRONDISSEMENT</h4>
        </div>
    </div>
</div>
<div class="row">
    <div class="col-12">
        {!! Form::model($arrondissement, ['method'=>'PATCH','route'=>['arrondissement.update', $arrondissement->id],'enctype'=>'multipart/form-data']) !!}
            @csrf
             <div class="card">
                        <div class="card-header text-center">FORMULAIRE DE MODIFICATION D'une Arrondissement</div>
                            <div class="card-body">
                                @if ($errors->any())
                                    <div class="alert alert-danger">
                                        <ul>
                                            @foreach ($errors->all() as $error)
                                                <li>{{ $error }}</li>
                                            @endforeach
                                        </ul>
                                    </div>
                                @endif

                                <div class="col-lg-6">
                                    <div class="form-group">
                                        <label>Nom</label>
                                    <input type="text" name="nom" class="form-control" value="{{$arrondissement->nom}}"   required>
                                    </div>

                                </div>
                               
                                <div class="col-lg-6">
                                    <label>Département</label>
                                    <select class="form-control" name="departement_id" required="">
                                        @foreach ($departements as $departement)
                                        <option {{old('departement_id', $arrondissement->departement_id) == $departement->id ? 'selected' : ''}}
                                            value="{{$departement->id}}">{{$departement->nom}}</option>
                                            @endforeach

                                    </select>
                                </div>

                                <div>
                                    <center>
                                        <button type="submit" class="btn btn-success btn btn-lg "> MODIFIER</button>
                                    </center>
                                </div>


                            </div>
                        </div>
    {!! Form::close() !!}
    </div>
</div>



@endsection
