<?php

namespace Blockera\Editor;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Tab Locking Handler for Blockera.
 *
 * Handles all post locking functionality for tabbed editing.
 * Integrates with WordPress core post locking system (post meta: _edit_lock).
 *
 * WordPress Post Locking Overview:
 * - Locks expire after ~150 seconds (wp_check_post_lock_window filter)
 * - wp_check_post_lock() returns the user ID if another user has the lock
 * - wp_set_post_lock() sets/refreshes the lock for the current user
 *
 * Our Implementation:
 * - check_post_locks: Read-only check of lock status (no side effects)
 * - takeover_post_lock: Force-acquire lock for current user (single post)
 * - refresh_post_locks: Refresh our locks AND check for takeovers (bulk)
 *
 * @package Blockera
 * @since 2.0.0
 */
class TabLocking {

	/**
	 * Nonce action for checking locks.
	 *
	 * @var string
	 */
	const NONCE_CHECK = 'blockera_tabs_check_locks';

	/**
	 * Nonce action for takeover.
	 *
	 * @var string
	 */
	const NONCE_TAKEOVER = 'blockera_tabs_takeover_lock';

	/**
	 * Initialize the tab locking handler.
	 * Only runs in admin area.
	 */
	public function __construct() {
		// Only run in admin area, never on frontend.
		if ( ! is_admin() ) {
			return;
		}

		$this->register_hooks();
	}

	/**
	 * Register all AJAX hooks for tab locking.
	 */
	private function register_hooks() {
		// AJAX handlers - only for logged-in users.
		add_action( 'wp_ajax_blockera_tabs_check_post_locks', array( $this, 'check_post_locks' ) );
		add_action( 'wp_ajax_blockera_tabs_takeover_post_lock', array( $this, 'takeover_post_lock' ) );
		add_action( 'wp_ajax_blockera_tabs_refresh_post_locks', array( $this, 'refresh_post_locks' ) );
	}

	/**
	 * Ensure post lock functions are available.
	 *
	 * WordPress lock functions are in wp-admin/includes/post.php.
	 * which may not be loaded during AJAX requests.
	 */
	private function ensure_lock_functions() {
		if ( ! function_exists( 'wp_check_post_lock' ) ) {
			require_once ABSPATH . 'wp-admin/includes/post.php';
		}
	}

	/**
	 * Check if a post ID is a Site Editor template identifier.
	 *
	 * Site Editor entities (templates, template parts, patterns, navigation)
	 * use string-based identifiers like "theme//slug" instead of numeric IDs.
	 *
	 * @param mixed $post_id The post ID to check.
	 * @return bool True if it's a template identifier, false otherwise. @since 2.0.0
	 */
	private function is_template_identifier( $post_id ) {
		return is_string( $post_id ) && strpos( $post_id, '//' ) !== false;
	}

	/**
	 * Resolve a post ID that might be a template identifier.
	 *
	 * Site Editor entities (templates, template parts, patterns) use string-based
	 * identifiers like "twentytwentyfive//author" instead of numeric post IDs.
	 * This method resolves the identifier to the actual database post ID (wp_id).
	 *
	 * @param mixed $post_id The post ID (numeric) or template identifier (string).
	 * @return int|null The resolved database post ID, or null if:
	 *                  - Invalid input.
	 *                  - Template identifier but file-based (no database record).
	 *                  - Template not found. @since 2.0.0
	 */
	private function resolve_post_id( $post_id ) {
		// If it's already a numeric ID, use absint.
		if ( is_numeric( $post_id ) ) {
			$resolved = absint( $post_id );
			return $resolved > 0 ? $resolved : null;
		}

		// Check if it's a template identifier (contains '//').
		if ( ! $this->is_template_identifier( $post_id ) ) {
			return null;
		}

		// Ensure block template functions are available.
		if ( ! function_exists( 'get_block_template' ) ) {
			return null;
		}

		// Try to get the template - first as wp_template, then as wp_template_part.
		$template = get_block_template( $post_id, 'wp_template' );

		if ( ! $template ) {
			$template = get_block_template( $post_id, 'wp_template_part' );
		}

		// If template exists and has a database record, return the wp_id.
		// File-based templates that haven't been customized have wp_id = null.
		if ( $template && ! empty( $template->wp_id ) ) {
			return (int) $template->wp_id;
		}

		// File-based template without database record, or template not found.
		return null;
	}

