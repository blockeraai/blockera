<?php


function blockera_performance_timing($callback, $args)
{

    $start = microtime(true);

    call_user_func_array($callback, $args);

    $seconds = round(microtime(true) - $start, 2);
    dd("Processing took {$seconds}s");
}
