// @flow
/**
 * External dependencies
 */
import type { MixedElement } from 'react';

/**
 * Blockera dependencies
 */
import {
	getSelectedSelectOption,
	normalizeSelectControlValue,
} from '@blockera/controls';

const PREVIEW_STRING_CLASS =
	'blockera-control-states-changes-item__preview-string';

export type RenderSelectOptionChangesetPreviewArgs = {
	/** Raw value from the state graph / attribute slice. */
	value: mixed,
	/**
	 * Build options for the given icon size so preview icons match `iconSize`
	 * (control UI often uses a larger size than the graph chip).
	 */
	getOptions: (iconSize: number) => $ReadOnlyArray<any>,
	showIcon?: boolean,
	showLabel?: boolean,
	iconSize?: number,
	/** Gap between icon and label when both are shown. */
	gap?: string,
	/**
	 * When true, a normalized empty string skips lookup and returns null (e.g. deselectable toggle).
	 */
	emptyValueMeansNoPreview?: boolean,
	/**
	 * When no option matches but the value is non-empty, show the raw value (e.g. custom CSS keyword).
	 */
	showUnmatchedValue?: boolean,
};

/**
 * Shared changeset-graph preview for select-like values: resolve `value` against `getOptions(iconSize)`
 * and render icon and/or label like Media Fit / Text Align rows.
 */
export function renderSelectOptionChangesetPreview({
	value,
	getOptions,
	showIcon = true,
	showLabel = false,
	iconSize = 16,
	gap = '4px',
	emptyValueMeansNoPreview = false,
	showUnmatchedValue = false,
}: RenderSelectOptionChangesetPreviewArgs): MixedElement | null {
	const val = normalizeSelectControlValue(value);

	if (emptyValueMeansNoPreview && val === '') {
		return null;
	}

	const options = getOptions(iconSize);
	const opt = getSelectedSelectOption(val, options);

	if (opt) {
		const hasIcon =
			showIcon &&
			opt.icon !== undefined &&
			opt.icon !== null &&
			opt.icon !== false;

		const hasLabel =
			showLabel &&
			opt.label !== undefined &&
			opt.label !== null &&
			String(opt.label) !== '';

		if (hasIcon && hasLabel) {
			return (
				<span
					style={{
						display: 'inline-flex',
						alignItems: 'center',
						gap,
						minWidth: 0,
					}}
				>
					{opt.icon}
					<span
						className={PREVIEW_STRING_CLASS}
						title={String(opt.label)}
					>
						{opt.label}
					</span>
				</span>
			);
		}

		if (hasIcon) {
			return (
				<span
					title={
						opt.label !== undefined && opt.label !== null
							? String(opt.label)
							: undefined
					}
					style={{
						display: 'inline-flex',
						alignItems: 'center',
					}}
				>
					{opt.icon}
				</span>
			);
		}

		if (hasLabel) {
			return (
				<span
					className={PREVIEW_STRING_CLASS}
					title={String(opt.label)}
				>
					{opt.label}
				</span>
			);
		}

		return null;
	}

	if (showUnmatchedValue && val !== '') {
		return (
			<span className={PREVIEW_STRING_CLASS} title={val}>
				{val}
			</span>
		);
	}

	return null;
}
