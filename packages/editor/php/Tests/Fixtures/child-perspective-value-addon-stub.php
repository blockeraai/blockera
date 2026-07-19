<?php

namespace Blockera\Editor\StyleDefinitions;

/**
 * Test-only namespaced override: ChildPerspective css() resolves value addons without qualification.
 * Delegates to the global helper unless a test payload sets __test_force_empty__.
 *
 * @param mixed $value
 * @return mixed
 */
function blockera_get_value_addon_real_value( $value ) {
	if ( is_array( $value ) && ! empty( $value['__test_force_empty__'] ) ) {
		return '';
	}

	return \blockera_get_value_addon_real_value( $value );
}
