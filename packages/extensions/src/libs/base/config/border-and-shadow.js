// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import type { ConfigModel } from '../types';

const publisherBoxShadow: ConfigModel = {
	show: true,
	force: true,
	status: true,
	cssGenerators: {},
	label: __('Box Shadow', 'publisher-core'),
};

const publisherOutline: ConfigModel = {
	show: true,
	force: true,
	status: true,
	cssGenerators: {},
	label: __('Outline', 'publisher-core'),
};

const publisherBorder: ConfigModel = {
	show: true,
	force: true,
	status: true,
	cssGenerators: {},
	label: __('Border', 'publisher-core'),
};

const publisherBorderRadius: ConfigModel = {
	show: true,
	force: true,
	status: true,
	cssGenerators: {},
	label: __('Border Radius', 'publisher-core'),
};

export const borderAndShadowConfig = {
	publisherBoxShadow,
	publisherOutline,
	publisherBorder,
	publisherBorderRadius,
};
