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
	getFeaturedImageDynamicValueItemsBy,
	getOtherDynamicValueItemsBy,
	getPostDynamicValueItemsBy,
	getSiteDynamicValueItemsBy,
	getUserDynamicValueItemsBy,
	getColors,
	getFontSizes,
	getLinearGradients,
	getMergedGlobalStylePresetVariables,
	getRadialGradients,
	getSpacings,
	getVariable,
	resolveThemeJsonPaintPresetStringFromWpEditor,
	resolveThemeJsonVariableStringFromWpEditor,
	getWidthSizes,
	type VariableCategory,
} from '@blockera/data';
import { isObject, isUndefined } from '@blockera/utils';
import { Icon } from '@blockera/icons';

/**
 * Internal dependencies
 */
import { isValid } from './utils';
import { ColorIndicator, NoticeControl } from '../';
import type {
	ValueAddon,
	ValueAddonProps,
	VariableCategoryDetail,
	DynamicValueCategoryDetail,
} from './types';
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

export function getValueAddonRealValue(
	value: ValueAddon | string | void,
	options?: {| blockName?: string |} | void
): any {
	if (value === undefined) {
		return '';
	}

	if (typeof value === 'number') {
		return value;
	}

	if (typeof value === 'string') {
		const stripped = value.endsWith('func') ? value.slice(0, -4) : value;
		return resolveThemeJsonVariableStringFromWpEditor(
			stripped,
			options?.blockName ?? ''
		);
	}

	if (isObject(value)) {
		if (value?.isValueAddon) {
			const blockName = options?.blockName ?? '';

			const variable = getVariable(
				value?.settings?.type,
				value?.settings?.id
			);

			let currentValue: mixed = '';
			let currentVar = '';

			//
			// use current saved value
			//
			if (!isUndefined(variable?.value) && variable?.value) {
				currentValue = variable.value;
			}

			//
			// use saved value if current value is not set
			//
			if (
				!currentValue &&
				!isUndefined(value.settings.value) &&
				value.settings.value
			) {
				currentValue = value.settings.value;
			}

			if (!isUndefined(value?.settings?.var) && value?.settings?.var) {
				currentVar = value.settings.var;
			}

			if (currentValue && currentVar) {
				// Structured preset payloads (objects) are not valid var() fallbacks; emit token only.
				if (typeof currentValue === 'object' && currentValue !== null) {
					return resolveThemeJsonVariableStringFromWpEditor(
						`var(${currentVar})`,
						blockName
					);
				}

				// If the value already starts with var({$value['settings']['var']}), return it as is
				if (
					typeof currentValue === 'string' &&
					currentValue.startsWith(`var(${currentVar}`)
				) {
					return resolveThemeJsonVariableStringFromWpEditor(
						currentValue,
						blockName
					);
				}

				return resolveThemeJsonVariableStringFromWpEditor(
					`var(${currentVar}, ${String(currentValue)})`,
					blockName
				);
			}

			if (currentValue) {
				if (typeof currentValue === 'string') {
					return resolveThemeJsonVariableStringFromWpEditor(
						currentValue,
						blockName
					);
				}
				return currentValue;
			}

			if (currentVar) {
				return resolveThemeJsonVariableStringFromWpEditor(
					`var(${currentVar})`,
					blockName
				);
			}
		}

		return ''; // return empty string because there is no real string value
	}

	//$FlowFixMe
	return value;
}

export type VariableIconSize = 'small' | 'normal' | 'large';

// Per tier: `default` px for all types; other keys match `getVariableIcon` `type`.
export type VariableIconSizeTierConfig = {
	default: number,
	[string]: number,
};

const VARIABLE_ICON_SIZE_PX: {
	[VariableIconSize]: VariableIconSizeTierConfig,
} = {
	small: { default: 16, color: 12 },
	normal: {
		default: 20,
		border: 14,
		transform: 16,
		transition: 16,
		'border-radius': 14,
		color: 16,
	},
	large: { default: 24, border: 22 },
};

function resolveVariableIconSizePx(
	variableType: string,
	iconSize?: VariableIconSize
): number {
	const tier: VariableIconSize =
		iconSize === 'small' || iconSize === 'normal' || iconSize === 'large'
			? iconSize
			: 'normal';

	const tierConfig = VARIABLE_ICON_SIZE_PX[tier];
	const override = tierConfig[variableType];

	if (typeof override === 'number') {
		return override;
	}

	return tierConfig.default;
}

function resolveVariableIconPaintString({
	type,
	value,
	presetSlug,
	themeJsonResolutionBlockName,
	themeJsonResolutionPresetCssVarInfix,
}: {
	type: string,
	value?: string,
	presetSlug?: string,
	themeJsonResolutionBlockName?: string,
	themeJsonResolutionPresetCssVarInfix?: string,
}): string {
	const paintable =
		type === 'color' ||
		type === 'linear-gradient' ||
		type === 'radial-gradient';
	if (!paintable) {
		return '';
	}

	return resolveThemeJsonPaintPresetStringFromWpEditor({
		value,
		presetSlug,
		blockName: themeJsonResolutionBlockName ?? '',
		presetCssVarInfix: themeJsonResolutionPresetCssVarInfix,
		variablePickerType: type,
	});
}

