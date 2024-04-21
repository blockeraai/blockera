<?php


namespace Blockera\Framework\Illuminate\Foundation\ValueAddon\DynamicValue\Fields;


use Blockera\Framework\Illuminate\Foundation\ValueAddon\DynamicValue\Field;


class RequestParameter extends Field {

	public function theName(): string {

		return 'request-parameter';
	}

	public function theValue( array $options = [] ): string {

		$settings     = $this->getSettings();
		$request_type = isset( $settings['request_type'] ) ? strtoupper( $settings['request_type'] ) : false;
		$param_name   = isset( $settings['param_name'] ) ? $settings['param_name'] : false;
		$value        = '';

		if ( ! $param_name || ! $request_type ) {

			return '';
		}

		switch ( $request_type ) {

			case 'POST':

				if ( ! isset( $_POST[ $param_name ] ) ) {

					return '';
				}

				$value = $_POST[ $param_name ];

				break;

			case 'GET':

				if ( ! isset( $_GET[ $param_name ] ) ) {

					return '';
				}

				$value = $_GET[ $param_name ];

				break;

			case 'QUERY_VAR':

				$value = get_query_var( $param_name );

				break;
		}

		return htmlentities( wp_kses_post( $value ) );
	}

}