	/**
	 * Build user data array for lock response.
	 *
	 * Creates a consistent user data structure for AJAX responses.
	 * Includes avatar URL if avatars are enabled in WordPress settings.
	 *
	 * @param int $user_id The user ID who holds the lock.
	 * @return array User data with id, name, and optionally avatar.
	 */
	private function get_lock_user_data( $user_id ) {
		$user = get_userdata( $user_id );

		$user_data = array(
			'id'   => $user_id,
			'name' => $user ? $user->display_name : __( 'Another user', 'blockera' ),
		);

		// Include avatar if avatars are enabled in WordPress settings.
		if ( get_option( 'show_avatars' ) && $user ) {
			$user_data['avatar'] = get_avatar_url( $user_id, array( 'size' => 64 ) );
		}

		return $user_data;
	}

	/**
	 * AJAX handler to check post locks for multiple posts (read-only).
	 *
	 * This is a read-only operation that checks if posts are locked by other users.
	 * Used when opening a new tab to check the lock status before acquiring.
	 *
	 * Handles both numeric post IDs and Site Editor template identifiers
	 * (e.g., "twentytwentyfive//author"). File-based templates without
	 * database records are reported as not locked.
	 *
	 * Request: POST with postIds[] array (can contain numeric IDs or template identifiers)
	 * Response: { success: true, data: { locks: { [postId]: { isLocked, user } } } }
	 * 
	 * @since 2.0.0
	 */
	public function check_post_locks() {
		// Verify nonce.
		if ( ! check_ajax_referer( self::NONCE_CHECK, 'nonce', false ) ) {
			wp_send_json_error( array( 'message' => 'Invalid nonce' ), 403 );
		}

		// Get raw post IDs from request - sanitize but don't convert to int yet.
		// phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotSanitized
		$raw_post_ids = isset( $_POST['postIds'] ) ? (array) $_POST['postIds'] : array();
		$raw_post_ids = array_map( 'sanitize_text_field', $raw_post_ids );

		if ( empty( $raw_post_ids ) ) {
			wp_send_json_success( array( 'locks' => array() ) );
		}

		$this->ensure_lock_functions();

		$locks = array();

		foreach ( $raw_post_ids as $raw_post_id ) {
			// Resolve the post ID (handles both numeric and template identifiers).
			$resolved_post_id = $this->resolve_post_id( $raw_post_id );

			// If not resolvable (file-based template or invalid), report as not locked.
			if ( ! $resolved_post_id ) {
				$locks[ $raw_post_id ] = array(
					'isLocked' => false,
					'user'     => null,
				);
				continue;
			}

			// Check if user can edit this post.
			if ( ! current_user_can( 'edit_post', $resolved_post_id ) ) {
				$locks[ $raw_post_id ] = array(
					'isLocked' => false,
					'user'     => null,
				);
				continue;
			}

			// Check if post is locked by another user.
			$lock_user_id = wp_check_post_lock( $resolved_post_id );

			if ( $lock_user_id ) {
				// Post is locked by another user.
				$locks[ $raw_post_id ] = array(
					'isLocked' => true,
					'user'     => $this->get_lock_user_data( $lock_user_id ),
				);
			} else {
				// Post is not locked.
				$locks[ $raw_post_id ] = array(
					'isLocked' => false,
					'user'     => null,
				);
			}
		}

		wp_send_json_success( array( 'locks' => $locks ) );
	}

