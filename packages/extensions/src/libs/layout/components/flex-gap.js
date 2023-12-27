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
	publisherGap,
	block,
	handleOnChangeAttributes,
	...props
}: {
	gap: { lock: boolean, gap: string, columns: string, rows: string },
	publisherGap: Object,
	handleOnChangeAttributes: THandleOnChangeAttributes,
	block: TBlockProps,
}): MixedElement {
	const { value, attribute, blockName, resetToDefault, getControlPath } =
		useControlContext({
			defaultValue: '',
			onChange: (newValue) =>
				handleOnChangeAttributes('publisherGap', {
					...gap,
					gap: newValue,
				}),
		});

	const labelProps = {
		value,
		attribute,
		blockName,
		defaultValue: '',
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
					<code>gap: 20px;</code>
				</>
			}
			columns="80px 160px"
			id={'gap'}
			path={'gap'}
			{...labelProps}
		>
			<Grid gap="10px" gridTemplateColumns="120px 30px">
				{gap?.lock ? (
					isActiveField(publisherGap) && (
						<InputControl
							{...props}
							className="control-first label-center small-gap"
							aria-label={__('Gap', 'publisher-core')}
							unitType="essential"
							min={0}
							max={200}
							defaultValue={gap?.gap}
							id={'gap'}
							onChange={(newValue) =>
								handleOnChangeAttributes('publisherGap', {
									...gap,
									gap: newValue,
								})
							}
							controlAddonTypes={['variable']}
							variableTypes={['spacing']}
						/>
					)
				) : (
					<Grid gridTemplateColumns="50px 50px" gap="10px">
						<InputControl
							{...props}
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
									<code>row-gap: 30px;</code>
								</>
							}
							unitType="essential"
							min={0}
							max={200}
							defaultValue={gap?.rows}
							id={'rows'}
							onChange={(newValue) =>
								handleOnChangeAttributes('publisherGap', {
									...gap,
									rows: newValue,
								})
							}
							size="small"
							controlAddonTypes={['variable']}
							variableTypes={['spacing']}
						/>

						<InputControl
							{...props}
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
									<code>column-gap: 30px;</code>
								</>
							}
							unitType="essential"
							min={0}
							max={200}
							defaultValue={gap?.columns}
							id={'columns'}
							onChange={(newValue) =>
								handleOnChangeAttributes('publisherGap', {
									...gap,
									columns: newValue,
								})
							}
							size="small"
							controlAddonTypes={['variable']}
							variableTypes={['spacing']}
						/>
					</Grid>
				)}
				<Button
					showTooltip={true}
					tooltipPosition="top"
					label={__('Custom Row Column Gap', 'publisher-core')}
					size="small"
					onClick={() => {
						if (gap?.lock) {
							handleOnChangeAttributes('publisherGap', {
								...gap,
								lock: !gap?.lock,
								rows: gap?.gap,
								columns: gap?.gap,
							});
						} else {
							handleOnChangeAttributes('publisherGap', {
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
