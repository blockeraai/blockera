<?php

namespace Blockera\Editor;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Bulk Actions Handler for Blockera
 *
 * Handles bulk action "Edit all in one window" for post types that support block editor.
 * Only runs in admin area, never affects frontend.
 *
 * @package Blockera
 * @since 2.0.0
 */
class BulkActions {

	/**
	 * Action slug for our bulk action.
	 *
	 * @var string
	 */
	const ACTION_SLUG = 'blockera_edit_all';

	/**
	 * Cache for post types that support block editor.
	 *
	 * @var array
	 */
	private static $block_editor_post_types_cache = array();

	/**
	 * Initialize the bulk actions handler.
	 * Only runs in admin area
	 */
	public function __construct() {
		// Only run in admin area, never on frontend.
		if ( ! is_admin() ) {
			return;
		}

		$this->register_hooks();
	}

	/**
	 * Register all hooks for bulk actions.
	 */
	private function register_hooks() {
		// Register bulk action filters for standard post types immediately.
		add_filter( 'bulk_actions-edit-post', array( $this, 'add_bulk_action' ) );
		add_filter( 'bulk_actions-edit-page', array( $this, 'add_bulk_action' ) );
		add_filter( 'handle_bulk_actions-edit-post', array( $this, 'handle_bulk_action' ), 10, 3 );
		add_filter( 'handle_bulk_actions-edit-page', array( $this, 'handle_bulk_action' ), 10, 3 );

		// Register bulk action filters for custom post types.
		// Use priority 20 to ensure post types are registered.
		add_action( 'admin_init', array( $this, 'register_custom_post_type_filters' ), 20 );

		// Capture bulk_edit_ids before editor initializes.
		add_action( 'admin_print_scripts-post.php', array( $this, 'capture_bulk_edit_ids' ), 1 );

		// Fix redirect URL if post parameter was removed.
		add_action( 'load-post.php', array( $this, 'fix_redirect_url' ) );
	}

	/**
	 * Register bulk action filters for custom post types that support block editor.
	 */
	public function register_custom_post_type_filters() {
		// Get all post types with UI.
		$post_types = get_post_types( array( 'show_ui' => true ), 'names' );

		foreach ( $post_types as $post_type ) {
			// Skip post and page as they're already registered.
			if ( in_array( $post_type, array( 'post', 'page' ), true ) ) {
				continue;
			}

			// Only register if post type supports block editor.
			if ( $this->post_type_supports_block_editor( $post_type ) ) {
				$screen_id = "edit-{$post_type}";
				add_filter( "bulk_actions-{$screen_id}", array( $this, 'add_bulk_action' ) );
				add_filter( "handle_bulk_actions-{$screen_id}", array( $this, 'handle_bulk_action' ), 10, 3 );
			}
		}
	}

	/**
	 * Add bulk action to posts list.
	 * Places it after "edit" if exists, otherwise at the end.
	 *
	 * @param array $actions Existing bulk actions.
	 * @return array Modified bulk actions.
	 */
	public function add_bulk_action( $actions ) {
		$screen = get_current_screen();

		// Only add to post type list screens.
		if ( ! $screen || 0 !== strpos( $screen->id, 'edit-' ) ) {
			return $actions;
		}

		// Extract post type from screen ID.
		$post_type = str_replace( 'edit-', '', $screen->id );

		// Only add if post type supports block editor.
		if ( ! $this->post_type_supports_block_editor( $post_type ) ) {
			return $actions;
		}

		// Check if "edit" action exists.
		if ( isset( $actions['edit'] ) ) {
			// Insert after "edit" action.
			$new_actions = array();
			foreach ( $actions as $key => $value ) {
				$new_actions[ $key ] = $value;
				// Insert our action right after "edit".
				if ( 'edit' === $key ) {
					$new_actions[ self::ACTION_SLUG ] = __( 'Edit All in Editor', 'blockera' );
				}
			}
			return $new_actions;
		}

		// If "edit" doesn't exist, add at the end.
		$actions[ self::ACTION_SLUG ] = __( 'Edit All in Editor', 'blockera' );

		return $actions;
	}

