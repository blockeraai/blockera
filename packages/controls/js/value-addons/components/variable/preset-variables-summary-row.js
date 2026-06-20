// @flow
/**
 * External dependencies
 */
import type { MixedElement } from 'react';
import { __, sprintf } from '@wordpress/i18n';
import { useMemo } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { ControlContextProvider } from '../../../context';
import { SelectControl } from '../../../libs';
import {
	usePresetVariablesViewMode,
	type PresetVariablesViewMode,
} from './preset-variables-view-mode';

type PresetVariablesSummaryRowProps = {
	variableCount: number,
	hasTaxonomyGroups: boolean,
	hideViewSelect?: boolean,
	viewMode?: PresetVariablesViewMode,
	onViewModeChange?: (mode: PresetVariablesViewMode) => void,
};

export function PresetVariablesSummaryRow({
	variableCount,
	hasTaxonomyGroups,
	hideViewSelect = false,
	viewMode: viewModeProp,
	onViewModeChange,
}: PresetVariablesSummaryRowProps): MixedElement {
	const contextViewMode = usePresetVariablesViewMode();
	const viewMode = viewModeProp ?? contextViewMode.viewMode;
	const setViewMode = onViewModeChange ?? contextViewMode.setViewMode;

	const showViewSelect = hasTaxonomyGroups && !hideViewSelect;

	const selectControlName = useMemo(
		() =>
			`blockera-variables-view-mode-${Math.random()
				.toString(36)
				.slice(2, 11)}`,
		[]
	);

	const selectOptions = useMemo(
		() => [
			{
				label: __('Grouped', 'blockera'),
				value: 'grouped',
			},
			{
				label: __('List', 'blockera'),
				value: 'list',
			},
		],
		[]
	);

	const selectContextValue = useMemo(
		() => ({
			name: selectControlName,
			value: viewMode,
		}),
		[selectControlName, viewMode]
	);

	return (
		<div
			data-test="preset-variables-summary-row"
			className="blockera-preset-variables-summary-row"
			style={{
				display: 'flex',
				justifyContent: 'space-between',
				alignItems: 'center',
				gap: '8px',
				minHeight: '24px',
			}}
		>
			<span
				data-test="preset-variables-count"
				style={{
					color: 'var(--wp-components-color-foreground, #757575)',
					fontSize: '12px',
					lineHeight: '16px',
				}}
			>
				{sprintf(
					/* translators: %d: number of variables */
					__('%d variables', 'blockera'),
					variableCount
				)}
			</span>
			{showViewSelect && (
				<div
					data-test="preset-variables-view-mode-select"
					style={{ minWidth: '96px', flexShrink: 0 }}
				>
					<ControlContextProvider value={selectContextValue}>
						<SelectControl
							type="native"
							options={selectOptions}
							onChange={(nextValue: string) => {
								if (
									nextValue === 'grouped' ||
									nextValue === 'list'
								) {
									setViewMode(nextValue);
								}
							}}
							style={{
								'--blockera-controls-input-height': '24px',
							}}
						/>
					</ControlContextProvider>
				</div>
			)}
		</div>
	);
}
