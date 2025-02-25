<?php

use App\Http\Controllers\ArrondissementController;
use App\Http\Controllers\CarteController;
use App\Http\Controllers\CentrevoteController;
use App\Http\Controllers\ChangementController;
use App\Http\Controllers\CommuneController;
use App\Http\Controllers\ComptageController;
use App\Http\Controllers\DepartementController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\IdentificationController;
use App\Http\Controllers\InscriptionController;
use App\Http\Controllers\LotController;
use App\Http\Controllers\ModificationController;
use App\Http\Controllers\PointageController;
use App\Http\Controllers\RadiationController;
use App\Http\Controllers\RegionController;
use App\Http\Controllers\RenseignementController;
use App\Http\Controllers\SemaineController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/
Route::get('/', [HomeController::class,'index'])->middleware(['auth']);
/* Route::get('/', function () {
    return view('home');
})->middleware(['auth']); */

Route::get('/teste', function () {
    return view('test');
})->name("carte.recenssement")->middleware(['auth']);
Route::resource('region', RegionController::class)->middleware(['auth']);
Route::resource('departement', DepartementController::class)->middleware(['auth']);
Route::resource('arrondissement', ArrondissementController::class)->middleware(['auth']);
Route::resource('commune', CommuneController::class)->middleware(['auth']);
Route::resource('user', UserController::class)->middleware(['auth','admin']);
Route::resource('carte', CarteController::class)->middleware(['auth']);
Route::resource('inscription', InscriptionController::class)->middleware(['auth']);
Route::resource('identification', IdentificationController::class)->middleware(['auth']);
Route::resource('centrevote', CentrevoteController::class)->middleware(['auth']);
Route::resource('inscription', InscriptionController::class)->middleware(['auth']);
Route::resource('modification', ModificationController::class)->middleware(['auth']);
Route::resource('radiation', RadiationController::class)->middleware(['auth']);
Route::resource('changement', ChangementController::class)->middleware(['auth']);
Route::resource('comptage', ComptageController::class)->middleware(['auth']);
Route::resource('semaine', SemaineController::class)->middleware(['auth']);
Route::resource('lot', LotController::class)->middleware(['auth']);
Route::resource('pointage', PointageController::class)->middleware(['auth']);

Route::get('/modifier/motdepasse',[UserController::class,'modifierMotDePasse'])->name("modifier.motdepasse")->middleware(['auth']);
Route::post('/importer/region',[RegionController::class,'importExcel'])->name("importer.region")->middleware(['auth']);//->middleware(['auth', 'admin', 'checkMaxSessions']);

Route::post('/importer/departement',[DepartementController::class,'importExcel'])->name("importer.departement")->middleware(['auth']);//->middleware(['auth', 'admin', 'checkMaxSessions']);

Auth::routes();

Route::get('/home', [App\Http\Controllers\HomeController::class, 'index'])->name('home')->middleware(['auth']);
Route::get('/modifier/motdepasse',[UserController::class,'modifierMotDePasse'])->name("modifier.motdepasse")->middleware(['auth']);//->middleware(['auth', 'checkMaxSessions']);
Route::post('/update/password',[UserController::class,'updatePassword'])->name("user.password.update")->middleware(['auth']);//->middleware(["auth","checkMaxSessions"]);
Route::post('/importer/commune',[CommuneController::class,'importExcel'])->name("importer.commune")->middleware("auth");
Route::post('/importer/arrondissement',[ArrondissementController::class,'importExcel'])->name("importer.arrondissement")->middleware("auth");
Route::post('/importer/centrevote',[CentrevoteController::class,'importExcel'])->name("importer.centrevote")->middleware("auth");

Route::get('/home', [App\Http\Controllers\HomeController::class, 'index'])->name('home')->middleware(['auth']);
Route::get('/departement/by/region/{region}',[DepartementController::class,'byRegion'])->name('rts.national.departement')->middleware("auth");


Route::get('/commune/by/departement/{departement}',[CommuneController::class,'byDepartement'])->name('rts.national.departement')->middleware("auth");
Route::get('/centrevote/by/commune/{commune}',[CentrevoteController::class,'getBycommune'])->name('rts.national.departement')->middleware("auth");

Route::get('/commune/by/arrondissement/{arrondissement}',[CommuneController::class,'getByArrondissement'])->name('rts.national.departement')->middleware("auth");
Route::get('/arrondissement/by/departement/{departement}',[ArrondissementController::class,'getByDepartement'])->name('rts.national.departement')->middleware("auth");
Route::get('/bordereau', function () {
    $comptage = null;
    return view('comptage.bordereau',compact("comptage"));
})->middleware(['auth']);

Route::get('/stat/by/commune/{commune}',[HomeController::class,'statByCommune'])->middleware("auth");


Route::get('/api/by/departement/{id}',[HomeController::class,'byDepartement'])->name('rts.national.departement')->middleware("auth");
Route::get('/api/by/commune/{id}',[HomeController::class,'byCommune'])->name('rts.national.departement')->middleware("auth");

Route::get('/api/by/arrondissement/{id}',[HomeController::class,'byArrondissement'])->name('rts.national.departement')->middleware("auth");
Route::get('/api/by/region/{id}',[HomeController::class,'byRegion'])->name('rts.national.departement')->middleware("auth");

Route::get('/test', function () {
    return view('situation.par_arrondissement');
})->middleware(['auth']);

Route::get('/message/arrondissement/{id}/{date}',[HomeController::class,'messageByArrondissement'])->name('message.arrondissement')->middleware("auth");

Route::get('/message/departement/{id}/{date}',[HomeController::class,'messageByDepartement'])->name('message.departement')->middleware("auth");

Route::get('/message/region/{id}/{date}',[HomeController::class,'messageByRegion'])->name('message.region')->middleware("auth");

Route::get('/message/national/{date}',[HomeController::class,'messageByNational'])->name('message.national')->middleware("auth");



Route::get('/pointage/create/{lot}',[PointageController::class,'create_lot'])->name('pointage.create.lot')->middleware("auth");


Route::get('/update/retour/{id}/{etat}',[LotController::class,'updateretour'])->name('update.retour')->middleware("auth");

Route::get('/update/validation/{id}/{etat}',[LotController::class,'updateValidation'])->name('update.validation')->middleware("auth");

Route::get('/update/commentaire/{id}/{commentaire}',[LotController::class,'updateCommentaire'])->name('update.commentaire')->middleware("auth");

Route::get('/commune/renseigne/{semaine}',[RenseignementController::class,'communeRenseigne'])->name('commune.renseigne')->middleware("auth");

Route::post('/search/renseignement', [RenseignementController::class, 'seaerchCommuneRenseigne'])->name('search.renseignement')->middleware(['auth']);



Route::post('/updateArrondissement', [ArrondissementController::class, 'updateArrondissement'])->name('updateArrondissement')->middleware(['auth','admin']);

Route::get('/statbydepartement',[HomeController::class,'statByDepartement'])->name('stat.by.departement')->middleware("auth","admin");

