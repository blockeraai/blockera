<?php

use Publisher\Core\Providers\AssetsProvider;

#Env Loading...
$dotenv = Dotenv\Dotenv::createImmutable( dirname( __DIR__ ) );
$dotenv->safeLoad();


#Assets Providing...
$provider = new AssetsProvider();
$provider->register();
