<?php

namespace Blockera\WordPress\RenderBlock\Traits;

/**
 * Trait ClassnameManagement
 * 
 * Provides classname management utilities including unique classname generation and management.
 * 
 * Unique Classname Strategy:
 * -------------------------
 * This trait implements a global registry system to ensure all blocks rendered during a single
 * request receive unique classnames, preventing CSS conflicts and style bleeding between blocks.
 * 
 * How it works:
 * 1. Each block generates a base classname from its blockeraPropsId hash
 * 2. Before using the classname, it checks the global registry for collisions
 * 3. If collision detected, generates a new unique classname with suffix
 * 4. Registers the classname to prevent future collisions
 * 5. Registry is cleared at the start of each request (wp, rest_api_init, admin-ajax)
 * 
 * Benefits:
 * - Guarantees unique classnames across all blocks in a page/post
 * - Prevents CSS specificity conflicts
 * - Maintains cache integrity while ensuring uniqueness
 * - Thread-safe for single request context
 * 
 * @package Blockera\WordPress\RenderBlock\Traits
 */
trait ClassnameManagement {

	/**
	 * Static registry to track all used classnames across all block renders.
	 * This ensures unique classnames between all blocks during a single request.
	 *
	 * @var array $used_classnames_registry Global registry of used classnames.
	 */
	protected static array $used_classnames_registry = [];

	/**
	 * Global css props classes.
	 *
	 * @var array
	 */
	protected array $global_css_props_classes = [];

	/**
	 * Set the global css props classes.
	 *
	 * @param array $global_css_props_classes The global css props classes.
	 *
	 * @return void
	 */
	public function setGlobalCssPropsClasses( array $global_css_props_classes): void {
		$this->global_css_props_classes = $global_css_props_classes;
	}

	/**
	 * Compute final CSS with unique classname ensuring no collision with other blocks.
	 * This method checks against the global registry and generates a new hash if collision detected.
	 *
	 * @param string $base_classname The base classname (e.g., 'blockera-block-abc123').
	 * @param array  $block The block array containing block data.
	 *
	 * @return array The output array containing the unique classname and if it was updated.
	 * 
	 * @example
	 * [
	 *     'classname' => 'blockera-block-abc123',
	 *     'updated' => true,
	 *     'computed_css' => 'p.blockera-block-abc123 { color: red; }',
	 * ]
	 */
	protected function computeFinalCSS( string $base_classname, array $block): array {

		// Initialize output structure - always return this format.
		$output = [
			'classname' => $base_classname,
			'updated' => false,
			'computed_css' => '',
		];

		// Early exit if blockeraComputedCss is not set.
		if ( ! isset($block['attrs']['blockeraComputedCss']) ) {
			return $output;
		}

		// Decode the computed CSS from base64.
		$computed_css           = base64_decode($block['attrs']['blockeraComputedCss'], true);
		$output['computed_css'] = $computed_css;

		// Normalize CSS for hashing by replacing classname with placeholder.
		// This ensures blocks with same styles but different classnames hash to the same value.
		$normalized_base_for_hash = str_replace(' ', '.', $base_classname);
		$normalized_css_for_hash  = preg_replace(
			'/' . preg_quote('.' . $normalized_base_for_hash, '/') . '/',
			'__BLOCKERA_CLASSNAME_PLACEHOLDER__',
			$computed_css
		);

		// Calculate hash of the normalized CSS to identify unique CSS content.
		// This hash ignores the classname, so blocks with same styles hash the same.
		$css_hash = md5($normalized_css_for_hash);

		// Check if this CSS hash is already registered with a classname.
		if ( isset(self::$used_classnames_registry[ $css_hash ]) ) {
			$registered_classname = self::$used_classnames_registry[ $css_hash ];

			// If the registered classname matches our base classname, reuse it.
			// This means same block with same CSS - no need to update.
			if ( $registered_classname === $base_classname ) {
				return $output;
			}

			// Same CSS content but different base classname.
			// Reuse the existing unique classname that was already created for this CSS.
			// This prevents duplicate CSS when multiple blocks have the same computed CSS.
			$output['classname'] = $registered_classname;
			$output['updated']   = true;

			// Update the computed CSS to use the registered classname instead of base classname.
			$normalized_base        = str_replace(' ', '.', $base_classname);
			$normalized_registered  = str_replace(' ', '.', $registered_classname);
			$output['computed_css'] = str_replace('.' . $normalized_base, '.' . $normalized_registered, $computed_css);

			return $output;
		}

		// CSS hash is not registered. Check if base_classname is already used with different CSS.
		if ( isset(self::$used_classnames_registry[ $base_classname ]) ) {
			$registered_hash = self::$used_classnames_registry[ $base_classname ];

			// If the registered hash matches our CSS hash, reuse the classname.
			if ( $registered_hash === $css_hash ) {
				return $output;
			}

			// Collision: Same base classname but different CSS content.
			// Generate a new unique classname with random suffix.
			$unique_suffix = '-' . blockera_get_small_random_hash();
			$new_classname = $base_classname . $unique_suffix;

			// Ensure the new classname doesn't collide.
			while ( isset(self::$used_classnames_registry[ $new_classname ]) ) {
				$unique_suffix = '-' . blockera_get_small_random_hash();
				$new_classname = $base_classname . $unique_suffix;
			}

			// Update the computed CSS to use the new classname.
			$normalized_base        = str_replace(' ', '.', $base_classname);
			$normalized_new         = str_replace(' ', '.', $new_classname);
			$output['computed_css'] = str_replace('.' . $normalized_base, '.' . $normalized_new, $computed_css);

			// Register the new unique classname with the normalized CSS hash.
			// Use the same normalized hash so blocks with same styles hash the same.
			self::$used_classnames_registry[ $css_hash ]      = $new_classname;
			self::$used_classnames_registry[ $new_classname ] = $css_hash;

			$output['classname'] = $new_classname;
			$output['updated']   = true;

			return $output;
		}

		// No collision detected. Register and return the base classname.
		self::$used_classnames_registry[ $css_hash ]       = $base_classname;
		self::$used_classnames_registry[ $base_classname ] = $css_hash;

		return $output;
	}

