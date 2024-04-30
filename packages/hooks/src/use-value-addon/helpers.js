// @flow
/**
 * External dependencies
 */
import type { MixedElement } from 'react';
import { __, sprintf } from '@wordpress/i18n';

/**
 * Blockera dependencies
 */
import {
	type DynamicValueCategory,
	type DynamicValueTypes,
	getArchiveDynamicValueItemsBy,
	getColors,
	getFeaturedImageDynamicValueItemsBy,
	getFontSizes,
	getLinearGradients,
	getOtherDynamicValueItemsBy,
	getPostDynamicValueItemsBy,
	getRadialGradients,
	getSiteDynamicValueItemsBy,
	getSpacings,
	getUserDynamicValueItemsBy,
	getVariable,
	getWidthSizes,
	type VariableCategory,
} from '@blockera/core-data';
import { ColorIndicator } from '@blockera/components';
import { isBlockTheme, isObject, isUndefined } from '@blockera/utils';
import { NoticeControl } from '@blockera/controls';

/**
 * Internal dependencies
 */
import type {
	ValueAddon,
	ValueAddonProps,
	VariableCategoryDetail,
	DynamicValueCategoryDetail,
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

/**
 * Sets value addon.
 *
 * @param {ValueAddonProps} newValue The new value addon.
 * @param {Function} setState The setState of target control component.
 * @param {*} defaultValue The target control default value.
 * @return {void}
 */
export function setValueAddon(
	newValue: ValueAddonProps,
	setState: (newValue: any) => void,
	defaultValue: any
): void {
	if (!newValue?.isValueAddon) {
		setState(defaultValue);

		return;
	}

	setState(newValue);
}

export function isValid(value: ValueAddon | string): boolean {
	//$FlowFixMe
	return !!value?.isValueAddon;
}

export function getValueAddonRealValue(value: ValueAddon | string): string {
	if (typeof value === 'number') {
		return value;
	}

	if (typeof value === 'string') {
		return value.endsWith('func') ? value.slice(0, -4) : value;
	}

	if (isObject(value)) {
		if (value?.isValueAddon) {
			const variable = getVariable(
				value?.settings?.type,
				value?.settings?.id
			);

			//
			// use current saved value if variable was not found
			//
			if (
				isUndefined(variable?.value) &&
				!isUndefined(value.settings.value) &&
				value.settings.value !== ''
			) {
				return value.settings.value;
			}

			if (
				isUndefined(value?.settings?.var) ||
				value?.settings?.var === ''
			) {
				return '';
			}

			return `var(${value?.settings?.var})`;
		}

		return ''; // return empty string because there is no real string value
	}

	//$FlowFixMe
	return value;
}

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
			return (
				<ColorIndicator
					type="gradient"
					value={value !== '' ? value : ''}
				/>
			);

		case 'color':
			return <ColorIndicator type="color" value={value} />;

		case 'spacing':
			return <VarTypeSpacingIcon />;

		case 'width-size':
			return <VarTypeWidthSizeIcon />;
	}

	return <></>;
}

export function getVariableCategory(
	category: VariableCategory
): VariableCategoryDetail {
	switch (category) {
		case 'font-size':
			return {
				label: isBlockTheme()
					? __('Theme Font Sizes', 'blockera')
					: __('Editor Font Sizes', 'blockera'),
				items: getFontSizes(),
			};

		case 'linear-gradient':
			return {
				label: isBlockTheme()
					? __('Theme Linear Gradients', 'blockera')
					: __('Editor Linear Gradients', 'blockera'),
				items: getLinearGradients(),
			};

		case 'radial-gradient':
			return {
				label: isBlockTheme()
					? __('Theme Radial Gradients', 'blockera')
					: __('Editor Radial Gradients', 'blockera'),
				items: getRadialGradients(),
			};

		case 'width-size':
			return {
				label: isBlockTheme()
					? __('Theme Width & Height Sizes', 'blockera')
					: __('Width & Height Sizes', 'blockera'),
				items: getWidthSizes(),
			};

		case 'spacing':
			return {
				label: isBlockTheme()
					? __('Theme Spacing Sizes', 'blockera')
					: __('Editor Spacing Sizes', 'blockera'),
				items: getSpacings(),
			};

		case 'color':
			return {
				label: isBlockTheme()
					? __('Theme Colors', 'blockera')
					: __('Editor Colors', 'blockera'),
				items: getColors(),
			};
	}

	return {
		label: '',
		items: [],
		notFound: true,
	};
}

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

