<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8" />
    <title>Direction générale des Élections (DGE) </title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta content="Responsive bootstrap 4 admin template" name="description" />
    <meta content="Coderthemes" name="author" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <!-- App favicon -->
    <link rel="shortcut icon" href="{{ asset('logo/fav.ico') }}">

    <!-- App css -->
    <link href=" {{ asset('assets/css/bootstrap.min.css') }} " rel="stylesheet" type="text/css" id="bootstrap-stylesheet" />
    <link href=" {{ asset('assets/css/icons.min.css') }} " rel="stylesheet" type="text/css" />
    <link href="{{ asset('assets/css/app.min.css') }}" rel="stylesheet" type="text/css" id="app-stylesheet" />

</head>

<body>

    <div class="account-pages mt-5 mb-5">
        <div class="container">
            <div class="row justify-content-center">
                <div class="col-md-8 col-lg-6 col-xl-5">
                    <div class="card">

                        <div class="text-center account-logo-box" style="background-color: white;">
                            <div class="mt-2 mb-2">
                                <a href="index.html" class="text-success">
                                    <span>                        <img src="{{ asset('logo/logo.png') }}" alt="" height="150">
                                    </span>
                                </a>
                            </div>
                        </div>

                        <div class="card-body">

                            <form method="POST" action="{{ route('login') }}">
                                @csrf

                                <div class="form-group">
                                    <input id="email" type="email" class="form-control @error('email') is-invalid @enderror" name="email" value="{{ old('email') }}" required autocomplete="email" autofocus>
                                </div>

                                @error('email')
                                    <span class="invalid-feedback" role="alert">
                                        <strong>{{ $message }}</strong>
                                    </span>
                                @enderror

                                <div class="form-group">
                                    <input id="password" type="password" class="form-control @error('password') is-invalid @enderror" name="password" required autocomplete="current-password">
                                </div>
                                @error('password')
                                    <span class="invalid-feedback" role="alert">
                                        <strong>{{ $message }}</strong>
                                    </span>
                                @enderror

                                <div class="form-group">
                                    <div class="custom-control custom-checkbox checkbox-success">
                                        <input type="checkbox" class="custom-control-input" id="checkbox-signin" checked>
                                        <label class="custom-control-label" for="checkbox-signin">Se Souvenir de moi</label>
                                    </div>
                                </div>

                              

                                <div class="form-group account-btn text-center mt-2">
                                    <div class="col-12">
                                        <button class="btn width-md btn-bordered btn-danger waves-effect waves-light" type="submit">Se Connecter</button>
                                    </div>
                                </div>
                            </form>

                        </div>
                        <!-- end card-body -->
                    </div>
                    <!-- end card -->
                </div>
                <!-- end col -->
            </div>
            <!-- end row -->
        </div>
        <!-- end container -->
    </div>
    <!-- end page -->

    <!-- Vendor js -->
    <script src=" {{ asset('assets/js/vendor.min.js') }} "></script>

    <!-- App js -->
    <script src= " {{ asset('assets/js/app.min.js') }}"></script>

</body>

</html>