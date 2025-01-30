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

                <table id="example1" class="table table-bordered table-responsive table-striped text-center">
                    <thead>
                        <tr>
                            <th rowspan="2">Commune</th>
                            <th colspan="3">Inscription</th>
                            <th colspan="3">Modification</th>
                            <th colspan="3">Changement</th>
                            <th colspan="3">Radiation</th>
                            <th rowspan="2">Total Des Operations</th>

                        </tr>
                        <tr>
                            <td>Anterieur</td>
                            <td>Semaine</td>
                            <td>cumul</td>
                            <td>Anterieur</td>
                            <td>Semaine</td>
                            <td>cumul</td>
                            <td>Anterieur</td>
                            <td>Semaine</td>
                            <td>cumul</td>
                            <td>Anterieur</td>
                            <td>Semaine</td>
                            <td>cumul</td>
                        </tr>
                    </thead>
                    <tbody>
                        @foreach ($departement->arrondissements as $arrondissement)
                            <tr>
                                <td colspan="16">Arrondissement de {{$arrondissement->nom}}</td>
                            </tr>
                            @foreach ($arrondissement->communes as $value)
                            <tr>
                                <td>{{ $value->data->commune }}</td>
                                <td>{{ $value->data->insant }}</td>
                                <td>{{ $value->data->inssem }}</td>
                                <td>{{ $value->data->cumulins }}</td>
    
                                <td>{{ $value->data->modant }}</td>
                                <td>{{ $value->data->modsem }}</td>
                                <td>{{ $value->data->cumulmod }}</td>
    
                                <td>{{ $value->data->chanant }}</td>
                                <td>{{ $value->data->chansem }}</td>
                                <td>{{ $value->data->cumulchan }}</td>
    
                                <td>{{ $value->data->radant }}</td>
                                <td>{{ $value->data->radsem }}</td>
                                <td>{{ $value->data->cumulrad }}</td>
                                <td>
                                  {{$value->data->cumulrad + $value->data->cumulchan +  $value->data->cumulmod + $value->data->cumulins }}
                                </td>
    
                            </tr>
                            @endforeach
                        @endforeach
                  
                    </tbody>
                </table>



            </div>

        </div>
    </div>
</div>

@endsection