export function getDynamicValueCategory(
	category: DynamicValueCategory,
	types: Array<DynamicValueTypes>
): DynamicValueCategoryDetail {
	switch (category) {
		case 'post':
			return {
				label: __('Posts and Pages', 'blockera'),
				items: getPostDynamicValueItemsBy('type', types),
			};

		case 'featured-image':
			return {
				label: __('Post Featured Image', 'blockera'),
				items: getFeaturedImageDynamicValueItemsBy('type', types),
			};

		case 'archive':
			return {
				label: __('Archive', 'blockera'),
				items: getArchiveDynamicValueItemsBy('type', types),
			};

		case 'site':
			return {
				label: __('Site Information', 'blockera'),
				items: getSiteDynamicValueItemsBy('type', types),
			};

		case 'user':
			return {
				label: __('User & Authors', 'blockera'),
				items: getUserDynamicValueItemsBy('type', types),
			};

		case 'other':
			return {
				label: __('Utilities', 'blockera'),
				items: getOtherDynamicValueItemsBy('type', types),
			};
	}

	return {
		label: '',
		items: [],
		notFound: true,
	};
}

export function canUnlinkVariable(value: ValueAddon): boolean {
	if (isValid(value)) {
		if (
			!isUndefined(value?.settings?.value) &&
			value?.settings?.value !== ''
		) {
			return true;
		}

		const variable = getVariable(value?.settings.type, value.settings.id);

		if (!isUndefined(variable?.value) && variable?.value !== '') {
			return true;
		}
	}

	return false;
}

