<?php
/**
 * Configure block all arguments.
 *
 * @var array $args the block arguments!
 *
 * @package blockera-core/packages/blocks/js/wordpress/loginout
 */

return array_merge(
	$args,
	[
		'selectors' => [
			'innerBlocks' => [
				'form'        => [
					'root' => 'form',
				],
				'input_label' => [
					'root' => '.login-password label, .login-username label',
				],
				'input'       => [
					'root' => '.login-password input, .login-username input',
				],
				'remember'    => [
					'root' => '.login-remember label',
				],
				'button'      => [
					'root' => '.button.button-primary',
				],
			],
		],
	]
);
