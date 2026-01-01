<?php
/**
 * Snapshot Screenshots Comparison Tool
 * 
 * Browser-accessible development tool for comparing test snapshot images.
 * Access via: http://yoursite.local/wp-content/plugins/blockera/bin/snapshot-screenshots/
 * 
 * Only works in development mode.
 */

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

// Get plugin directory
$plugin_dir = dirname(dirname(__DIR__));
$fixtures_dir = $plugin_dir . '/tests/fixtures';

// Scan fixtures directory
$tests = [];
if (is_dir($fixtures_dir)) {
    $fixture_folders = array_filter(glob($fixtures_dir . '/*'), 'is_dir');
    
    foreach ($fixture_folders as $fixture_folder) {
        $test_id = basename($fixture_folder);
        $snapshot_dir = $fixture_folder . '/snapshot';
        
        if (!is_dir($snapshot_dir)) {
            continue;
        }
        
        // Expected image patterns
        $image_types = [
            'editor-desktop' => "test-{$test_id}-editor-desktop.png",
            'editor-mobile' => "test-{$test_id}-editor-mobile.png",
            'frontend-desktop' => "test-{$test_id}-frontend-desktop.png",
            'frontend-mobile' => "test-{$test_id}-frontend-mobile.png",
        ];
        
        $test_data = [
            'id' => $test_id,
            'images' => [],
        ];
        
        // Check each image file
        foreach ($image_types as $key => $filename) {
            $file_path = $snapshot_dir . '/' . $filename;
            $exists = file_exists($file_path);
            
            // Convert to web-accessible URL
            $relative_path = str_replace($plugin_dir, '', $file_path);
            $url = content_url('/plugins/blockera' . $relative_path);
            
            // Alternative: use site_url if content_url doesn't work
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
                <div class="threshold-control">
                    <label for="threshold-input" class="threshold-label">Threshold (%):</label>
                    <input type="number" id="threshold-input" class="threshold-input" value="3" min="0" max="100" step="0.1">
                </div>
                <div class="nav-buttons">
                    <button class="nav-btn" id="btn-prev" onclick="navigateToFailing(-1)">← Previous Failing</button>
                    <button class="nav-btn" id="btn-next" onclick="navigateToFailing(1)">Next Failing →</button>
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