	/**
	 * AJAX handler to take over a single post lock
	 *
	 * Force-acquires the lock for the current user, even if another user has it.
	 * Used when user clicks "Take Over" in the lock modal.
	 *
	 * Handles both numeric post IDs and Site Editor template identifiers
	 * (e.g., "twentytwentyfive//author"). File-based templates without
	 * database records return success with no lock (nothing to lock).
	 *
	 * IMPORTANT: This will cause the other user to lose their editing session.
	 * Their unsaved changes will be preserved via autosave, but they'll see
	 * a "someone else has taken over" message.
	 *
	 *
	 * Request: POST with postId (numeric or template identifier)
	 * Response: { success: true, data: { newLock, postId } }
	 * 
	 * @since 2.0.0
	 */
	public function takeover_post_lock() {
		// Verify nonce.
		if ( ! check_ajax_referer( self::NONCE_TAKEOVER, 'nonce', false ) ) {
			wp_send_json_error( array( 'message' => 'Invalid nonce' ), 403 );
		}

		// Get raw post ID from request - sanitize but don't convert to int yet.
		$raw_post_id = isset( $_POST['postId'] ) ? sanitize_text_field( wp_unslash( $_POST['postId'] ) ) : '';

		if ( empty( $raw_post_id ) ) {
			wp_send_json_error( array( 'message' => 'Invalid post ID' ), 400 );
		}

		// Resolve the post ID (handles both numeric and template identifiers).
		$resolved_post_id = $this->resolve_post_id( $raw_post_id );

		// Handle file-based templates without database records.
		if ( ! $resolved_post_id ) {
			// If it's a template identifier, return success - no lock needed.
			if ( $this->is_template_identifier( $raw_post_id ) ) {
				wp_send_json_success(
					array(
						'newLock' => null,
						'postId'  => $raw_post_id,
						'message' => 'File-based template - no locking required',
					)
				);
			}
			wp_send_json_error( array( 'message' => 'Invalid post ID' ), 400 );
		}

		// Check if user can edit this post.
		if ( ! current_user_can( 'edit_post', $resolved_post_id ) ) {
			wp_send_json_error( array( 'message' => 'Permission denied' ), 403 );
		}

		$this->ensure_lock_functions();

		// Take over the lock - this overwrites any existing lock.
		$new_lock = wp_set_post_lock( $resolved_post_id );

		if ( $new_lock ) {
			wp_send_json_success(
				array(
					'newLock' => implode( ':', $new_lock ),
					'postId'  => $raw_post_id, // Return original ID for client mapping.
				)
			);
		} else {
			wp_send_json_error( array( 'message' => 'Failed to acquire lock' ), 500 );
		}
	}

