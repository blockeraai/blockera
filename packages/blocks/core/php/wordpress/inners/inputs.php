<?php
/**
 * Configure "elements/input", "elements/input-label", "elements/remember" inner block types selectors.
 *
 * @package blockera/packages/blocks/js/wordpress/inners/inputs.php
 */

return [
	'elements/input-label' => [
		'root' => '.login-password label, .login-username label',
	],
	'elements/input'       => [
		'root' => '.login-password input, .login-username input',
	],
	'elements/remember'    => [
		'root' => '.login-remember label',
	],
];
