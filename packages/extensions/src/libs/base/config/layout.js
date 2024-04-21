// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import type { FeatureConfig } from '../types';

const blockeraDisplay: FeatureConfig = {
	show: true,
	force: true,
	status: true,
	label: __('Display', 'blockera-core'),
};

const blockeraFlexLayout: FeatureConfig = {
	show: true,
	force: true,
	status: true,
	label: __('Flex Layout', 'blockera-core'),
};

const blockeraGap: FeatureConfig = {
	show: true,
	force: true,
	status: true,
	label: __('Gap', 'blockera-core'),
};

const blockeraFlexWrap: FeatureConfig = {
	show: false,
	force: false,
	status: true,
	label: __('Flex Children Wrap', 'blockera-core'),
};

const blockeraAlignContent: FeatureConfig = {
	show: true,
	force: false,
	status: true,
	showInSettings: false,
	label: __('Children Align Content', 'blockera-core'),
};

export const layoutConfig = {
	blockeraDisplay,
	blockeraFlexLayout,
	blockeraGap,
	blockeraFlexWrap,
	blockeraAlignContent,
};
