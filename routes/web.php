<?php

use App\Http\Controllers\ArrondissementController;
use App\Http\Controllers\CarteController;
use App\Http\Controllers\CentrevoteController;
use App\Http\Controllers\ChangementController;
use App\Http\Controllers\CommuneController;
use App\Http\Controllers\DepartementController;
use App\Http\Controllers\IdentificationController;
use App\Http\Controllers\InscriptionController;
use App\Http\Controllers\ModificationController;
use App\Http\Controllers\RadiationController;
use App\Http\Controllers\RegionController;
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

Route::get('/', function () {
    return view('welcome');
})->middleware(['auth']);
Route::resource('region', RegionController::class)->middleware(['auth']);
Route::resource('departement', DepartementController::class)->middleware(['auth']);
Route::resource('arrondissement', ArrondissementController::class)->middleware(['auth']);
Route::resource('commune', CommuneController::class)->middleware(['auth']);
Route::resource('user', UserController::class)->middleware(['auth']);
Route::resource('carte', CarteController::class)->middleware(['auth']);
Route::resource('inscription', InscriptionController::class)->middleware(['auth']);
Route::resource('identification', IdentificationController::class)->middleware(['auth']);
Route::resource('centrevote', CentrevoteController::class)->middleware(['auth']);
Route::resource('inscription', InscriptionController::class)->middleware(['auth']);
Route::resource('modification', ModificationController::class)->middleware(['auth']);
Route::resource('radiation', RadiationController::class)->middleware(['auth']);
Route::resource('changement', ChangementController::class)->middleware(['auth']);

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
