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
            <h3 style="margin-bottom: 0px;margin-top: 5px;padding-bottom: 0px;"> MINISTERE DE L’INTERIEUR</h3>
        </div>
        <hr>
        <div class="sub-header">
            <h4>FORMULAIRE DE RADIATION SUR LES LISTES ELECTORALES</h4>
            <h4>Numéro de la demande :  {{$radiation->id}} <span style="text-align: right ;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{ $qrcode }}</span> </h4>
        </div>

        <!-- Identification de la commission -->
        <div class="gray" style="display:flex; align-items: center;justify-content: center;height: 30px;">
            <center> <h4>IDENTIFICATION DE LA COMMISSION ADMINISTRATIVE</h4></center>
        </div>
        <table>
            <tr>
                <td style="text-align: left;">Region : <strong>  {{$identification->region ?? null}} </strong></td>
                <td style="text-align: left;">Département : <strong>{{$identification->departement}}</strong></td>
                <td style="text-align: left;">Commune : <strong>{{$identification->commune}}</strong></td>
            </tr>
        </table>

        <!-- Identification du demandeur -->
        <div class="gray"  style="display:flex; align-items: center;justify-content: center;height: 30px;">
          <center>  <h4>IDENTIFICATION DU DEMANDEUR</h4></center>
        </div>
        <table>
            <tr>
                <td style="text-align: left;">CNI : <strong>{{$identification->cni}}</strong></td>
            </tr>
            <tr>
                <td style="text-align: left;">PRENOM : <strong>{{$identification->prenom}}</strong></td>
            </tr>
            <tr>
                <td style="text-align: left;">NOM : <strong>{{$identification->nom}}</strong></td>
            </tr>
            <tr>
                <td style="text-align: left;">DATE ET LIEU DE NAISSANCE : <strong>{{$identification->datenaiss}} à {{$identification->lieunaiss}}</strong></td>
            </tr>
            <tr>
                <td style="text-align: left;"> téléphone du demandeur : <strong>   {{$identification->tel}} </strong></td>
            </tr>
            <tr>
                <td style="text-align: left;">  Le demandeur est-il un électeur ayant un handicap réduisant sa mobilité ?  <strong>@if($identification->handicap==0) Non @else Oui  @endif</strong></td>
            </tr>

        </table>

        <div class="gray" style="display:flex; align-items: center;justify-content: center;height: 30px;">
            <center> <h4>DEMANDE DE RADIATION D’UN ELECTEUR</h4></center>
        </div>
        <center> <h4>IDENTIFICATION DE L’ELECTEUR A RADIER</h4></center>
        <table>
            <tr>
                <td style="text-align: left;">CNI : <strong>{{$identification->cni}}</strong></td>
            </tr>
            <tr>
                <td style="text-align: left;">PRENOM : <strong>{{$identification->prenom}}</strong></td>
            </tr>
            <tr>
                <td style="text-align: left;">NOM : <strong>{{$identification->nom}}</strong></td>
            </tr>
            <tr>
                <td style="text-align: left;">DATE ET LIEU DE NAISSANCE : <strong>{{$identification->datenaiss}} à {{$identification->lieunaiss}}</strong></td>
            </tr>
          
        </table>

        <!-- Authentification du formulaire -->
        <div class="gray" style="display:flex; align-items: center;justify-content: center;height: 30px;">
           <center> <h4>AUTHENTIFICATION DU FORMULAIRE</h4></center>
        </div>
        <br>
        <table>
            <tr>


                <td style="text-align: left; padding-top: 0px;border: none;"> Signature du demandeur :</td>
                <td style="text-align: right;border: none;">Visa du représentant de la CENA (Signature et cachet)</td>
            </tr>
            <tr>
                <td style="text-align: left; height: 60px;padding-top: 0px;border: none;"></td>
                <td style="text-align: right;height: 860x;border: none;"></td>
            </tr>
        </table>


        <p>
            <br> Prénoms et nom du Président de la commission administrative : ..................................................
        </p>
    </div>


<br>
<div class="page-break"></div>
<br><br><br><br>
    <div  style="display:flex; align-items: center;justify-content: center;height: 30px;">
        <center> <h4>  Numéro de la demande : {{$radiation->id}} <span style="text-align: right ;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{ $qrcode }}</span> </h4></center>

    </div>
    <br><br>
    <div  style="display:flex; align-items: center;justify-content: center;height: 30px;">
    <center> <h4> RECEPISSE DESTINE A LA CENA</h4></center>
    </div>

    <p>Prénoms <strong>{{$identification->prenom}}</strong>  Nom <strong>{{$identification->nom}}</strong>
        né(e) le<strong>{{$identification->datenaiss}}</strong>  à  <strong>{{$identification->lieunaiss}}</strong>
        a sollicité auprès de la commission administrative l’opération suivante :
        <b>une demande radiation sur la liste électorale </b>
        <table style="border: none;">
            <tr>

                <td style="text-align: left;border: none;"> Le Président de la commission</td>

                <td style="text-align: right;border: none;"> Visa de la CENA</td>
            </tr>
            <tr >
                <td style="text-align: left;border: none;"  ></td>
                <td style="text-align: left; border: none;" ></td>

            </tr>
        </table>
        <br><br>
        <div  style="display:flex; align-items: center;justify-content: center;height: 30px;">
            <center> <h4>  Numéro de la demande : {{$radiation->id}} <span style="text-align: right ;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{ $qrcode }}</span> </h4></center>
    
        </div>
        <br><br>
        <div  style="display:flex; align-items: center;justify-content: center;height: 30px;">
        <center> <h4>  RECEPISSE DESTINE A L’ELECTEUR</h4></center>
        </div>
        <p>Prénoms <strong>{{$identification->prenom}}</strong>  Nom <strong>{{$identification->nom}}</strong>
            né(e) le<strong>{{$identification->datenaiss}}</strong>  à  <strong>{{$identification->lieunaiss}}</strong>
            a sollicité auprès de la commission administrative l’opération suivante :
            <b>une demande radiation sur la liste électorale </b>
            <table style="border: none;">
                <tr>
    
                    <td style="text-align: left;border: none;"> Le Président de la commission</td>
    
                    <td style="text-align: right;border: none;"> Visa de la CENA</td>
                </tr>
                <tr >
                    <td style="text-align: left;border: none;"  ></td>
                    <td style="text-align: left; border: none;" ></td>
    
                </tr>
            </table>
</body>

</html>