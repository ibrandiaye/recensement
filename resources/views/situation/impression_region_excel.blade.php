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
        <div class="card-header">Statistique Region</div>
            <div class="card-body">

                <table id="datatable-buttons" class="table table-bordered table-responsive table-striped text-center">
                    <thead>
                        <tr>
                            <th >Departement</th>
                            <th >Inscription</th>
                            <th >Modification</th>
                            <th>Changement</th>
                            <th>Radiation</th>
                            <th>Total Des Operations</th>
    
                        </tr>
                       
                    </thead>
                    <tbody>
                        @php
                           $totalIns = 0;
                           $totalMod = 0;
                           $totalChan = 0;
                           $totalRad = 0;
                           
                        @endphp
                           
                           
                            @foreach ($regions as $value)
                            <tr>
                                <td>{{ $value->nom }}</td>
                                <td>{{ $value->inscription }}</td>
                                <td>{{ $value->modification }}</td>
                                <td>{{ $value->changement }}</td>
                                <td>{{ $value->radiation }}</td>
    
                                <td>
                                  {{$value->inscription + $value->modification + $value->changement + $value->radiation}}
                                  @php
                                    $totalIns = $value->inscription + $totalIns;
                                    $totalMod = $value->modification + $totalMod;
                                    $totalChan = $value->changement + $totalChan;
                                    $totalRad = $value->radiation + $totalRad;
                                  @endphp
                                </td>
    
                            </tr>
                            @endforeach
                            <tr>
                                <td>total</td>
                                <td>{{ $totalIns }}</td>
                                <td>{{ $totalMod }}</td>
                                <td>{{ $totalChan }}</td>
                                <td>{{ $totalRad }}</td>
                                <td>{{$totalIns + $totalMod + $totalChan + $totalRad }}</td>
    
    
                            </tr>
                        
                  
                    </tbody>
                </table>


            </div>

        </div>
    </div>
</div>

@endsection
