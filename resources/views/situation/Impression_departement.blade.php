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
            <h4><b>DESTINATAIRE  : </b>GOUVERNEUR DU REGION DE {{$departement->region->nom}} </h4>
            <h4><b>NUMERO : ..................................</b></h4>
        </div>
        <div class="sub-header">
            <h4>Texte</h4>
        </div> 
        <p>ENEXECUTION DES INSTRUCTIONS RELATIVES A LA REVISION EXCEPTIONNELLE DES LISTE ELECTORALES POUR LES LEGISLATIVES DU 31 JUILLET 
            2022– STOP- VOUS FAIS PARVENIR SITUATION STATISTIQUES STOP- VALABLE A LA DATE  DU LUNDI 28 MARS 2022 -STOP-</p>       
        
       
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
       
      
</body>

</html>
