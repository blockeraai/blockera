<?php

#Env Loading...
$dotenv = Dotenv\Dotenv::createImmutable( dirname( __DIR__ ) );
$dotenv->safeLoad();


$app = new \Publisher\Framework\Illuminate\Foundation\Application();

$app->bootstrap();
