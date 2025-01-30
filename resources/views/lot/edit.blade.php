{{-- \resources\views\permissions\create.blade.php --}}
@extends('welcome')

@section('title', '| Modifier Département')

@section('content')
<div class="row">

    <div class="col-12">
        <div class="page-title-box">
            <div class="page-title-right">
                <ol class="breadcrumb m-0">
                    <li class="breadcrumb-item"><a href="javascript: void(0);">Tableau de bord</a></li>
                    <li class="breadcrumb-item active"><a href="javascript: void(0);">Lot </a></li>
                </ol>
            </div>
            <h4 class="page-title">Modifier un Lot</h4>
        </div>
    </div>
</div>
<div class="row">
    <div class="col-12">

        {!! Form::model($lot, ['method'=>'PATCH','route'=>['lot.update', $lot->id]]) !!}
            @csrf
             <div class="card ">
                <div class="card-header text-center">FORMULAIRE DE MODIFICATION Département</div>
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
                            <label>Numero</label>
                            <input type="number" name="numero"  value="{{ $lot->numero }}" class="form-control" min="1" required>
                        </div>
                    </div>
                    <div class="col-lg-6">
                        <div class="form-group">
                            <label>Nombre</label>
                            <input type="number" name="nombre"  value="{{ $lot->nombre }}" class="form-control" min="1" required>
                        </div>
                    </div>
            
                    <div class="col-lg-6">
                        <label>Commune</label>
                        <select class="form-control" name="commune_id" required="">
                            @foreach ($communes as $commune)
                            <option {{old('commune_id', $lot->commune_id) == $commune->id ? 'selected' : ''}}
                                value="{{$commune->id}}">{{$commune->nom}}</option>
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