	/**
	 * Handle bulk action to redirect to editor with multiple posts.
	 *
	 * @param string $sendback The redirect URL.
	 * @param string $doaction The action being taken.
	 * @param array  $post_ids The post IDs to take the action on.
	 * @return string Modified redirect URL.
	 */
	public function handle_bulk_action( $sendback, $doaction, $post_ids ) {
		// Only handle our custom action.
		if ( self::ACTION_SLUG !== $doaction ) {
			return $sendback;
		}

		// Validate and sanitize post IDs.
		$valid_post_ids = $this->validate_post_ids( $post_ids );
		if ( empty( $valid_post_ids ) ) {
			return $sendback;
		}

		// Get post type from first post.
		$post_type = $this->get_post_type_from_ids( $valid_post_ids );
		if ( ! $post_type ) {
			return $sendback;
		}

		// Verify post type supports block editor.
		if ( ! $this->post_type_supports_block_editor( $post_type ) ) {
			return $sendback;
		}

		// Filter posts by user capabilities.
		$editable_post_ids = $this->filter_editable_posts( $valid_post_ids, $post_type );
		if ( empty( $editable_post_ids ) ) {
			return $sendback;
		}

		// Build and return editor URL.
		return $this->build_editor_url( $editable_post_ids );
	}

	/**
	 * Capture bulk_edit_ids from URL before editor initializes.
	 * This prevents the editor from removing the parameter
	 */
	public function capture_bulk_edit_ids() {
		// Only run on post editor pages.
		global $pagenow;
		if ( 'post.php' !== $pagenow ) {
			return;
		}

		// Check if bulk_edit_ids parameter exists.
		if ( ! isset( $_GET['bulk_edit_ids'] ) ) {
			return;
		}

		$bulk_edit_ids = sanitize_text_field( $_GET['bulk_edit_ids'] );
		$post_id       = isset( $_GET['post'] ) ? absint( $_GET['post'] ) : 0;

		if ( empty( $bulk_edit_ids ) || ! $post_id ) {
			return;
		}

		// Get post type (cached by WordPress).
		$post_type = get_post_type( $post_id );
		if ( ! $post_type ) {
			return;
		}

		// Output inline script to store in sessionStorage.
		$this->output_capture_script( $bulk_edit_ids, $post_type );
	}

	/**
	 * Fix redirect URL if post parameter was removed by WordPress.
	 */
	public function fix_redirect_url() {
		// Check if we have bulk_edit_ids but no post parameter.
		if ( ! isset( $_GET['bulk_edit_ids'] ) || isset( $_GET['post'] ) ) {
			return;
		}

		$bulk_edit_ids = sanitize_text_field( $_GET['bulk_edit_ids'] );
		$post_ids      = $this->parse_post_ids( $bulk_edit_ids );

		if ( empty( $post_ids ) ) {
			return;
		}

		// Get the first post ID.
		$first_post_id = array_shift( $post_ids );

		// Build correct URL and redirect.
		$redirect_url = $this->build_editor_url( array_merge( array( $first_post_id ), $post_ids ) );
		wp_safe_redirect( $redirect_url );
		exit;
	}

	/**
	 * Check if post type supports block editor (with caching).
	 *
	 * @param string $post_type Post type to check.
	 * @return bool True if supports block editor.
	 */
	private function post_type_supports_block_editor( $post_type ) {
		// Check cache first.
		if ( isset( self::$block_editor_post_types_cache[ $post_type ] ) ) {
			return self::$block_editor_post_types_cache[ $post_type ];
		}

		// Check if function exists and post type supports block editor.
		$supports = function_exists( 'use_block_editor_for_post_type' )
			&& use_block_editor_for_post_type( $post_type );

		// Cache the result.
		self::$block_editor_post_types_cache[ $post_type ] = $supports;

		return $supports;
	}

	/**
	 * Validate and sanitize post IDs.
	 *
	 * @param array $post_ids Raw post IDs.
	 * @return array Validated and sanitized post IDs.
	 */
	private function validate_post_ids( $post_ids ) {
		if ( empty( $post_ids ) || ! is_array( $post_ids ) ) {
			return array();
		}

		// Sanitize post IDs.
		$post_ids = array_map( 'absint', $post_ids );
		$post_ids = array_filter( $post_ids );

		return $post_ids;
	}

