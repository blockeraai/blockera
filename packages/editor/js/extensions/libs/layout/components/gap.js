// @flow
/**
 * External dependencies
 */
import type { MixedElement } from 'react';
import { __ } from '@wordpress/i18n';

/**
 * Blockera dependencies
 */
import {
	Grid,
	Button,
	BaseControl,
	InputControl,
	useControlContext,
	getValueAddonRealValue,
} from '@blockera/controls';
import { Icon } from '@blockera/icons';
import { isObject } from '@blockera/utils';

/**
 * Internal dependencies
 */
import { isActiveField } from '../../../api/utils';
import type { TBlockProps, THandleOnChangeAttributes } from '../../types';

/**
 * Changeset graph text for blockeraGap: locked → single `gap`; unlocked (`lock === false`) → `rows / columns`.
 * `lock` undefined is treated as locked (default layout matches single-field mode).
 */
function formatGapUnifiedChangesetPreview(resolved: mixed): string {
	if (resolved === null || resolved === undefined) {
		return '';
	}

	if (
		typeof resolved === 'string' ||
		typeof resolved === 'number' ||
		typeof resolved === 'boolean'
	) {
		return String(resolved).trim();
	}

	if (!isObject(resolved)) {
		const raw = getValueAddonRealValue(resolved);

		if (raw === null || raw === undefined || raw === '') {
			return '';
		}

		return String(raw).trim();
	}

	const o: Object = resolved;
	const isGapObject =
		'gap' in o || 'lock' in o || 'rows' in o || 'columns' in o;

	if (!isGapObject) {
		const raw = getValueAddonRealValue(resolved);

		if (raw === null || raw === undefined || raw === '') {
			return '';
		}

		return String(raw).trim();
	}

	// Only explicit `lock === false` uses row/column pair; otherwise show unified `gap`.
	if (o.lock !== false) {
		const raw = getValueAddonRealValue(o.gap);

		if (raw === null || raw === undefined || raw === '') {
			return '';
		}

		return String(raw).trim();
	}

	const rowStr = String(getValueAddonRealValue(o.rows) ?? '').trim();
	const colStr = String(getValueAddonRealValue(o.columns) ?? '').trim();

	if (!rowStr && !colStr) {
		return '';
	}

	if (!rowStr) {
		return colStr;
	}

	if (!colStr) {
		return rowStr;
	}

	return `${rowStr} / ${colStr}`;
}

