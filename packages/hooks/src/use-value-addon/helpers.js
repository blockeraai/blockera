// @flow
/**
 * External dependencies
 */
import type { MixedElement } from 'react';
import { __ } from '@wordpress/i18n';

/**
 * Publisher dependencies
 */
import {
	getThemeColors,
	getFontSizes,
	getLinearGradients,
	getRadialGradients,
	getSpacings,
	getWidthSizes,
	getVariable,
	getPostDynamicValueItemsBy,
	getFeaturedImageDynamicValueItemsBy,
	getArchiveDynamicValueItemsBy,
	getSiteDynamicValueItemsBy,
	getUserDynamicValueItemsBy,
	getOtherDynamicValueItemsBy,
} from '@publisher/core-data';
// eslint-disable-next-line no-duplicate-imports
import type {
	VariableCategory,
	DynamicValueTypes,
	DynamicValueCategory,
} from '@publisher/core-data';
import { ColorIndicator } from '@publisher/components';
import { isBlockTheme, isObject, isUndefined } from '@publisher/utils';

/**
 * Internal dependencies
 */
import type {
	ValueAddon,
	DynamicValueCategoryDetail,
	VariableCategoryDetail,
} from './types';
import VarTypeFontSizeIcon from './icons/var-font-size';
import VarTypeSpacingIcon from './icons/var-spacing';
import VarTypeWidthSizeIcon from './icons/var-width-size';
import DVTypeTextIcon from './icons/dv-text';
import DVTypeLinkIcon from './icons/dv-link';
import DVTypeIDIcon from './icons/dv-id';
import DVTypeDateIcon from './icons/dv-date';
import DVTypeTimeIcon from './icons/dv-time';
import DVTypeMetaIcon from './icons/dv-meta';
import DVTypeImageIcon from './icons/dv-image';
import DVTypeCategoryIcon from './icons/dv-category';
import DVTypeTagIcon from './icons/dv-tag';
import DVTypeTermIcon from './icons/dv-terms';
import DVTypeShortcodeIcon from './icons/dv-shortcode';
import DVTypeEmailIcon from './icons/dv-email';
import DVTypeCommentIcon from './icons/dv-comment';

// todo improve and write tests
export const isValid = ({ isValueAddon = false }: ValueAddon): boolean => {
	return isValueAddon;
};

export function getValueAddonRealValue(value: ValueAddon | string): string {
	if (typeof value === 'number') {
		return value;
	}

	if (typeof value === 'string') {
		return value.endsWith('func') ? value.slice(0, -4) : value;
	}

	if (isObject(value)) {
		if (!isUndefined(value?.isValueAddon)) {
			const variable = getVariable(
				value?.settings?.type,
				value?.settings?.slug
			);

			//
			// use current saved value if variable was not found
			//
			if (
				isUndefined(variable?.value) &&
				!isUndefined(value.settings.value)
			) {
				return value.settings.value;
			}

			return `var(${value?.settings?.var})`;
		}
	}

	//$FlowFixMe
	return value;
}

// todo write tests
export function getVariableIcon({
	type,
	value,
}: {
	type: string,
	value?: string,
}): MixedElement {
	switch (type) {
		case 'font-size':
			return <VarTypeFontSizeIcon />;

		case 'radial-gradient':
		case 'linear-gradient':
			if (value !== '') {
				return <ColorIndicator type="gradient" value={value} />;
			}
			break;

		case 'theme-color':
			return <ColorIndicator type="color" value={value} />;

		case 'spacing':
			return <VarTypeSpacingIcon />;

		case 'width-size':
			return <VarTypeWidthSizeIcon />;
	}

	return <></>;
}

