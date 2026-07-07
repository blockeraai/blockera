<?php
/**
 * E2E: force global styles entity to be read-only (no edit/delete) while keeping read access.
 *
 * Revokes real WordPress capabilities so core-data `canUser( 'update', globalStyles )` is false.
 * Used to assert Blockera variable-picker UI hides add/edit controls but still allows picking
 * existing theme presets (block-level value; does not mutate theme.json).
 *
 * @see packages/global-styles-ui/js/context/global-styles-provider.ts
 */

if (! defined('ABSPATH')) {
	exit;
}

/**
 * Block editing the wp_global_styles post (Site Editor global styles JSON).
 */
add_filter(
	'map_meta_cap',
	static function ($caps, $cap, $user_id, $args) {
		if ($cap !== 'edit_post' && $cap !== 'delete_post') {
			return $caps;
		}
		if (empty($args[0])) {
			return $caps;
		}
		$post = get_post($args[0]);
		if (! $post || $post->post_type !== 'wp_global_styles') {
			return $caps;
		}

		return ['do_not_allow'];
	},
	10,
	4
);

/**
 * Reject mutating REST requests to global styles.
 */
add_filter(
	'rest_pre_dispatch',
	static function ($result, $server, $request) {
		$route = $request->get_route();
		if (strpos($route, '/wp/v2/global-styles') !== 0) {
			return $result;
		}
		$method = $request->get_method();
		if (! in_array($method, ['POST', 'PUT', 'PATCH', 'DELETE'], true)) {
			return $result;
		}

		return new WP_Error(
			'rest_cannot_edit',
			'Global styles are read-only (E2E).',
			['status' => 403]
		);
	},
	10,
	3
);

/**
 * Ensure core-data `canUser( 'update', … )` resolves false when the REST embeds capabilities.
 */
add_filter(
	'rest_prepare_global_styles',
	static function ($response, $post, $request) {
		if (! $response instanceof WP_REST_Response) {
			return $response;
		}
		$data = $response->get_data();
		if (isset($data['capabilities']) && is_array($data['capabilities'])) {
			$data['capabilities']['edit']   = false;
			$data['capabilities']['update'] = false;
			$response->set_data($data);
		}

		return $response;
	},
	10,
	3
);
