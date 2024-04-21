<?php

namespace Blockera\Framework\Illuminate\Support;

class View {

	/**
	 * Load php scripts file,
	 * support providing variables for any scripts with second param.
	 *
	 * @param string $template    the template to load
	 * @param array  $args        the args to extract in template
	 * @param bool   $return_flag the return flag to retrieve file return value!
	 *
	 * @return void|mixed
	 */
	public static function load( string $template, array $args = [], bool $return_flag = false ) {

		$template = str_replace( '.', DIRECTORY_SEPARATOR, $template );

		$templateFile = blockera_core_config( 'app.path' ) . $template . '.php';

		if ( ! file_exists( $templateFile ) ) {

			return;
		}

		extract( $args );

		if ( $return_flag ) {

			return include $templateFile;
		}

		include $templateFile;
	}

}