export default function ({
	gap,
	field,
	attributeId,
	block,
	handleOnChangeAttributes,
	defaultValue,
	...props
}: {
	gap: { lock: boolean, gap: string, columns: string, rows: string },
	defaultValue: { lock: boolean, gap: string, columns: string, rows: string },
	field: Object,
	attributeId: string,
	handleOnChangeAttributes: THandleOnChangeAttributes,
	block: TBlockProps,
}): MixedElement {
	const { value, attribute, blockName, resetToDefault } = useControlContext({
		defaultValue,
		onChange: (newValue) =>
			handleOnChangeAttributes(
				attributeId,
				isObject(newValue)
					? newValue
					: {
							...gap,
							gap: newValue,
						},
				{}
			),
	});

	const labelProps = {
		...(props.labelProps || {}),
		value,
		attribute,
		blockName,
		defaultValue,
		resetToDefault,
		mode: 'advanced',
		// Full gap object so preview sees lock / rows / columns (not only unified `gap`).
		path: props.labelProps?.path ?? attribute,
		changesetGraphPreviewRender:
			props.labelProps?.changesetGraphPreviewRender ??
			formatGapUnifiedChangesetPreview,
	};

	return (
		<BaseControl
			label={__('Gap', 'blockera')}
			labelDescription={
				<>
					<p>
						{__(
							'The Gap property in Flexbox sets the spacing between flex items, both rows and columns, simplifying layout spacing.',
							'blockera'
						)}
					</p>
					<p>
						{__(
							'You can also unlock the gap to use different gap for rows and columns.',
							'blockera'
						)}
					</p>
				</>
			}
			id={'gap'}
			columns="1fr 2.5fr"
			{...labelProps}
		>
			<Grid gap="10px" gridTemplateColumns="1fr 30px">
				{gap?.lock ? (
					isActiveField(field) && (
						<InputControl
							className="control-first label-center small-gap"
							aria-label={__('Gap', 'blockera')}
							unitType="essential"
							min={0}
							defaultValue={defaultValue.gap}
							id={'gap'}
							onChange={(newValue, ref) =>
								handleOnChangeAttributes(
									attributeId,
									{
										...gap,
										gap: newValue,
									},
									{ ref }
								)
							}
							controlAddonTypes={['variable']}
							variableTypes={['spacing']}
							{...props}
						/>
					)
				) : (
					<Grid gridTemplateColumns="1fr 1fr" gap="8px">
						<InputControl
							columns="columns-1"
							className="control-first label-center small-gap"
							label={__('Rows', 'blockera')}
							labelPopoverTitle={__('Rows Gap', 'blockera')}
							labelDescription={
								<>
									<p>
										{__(
											"Rows gap in Flexbox specifically sets the vertical spacing between rows of flex items, allowing precise control over the layout's vertical separation.",
											'blockera'
										)}
									</p>
								</>
							}
							labelProps={{
								changesetGraphPreview: {
									type: 'string',
								},
							}}
							unitType="essential"
							min={0}
							defaultValue={defaultValue.rows}
							id={'rows'}
							singularId={'rows'}
							onChange={(newValue, ref) => {
								const gapResetValue = !gap?.columns
									? {
											...newValue,
											gap: '',
											lock: true,
										}
									: newValue;

								handleOnChangeAttributes(
									attributeId,
									ref?.current?.reset
										? gapResetValue
										: {
												...gap,
												rows: newValue,
											},
									{ ref }
								);
							}}
							size="small"
							controlAddonTypes={['variable']}
							variableTypes={['spacing']}
							{...props}
						/>

						<InputControl
							columns="columns-1"
							className="control-first label-center small-gap"
							label={__('Columns', 'blockera')}
							labelPopoverTitle={__('Columns Gap', 'blockera')}
							labelDescription={
								<>
									<p>
										{__(
											"Columns gap in Flexbox specifically sets the horizontal spacing between columns of flex items, allowing precise control over the layout's horizontal separation.",
											'blockera'
										)}
									</p>
								</>
							}
							labelProps={{
								changesetGraphPreview: {
									type: 'string',
								},
							}}
							unitType="essential"
							min={0}
							defaultValue={defaultValue.columns}
							id={'columns'}
							singularId={'columns'}
							onChange={(newValue, ref) => {
								const gapResetValue = !gap?.rows
									? {
											...newValue,
											gap: '',
											lock: true,
										}
									: newValue;

								handleOnChangeAttributes(
									attributeId,
									ref?.current?.reset
										? gapResetValue
										: {
												...gap,
												columns: newValue,
											},
									{ ref }
								);
							}}
							size="small"
							controlAddonTypes={['variable']}
							variableTypes={['spacing']}
							{...props}
						/>
					</Grid>
				)}
				<Button
					showTooltip={true}
					tooltipPosition="top"
					label={__('Custom Row & Column Gap', 'blockera')}
					onClick={() => {
						if (gap?.lock) {
							handleOnChangeAttributes(
								attributeId,
								{
									...gap,
									lock: !gap?.lock,
									rows: gap?.gap,
									columns: gap?.gap,
								},
								{}
							);
						} else {
							handleOnChangeAttributes(
								attributeId,
								{
									lock: !gap?.lock,
									gap:
										gap?.columns &&
										gap?.rows &&
										gap?.columns === gap?.rows
											? gap?.columns
											: gap?.gap,
									columns: '',
									rows: '',
								},
								{}
							);
						}
					}}
					size="extra-small"
					style={{
						padding: '4px',
						width: 'var(--blockera-controls-input-height)',
						height: 'var(--blockera-controls-input-height)',
					}}
					className={
						!gap?.lock
							? 'is-toggle-btn is-toggled'
							: 'is-toggle-btn'
					}
				>
					{gap?.lock ? (
						<Icon icon="lock" iconSize="22" />
					) : (
						<Icon icon="unlock" iconSize="22" />
					)}
				</Button>
			</Grid>
		</BaseControl>
	);
}