export function getVariableIcon({
	type,
	value,
	iconSize = 'normal',
	presetSlug,
	themeJsonResolutionBlockName,
	themeJsonResolutionPresetCssVarInfix,
}: {
	type: string,
	value?: string,
	iconSize?: VariableIconSize,
	presetSlug?: string,
	themeJsonResolutionBlockName?: string,
	themeJsonResolutionPresetCssVarInfix?: string,
}): MixedElement {
	const sizePx = resolveVariableIconSizePx(type, iconSize);
	const iconSizeProp = String(sizePx);

	const paintStr = resolveVariableIconPaintString({
		type,
		value,
		presetSlug,
		themeJsonResolutionBlockName,
		themeJsonResolutionPresetCssVarInfix,
	});

	const inferGradient =
		type === 'linear-gradient' ||
		type === 'radial-gradient' ||
		(paintStr !== '' && paintStr.includes('gradient('));

	switch (type) {
		case 'font-size':
			return <Icon icon="variable-font-size" iconSize={iconSizeProp} />;

		case 'radial-gradient':
		case 'linear-gradient':
			return (
				<ColorIndicator
					type="gradient"
					value={paintStr !== '' ? paintStr : ''}
					size={sizePx}
				/>
			);

		case 'color':
			if (inferGradient && paintStr !== '') {
				return (
					<ColorIndicator
						type="gradient"
						value={paintStr}
						size={sizePx}
					/>
				);
			}
			return (
				<ColorIndicator
					type="color"
					value={paintStr !== '' ? paintStr : value}
					size={sizePx}
				/>
			);

		case 'spacing':
			return <Icon icon="variable-spacing" iconSize={iconSizeProp} />;

		case 'width-size':
			return <Icon icon="variable-width-size" iconSize={iconSizeProp} />;

		case 'border':
			return <Icon icon="border" iconSize={iconSizeProp} />;

		case 'border-radius':
			return <Icon icon="border-radius" iconSize={iconSizeProp} />;

		case 'text-shadow':
			return <Icon icon="text-shadow" iconSize={iconSizeProp} />;

		case 'shadow':
			return <Icon icon="wp-shadows" iconSize={iconSizeProp} />;

		case 'transform':
			return <Icon icon="transform-move" iconSize={iconSizeProp} />;

		case 'filter':
			return <Icon icon="variable-filter" iconSize={iconSizeProp} />;

		case 'transition':
			return <Icon icon="transition" iconSize={iconSizeProp} />;
	}

	return <></>;
}

export function getVariableCategory(
	category: VariableCategory
): VariableCategoryDetail {
	switch (category) {
		case 'font-size':
			return {
				label: __('Font Size Variables', 'blockera'),
				items: getFontSizes(),
				type: 'font-size',
			};

		case 'linear-gradient':
			return {
				label: __('Linear Gradient Variables', 'blockera'),
				items: getLinearGradients(),
				type: 'linear-gradient',
			};

		case 'radial-gradient':
			return {
				label: __('Radial Gradient Variables', 'blockera'),
				items: getRadialGradients(),
				type: 'radial-gradient',
			};

		case 'width-size':
			return {
				label: __('Width & Height Variables', 'blockera'),
				items: getWidthSizes(),
				type: 'width-size',
			};

		case 'spacing':
			return {
				label: __('Spacing Variables', 'blockera'),
				items: getSpacings(),
				type: 'spacing',
			};

		case 'color':
			return {
				label: __('Color Variables', 'blockera'),
				items: getColors(),
				type: 'color',
			};

		case 'shadow':
			return {
				label: __('Shadow variables', 'blockera'),
				items: getMergedGlobalStylePresetVariables('shadow'),
				type: 'shadow',
			};

		case 'text-shadow':
			return {
				label: __('Text shadow variables', 'blockera'),
				items: getMergedGlobalStylePresetVariables('text-shadow'),
				type: 'text-shadow',
			};

		case 'border-radius':
			return {
				label: __('Border radius variables', 'blockera'),
				items: getMergedGlobalStylePresetVariables('border-radius'),
				type: 'border-radius',
			};

		case 'border':
			return {
				label: __('Border variables', 'blockera'),
				items: getMergedGlobalStylePresetVariables('border'),
				type: 'border',
			};

		case 'transition':
			return {
				label: __('Transition variables', 'blockera'),
				items: getMergedGlobalStylePresetVariables('transition'),
				type: 'transition',
			};

		case 'transform':
			return {
				label: __('Transform variables', 'blockera'),
				items: getMergedGlobalStylePresetVariables('transform'),
				type: 'transform',
			};

		case 'filter':
			return {
				label: __('Filter variables', 'blockera'),
				items: getMergedGlobalStylePresetVariables('filter'),
				type: 'filter',
			};
	}

	return {
		label: '',
		items: [],
		type: '',
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
