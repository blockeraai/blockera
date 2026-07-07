/**
 * External dependencies
 */
import type { ReactNode } from 'react';
import { ToggleControl } from '@wordpress/components';

/**
 * Blockera dependencies
 */
import { Flex } from '@blockera/controls';
import { componentInnerClassNames } from '@blockera/classnames';

export type VariableVariationsFieldsSlotProviderProps = {
	children: ReactNode;
};

/**
 * Bordered container for preset variable-variations fields (e.g. color shades).
 * Pair with {@link VariableVariationsFieldsToggleSlot} and {@link VariableVariationsFieldsEditorSlot}.
 */
export function VariableVariationsFieldsSlotProvider({
	children,
}: VariableVariationsFieldsSlotProviderProps) {
	return (
		<div
			className={componentInnerClassNames(
				'preset-variable-variations-wrapper'
			)}
		>
			{children}
		</div>
	);
}

export type VariableVariationsFieldsToggleSlotProps = {
	label: string;
	checked: boolean;
	disabled?: boolean;
	onChange: (checked: boolean) => void;
	/** Preview or auxiliary UI next to the toggle (e.g. shade stack). */
	trailing?: ReactNode;
};

/**
 * Primary enable/disable row for variations; owns {@link ToggleControl} so other preset
 * types can reuse the same layout without importing WordPress toggle directly.
 */
export function VariableVariationsFieldsToggleSlot({
	label,
	checked,
	disabled = false,
	onChange,
	trailing = null,
}: VariableVariationsFieldsToggleSlotProps) {
	return (
		<Flex
			direction="row"
			alignItems="center"
			gap={6}
			style={{ width: '100%', flexWrap: 'wrap', marginTop: '5px' }}
		>
			<ToggleControl
				label={label}
				checked={checked}
				disabled={disabled}
				onChange={onChange}
			/>
			{trailing}
		</Flex>
	);
}

export type VariableVariationsFieldsEditorSlotProps = {
	children: ReactNode;
	style?: object;
};

/**
 * Horizontal strip for per-variation editors (e.g. shade step color pickers).
 */
export function VariableVariationsFieldsEditorSlot({
	children,
	style = {},
}: VariableVariationsFieldsEditorSlotProps) {
	return (
		<Flex
			className={componentInnerClassNames(
				'editor-variable-variations-fields-wrapper'
			)}
			gap={0}
			justifyContent="flex-start"
			style={{
				width: '100%',
				...style,
			}}
		>
			{children}
		</Flex>
	);
}

export type VariableVariationsFieldsConsentSlotProps = {
	children: ReactNode;
};

/**
 * Warning / confirm flow when disabling variations (stacked notice + actions).
 */
export function VariableVariationsFieldsConsentSlot({
	children,
}: VariableVariationsFieldsConsentSlotProps) {
	return (
		<Flex
			gap={15}
			className={componentInnerClassNames('consent-wrapper')}
			direction="column"
		>
			{children}
		</Flex>
	);
}

export type VariableVariationsFieldsSectionProps = {
	children: ReactNode;
};

/**
 * Vertical stack for the whole variations block (wrapper + optional consent sibling).
 */
export function VariableVariationsFieldsSection({
	children,
}: VariableVariationsFieldsSectionProps) {
	return (
		<Flex direction="column" gap={12}>
			{children}
		</Flex>
	);
}
