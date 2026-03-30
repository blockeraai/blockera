<?php
/**
 * Snapshot Screenshots Comparison Tool
 *
 * Browser-accessible development tool for comparing Playwright visual snapshot images.
 * Images are read from tests/__snapshots__/ (Playwright snapshotPathTemplate).
 *
 * Access via: http://yoursite.local/wp-content/plugins/blockera/bin/snapshot-screenshots/
 *
 * Only works in development mode.
 */

// Prevent browser caching of this page
header('Cache-Control: no-cache, no-store, must-revalidate, max-age=0');
header('Pragma: no-cache');
header('Expires: 0');

include_once '../../../../../wp-load.php';

// Only allow in development
if (!defined('WP_DEBUG') || !WP_DEBUG) {
    // Try to bootstrap WordPress to check WP_DEBUG
    $wp_load_paths = [
        dirname(dirname(dirname(dirname(__DIR__)))) . '/wp-load.php', // Standard WordPress location
        dirname(dirname(dirname(__DIR__))) . '/wp-load.php', // Alternative location
    ];
    
    $wp_loaded = false;
    foreach ($wp_load_paths as $wp_path) {
        if (file_exists($wp_path)) {
            require_once $wp_path;
            $wp_loaded = true;
            break;
        }
    }
    
    if (!$wp_loaded || (!defined('WP_DEBUG') || !WP_DEBUG)) {
        die('This tool is only available in development mode. Set WP_DEBUG to true in wp-config.php');
    }
} else {
    // WordPress already loaded, find wp-load.php
    $wp_load_paths = [
        dirname(dirname(dirname(dirname(__DIR__)))) . '/wp-load.php',
        dirname(dirname(dirname(__DIR__))) . '/wp-load.php',
    ];
    
    foreach ($wp_load_paths as $wp_path) {
        if (file_exists($wp_path)) {
            require_once $wp_path;
            break;
        }
    }
}

// Get plugin directory (blockera root)
$plugin_dir = dirname(dirname(__DIR__));

// Playwright stores screenshots under tests/__snapshots__/ (see @wordpress/scripts
// snapshotPathTemplate: {testDir}/{testFileDir}/__snapshots__/{arg}-{projectName}{ext})
// Example: test-block-accordion-editor-desktop-chromium.png
$snapshots_dir = $plugin_dir . '/tests/__snapshots__';

// Single map: UI/script keys => filename tail after fixture id (Playwright project is chromium).
$chromium_snapshot_variants = [
    'editor-desktop' => '-editor-desktop-chromium.png',
    'editor-mobile' => '-editor-mobile-chromium.png',
    'frontend-desktop' => '-frontend-desktop-chromium.png',
    'frontend-mobile' => '-frontend-mobile-chromium.png',
];

$grouped = [];
if (is_dir($snapshots_dir)) {
    $png_files = glob($snapshots_dir . '/*.png');
    if ($png_files !== false) {
        foreach ($png_files as $file_path) {
            $basename = basename($file_path);
            if (strncmp($basename, 'test-', 5) !== 0) {
                continue;
            }
            foreach ($chromium_snapshot_variants as $key => $suffix) {
                $suffix_len = strlen($suffix);
                $prefix_len = 5; // strlen('test-')
                // Need at least one character for fixture id between prefix and suffix.
                if (strlen($basename) <= $prefix_len + $suffix_len) {
                    continue;
                }
                if (substr($basename, -$suffix_len) !== $suffix) {
                    continue;
                }
                // Middle segment is the fixture folder name (e.g. block-accordion, complex-1).
                $test_id = substr($basename, $prefix_len, -$suffix_len);
                if ($test_id === '' || $test_id === false) {
                    break;
                }
                if (!isset($grouped[$test_id])) {
                    $grouped[$test_id] = [];
                }
                $grouped[$test_id][$key] = $file_path;
                break;
            }
        }
    }
}

