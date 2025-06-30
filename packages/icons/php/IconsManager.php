<?php

namespace Blockera\Icons;

/**
 * Class IconsManager.
 * 
 * Manages icon libraries and provides methods for retrieving icon information.
 */
class IconsManager {

    /** @var array|null Cache of icon libraries. */
    protected static $libraries = null;

    /** @var array Mapping of library names to icon directory paths. */
    protected static $icon_dirs = [];

    /** @var array Mapping of library names to relative icon paths. */
    protected static $icon_paths = [
		'wp' => 'js/library-wp/icons/',
        'ui' => 'js/library-ui/icons/',
        'blockera' => 'js/library-blockera/icons/',
        'cursor' => 'js/library-cursor/icons/',
    ];

	public function __construct() {
		$dir = dirname(__DIR__);
		
		self::$icon_dirs = [
			'ui' => $dir . '/js/library-ui/icons',
			'wp' => $dir . '/js/library-wp/icons',
			'cursor' => $dir . '/js/library-cursor/icons',
			'blockera' => $dir . '/js/library-blockera/icons',
		];
	}

    /**
     * Converts a string to PascalCase.
     *
     * @param string $str The string to convert.
	 * 
     * @return string The PascalCase string.
     */
    protected static function pascalCase( $str) {
        // Remove extension, split by non-alphanumeric, capitalize, join.
        $str   = preg_replace('/\.[^.]+$/', '', $str);
        $parts = preg_split('/[^a-zA-Z0-9]+/', $str);
        $parts = array_map('ucfirst', $parts);

        return implode('', $parts);
    }

    /**
     * Builds the libraries array by scanning icon directories.
     *
     * @return array The built libraries array.
     */
    protected static function buildLibraries() {
        $libraries = [];

        foreach (self::$icon_dirs as $lib => $dir) {
            $libraries[ $lib ] = [];

			if (! is_dir($dir)) {
                continue;
            }

            $files = scandir($dir);

            foreach ($files as $file) {
                if (substr($file, -4) === '.svg') {
                    $iconName                       = self::pascalCase($file);
                    $libraries[ $lib ][ $iconName ] = self::$icon_paths[ $lib ] . $file;
                }
            }
        }

        return $libraries;
    }

    /**
     * Ensures libraries are loaded by building them if not already cached.
	 * 
	 * @return void
     */
    protected static function ensureLibraries(): void {
        if (null === self::$libraries) {
            self::$libraries = self::buildLibraries();
        }
    }

    /**
     * Checks if a given icon library is valid.
     *
     * @param string $library The library name to check.
	 * 
     * @return bool Whether the library exists.
     */
    public static function isValidIconLibrary( $library) {
        self::ensureLibraries();

        return isset(self::$libraries[ $library ]);
    }

    /**
     * Gets all icons from a specific library or all libraries.
     *
     * @param string $library The library name or 'all' for all libraries.
	 * 
     * @return array The library icons or all libraries.
     */
    public static function getIconLibrary( $library = 'all') {
        self::ensureLibraries();

        if ('all' === $library) {
            return self::$libraries;
        }

        return self::isValidIconLibrary($library) ? self::$libraries[ $library ] : [];
    }

    /**
     * Gets all icons from a specific library.
     *
     * @param string $library The library name.
	 * 
     * @return array The library icons.
     */
    public static function getIconLibraryIcons( $library) {
        self::ensureLibraries();

        return self::isValidIconLibrary($library) ? self::$libraries[ $library ] : [];
    }

    /**
     * Gets a specific icon from a library.
     *
     * @param string $iconName The name of the icon.
     * @param string $library The library name, defaults to 'ui'.
     * @param bool   $standardize Whether to return standardized icon object.
	 * 
     * @return array|null The icon data or null if not found.
     */
    public static function getIcon( $iconName, $library = 'ui', $standardize = true) {
        self::ensureLibraries();

		if ('wp' === $library) {
			$icon = '<span class="dashicons dashicons-' . $iconName . '"></span>';

			return $standardize
				? self::createStandardIconObject($iconName, $library, $icon)
				: [
					'iconName' => $iconName,
					'library' => $library,
					'icon' => $icon,
				];
		}

        if (! self::isValidIconLibrary($library)) {
            return null;
        }

        $icons = self::$libraries[ $library ];

        if (! isset($icons[ $iconName ])) {
            return null;
        }

        $icon = $icons[ $iconName ];

        return $standardize
            ? self::createStandardIconObject($iconName, $library, $icon)
            : [
				'iconName' => $iconName,
				'library' => $library,
				'icon' => $icon,
			];
    }

    /**
     * Creates a standardized icon object.
     *
     * @param string $iconName The name of the icon.
     * @param string $library The library name.
     * @param string $icon The icon path.
	 * 
     * @return array The standardized icon object.
     */
    public static function createStandardIconObject( $iconName, $library, $icon) {
        return [
			'icon' => $icon,
			'iconName' => $iconName,
			'library' => $library,
		];
    }
}
