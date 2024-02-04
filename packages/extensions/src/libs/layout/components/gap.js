// @flow
/**
 * External dependencies
 */
import type { MixedElement } from 'react';
import { __ } from '@wordpress/i18n';

/**
 * Publisher dependencies
 */
import { Button, Grid } from '@publisher/components';
import {
	BaseControl,
	InputControl,
	useControlContext,
} from '@publisher/controls';

/**
 * Internal dependencies
 */
import { isActiveField } from '../../../api/utils';
import LockIcon from '../icons/lock';
import UnlockIcon from '../icons/unlock';
import type { TBlockProps, THandleOnChangeAttributes } from '../../types';

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
	const { value, attribute, blockName, resetToDefault, getControlPath } =
		useControlContext({
			defaultValue,
			onChange: (newValue) =>
				handleOnChangeAttributes(attributeId, {
					...gap,
					gap: newValue,
				}),
		});

	const labelProps = {
		value,
		attribute,
		blockName,
		defaultValue,
		resetToDefault,
		mode: 'advanced',
		path: getControlPath(attribute, 'gap'),
	};

	return (
		<BaseControl
			label={__('Gap', 'publisher-core')}
			labelDescription={
				<>
					<p>
						{__(
							'The Gap property in Flexbox sets the spacing between flex items, both rows and columns, simplifying layout spacing.',
							'publisher-core'
						)}
					</p>
					<p>
						{__(
							'You can also unlock the gap to use different gap for rows and columns.',
							'publisher-core'
						)}
					</p>
				</>
			}
			id={'gap'}
			columns="80px 160px"
			{...labelProps}
		>
			<Grid gap="10px" gridTemplateColumns="120px 30px">
				{gap?.lock ? (
					isActiveField(field) && (
						<InputControl
							className="control-first label-center small-gap"
							aria-label={__('Gap', 'publisher-core')}
							unitType="essential"
							min={0}
							max={200}
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
					<Grid gridTemplateColumns="55px 55px" gap="10px">
						<InputControl
							controlName="input"
							columns="columns-1"
							className="control-first label-center small-gap"
							label={__('Rows', 'publisher-core')}
							labelPopoverTitle={__('Rows Gap', 'publisher-core')}
							labelDescription={
								<>
									<p>
										{__(
											"Rows gap in Flexbox specifically sets the vertical spacing between rows of flex items, allowing precise control over the layout's vertical separation.",
											'publisher-core'
										)}
									</p>
								</>
							}
							unitType="essential"
							min={0}
							max={200}
							defaultValue={defaultValue.rows}
							id={'rows'}
							singularId={'rows'}
							onChange={(newValue, ref) =>
								handleOnChangeAttributes(
									attributeId,
									{
										...gap,
										rows: newValue,
									},
									{ ref }
								)
							}
							size="small"
							controlAddonTypes={['variable']}
							variableTypes={['spacing']}
							{...props}
						/>

						<InputControl
							controlName="input"
							columns="columns-1"
							className="control-first label-center small-gap"
							label={__('Columns', 'publisher-core')}
							labelPopoverTitle={__(
								'Columns Gap',
								'publisher-core'
							)}
							labelDescription={
								<>
									<p>
										{__(
											"Columns gap in Flexbox specifically sets the horizontal spacing between columns of flex items, allowing precise control over the layout's horizontal separation.",
											'publisher-core'
										)}
									</p>
								</>
							}
							unitType="essential"
							min={0}
							max={200}
							defaultValue={defaultValue.columns}
							id={'columns'}
							singularId={'columns'}
							onChange={(newValue, ref) =>
								handleOnChangeAttributes(
									attributeId,
									{
										...gap,
										columns: newValue,
									},
									{ ref }
								)
							}
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
					label={__('Custom Row & Column Gap', 'publisher-core')}
					size="small"
					onClick={() => {
						if (gap?.lock) {
							handleOnChangeAttributes(attributeId, {
								...gap,
								lock: !gap?.lock,
								rows: gap?.gap,
								columns: gap?.gap,
							});
						} else {
							handleOnChangeAttributes(attributeId, {
								lock: !gap?.lock,
								gap: gap?.gap,
								columns: '',
								rows: '',
							});
						}
					}}
					style={{
						color: gap?.lock
							? 'var(--publisher-controls-color)'
							: 'var(--publisher-controls-primary-color)',
						padding: '6px 3px',
					}}
				>
					{gap?.lock ? <LockIcon /> : <UnlockIcon />}
				</Button>
			</Grid>
		</BaseControl>
	);
}
