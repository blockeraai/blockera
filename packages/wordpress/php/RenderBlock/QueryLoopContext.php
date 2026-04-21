<?php

namespace Blockera\WordPress\RenderBlock;

/**
 * Query Loop Render Context Tracker
 *
 * Tracks when WordPress renders blocks inside a Query Loop block (core/query).
 * Provides a lightweight stack-based context tracker with hooks for Blockera code
 * to react to blocks rendered inside query loops.
 *
 * @package Blockera\WordPress\RenderBlock
 */
class QueryLoopContext {

	/**
	 * Static stack of query loop frames.
	 * Each frame represents a nested query loop being rendered.
	 *
	 * @var array<int, array{
	 *   depth: int,
	 *   blockName: string,
	 *   queryId: string|null,
	 * }>
	 */
	private static array $stack = [];

	/**
	 * Flag to track if hooks have been registered.
	 *
	 * @var bool
	 */
	private static bool $hooks_registered = false;

	/**
	 * List of block names that are considered query loops.
	 * Associative array for O(1) lookup performance using isset().
	 *
	 * @var array<string, bool>
	 */
	private static array $query_loop_blocks = [
		'core/query'       => true,
		'core/terms-query' => true,
		'core/comments'     => true,
		'blocksy/query'     => true,
		'blocksy/tax-query' => true,
	];

	/**
	 * Handle entry into a Query Loop block.
	 *
	 * This is called from pre_render_block hook BEFORE WordPress renders
	 * the inner blocks of the query loop. Pushes a frame onto the stack
	 * and fires the 'blockera/query_loop/enter' action.
	 *
	 * @param array          $parsed_block  The parsed block array.
	 * @param \WP_Block|null $parent_block  The parent block instance, if nested.
	 *
	 * @return void
	 */
	public static function enter( array $parsed_block, ?\WP_Block $parent_block = null ): void {
		// Push frame onto stack (O(1) operation).
		// Calculate depth from current stack size before pushing.
		self::$stack[] = [
			'depth'    => count(self::$stack) + 1,
			'blockName' => $parsed_block['blockName'] ?? null,
			'queryId'   => $parsed_block['attrs']['queryId'] ?? null,
		];
	}

	/**
	 * Handle exit from a Query Loop block.
	 *
	 * This is called from render_block hook AFTER WordPress has rendered
	 * the block and its inner blocks. Pops the frame from the stack
	 * and fires the 'blockera/query_loop/exit' action.
	 *
	 * @param array          $parsed_block  The parsed block array.
	 * @param \WP_Block|null $parent_block  The parent block instance, if nested.
	 *
	 * @return void
	 */
	public static function leave( array $parsed_block, ?\WP_Block $parent_block = null ): void {
		// Pop frame from stack (O(1) operation).
		// array_pop() returns null if stack is empty, which is safe to ignore.
		array_pop(self::$stack);
	}

	/**
	 * Get the current stack depth (number of nested query loops).
	 *
	 * @return int The current depth (0 if not inside any query loop).
	 */
	public static function getDepth(): int {
		return count(self::$stack);
	}

	/**
	 * Check if currently inside a Query Loop.
	 *
	 * @return bool True if stack depth > 0, false otherwise.
	 */
	public static function isInside(): bool {
		// Direct array check is faster than count() for empty check.
		return ! empty(self::$stack);
	}

	/**
	 * Get the current query loop frame (top of stack).
	 *
	 * @return array|null The current frame array, or null if not inside a query loop.
	 */
	public static function getCurrentFrame(): ?array {
		// end() returns false for empty array, cast to null for type safety.
		// Direct access to last element is faster when we know array exists.
		return empty(self::$stack) ? null : end(self::$stack);
	}

	/**
	 * Reset the stack (useful for testing or edge cases).
	 *
	 * @return void
	 */
	public static function reset(): void {
		self::$stack = [];
	}

	/**
	 * Check if currently inside a Query Loop (alias for isInside).
	 *
	 * @return bool True if inside a query loop, false otherwise.
	 */
	public static function isInLoop(): bool {
		return self::isInside();
	}

	/**
	 * Check if a block name is a query loop block.
	 *
	 * Uses isset() for O(1) lookup performance instead of in_array().
	 * isset() safely handles null values, so no explicit null check needed.
	 *
	 * @param string|null $block_name The block name to check.
	 *
	 * @return bool True if the block is a query loop block, false otherwise.
	 */
	private static function isQueryLoopBlock( ?string $block_name ): bool {
		// isset() returns false for null, so no explicit null check needed.
		return isset(self::$query_loop_blocks[ $block_name ]);
	}

	/**
	 * Register WordPress hooks for Query Loop detection.
	 *
	 * This method registers the pre_render_block and render_block filters
	 * to detect when WordPress enters/exits Query Loop blocks.
	 *
	 * @return void
	 */
	public static function register(): void {
		// Only register hooks once.
		if (self::$hooks_registered) {
			return;
		}

		// Register pre_render_block hook to detect Query Loop entry and inner blocks.
		// Priority 5 ensures this runs before the render_block filter at priority 10.
		// The pre_render_block hook fires BEFORE WordPress renders inner blocks,
		// allowing us to detect entry into query loop blocks before any child blocks are processed.
		add_filter(
			'pre_render_block',
			function ( $pre_render, array $parsed_block, ?\WP_Block $parent_block = null ) {
				// Only record DOM order when no earlier filter short-circuited; otherwise render_block will not run for this block.
				if ( null === $pre_render ) {
					Render::registerBlockDomOrderSlot( $parsed_block );
				}

				$block_name = $parsed_block['blockName'] ?? null;

				// Early return if not a query loop block and stack is empty (performance optimization).
				// Check isInside() first as it's faster (empty check vs isset lookup).
				if (! self::isInside() && ! self::isQueryLoopBlock($block_name)) {
					return $pre_render;
				}

				// Detect entry into Query Loop block.
				if (self::isQueryLoopBlock($block_name)) {
					self::enter($parsed_block, $parent_block);
				}

				return $pre_render;
			},
			5,
			3
		);

		// Register late-priority render_block hook to detect Query Loop exit.
		// This runs after the main render_block filter to ensure exit detection
		// happens after all block processing is complete.
		add_filter(
			'render_block',
			function ( string $html, array $block, ?\WP_Block $instance = null ) {
				// Detect exit from Query Loop block.
				// This runs at priority 999, after all other render_block filters.
				// Only check if we're inside a loop (early exit optimization).
				if (self::isInside() && self::isQueryLoopBlock($block['blockName'] ?? null)) {
					self::leave($block, $instance);
				}

				return $html;
			},
			999,
			3
		);

		self::$hooks_registered = true;
	}
}
