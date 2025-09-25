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
                    <li class="breadcrumb-item active"><a href="javascript: void(0);">Personne </a></li>
                </ol>
            </div>
            <h4 class="page-title">Enregistrer une Rejêt</h4>
        </div>
    </div>
</div>
<div class="row">
    <div class="col-12">
        {!! Form::model($personne, ['method'=>'PATCH','route'=>['personne.update', $personne->id],'enctype'=>'multipart/form-data']) !!}
            @csrf
             <div class="card ">
                        <div class="card-header text-center">FORMULAIRE DE MODIFICATION D'UNE Rejêt</div>
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

                                <div class="row">
                                    <div class="col-lg-6">
                                        <label>Nom Commune</label>
                                        <select class="form-control" name="commune_id" required="">
                                           <option value="">Selectionnez</option>
                                            @foreach ($communes as $commune)
                                            <option value="{{$commune->id}}" {{$personne->commune_id==$commune->id ? 'selected' : ''}}>{{$commune->nom}}</option>
                                                @endforeach

                                        </select>
                                    </div>

                                    <div class="col-lg-6">
                                        <div class="form-group">
                                            <label>Prénom</label>
                                            <input type="text" name="prenom"  value="{{ $personne->prenom }}" class="form-control"  required>
                                        </div>
                                    </div>
                                     <div class="col-lg-6">
                                        <div class="form-group">
                                            <label>Nom</label>
                                            <input type="text" name="nom"  value="{{ $personne->nom }}" class="form-control"  required>
                                        </div>
                                    </div>
                                    <div class="col-lg-6">
                                        <div class="form-group">
                                            <label>Date de Naissance</label>
                                            <input type="date" name="datenaiss"  value="{{ $personne->datenaiss }}" class="form-control"  >
                                        </div>
                                    </div>
                                     <div class="col-lg-6">
                                        <div class="form-group">
                                            <label> N° CNI </label>
                                            <input type="text" name="cni"  value="{{ $personne->cni }}" class="form-control"  required>
                                        </div>
                                    </div>
                                    <div class="col-lg-6">
                                        <div class="form-group">
                                            <label>Motif de rejet</label>
                                            <textarea class="form-control" name="commentaire" required> {{ $personne->commentaire}} </textarea>
                                        </div>
                                    </div>

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
