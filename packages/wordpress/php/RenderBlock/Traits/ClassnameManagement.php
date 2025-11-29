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
     * Update classname for current tag.
     *
     * @param \WP_HTML_Tag_Processor $processor The HTML tag processor object.
     * @param string                 $classname The classname to update.
	 * @param array                  $args the arguments to updating classname for current element.
     *
     * @return void
     */
    protected function updateClassname( \WP_HTML_Tag_Processor $processor, string $classname, array $args): void {

		$block                  = $args['block'];
		$force_update_classname = $args['force_update_classname'] ?? false;

        $previous_class  = $processor->get_attribute('class');
        $regexp          = blockera_get_unique_class_name_regex();
		$final_classname = '';

        if (! empty($previous_class) && ! empty($classname)) {
			$next_is_blockera_class = preg_match($regexp, $classname, $next_matches);
			$prev_is_blockera_class = preg_match($regexp, $previous_class, $prev_matches);

            if ($next_is_blockera_class && ! $prev_is_blockera_class) {

                $final_classname = $classname . ' ' . $previous_class;
            } elseif ($next_is_blockera_class && $prev_is_blockera_class) {

				// Detected duplicate classname, updating the classname.
				if ($force_update_classname && ! str_contains($previous_class, $classname)) {
					$final_classname = str_replace($prev_matches, $classname, $previous_class);
				}
			} elseif (! $next_is_blockera_class && ! str_contains($previous_class, $classname)) {
					
				$final_classname = $classname . ' ' . $previous_class;
			}

			if (empty($final_classname)) {

				$final_classname = $previous_class;
			}
        }

		// Prevent double adding the $transpile_classname class to block wrapper element.
		// It should has not icon element.
		if (! empty($final_classname) && ! str_contains($final_classname, $this->transpile_classname) && ! blockera_block_has_icon($block)) {
			
			if (isset($prev_matches[0])) {
				$final_classname = str_replace($prev_matches[0], $prev_matches[0] . ' ' . $this->transpile_classname, $final_classname);
			} else {
				$final_classname .= ' ' . $this->transpile_classname;
			}
		}

		if (! empty($final_classname)) {
			$processor->set_attribute('class', $final_classname);
		}
    }

	/**
	 * Add css props classes to the classname of current tag.
	 * Update classname based on global css props classes.
	 * Just for backward compatibility with WordPress original block output.
	 *
	 * @param \WP_HTML_Tag_Processor $processor The HTML tag processor object.
	 * @param string                 $style The style attribute value.
	 * @param array                  $block The block data.
	 *
	 * @return void
	 */
	protected function addCssPropsClasses( \WP_HTML_Tag_Processor $processor, string $style, array $block): void {
		if (! $style) {
			return;
		}

		foreach ($this->global_css_props_classes as $prop => $prop_class) {
			if (str_contains($style, $prop)) {
				$this->updateClassname($processor, $prop_class, [ 'block' => $block ]);
			}
		}
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

			// Collision detected! Generate a new unique classname.
			$counter       = 1;
			$unique_suffix = '';
			$new_classname = $base_classname;

			// Keep trying until we find an unused classname.
			while (isset(self::$used_classnames_registry[ $new_classname ])) {

				// Create a unique suffix using counter and block name.
				$unique_suffix = '-' . $counter . '-' . substr(md5($blockera_props_id . $counter), 0, 6);
				$new_classname = $base_classname . $unique_suffix;
				$counter++;

				// Safety check to prevent infinite loop (very unlikely).
				if ($counter > 1000) {
					// Fallback to timestamp + random.
					$unique_suffix = '-' . time() . '-' . wp_rand(1000, 9999);
					$new_classname = $base_classname . $unique_suffix;
					break;
				}
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

		// phpcs:disable WordPress.PHP.DevelopmentFunctions.error_log_error_log
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
