<?php
/**
 * Plugin Name: Blockera WooCommerce E2E Fixtures
 * Description: Registers store state the Blockera WooCommerce E2E suite needs at runtime.
 *
 * Mapped into `wp-content/mu-plugins/` by `.github/wp-env-configs/woocommerce.json`.
 *
 * One-off data (products, categories, attributes, reviews) is seeded by
 * `seed-woocommerce.php` through WP-CLI. This file covers the case that cannot
 * be seeded: `woocommerce_register_additional_checkout_field()` is a
 * registration call that has to run on every request.
 *
 * Without a registered additional field, `AdditionalFieldsWrapper`'s editor
 * component returns `null` — `additional-fields-wrapper/edit.tsx` bails when
 * `ORDER_FORM_FIELDS` and `CONTACT_FORM_FIELDS` are both empty. Because the
 * block is `apiVersion: 3`, a `null` edit renders no DOM node at all, so
 * neither it nor its inner `order-confirmation-additional-fields` block can be
 * selected in the Site Editor.
 *
 * Both locations are registered on purpose. `CONTACT_FORM_FIELDS` reads the
 * `additionalContactFields` setting, which is populated from the `contact`
 * location, so a field registered only against `order` leaves the editor
 * component on its `null` branch.
 *
 * @package Blockera
 */

defined( 'ABSPATH' ) || exit;

add_action(
	'woocommerce_init',
	static function (): void {
		if ( ! function_exists( 'woocommerce_register_additional_checkout_field' ) ) {
			return;
		}

		$fields = array(
			array(
				'id'       => 'blockera-e2e/how-did-you-hear',
				'label'    => 'How did you hear about us?',
				'location' => 'order',
				'type'     => 'text',
				'required' => false,
			),
			array(
				'id'       => 'blockera-e2e/preferred-contact',
				'label'    => 'Preferred contact method',
				'location' => 'contact',
				'type'     => 'text',
				'required' => false,
			),
		);

		foreach ( $fields as $field ) {
			try {
				woocommerce_register_additional_checkout_field( $field );
			} catch ( Exception $exception ) {
				// Re-registration on a warm request is not an error worth failing on.
				unset( $exception );
			}
		}
	}
);
