// @flow
/**
 * Read-only chip for variable / dynamic-value addons (no picker, no pointer).
 * Mirrors label + icon + deleted state logic from ValueAddonControl.
 */
/**
 * External dependencies
 */
import type { Element } from 'react';
import { __ } from '@wordpress/i18n';
import { select } from '@wordpress/data';

/**
 * Blockera dependencies
 */
import {
	controlClassNames,
	controlInnerClassNames,
} from '@blockera/classnames';
import { isUndefined } from '@blockera/utils';
import { getVariable, STORE_NAME } from '@blockera/data';

/**
 * Internal dependencies
 */
import { hasThemeJsonPlainPresetSlug, isValid } from '../../utils';
import type { ValueAddon } from '../../types';
import { default as EmptyIcon } from '../../icons/empty.svg';
import { default as DeletedIcon } from '../../icons/deleted.svg';
import { getDynamicValueIcon, getVariableIcon } from '../../helpers';

export type ValueAddonDisplayProps = {
	value: ValueAddon,
	className?: string,
	themeJsonPlainPresetSlug?: string,
	themeJsonPlainPresetVariableType?: string,
};

export default function ValueAddonDisplay({
	value,
	className,
	themeJsonPlainPresetSlug,
	themeJsonPlainPresetVariableType,
}: ValueAddonDisplayProps): null | Element<any> {
	if (!isValid(value)) {
		if (!hasThemeJsonPlainPresetSlug(themeJsonPlainPresetSlug)) {
			return null;
		}

		const label =
			typeof themeJsonPlainPresetSlug === 'string'
				? themeJsonPlainPresetSlug
				: '';

		return (
			<span
				className={controlClassNames(
					'value-addon-display',
					'type-variable',
					'value-addon-display-with-icon',
					className
				)}
				title={label}
				aria-label={label}
			>
				<span className={controlInnerClassNames('item-icon')}>
					{getVariableIcon({
						type: themeJsonPlainPresetVariableType || 'color',
						value: undefined,
						iconSize: 'small',
					})}
				</span>
				<span className={controlClassNames('item-name')}>{label}</span>
			</span>
		);
	}

	if (value.valueType !== 'variable' && value.valueType !== 'dynamic-value') {
		return null;
	}

	let icon: Element<any> = <EmptyIcon />;
	let label = '';
	let isDeleted = false;
	// Sync read from @blockera/data (same idea as ValueAddonControl): no hook subscription;
	// the chip updates when a parent rerenders after store/catalog changes.
	const { getDynamicValue } = select(STORE_NAME);

	if (value.valueType === 'variable') {
		const item = getVariable(value?.settings?.type, value?.settings?.id);
		const missing = !item || isUndefined(item.value);

		if (missing) {
			isDeleted = true;
			label = __('Missing Variable', 'blockera');
			icon = <DeletedIcon />;
		} else {
			label = !isUndefined(item?.name)
				? item.name
				: value?.settings?.name;
			icon = getVariableIcon({
				type: value?.settings?.type,
				value: value?.settings?.value,
				iconSize: 'small',
			});
		}
	} else if (value.valueType === 'dynamic-value') {
		const item = getDynamicValue(value.settings.group, value.name);

		if (isUndefined(item?.name)) {
			isDeleted = true;
			label = __('Missing Item', 'blockera');
			icon = <DeletedIcon />;
		} else {
			label = !isUndefined(item?.name)
				? item.name
				: value?.settings?.name;
			icon = getDynamicValueIcon(value?.settings?.type);
		}
	}

	return (
		<span
			className={controlClassNames(
				'value-addon-display',
				'type-' + (value.valueType || 'unknown'),
				'value-addon-display-with-icon',
				isDeleted && 'type-deleted',
				className
			)}
			title={label}
			aria-label={label}
		>
			<span className={controlInnerClassNames('item-icon')}>{icon}</span>
			<span className={controlClassNames('item-name')}>{label}</span>
		</span>
	);
}
