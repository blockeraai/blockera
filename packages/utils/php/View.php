<?php

namespace Blockera\Utils;

/**
 * Class View for provide utils method to load and return template content.
 *
 * @package View
 */
class View {

	/**
	 * Load php scripts file,
	 * support providing variables for any scripts with second param.
	 *
	 * @param string $template   the template to load.
	 * @param array  $args       the args to extract in template.
	 * @param array  $extra_args the extra arguments to load template.
	 *
	 * @return void|mixed
	 */
	public static function load( string $template, array $args = [], array $extra_args = [] ) {

		if ( empty( $extra_args['root-path'] ) || ! file_exists( $extra_args['root-path'] ) ) {

			return;
		}

		$template = str_replace( '.', DIRECTORY_SEPARATOR, $template );

		$templateFile = $extra_args['root-path'] . $template . '.php';

		if ( ! file_exists( $templateFile ) ) {

			return;
		}

		// phpcs:ignore
		extract( $args );

		if ( ! empty( $extra_args['return'] ) ) {

			return include $templateFile;
		}

		include $templateFile;
	}

}
