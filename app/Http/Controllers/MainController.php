<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class MainController extends Controller
{
    public function index()
    {
        return Inertia::render('MainPage');
    }
    public function newProduct()
    {
        return Inertia::render('CreatePage');
    }


}
