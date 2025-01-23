<!DOCTYPE html>
<html lang="fr">

<head>
    <meta charset="UTF-8">
    <title>Inscription</title>
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
        <table style="border: none;">
            <tr style="border: none;">
                <td style="text-align: left; width: 50%;border: none;">Region de : <strong>  {{$user->departement->region->nom ?? null}} </strong></td>
                <td style="text-align: left;width: 50%;border: none;">Département de : <strong>{{$user->departement->nom ?? null}}</strong></td>
            </tr>
            <tr style="border: none;">
                <td style="text-align: left; width: 50%;border: none;">Arrondissement de : <strong>{{$user->arrondissement->nom ?? null}}</strong></td>
                <td style="text-align: left; width: 50%;border: none;">Commune de : <strong>{{$comptage->commune->nom ?? null}}</strong></td>
            </tr>
        </table>
        <!-- Comptage de la commission -->
        <div class="gray" style="display:flex; align-items: center;justify-content: center;height: 30px;margin-bottom: 40px;">
            <center> <h4>REVISION ORDINAIRE DES LISTES ELECTORALES / 2025</h4></center>
        </div>
        

        <!-- Comptage du demandeur -->
        <div class="gray"  style="display:flex; align-items: center;justify-content: center;height: 30px;">
          <center style="background: black;color: white;border-radius: 10px; padding: 10px;">  <h4>BORDEREAU DE TRANSMISSION DES FORMULAIRES
            </h4></center>
        </div>
        <div   style="display:flex; align-items: center;justify-content: center;height: 30px;margin-top: 40px;">
            <center>  <h4>COMMISSION ADMINISTRATIVE DE : {{$comptage->commune->nom}}<br>
              </h4></center>
          </div>
        <table>
            <tr>
                <td style="text-align: left;background-color: rgb(212, 212, 212);" colspan="3" ><center><b> TOTAL DES FORMULAIRES :  {{$comptage->inscription + $comptage->modification + $comptage->changement +$comptage->radiation }}   </b></center></td>
            </tr>
            <tr>
                <td style="text-align: left;"  colspan="3"> <center> <strong>COMPOSITION DU LOT</strong></center></td>
            </tr>
            <tr style="background-color: rgb(212, 212, 212);">
                <td style="text-align: left;"> <strong>Nature de la demande du formulaire</strong></td>
                <td style="text-align: left;"> <strong>Nombre </strong></td>
                <td style="text-align: left;"> <strong>Observations</strong></td>

            </tr>
            <tr>
                <td style="text-align: left;">1-	Demande d’inscription sur une liste électorale </td>
                <td style="text-align: left;"><strong>   <strong>   {{$comptage->inscription}} </strong> </strong></td>
                <td style="text-align: left;" rowspan="4"><strong>    </strong></td>

            </tr>
            <tr>
                <td style="text-align: left;">2-	Demande de modification de l’inscription 
                    <br>(Changement de circonscription ou d’adresse électorale)</td>
               
                <td style="text-align: left;">    <strong>  {{$comptage->modification}}</strong></td>
            </tr>
           
            <tr>
                <td style="text-align: left;">3-	Demande de Changement de Statut d’électeur « civil, militaire ou paramilitaire »<strong>    </strong></td>
               
                <td style="text-align: left;">    <strong> {{$comptage->changement}} </strong></td>
            </tr>
            <tr>
                <td style="text-align: left;">4-	Demande de radiation<strong>    </strong></td>
               
                <td style="text-align: left;">    <strong> {{$comptage->radiation}} </strong></td>
            </tr>
        </table>

     

        <!-- Authentification du formulaire -->
        <table style="border: none;">
            <tr>

                <td style="text-align: left;border: none;"> Prénoms et nom du Président de la commission administrative : ...............................................   N° TEL .........................................</td>

               
            </tr>
            <tr >
                <td style="text-align: right;border: none;"> Fait à …………………… le …………………2025

                    <br>Le Préfet ou le Sous-préfet (1°)
                </td>

            </tr>
        </table>


    </div>


     
</body>

</html>
