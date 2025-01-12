<!DOCTYPE html>
<html lang="fr">

<head>
    <meta charset="UTF-8">
    <title>Changement</title>
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
            background-color: rgb(80, 80, 211);
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
            <h4>FORMULAIRE DE CHANGEMENT SUR LES LISTES ELECTORALES</h4>
            <h4>Numéro de la demande :  {{$changement->id}} <span style="text-align: right ;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{ $qrcode }}</span> </h4>
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
            <center> <h4>CHANGEMENT DE STATUT « ELECTEUR CIVIL » ou 
                « ELECTEUR MILITAIRE OU PARAMILITAIRE »</h4></center>
        </div>
        <div>
            <center>
                En application des dispositions des articles L.27 et R.37 du Code électoral
            </center>
            <p>
                Le statut de l’électeur (civil ou militaire) est pris en compte dans la perspective de l’organisation du vote lors des élections territoriales. Il s’agit de :
            </p>
            <ul>
                <li> L’électeur inscrit avec le statut de militaire ou de paramilitaire qui redevient civil, doit à l’appui de sa demande présenter une attestation de cessation de service délivrée par l’autorité compétente ou la carte de pension ;</li>
                <li>	L’électeur inscrit avec un statut civil et qui entre par la suite dans un corps militaire ou paramilitaire, doit présenter à l’appui de sa demande une carte professionnelle ou une attestation de présence au corps délivrée par l’autorité compétente.</li>
            </ul>
            <p><b>{{$changement->statut}}</b></p>
        </div>
      {{--   <table>
            <tr>
                <td style="text-align: left;">Commune : <strong>{{$changement->commune}}</strong></td>
                <td style="text-align: left;">Département : {{$changement->departement}}</td>
                <td style="text-align: left;">Region : {{$changement->region ?? null}} </td>
            </tr>
            <tr>
                <td style="text-align: left;" colspan="3">Centre de vote : {{$changement->centrevote}}</td>

            </tr>

        </table> 
 --}}

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


  <div class="page-break"></div>
    <br><br><br><br>
  <div  style="display:flex; align-items: center;justify-content: center;height: 30px;">
        <center> <h4>  Numéro de la demande : {{$changement->id}} <span style="text-align: right ;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{ $qrcode }}</span> </h4></center>

    </div>
    <br><br>

    <div  style="display:flex; align-items: center;justify-content: center;height: 30px;">
    <center> <h4>  RECEPISSE DESTINE A LA CENA</h4></center>
    </div>
    <p>Prénoms <strong>{{$identification->prenom}}</strong>  Nom <strong>{{$identification->nom}}</strong>
        né(e) le<strong>{{$identification->datenaiss}}</strong>  à  <strong>{{$identification->lieunaiss}}</strong>
        a sollicité auprès de la commission administrative l’opération suivante :
        une demande de changement  <strong> {{$changement->statut}} </strong></p>
        <p>Adresse et numéro de téléphone de l’électeur {{$identification->tel}}</p>
        <p>Date d’enregistrement de la demande : {{$identification->created_at}}</p>
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

        <br><br><br><br>
        <div  style="display:flex; align-items: center;justify-content: center;height: 30px;">
            <center> <h4>  Numéro de la demande : {{$changement->id}} <span style="text-align: right ;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{ $qrcode }}</span> </h4></center>
    
        </div>
        <br><br>
        <div  style="display:flex; align-items: center;justify-content: center;height: 30px;">
        <center> <h4>  RECEPISSE DESTINE A L’ELECTEUR</h4></center>
        </div>
        <p>Prénoms <strong>{{$identification->prenom}}</strong>  Nom <strong>{{$identification->nom}}</strong>
            né(e) le<strong>{{$identification->datenaiss}}</strong>  à  <strong>{{$identification->lieunaiss}}</strong>
            a sollicité auprès de la commission administrative l’opération suivante :
            une demande de changement  <strong> {{$changement->statut}} </strong></p>
            <p>Adresse et numéro de téléphone de l’électeur {{$identification->tel}}</p>
            <p>Date d’enregistrement de la demande : {{$identification->created_at}}</p>
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
