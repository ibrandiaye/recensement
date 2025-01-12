{{-- \resources\views\permissions\create.blade.php --}}
@extends('welcome')

@section('title', '| Modifier Utilisateur')

@section('content')
<div class="row">

    <div class="col-12">
        <div class="page-title-box">
            <div class="page-title-right">
                <ol class="breadcrumb m-0">
                    <li class="breadcrumb-item"><a href="javascript: void(0);">Tableau de bord</a></li>
                    <li class="breadcrumb-item active"><a href="javascript: void(0);">Region </a></li>
                </ol>
            </div>
            <h4 class="page-title">Enregistrer un Region</h4>
        </div>
    </div>
</div>
<div class="row">
    <div class="col-12">

        <form action="{{ route('user.password.update') }}" method="POST">
            @csrf
            <div class="card ">
                <div class="card-header text-center">FORMULAIRE DE MODIFICATION Utilisateur</div>
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
                    <div class="row">
                        <div class="col-md-6">
                            <div class="form-group">
                                <label for="field-3" class="control-label">Mot de passe</label>
                                <input type="password" class="form-control" id="field-3" placeholder="Mot de passe"  name="password">
                            </div>
                        </div>
                    
                    
                        <div class="col-md-6">
                            <div class="form-group no-margin">
                                <label for="field-7" class="control-label">Repetez Mot de passe</label>
                                <input type="password" name="password_confirmation" class="form-control" id="field-5" placeholder="Confirmer mot de passe">                                                        </div>
                        </div>
                    </div>
                    

                    <div>
                        <center>
                            <button type="submit" class="btn btn-success btn btn-lg "> MODIFIER</button>
                        </center>
                    </div>


                </div>
            </div>
        </form>
    </div>
</div>

@endsection
