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
            <h3 style="margin-bottom: 0px;margin-top: 5px;padding-bottom: 0px;">  {{$region->nom}}</h3>
            <h3 style="margin-bottom: 0px;margin-top: 5px;padding-bottom: 0px;"> Gouvernance </h3>
        </div>
        <hr>
        <div class="sub-header">
            <h4>MESSAGE DEPART</h4>
        </div>
        <div>
            <h4><b>EXPEDITEUR : </b>GOUVERNEUR DU DE  {{$region->nom}} </h4>
            <h4><b>DESTINATAIRE  : </b>MINISTAIRE INTERIEUR </h4>
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
                        $totalr = 0;
                        $totalIns = 0;
                        $totalMod = 0;
                        $totalChang = 0;
                        $totalRad = 0;
                    @endphp
                     @foreach ($region->departements as $departement)
                     @php
                     $totald = 0;
                    @endphp
                     <tr>
                        <td colspan="16" bgcolor="gray" style="color: white;font-weight: bolder;font-size: 12px;">Departement de {{$departement->nom}}</td>
                    </tr>
                    @foreach ($departement->arrondissements as $arrondissement)
                        <tr>
                            <td colspan="16">Arrondissement de {{$arrondissement->nom}}</td>
                        </tr>
                        @php
                        $totala = 0;
                       
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
                                $totalr =  $totalr + $value->data->cumulrad + $value->data->cumulchan +  $value->data->cumulmod + $value->data->cumulins  ;
                                $totalIns = $totalIns + $value->data->cumulins;
                                $totalChang = $totalChang + $value->data->cumulchan;
                                $totalMod = $totalMod + $value->data->cumulmod;
                                $totalRad = $totalRad + $value->data->cumulrad;
                             @endphp
                            </td>

                        </tr>
                        @endforeach
                       
                        <tr>
                            <td>total</td>
                            <td colspan="15" style="text-align: right;">{{$totala   }}</td>
                        </tr>
                    @endforeach
                    <tr>
                        <td>total Departement </td>
                        <td colspan="15" style="text-align: right;">{{$totald }}</td>
                    </tr>
                    @endforeach
                    <tr>
                        <td>total Inscription</td>
                        <td colspan="15" style="text-align: right;">{{$totalIns }}</td>
                    </tr>
                    <tr>
                        <td>total Modification</td>
                        <td colspan="15" style="text-align: right;">{{$totalMod }}</td>
                    </tr>
                    <tr>
                        <td>total Changement </td>
                        <td colspan="15" style="text-align: right;">{{$totalChang }}</td>
                    </tr>
                    <tr>
                        <td>total Radiation</td>
                        <td colspan="15" style="text-align: right;">{{$totalRad }}</td>
                    </tr>
                    <tr>
                        <td>total  </td>
                        <td colspan="15" style="text-align: right;">{{$totalr }}</td>
                    </tr>
              
                </tbody>
            </table>
       
      
</body>

</html>
