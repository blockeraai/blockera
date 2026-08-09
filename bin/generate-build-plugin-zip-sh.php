#!/usr/bin/env php
<?php

/**
 * Generates the production (plugin build) version of `./bin/build-plugin-zip.sh`,
 * containing alternate `define` statements from the development version.
 *
 * @package blockera-build
 */

$f = fopen(dirname(__DIR__) . '/bin/build-plugin-zip.sh', 'r');
$packages_root = dirname(__DIR__) . '/packages/global-packages/packages';
$filtered_packages = array_filter(
    (function () use ($packages_root) {
        $all_dirs = glob($packages_root . '/*') ?: [];
        $result = [];
        foreach ($all_dirs as $dir) {
            if (is_dir($dir)) {
                if (substr($dir, -strlen('/blocks-library')) === '/blocks-library') {
                    // Add all directories inside /blocks-library
                    foreach (glob($dir . '/*', GLOB_ONLYDIR) as $subdir) {
                        $result[] = $subdir;
                    }
                } elseif (substr($dir, -strlen('/features-library')) === '/features-library') {
                    // Add all directories inside /features-library
                    foreach (glob($dir . '/*', GLOB_ONLYDIR) as $subdir) {
                        $result[] = $subdir;
                    }
                } else {
                    $result[] = $dir;
                }
            }
        }
        return $result;
    })(),
    function (string $package_name): string {

        // filter dev tools packages.
        if (preg_match('/dev-(.*)/', $package_name)) {

            return false;
        }

        // filter invalid packages.
        if (! is_dir($package_name . '/php') &&
         	! is_dir($package_name . '/core/php') &&
          	!is_dir($package_name . '/src')
		) {
            return false;
        }

        return true;
    }
);
$packages = array_map(
    function (string $package_name) use ($packages_root) {

        $root_dir = (realpath($packages_root) ?: $packages_root) . '/';
        $package_name = str_replace('\\', '/', $package_name);
        $package_name = str_replace($root_dir, '', $package_name);
        $package_name = preg_replace('#^.*/packages/global-packages/packages/#', '', $package_name);

        if (preg_match('/\bblocks-library\b/', $package_name) || preg_match('/\bfeatures-library\b/', $package_name)) {
            ob_start();
            include $root_dir . $package_name . '/composer.json';
            $composer_package_name = str_replace('blockera/', '', json_decode(ob_get_clean(), true)['name']);

            $package_name = $composer_package_name;
        }

        return $package_name;
    },
    $filtered_packages
);

$internal_packages = array_filter(
    $packages,
    function (string $package_name): string {

        if (preg_match('/-sdk$/', $package_name)) {
            return false;
        }

        return true;
    }
);

$sdks = array_diff($packages, $internal_packages);

$inside_pattern_block = false;

while (true) {
    $line = fgets($f);
    if (false === $line) {
        break;
    }

    switch (trim($line)) {

        case '### END AUTO-GENERATED VENDOR PACKAGES PATH PATTERN':
            $inside_pattern_block = false;
            break;

        case '### BEGIN AUTO-GENERATED VENDOR PACKAGES PATH PATTERN':
            $inside_pattern_block = true;

            echo implode(PHP_EOL, array_map(function (string $name): string {

                return sprintf(
                    '	$(find ./vendor/blockera/%1$s/ -type f \( -name "*.php" -o -name "*.json" -o -name "*.css" \)) \\',
                    $name
                );
            }, $internal_packages));

            if (! empty($sdks)) {
                echo PHP_EOL;
            }

            echo implode(
                PHP_EOL,
                array_map(function (string $name): string {

                    return sprintf(
                        '	$(find ./vendor/blockera/%1$s/) \\',
                        $name
                    );
                }, $sdks)
            );

            echo PHP_EOL;

            break;

        default:
            if (! $inside_pattern_block) {

                echo $line;
            }
            break;
    }
}

fclose($f);