	/**
	 * Check if a classname is already registered in the global registry.
	 *
	 * @param string $classname The classname to check.
	 *
	 * @return bool True if classname is already registered, false otherwise.
	 */
	protected function isClassnameRegistered( string $classname): bool {

		return isset(self::$used_classnames_registry[ $classname ]);
	}

	/**
	 * Register a classname in the global registry.
	 *
	 * @param string $classname The classname to register.
	 * @param string $blockera_props_id The blockeraPropsId for tracking.
	 *
	 * @return void
	 */
	protected function registerClassname( string $classname, string $blockera_props_id): void {

		self::$used_classnames_registry[ $classname ] = $blockera_props_id;
	}

	/**
	 * Get all registered classnames from the global registry.
	 *
	 * @return array The array of registered classnames.
	 */
	protected function getRegisteredClassnames(): array {

		return self::$used_classnames_registry;
	}

	/**
	 * Clear the global classnames registry.
	 * Useful for testing or when starting a new request context.
	 *
	 * @return void
	 */
	public static function clearClassnamesRegistry(): void {

		self::$used_classnames_registry = [];
	}

	/**
	 * Extract the blockera unique classname from a full classname string.
	 *
	 * @param string $classname The full classname string.
	 *
	 * @return string|null The extracted blockera classname or null if not found.
	 */
	protected function extractBlockeraClassname( string $classname): ?string {

		if (preg_match(blockera_get_unique_class_name_regex(), $classname, $matches)) {

			return $matches[0];
		}

		return null;
	}

	/**
	 * Log classname collision for debugging purposes.
	 * Only logs in BLOCKERA_DEVELOPMENT mode.
	 *
	 * @param string $classname The colliding classname.
	 * @param string $blockera_props_id The current block's blockeraPropsId.
	 * @param array  $block The block array.
	 *
	 * @return void
	 */
	protected function logClassnameCollision( string $classname, string $blockera_props_id, array $block): void {

		$existing_props_id = self::$used_classnames_registry[ $classname ] ?? 'unknown';
		$block_name        = $block['blockName'] ?? 'unknown';

		// phpcs:disable WordPress.PHP.DevelopmentFunctions.error_log_error_log @debug-ignore
		error_log(
			sprintf(
				'[Blockera] Classname collision detected: "%s" - Block: %s, Current PropsId: %s, Existing PropsId: %s',
				$classname,
				$block_name,
				$blockera_props_id,
				$existing_props_id
			)
		);
		// phpcs:enable WordPress.PHP.DevelopmentFunctions.error_log_error_log
	}	
}