$tests = [];
foreach ($grouped as $test_id => $paths_by_key) {
    $test_data = [
        'id' => $test_id,
        'images' => [],
    ];
    foreach ($chromium_snapshot_variants as $key => $suffix) {
        $filename = 'test-' . $test_id . $suffix;
        if (isset($paths_by_key[$key])) {
            $file_path = $paths_by_key[$key];
            $exists = true;
            $filename = basename($file_path);
        } else {
            $file_path = $snapshots_dir . '/' . $filename;
            $exists = false;
        }

        $relative_path = str_replace($plugin_dir, '', $file_path);
        $url = content_url('/plugins/blockera' . $relative_path);

        if (!function_exists('content_url')) {
            $url = str_replace(ABSPATH, site_url('/'), $file_path);
        }

        $test_data['images'][$key] = [
            'exists' => $exists,
            'path' => $file_path,
            'url' => $url,
            'filename' => $filename,
        ];
    }

    $tests[] = $test_data;
}

// Sort tests by ID
usort($tests, function($a, $b) {
    return strcmp($a['id'], $b['id']);
});

// Convert to JSON for JavaScript
$tests_json = json_encode($tests, JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS | JSON_HEX_QUOT);
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Snapshot Screenshots Comparison Tool - Blockera</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="header">
        <div class="header-content">
            <h1>Blockera Tests Screenshots Comparision</h1>
            <div class="stats-container">
                <div class="stat">
                    <span class="stat-label">Test Categories</span>
                    <span class="stat-value total" id="stat-categories">0</span>
                </div>
                <div class="stat">
                    <span class="stat-label">Total Tests</span>
                    <span class="stat-value total" id="stat-total">0</span>
                </div>
                <div class="stat">
                    <span class="stat-label">Passing</span>
                    <span class="stat-value passing" id="stat-passing">0</span>
                </div>
                <div class="stat">
                    <span class="stat-label">Failing</span>
                    <span class="stat-value failing" id="stat-failing">0</span>
                </div>
                <div class="stat">
                    <span class="stat-label">Missing</span>
                    <span class="stat-value missing" id="stat-missing">0</span>
                </div>
                <div class="filter-control">
                    <label class="filter-label">Filter:</label>
                    <div class="filter-buttons">
                        <button class="filter-btn active" data-filter="all">All</button>
                        <button class="filter-btn" data-filter="failing">Failing</button>
                        <button class="filter-btn" data-filter="passing">Passing</button>
                        <button class="filter-btn" data-filter="missing">Missing</button>
                    </div>
                </div>
                <div class="threshold-control">
                    <label for="threshold-input" class="threshold-label">Threshold (%):</label>
                    <input type="number" id="threshold-input" class="threshold-input" value="3" min="0" max="100" step="0.1">
                </div>
            </div>
        </div>
    </div>
    
    <div class="progress-indicator" id="progress-indicator">
        <div class="header-content">
            <div class="progress-text" id="progress-text">Comparing...</div>
        </div>
    </div>
    
    <div class="container" id="tests-container">
        <!-- Test sections will be inserted here -->
    </div>
    
    <!-- Lightbox -->
    <div class="lightbox" id="lightbox">
        <div class="lightbox-content">
            <button class="lightbox-close" onclick="closeLightbox()">×</button>
            <div id="lightbox-comparison-container"></div>
            <div class="lightbox-caption" id="lightbox-caption"></div>
        </div>
    </div>
    
    <script>
        // Test data from PHP
        const tests = <?php echo $tests_json; ?>;
    </script>
    <script>
        // Load Resemble.js and then load our script
        (function() {
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/resemblejs@5.0.0/resemble.min.js';
            script.onload = function() {
                // Resemble.js is loaded, now load our script
                const ourScript = document.createElement('script');
                ourScript.src = 'script.js';
                document.body.appendChild(ourScript);
            };
            script.onerror = function() {
                console.error('Failed to load Resemble.js from CDN');
                // Still load our script so it can show an error
                const ourScript = document.createElement('script');
                ourScript.src = 'script.js';
                document.body.appendChild(ourScript);
            };
            document.body.appendChild(script);
        })();
    </script>
</body>
</html>
