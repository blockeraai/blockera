// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import type { ConfigModel } from '../types';

const publisherOpacity: ConfigModel = {
	show: true,
	force: true,
	status: true,
	label: __('Opacity', 'publisher-core'),
};

const publisherTransform: ConfigModel = {
	show: true,
	force: true,
	status: true,
	label: __('Transform', 'publisher-core'),
};

const publisherTransition: ConfigModel = {
	show: true,
	force: true,
	status: true,
	label: __('Transition', 'publisher-core'),
};

const publisherFilter: ConfigModel = {
	show: true,
	force: true,
	status: true,
	label: __('Filter', 'publisher-core'),
};

const publisherBackdropFilter: ConfigModel = {
	show: true,
	force: true,
	status: true,
	label: __('Backdrop Filter', 'publisher-core'),
};

const publisherBlendMode: ConfigModel = {
	show: true,
	force: true,
	status: true,
	label: __('Blending Mode', 'publisher-core'),
};

const publisherDivider: ConfigModel = {
	show: true,
	force: true,
	status: true,
	label: __('Divider', 'publisher-core'),
};

const publisherMask: ConfigModel = {
	show: true,
	force: true,
	status: true,
	label: __('Mask', 'publisher-core'),
};

export const effectsConfig = {
	publisherOpacity,
	publisherTransform,
	publisherTransition,
	publisherFilter,
	publisherBackdropFilter,
	publisherBlendMode,
	publisherDivider,
	publisherMask,
};