export function getDeletedItemInfo(item: ValueAddon): {
	name: string,
	id: string,
	value: string,
	referenceType: string,
	referenceName: string,
	tooltip: string,
	before: string,
	after: string,
	after2: string,
} {
	const result = {
		name: '',
		id: '',
		value: '',
		referenceType: '',
		referenceName: '',
		before: '',
		after: '',
		after2: '',
		tooltip: '',
	};

	if (!isUndefined(item?.settings?.value) && item?.settings?.value !== '') {
		result.value = item?.settings?.value;

		switch (item.valueType) {
			case 'variable':
				result.after = __(
					'You have the option to either switch it with another variable or unlink it to use the value directly.',
					'blockera'
				);
				break;
		}
	}

	if (!isUndefined(item?.settings?.name) && item?.settings?.name !== '') {
		result.name = item?.settings?.name;
	} else {
		result.id = item?.settings?.id;
	}

	if (
		!isUndefined(item?.settings?.reference?.type) &&
		item?.settings?.reference?.type !== ''
	) {
		result.referenceType = item?.settings?.reference?.type;

		switch (result.referenceType) {
			case 'preset':
				result.referenceName = __('Block Editor', 'blockera');
				break;

			case 'core':
				result.referenceName = __('Blockera Blocks', 'blockera');
				break;

			case 'core-pro':
				result.referenceName = __('Blockera Blocks Pro', 'blockera');

				switch (item.valueType) {
					case 'variable':
						result.after2 = (
							<NoticeControl type="success">
								{__(
									'Activating Blockera Blocks Pro plugin may potentially restore this variable.',
									'blockera'
								)}
							</NoticeControl>
						);
						break;

					case 'dynamic-value':
						result.after2 = (
							<NoticeControl type="success">
								{__(
									'Activating Blockera Blocks Pro plugin restores functionality for this dynamic value item.',
									'blockera'
								)}
							</NoticeControl>
						);

						break;
				}
				break;

			case 'custom':
				switch (item.valueType) {
					case 'variable':
						result.referenceName = __('Custom', 'blockera');
						result.after2 = (
							<NoticeControl type="information">
								{__(
									'You can create a custom variable with the exact same name to restore this variable across all its usages.',
									'blockera'
								)}
							</NoticeControl>
						);
						break;

					case 'dynamic-value':
						result.referenceName = __('Custom Code', 'blockera');
						result.after2 = (
							<NoticeControl type="information">
								{__(
									'Find and restore the custom code to return back functionality for this dynamic value item.',
									'blockera'
								)}
							</NoticeControl>
						);

						break;
				}
				break;

			case 'plugin':
				let pluginName = '';

				if (
					!isUndefined(item?.settings?.reference?.plugin) &&
					item?.settings?.reference?.plugin !== ''
				) {
					pluginName = item?.settings?.reference?.plugin;
					result.referenceName = sprintf(
						// Translators: %s is plugin name
						__('%s plugin', 'blockera'),
						pluginName
					);
				} else {
					pluginName = 'unknown';
					result.referenceName = __('unknown plugin', 'blockera');
				}

				switch (item.valueType) {
					case 'variable':
						result.after2 = (
							<NoticeControl type="information">
								{sprintf(
									// Translators: %s is plugin name
									__(
										'Activating %s plugin may potentially restore this variable.',
										'blockera'
									),
									pluginName
								)}
							</NoticeControl>
						);
						break;

					case 'dynamic-value':
						result.after2 = (
							<NoticeControl type="success">
								{sprintf(
									// Translators: %s is plugin name
									__(
										'Activating %s plugin restores functionality for this dynamic value item.',
										'blockera'
									),
									pluginName
								)}
							</NoticeControl>
						);

						break;
				}

				break;

			case 'theme':
				let themeName = '';

				if (
					!isUndefined(item?.settings?.reference?.theme) &&
					item?.settings?.reference?.theme !== ''
				) {
					themeName = item?.settings?.reference?.theme;
					result.referenceName = sprintf(
						// Translators: %s is plugin name
						__('%s theme', 'blockera'),
						themeName
					);
				} else {
					themeName = 'unknown';
					result.referenceName = __('unknown theme', 'blockera');
				}

				switch (item.valueType) {
					case 'variable':
						result.after2 = (
							<NoticeControl type="information">
								{sprintf(
									// Translators: %s is plugin name
									__(
										'Activating %s theme may potentially restore this variable.',
										'blockera'
									),
									themeName
								)}
							</NoticeControl>
						);
						break;

					case 'dynamic-value':
						result.after2 = (
							<NoticeControl type="success">
								{sprintf(
									// Translators: %s is plugin name
									__(
										'Activating %s theme restores functionality for this dynamic value item.',
										'blockera'
									),
									themeName
								)}
							</NoticeControl>
						);

						break;
				}

				break;
		}
	}

	switch (item.valueType) {
		case 'variable':
			if (result.tooltip === '') {
				result.tooltip = __(
					'This is the latest value identified by  Blocks, which may differ from the final value of this variable.',
					'blockera'
				);
			}

			if (result.before === '') {
				result.before = __(
					"There was a deletion or disappearance of this variable, however it's value is still used here.",
					'blockera'
				);
			}

			if (result.after === '') {
				result.after = __(
					'You have the option to either switch it with another variable or remove it.',
					'blockera'
				);
			}

			break;

		case 'dynamic-value':
			if (result.before === '') {
				result.before = __(
					'The dynamic value item is inactive or has been removed.',
					'blockera'
				);
			}

			if (result.after === '') {
				result.after = __(
					'You have the option to either switch this item or remove its usage.',
					'blockera'
				);
			}
			break;
	}

	return result;
}