	/**
	 * Get post type from first post ID.
	 *
	 * @param array $post_ids Post IDs.
	 * @return string|false Post type or false on failure.
	 */
	private function get_post_type_from_ids( $post_ids ) {
		if ( empty( $post_ids ) ) {
			return false;
		}

		$first_post = get_post( $post_ids[0] );
		if ( ! $first_post ) {
			return false;
		}

		return $first_post->post_type;
	}

	/**
	 * Filter posts by user edit capabilities.
	 *
	 * @param array  $post_ids Post IDs to check.
	 * @param string $post_type Post type.
	 * @return array Post IDs user can edit.
	 */
	private function filter_editable_posts( $post_ids, $post_type ) {
		$post_type_object = get_post_type_object( $post_type );
		if ( ! $post_type_object ) {
			return array();
		}

		$editable_ids = array();
		foreach ( $post_ids as $post_id ) {
			$post = get_post( $post_id );
			// Verify post exists, is correct type, and user can edit it.
			if ( $post
				&& $post->post_type === $post_type
				&& current_user_can( $post_type_object->cap->edit_post, $post_id )
			) {
				$editable_ids[] = $post_id;
			}
		}

		return $editable_ids;
	}

	/**
	 * Build editor URL with post IDs.
	 *
	 * @param array $post_ids All post IDs (first will be main post, rest in bulk_edit_ids).
	 * @return string Editor URL.
	 */
	private function build_editor_url( $post_ids ) {
		if ( empty( $post_ids ) ) {
			return admin_url( 'edit.php' );
		}

		// Get first post ID for main editor URL.
		$first_post_id = array_shift( $post_ids );

		// Build editor URL.
		$editor_url = admin_url( 'post.php' );
		$editor_url = add_query_arg( 'post', $first_post_id, $editor_url );
		$editor_url = add_query_arg( 'action', 'edit', $editor_url );

		// Add ALL post IDs (including first) as bulk_edit_ids parameter.
		// This ensures we don't lose the first post ID when WordPress removes the 'post' parameter!.
		$all_post_ids  = array_merge( array( $first_post_id ), $post_ids );
		$bulk_edit_ids = implode( ',', $all_post_ids );
		$editor_url    = add_query_arg( 'bulk_edit_ids', $bulk_edit_ids, $editor_url );

		return $editor_url;
	}

	/**
	 * Parse comma-separated post IDs string.
	 *
	 * @param string $bulk_edit_ids Comma-separated post IDs.
	 * @return array Parsed post IDs
	 */
	private function parse_post_ids( $bulk_edit_ids ) {
		if ( empty( $bulk_edit_ids ) ) {
			return array();
		}

		$post_ids = array_map( 'absint', explode( ',', $bulk_edit_ids ) );
		$post_ids = array_filter( $post_ids );

		return $post_ids;
	}

	/**
	 * Output inline script to capture bulk_edit_ids in sessionStorage.
	 *
	 * @param string $bulk_edit_ids Comma-separated post IDs.
	 * @param string $post_type Post type.
	 */
	private function output_capture_script( $bulk_edit_ids, $post_type ) {
		$ids_key       = blockera_get_scoped_storage_key( 'blockera_tabs_bulk_edit_ids' );
		$post_type_key = blockera_get_scoped_storage_key( 'blockera_tabs_bulk_edit_post_type' );
		?>
		<script type="text/javascript">
			(function() {
				// Capture immediately when script runs (before React/editor initializes).
				var bulkEditIds = <?php echo wp_json_encode( $bulk_edit_ids ); ?>;
				var postType = <?php echo wp_json_encode( $post_type ); ?>;
				var idsKey = <?php echo wp_json_encode( $ids_key ); ?>;
				var postTypeKey = <?php echo wp_json_encode( $post_type_key ); ?>;

				if ( typeof Storage !== 'undefined' ) {
					try {
						sessionStorage.setItem( idsKey, bulkEditIds );
						sessionStorage.setItem( postTypeKey, postType );
					} catch ( e ) {
						// sessionStorage might be disabled, fallback to global variable.
						window.blockeraTabsBulkEditIds = bulkEditIds;
						window.blockeraTabsBulkEditPostType = postType;
					}
				} else {
					// Fallback to global variable if sessionStorage not available.
					window.blockeraTabsBulkEditIds = bulkEditIds;
					window.blockeraTabsBulkEditPostType = postType;
				}
			})();
		</script>
		<?php
	}
}
