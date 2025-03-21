<!DOCTYPE html>
<html lang="fr">

<head>
    <meta charset="UTF-8">
    <title>Radiation</title>
    <style>
        /* Style général */
        body {
            font-family: Arial, sans-serif;
            font-size: 12px;
        }

        .container {
            width: 100%;
            margin: 0 auto;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 10px;
        }

        th, td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: center;
        }

        th {
            background-color: #f2f2f2;
        }

        .header, .sub-header {
            text-align: center;
            margin-bottom: 10px;
        }

        .gray {
            background-color: red;
            color: white;
        }
        .page-break{
                page-break-after: always;
            }
    </style>
</head>

<body>
    <div class="container">
        <!-- Titre principal -->
        <div class="header">
            <h2  style="margin-bottom: 0px;margin-top: 0px;padding-bottom: 0px;">REPUBLIQUE DU SENEGAL </h2>
             <h6 style="margin-bottom: 0px;margin-top: 5px;padding-bottom: 0px;">   Un Peuple - un But - une Foi</h6>
            <h3 style="margin-bottom: 0px;margin-top: 5px;padding-bottom: 0px;">  Region de {{$arrondissement->departement->region->nom}}</h3>
            <h3 style="margin-bottom: 0px;margin-top: 5px;padding-bottom: 0px;"> Departement de {{$arrondissement->departement->nom}} </h3>
            <h3 style="margin-bottom: 0px;margin-top: 5px;padding-bottom: 0px;"> Arrondissement de {{$arrondissement->nom}} </h3>
            <h3 style="margin-bottom: 0px;margin-top: 5px;padding-bottom: 0px;"> SOUS-PREFECTURE </h3>
        </div>
        <hr>
        <div class="sub-header">
            <h4>MESSAGE DEPART</h4>
        </div>
        <div>
            <h4><b>EXPEDITEUR : </b>SOUS-PREFET ARRONDISSEMENT DE {{$arrondissement->nom}} </h4>
            <h4><b>DESTINATAIRE  : </b>PREFET DEPARTEMENT DE {{$arrondissement->departement->nom}} </h4>
            <h4><b>NUMERO : ..................................</b></h4>
        </div>
        
        <center> <p>EN EXECUTION DES INSTRUCTIONS RELATIVES A LA REVISION ORDINAIRE DES LISTE ELECTORALES. 
            ON VOUS FAIS PARVENIR SITUATION STATISTIQUES VALABLE A LA DATE  DU {{ date('d/m/Y', strtotime($semaine->debut)) }} AU {{ date('d/m/Y', strtotime($semaine->fin)) }} </p>       
       </center>
       
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
                @php
                    $total = 0;

                    $totalinsant = 0;
                    $totalinssem = 0;
                    $totalcumulins = 0;

                    $totalmodant = 0;
                    $totalmodsem = 0;
                    $totalcumulmod = 0;

                    $totalchanant = 0;
                    $totalchansem = 0;
                    $totalcumulchan = 0;

                    $totalradan = 0;
                    $totalradsem = 0;
                    $totalcumulrad = 0;
                @endphp
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
                          @php
                            $total = $total +$value->cumulrad + $value->cumulchan +  $value->cumulmod + $value->cumulins;
                            $totalinsant = $totalinsant + $value->insant;
                            $totalinssem = $totalinssem + $value->inssem ;
                            $totalcumulins = $totalcumulins + $value->cumulins;

                            $totalmodant = $totalmodant+$value->modant ;
                            $totalmodsem = $totalmodsem + $value->modsem;
                            $totalcumulmod = $totalcumulmod + $value->cumulmod;

                            $totalchanant = $totalchanant + $value->chanant ;
                            $totalchansem = $totalchansem + $value->chansem;
                            $totalcumulchan = $totalcumulchan + $value->cumulchan ;

                            $totalradan = $totalradan + $value->radant;
                            $totalradsem = $totalradsem + $value->radsem;
                            $totalcumulrad = $totalcumulrad + $value->cumulrad;
                          @endphp
                        </td>

                    </tr>
                    @endforeach 
                   
                   
                    <tr>
                        <td>total</td>
                        <td>{{ $totalinsant }}</td>
                        <td>{{ $totalinssem }}</td>
                        <td>{{ $totalcumulins }}</td>

                        <td>{{ $totalmodant }}</td>
                        <td>{{ $totalmodsem }}</td>
                        <td>{{ $totalcumulmod }}</td>

                        <td>{{ $totalchanant }}</td>
                        <td>{{ $totalchansem }}</td>
                        <td>{{ $totalcumulchan }}</td>

                        <td>{{ $totalradan }}</td>
                        <td>{{ $totalradsem }}</td>
                        <td>{{ $totalcumulrad }}</td>
                        <td colspan="15" style="text-align: right;">{{$total }}</td>
                    </tr>

                </tbody>
            </table>
       
      
</body>

<script>
    window.print();
</script>
</html>
