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
                    <li class="breadcrumb-item active"><a href="javascript: void(0);">Pointage </a></li>
                </ol>
            </div>
            <h4 class="page-title">Modifier un Pointage</h4>
        </div>
    </div>
</div>
<div class="row">
    <div class="col-12">

        {!! Form::model($pointage, ['method'=>'PATCH','route'=>['pointage.update', $pointage->id]]) !!}
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
                            <input type="number" name="numero"  value="{{ $pointage->numero }}" class="form-control" min="1" required>
                        </div>
                    </div>
                 
            
                    <div class="col-lg-6">
                        <label>Lot</label>
                        <select class="form-control" name="lot_id" required="">
                            <option value="">Veuilez Selectionner</option>
                            @foreach ($lots as $lot)
                            <option {{old('lot_id', $pointage->lot_id) == $lot->id ? 'selected' : ''}}
                                value="{{$lot->id}}">{{$lot->nom}}</option>
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
