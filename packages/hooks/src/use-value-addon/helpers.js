// @flow
/**
 * External dependencies
 */
import type { MixedElement } from 'react';
import { __, sprintf } from '@wordpress/i18n';

/**
 * Publisher dependencies
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
} from '@publisher/core-data';
import { ColorIndicator } from '@publisher/components';
import { isBlockTheme, isObject, isUndefined } from '@publisher/utils';
import { NoticeControl } from '@publisher/controls';

/**
 * Internal dependencies
 */
import type {
	DynamicValueCategoryDetail,
	ValueAddon,
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

export function isValid(value: ValueAddon): boolean {
	return value?.isValueAddon;
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
					? __('Theme Font Sizes', 'publisher-core')
					: __('Editor Font Sizes', 'publisher-core'),
				items: getFontSizes(),
			};

		case 'linear-gradient':
			return {
				label: isBlockTheme()
					? __('Theme Linear Gradients', 'publisher-core')
					: __('Editor Linear Gradients', 'publisher-core'),
				items: getLinearGradients(),
			};

		case 'radial-gradient':
			return {
				label: isBlockTheme()
					? __('Theme Radial Gradients', 'publisher-core')
					: __('Editor Radial Gradients', 'publisher-core'),
				items: getRadialGradients(),
			};

		case 'width-size':
			return {
				label: isBlockTheme()
					? __('Theme Width & Height Sizes', 'publisher-core')
					: __('Width & Height Sizes', 'publisher-core'),
				items: getWidthSizes(),
			};

		case 'spacing':
			return {
				label: isBlockTheme()
					? __('Theme Spacing Sizes', 'publisher-core')
					: __('Editor Spacing Sizes', 'publisher-core'),
				items: getSpacings(),
			};

		case 'color':
			return {
				label: isBlockTheme()
					? __('Theme Colors', 'publisher-core')
					: __('Editor Colors', 'publisher-core'),
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
				label: __('Posts and Pages', 'publisher-core'),
				items: getPostDynamicValueItemsBy('type', types),
			};

		case 'featured-image':
			return {
				label: __('Post Featured Image', 'publisher-core'),
				items: getFeaturedImageDynamicValueItemsBy('type', types),
			};

		case 'archive':
			return {
				label: __('Archive', 'publisher-core'),
				items: getArchiveDynamicValueItemsBy('type', types),
			};

		case 'site':
			return {
				label: __('Site Information', 'publisher-core'),
				items: getSiteDynamicValueItemsBy('type', types),
			};

		case 'user':
			return {
				label: __('User & Authors', 'publisher-core'),
				items: getUserDynamicValueItemsBy('type', types),
			};

		case 'other':
			return {
				label: __('Utilities', 'publisher-core'),
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
					'publisher-core'
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
				result.referenceName = __('Block Editor', 'publisher-core');
				break;

			case 'core':
				result.referenceName = __('Publisher Blocks', 'publisher-core');
				break;

			case 'core-pro':
				result.referenceName = __(
					'Publisher Blocks Pro',
					'publisher-core'
				);

				switch (item.valueType) {
					case 'variable':
						result.after2 = (
							<NoticeControl type="success">
								{__(
									'Activating Publisher Blocks Pro plugin may potentially restore this variable.',
									'publisher-blocks'
								)}
							</NoticeControl>
						);
						break;

					case 'dynamic-value':
						result.after2 = (
							<NoticeControl type="success">
								{__(
									'Activating Publisher Blocks Pro plugin restores functionality for this dynamic value item.',
									'publisher-blocks'
								)}
							</NoticeControl>
						);

						break;
				}
				break;

			case 'custom':
				switch (item.valueType) {
					case 'variable':
						result.referenceName = __('Custom', 'publisher-core');
						result.after2 = (
							<NoticeControl type="information">
								{__(
									'You can create a custom variable with the exact same name to restore this variable across all its usages.',
									'publisher-blocks'
								)}
							</NoticeControl>
						);
						break;

					case 'dynamic-value':
						result.referenceName = __(
							'Custom Code',
							'publisher-core'
						);
						result.after2 = (
							<NoticeControl type="information">
								{__(
									'Find and restore the custom code to return back functionality for this dynamic value item.',
									'publisher-blocks'
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
						__('%s plugin', 'publisher-core'),
						pluginName
					);
				} else {
					pluginName = 'unknown';
					result.referenceName = __(
						'unknown plugin',
						'publisher-core'
					);
				}

				switch (item.valueType) {
					case 'variable':
						result.after2 = (
							<NoticeControl type="information">
								{sprintf(
									// Translators: %s is plugin name
									__(
										'Activating %s plugin may potentially restore this variable.',
										'publisher-blocks'
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
										'publisher-blocks'
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
						__('%s theme', 'publisher-core'),
						themeName
					);
				} else {
					themeName = 'unknown';
					result.referenceName = __(
						'unknown theme',
						'publisher-core'
					);
				}

				switch (item.valueType) {
					case 'variable':
						result.after2 = (
							<NoticeControl type="information">
								{sprintf(
									// Translators: %s is plugin name
									__(
										'Activating %s theme may potentially restore this variable.',
										'publisher-blocks'
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
										'publisher-blocks'
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
					'This is the latest value identified by Publisher Blocks, which may differ from the final value of this variable.',
					'publisher-blocks'
				);
			}

			if (result.before === '') {
				result.before = __(
					"There was a deletion or disappearance of this variable, however it's value is still used here.",
					'publisher-core'
				);
			}

			if (result.after === '') {
				result.after = __(
					'You have the option to either switch it with another variable or remove it.',
					'publisher-core'
				);
			}

			break;

		case 'dynamic-value':
			if (result.before === '') {
				result.before = __(
					'The dynamic value item is inactive or has been removed.',
					'publisher-core'
				);
			}

			if (result.after === '') {
				result.after = __(
					'You have the option to either switch this item or remove its usage.',
					'publisher-core'
				);
			}
			break;
	}

	return result;
}
