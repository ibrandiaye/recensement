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
                     @foreach ($data as $value)
                        <tr>
                            <td>{{ $value->commune }}</td>
                            <td>{{ $value->insant }}</td>
                            <td>{{ $value->inssem }}</td>
                            <td>{{ $value->cumulins }}</td>

                            <td>{{ $value->modant }}</td>
                            <td>{{ $value->modsem }}</td>
                            <td>{{ $value->cumulmod }}</td>

                            <td>{{ $value->chanant }}</td>
                            <td>{{ $value->chansem }}</td>
                            <td>{{ $value->cumulchan }}</td>

                            <td>{{ $value->radant }}</td>
                            <td>{{ $value->radsem }}</td>
                            <td>{{ $value->cumulrad }}</td>
                            <td>
                              {{$value->cumulrad + $value->cumulchan +  $value->cumulmod + $value->cumulins }}
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
