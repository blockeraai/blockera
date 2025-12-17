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
	 * Generate a unique classname ensuring no collision with other blocks.
	 * This method checks against the global registry and generates a new hash if collision detected.
	 *
	 * @param string $base_classname The base classname (e.g., 'blockera-block-abc123').
	 * @param string $blockera_props_id The blockeraPropsId attribute value.
	 * @param array  $block The block array containing block data.
	 *
	 * @return string The unique classname guaranteed to be unique across all blocks.
	 */
	protected function ensureUniqueClassname( string $base_classname, string $blockera_props_id, array $block): string {

		// Check if the base classname is already used by another block.
		if (isset(self::$used_classnames_registry[ $base_classname ])) {

			// Check if it's the same block (by blockeraPropsId).
			if (self::$used_classnames_registry[ $base_classname ] === $blockera_props_id) {

				// Same block, return the existing classname.
				return $base_classname;
			}

			// Collision detected! Generate a new unique classname using random hash.
			$unique_suffix = '-' . blockera_get_small_random_hash();
			$new_classname = $base_classname . $unique_suffix;

			// In the extremely unlikely case of another collision, generate one more time.
			if (isset(self::$used_classnames_registry[ $new_classname ])) {
				$unique_suffix = '-' . blockera_get_small_random_hash();
				$new_classname = $base_classname . $unique_suffix;
			}

			// Register the new unique classname.
			self::$used_classnames_registry[ $new_classname ] = $blockera_props_id;

			return $new_classname;
		}

		// No collision, register and return the base classname.
		self::$used_classnames_registry[ $base_classname ] = $blockera_props_id;

		return $base_classname;
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