// todo write tests
export function getVariableCategory(
	category: VariableCategory
): VariableCategoryDetail {
	switch (category) {
		case 'font-size':
			return {
				name: isBlockTheme()
					? __('Theme Font Sizes', 'publisher-core')
					: __('Font Sizes', 'publisher-core'),
				variables: getFontSizes(),
			};

		case 'linear-gradient':
			return {
				name: isBlockTheme()
					? __('Theme Linear Gradients', 'publisher-core')
					: __('Linear Gradients', 'publisher-core'),
				variables: getLinearGradients(),
			};

		case 'radial-gradient':
			return {
				name: isBlockTheme()
					? __('Theme Radial Gradients', 'publisher-core')
					: __('Radial Gradients', 'publisher-core'),
				variables: getRadialGradients(),
			};

		case 'width-size':
			return {
				name: isBlockTheme()
					? __('Theme Width & Height Sizes', 'publisher-core')
					: __('Width & Height Sizes', 'publisher-core'),
				variables: getWidthSizes(),
			};

		case 'spacing':
			return {
				name: isBlockTheme()
					? __('Theme Spacing Sizes', 'publisher-core')
					: __('Spacing Sizes', 'publisher-core'),
				variables: getSpacings(),
			};

		case 'theme-color':
			return {
				name: __('Theme Colors', 'publisher-core'),
				variables: getThemeColors(),
			};
	}

	return {
		name: '',
		variables: [],
		notFound: true,
	};
}

// todo write tests
export function getDynamicValueIcon(type: DynamicValueTypes): MixedElement {
	switch (type) {
		case 'text':
			return <DVTypeTextIcon />;

		case 'link':
			return <DVTypeLinkIcon />;

		case 'image':
			return <DVTypeImageIcon />;

		case 'id':
			return <DVTypeIDIcon />;

		case 'date':
			return <DVTypeDateIcon />;

		case 'time':
			return <DVTypeTimeIcon />;

		case 'category':
			return <DVTypeCategoryIcon />;

		case 'tag':
			return <DVTypeTagIcon />;

		case 'term':
			return <DVTypeTermIcon />;

		case 'shortcode':
			return <DVTypeShortcodeIcon />;

		case 'email':
			return <DVTypeEmailIcon />;

		case 'comment':
			return <DVTypeCommentIcon />;

		case 'meta':
			return <DVTypeMetaIcon />;
	}

	return <></>;
}

// todo write tests
export function getDynamicValueCategory(
	category: DynamicValueCategory,
	types: Array<DynamicValueTypes>
): DynamicValueCategoryDetail {
	switch (category) {
		case 'post':
			return {
				name: __('Posts and Pages', 'publisher-core'),
				items: getPostDynamicValueItemsBy('type', types),
			};

		case 'featured-image':
			return {
				name: __('Post Featured Image', 'publisher-core'),
				items: getFeaturedImageDynamicValueItemsBy('type', types),
			};

		case 'archive':
			return {
				name: __('Archive', 'publisher-core'),
				items: getArchiveDynamicValueItemsBy('type', types),
			};

		case 'site':
			return {
				name: __('Site Information', 'publisher-core'),
				items: getSiteDynamicValueItemsBy('type', types),
			};

		case 'user':
			return {
				name: __('User & Authors', 'publisher-core'),
				items: getUserDynamicValueItemsBy('type', types),
			};

		case 'other':
			return {
				name: __('Utilities', 'publisher-core'),
				items: getOtherDynamicValueItemsBy('type', types),
			};
	}

	return {
		name: '',
		items: [],
		notFound: true,
	};
}

export function generateVariableString({
	reference,
	type,
	slug,
}: {
	reference: 'publisher' | 'preset',
	type: VariableCategory,
	slug: string,
}): string {
	let _type: string = type;

	if (type === 'theme-color') {
		_type = 'color';
	} else if (type === 'width-size') {
		if (slug === 'contentSize') {
			slug = 'content-size';
			_type = 'global';
			// $FlowFixMe
			reference = 'style';
		} else if (slug === 'wideSize') {
			slug = 'wide-size';
			_type = 'global';
			// $FlowFixMe
			reference = 'style';
		}
	} else {
		_type = type.replace(/^linear-|^radial-/i, '');
	}

	return `--wp--${reference}--${_type}--${slug}`;
}

export function canUnlinkVariable(value: ValueAddon): boolean {
	if (isValid(value)) {
		if (
			!isUndefined(value?.settings?.value) &&
			value?.settings?.value !== ''
		) {
			return true;
		}

		// $FlowFixMe
		const variable = getVariable(value.valueType, value.settings.slug);

		if (!isUndefined(variable?.value) && variable?.value !== '') {
			return true;
		}
	}

	return false;
}
