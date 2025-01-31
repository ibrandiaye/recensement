{{-- \resources\views\permissions\create.blade.php --}}
@extends('welcome')

@section('title', '| Enregister Département')

@section('content')
<div class="row">

    <div class="col-12">
        <div class="page-title-box">
            <div class="page-title-right">
                <ol class="breadcrumb m-0">
                    <li class="breadcrumb-item"><a href="javascript: void(0);">Tableau de bord</a></li>
                    <li class="breadcrumb-item active"><a href="javascript: void(0);">Pointage </a></li>
                </ol>
            </div>
            <h4 class="page-title">Enregistrer un Pointage</h4>
        </div>
    </div>
</div>
<div class="row">
    <div class="col-12">
        <form action="{{ route('pointage.store') }}" method="POST">
            @csrf
             <div class="card">
                <div class="card-header  text-center">FORMULAIRE D'ENREGISTREMENT D'UN Département</div>
                <div class="card-body">
                    @if ($errors->any())
                        <div class="alert alert-danger">
                            <ul>
                                @foreach ($errors->all() as $error)
                                    <li>{{ $error }}</li>
                                @endforeach
                            </ul>
                        </div>
                    @endif
                    {{-- <input type="text" id="barcode" name="barcode" > --}}

                    <div class="col-lg-6">
                        <div class="form-group">
                            <label>Numero</label>
                            <input type="text" id="barcode"  name="numero"  value="{{ old('numero') }}" class="form-control" min="1" required autofocus>
                        </div>
                    </div>
                    <div class="col-lg-6">
                        <label> Numero Lot</label>
                        <select class="form-control" name="lot_id" required="">
                            <option value="">Veuilez Selectionner</option>
                            @foreach ($lots as $lot)
                            <option value="{{$lot->id}}">{{$lot->numero}}</option>
                                @endforeach

                        </select>
                    </div>

                    <div>
                        <center>
                            <button type="submit" class="btn btn-success btn btn-lg "> ENREGISTRER</button>
                        </center>
                    </div>
                </div>

            </div>

        </form>
    </div>
</div>


@endsection


@section("js")
<script>
    const barcodeInput = document.getElementById('barcode');
    let barcode = "";
    let timeout;

    // Fonction de correction des caractères
    function correctCharacters(input) {
        return input.replace(/&/g, '1')
                    .replace(/é/g, '2')
                    .replace(/"/g, '3')
                    .replace(/'/g, '4')
                    .replace(/\(/g, '5')
                    .replace(/-/g, '6')
                    .replace(/è/g, '7')
                    .replace(/_/g, '8')
                    .replace(/ç/g, '9')
                    .replace(/à/g, '0');
    }
    

    document.addEventListener('keypress', function (e) {
        barcode += e.key;

        clearTimeout(timeout);

        timeout = setTimeout(function () {
            let correctedBarcode = correctCharacters(barcodeInput.value);
            console.log('Code-barres corrigé:', correctedBarcode);

            if (barcodeInput) {
                barcodeInput.value = correctedBarcode;
            }

            barcode = "";
        }, 300);
    });
</script>

@endsection