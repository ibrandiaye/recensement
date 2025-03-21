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
            <h3 style="margin-bottom: 0px;margin-top: 5px;padding-bottom: 0px;">  Region de {{$departement->region->nom}}</h3>
            <h3 style="margin-bottom: 0px;margin-top: 5px;padding-bottom: 0px;"> Departement de {{$departement->nom}} </h3>
            <h3 style="margin-bottom: 0px;margin-top: 5px;padding-bottom: 0px;"> PREFECTURE </h3>
        </div>
        <hr>
        <div class="sub-header">
            <h4>MESSAGE DEPART</h4>
        </div>
        <div>
            <h4><b>EXPEDITEUR : </b>PREFET DU DEPARTEMENT  DE {{$departement->nom}} </h4>
            <h4><b>DESTINATAIRE  : </b>GOUVERNEUR REGION DE {{$departement->region->nom}} </h4>
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
                <tbody>
                    @php
                        $totald = 0;
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
                    @foreach ($departement->arrondissements as $arrondissement)
                        <tr>
                            <td colspan="16">@if($arrondissement->is_arrondissement) Arrondissement de @else  Departement de @endif{{$arrondissement->nom}}</td>
                        </tr>
                        @php
                        $totala = 0;
                        $totalainsant = 0;
                        $totalainssem = 0;
                        $totalacumulins = 0;

                        $totalamodant = 0;
                        $totalamodsem = 0;
                        $totalacumulmod = 0;

                        $totalachanant = 0;
                        $totalachansem = 0;
                        $totalacumulchan = 0;

                        $totalaradan = 0;
                        $totalaradsem = 0;
                        $totalacumulrad = 0;
                       
                        @endphp
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
                              @php
                                $totala = $totala +$value->data->cumulrad + $value->data->cumulchan +  $value->data->cumulmod + $value->data->cumulins  ;
                                $totald = $totald + $value->data->cumulrad + $value->data->cumulchan +  $value->data->cumulmod + $value->data->cumulins ;
                               
                                $totalinsant = $totalinsant + $value->data->insant;
                                $totalinssem = $totalinssem + $value->data->inssem ;
                                $totalcumulins = $totalcumulins + $value->data->cumulins;

                                $totalmodant = $totalmodant+$value->data->modant ;
                                $totalmodsem = $totalmodsem + $value->data->modsem;
                                $totalcumulmod = $totalcumulmod + $value->data->cumulmod;

                                $totalchanant = $totalchanant + $value->data->chanant ;
                                $totalchansem = $totalchansem + $value->data->chansem;
                                $totalcumulchan = $totalcumulchan + $value->data->cumulchan ;

                                $totalradan = $totalradan + $value->data->radant;
                                $totalradsem = $totalradsem + $value->data->radsem;
                                $totalcumulrad = $totalcumulrad + $value->data->cumulrad;

                                $totalainsant = $totalainsant + $value->data->insant;
                                $totalainssem = $totalainssem + $value->data->inssem ;
                                $totalacumulins = $totalacumulins + $value->data->cumulins;

                                $totalamodant = $totalamodant+$value->data->modant ;
                                $totalamodsem = $totalamodsem + $value->data->modsem;
                                $totalacumulmod = $totalacumulmod + $value->data->cumulmod;

                                $totalachanant = $totalachanant + $value->data->chanant ;
                                $totalachansem = $totalachansem + $value->data->chansem;
                                $totalacumulchan = $totalacumulchan + $value->data->cumulchan ;

                                $totalaradan = $totalaradan + $value->data->radant;
                                $totalaradsem = $totalaradsem + $value->data->radsem;
                                $totalacumulrad = $totalacumulrad + $value->data->cumulrad;
                              @endphp
                            </td>

                        </tr>
                        @endforeach
                        <tr>
                            <td>total</td>
                            <td>{{ $totalainsant }}</td>
                        <td>{{ $totalainssem }}</td>
                        <td>{{ $totalacumulins }}</td>

                        <td>{{ $totalamodant }}</td>
                        <td>{{ $totalamodsem }}</td>
                        <td>{{ $totalacumulmod }}</td>

                        <td>{{ $totalachanant }}</td>
                        <td>{{ $totalachansem }}</td>
                        <td>{{ $totalacumulchan }}</td>

                        <td>{{ $totalaradan }}</td>
                        <td>{{ $totalaradsem }}</td>
                        <td>{{ $totalacumulrad }}</td>
                            <td colspan="15" style="text-align: right;">{{$totala   }}</td>
                        </tr>
                    @endforeach
                   
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
                        <td colspan="15" style="text-align: right;">{{$totald }}</td>
                    </tr>
              
                </tbody>
            </table>
       
      
</body>
<script>
    window.print();
</script>
</html>
