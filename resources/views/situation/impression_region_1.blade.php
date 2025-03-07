<!DOCTYPE html>
<html lang="fr">

<head>
    <meta charset="UTF-8">
    <title>Situation Par region</title>
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
           
        </div>
        <hr>
        <div class="sub-header">
            <h4>MESSAGE DEPART</h4>
        </div>
        <div>
            <h4><b>EXPEDITEUR : </b>MINISTERE DE L'INTERIEUR </h4>
            <h4><b>DESTINATAIRE  : </b>MINISTERE DE L'INTERIEUR </h4>
            <h4><b>NUMERO : ..................................</b></h4>
        </div>
       
     
            <table id="example1" class="table table-bordered table-responsive table-striped text-center">
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
       
      
</body>
<script>
    window.print();
</script>
</html>