	/**
	 * AJAX handler to refresh post locks for multiple posts (bulk operation).
	 *
	 * This is the main polling endpoint called every 30 seconds.
	 * It performs two critical functions:
	 *
	 * 1. REFRESH: For posts NOT locked by others, refresh our lock (update timestamp).
	 *    This prevents our locks from expiring (WordPress locks expire after ~150s).
	 *
	 * 2. CHECK: For posts locked by others, return lock info without overriding
	 *    This allows us to detect when another user has taken over a post.
	 *
	 * Handles both numeric post IDs and Site Editor template identifiers
	 * (e.g., "twentytwentyfive//author"). File-based templates without
	 * database records are skipped (no lock to refresh).
	 *
	 * Why this dual behavior?
	 * - We don't want to steal locks from other users during routine polling.
	 * - But we do need to keep our own locks alive.
	 * - And we need to know if someone else has taken over any of our posts.
	 *
	 *
	 * Request: POST with postIds[] array (can contain numeric IDs or template identifiers)
	 * Response: { success: true, data: { locks: { [postId]: { isLocked, user } } } }
	 * 
	 * @since 2.0.0
	 */
	public function refresh_post_locks() {
		// Verify nonce.
		if ( ! check_ajax_referer( self::NONCE_CHECK, 'nonce', false ) ) {
			wp_send_json_error( array( 'message' => 'Invalid nonce' ), 403 );
		}

		// Get raw post IDs from request - sanitize but don't convert to int yet.
		// phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotSanitized
		$raw_post_ids = isset( $_POST['postIds'] ) ? (array) $_POST['postIds'] : array();
		$raw_post_ids = array_map( 'sanitize_text_field', $raw_post_ids );

		if ( empty( $raw_post_ids ) ) {
			wp_send_json_success( array( 'locks' => array() ) );
		}

		$this->ensure_lock_functions();

		$locks = array();

		foreach ( $raw_post_ids as $raw_post_id ) {
			// Resolve the post ID (handles both numeric and template identifiers).
			$resolved_post_id = $this->resolve_post_id( $raw_post_id );

			// If not resolvable (file-based template or invalid), report as not locked.
			if ( ! $resolved_post_id ) {
				$locks[ $raw_post_id ] = array(
					'isLocked' => false,
					'user'     => null,
				);
				continue;
			}

			/*
			 * Permission Check
			 * Skip posts the user can't edit (shouldn't happen in normal use)
			 */
			if ( ! current_user_can( 'edit_post', $resolved_post_id ) ) {
				$locks[ $raw_post_id ] = array(
					'isLocked' => false,
					'user'     => null,
				);
				continue;
			}

			/*
			 * Check if another user holds the lock.
			 * wp_check_post_lock() returns:
			 * - User ID if another user has a valid (non-expired) lock
			 * - false if no lock, lock expired, or current user holds the lock
			 */
			$lock_user_id = wp_check_post_lock( $resolved_post_id );

			if ( $lock_user_id ) {
				/*
				 * CASE: Another user has the lock
				 *
				 * Don't override their lock - just report it back to the client.
				 * This allows our UI to show the lock modal for this tab.
				 */
				$locks[ $raw_post_id ] = array(
					'isLocked' => true,
					'user'     => $this->get_lock_user_data( $lock_user_id ),
				);
			} else {
				/*
				 * CASE: No lock or we hold the lock
				 *
				 * Before refreshing, verify we actually hold the lock by checking
				 * the lock meta directly. This prevents race conditions where
				 * another user might have acquired the lock between our check and refresh.
				 */
				$current_user_id = get_current_user_id();
				$lock_meta       = get_post_meta( $resolved_post_id, '_edit_lock', true );
				$we_hold_lock    = false;

				if ( $lock_meta ) {
					$lock_parts = explode( ':', $lock_meta );
					$lock_time  = isset( $lock_parts[0] ) ? (int) $lock_parts[0] : 0;
					$lock_owner = isset( $lock_parts[1] ) ? (int) $lock_parts[1] : 0;

					// Check if lock is valid (not expired) and we own it.
					$time_window = apply_filters( 'wp_check_post_lock_window', 150 );
					if ( $lock_time > time() - $time_window && $lock_owner === $current_user_id ) {
						$we_hold_lock = true;
					}
				}

				// Only refresh if we actually hold the lock or no lock exists.
				// If another user just acquired it, we'll detect it on the next poll.
				if ( $we_hold_lock || ! $lock_meta ) {
					wp_set_post_lock( $resolved_post_id );
				}

				// Double-check after refresh to ensure we still hold it.
				// This catches race conditions where another user acquired it during refresh.
				$final_check = wp_check_post_lock( $resolved_post_id );

				if ( $final_check ) {
					// Another user has the lock - report it.
					$locks[ $raw_post_id ] = array(
						'isLocked' => true,
						'user'     => $this->get_lock_user_data( $final_check ),
					);
				} else {
					// We hold the lock or no lock exists.
					$locks[ $raw_post_id ] = array(
						'isLocked' => false,
						'user'     => null,
					);
				}
			}
		}

		wp_send_json_success( array( 'locks' => $locks ) );
	}
}
