// @flow
/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import type { MixedElement } from 'react';

/**
 * Blockera dependencies
 */
import {
	BaseControl,
	ControlContextProvider,
	PositionButtonControl,
	SelectControl,
	useControlContext,
} from '@blockera/controls';
import { Icon } from '@blockera/icons';

/**
 * Internal dependencies
 */
import type { TBlockProps, THandleOnChangeAttributes } from '../../types';
import { generateExtensionId } from '../../utils';

export default function ObjectFit({
	block,
	fitPosition,
	handleOnChangeAttributes,
	defaultValue,
	fitPositionDefaultValue,
	fitPositionProps,
	...props
}: {
	block: TBlockProps,
	defaultValue: string,
	fitPosition: { top: string, left: string },
	fitPositionDefaultValue: { top: string, left: string },
	fitPositionProps: Object,
	handleOnChangeAttributes: THandleOnChangeAttributes,
}): MixedElement {
	const { value, attribute, blockName, resetToDefault } = useControlContext({
		onChange: (newValue, ref) =>
			handleOnChangeAttributes('blockeraFit', newValue, { ref }),
		defaultValue,
	});

	const labelProps = {
		value,
		attribute: 'blockeraRatio',
		blockName,
		defaultValue,
		resetToDefault,
		mode: 'advanced',
		path: attribute,
	};

	return (
		<BaseControl
			label={__('Media Fit', 'blockera')}
			labelDescription={
				<>
					<p>
						{__(
							'Media Fit (object-Fit) controls how an image or video fits into its container for ensuring optimal media display.',
							'blockera'
						)}
					</p>
					<p>
						{__(
							'It is essential for responsive design, ensuring media maintain their aspect ratio while adapting to different container sizes, enhancing visual appeal without distortion.',
							'blockera'
						)}
					</p>
					<h3>
						<Icon icon="fit-fill" iconSize="22" />
						{__('Fill', 'blockera')}
					</h3>
					<p>
						{__(
							'The image or video is stretched to fill the container, which may lead to distortion.',
							'blockera'
						)}
					</p>
					<h3>
						<Icon icon="fit-contain" iconSize="22" />
						{__('Contain', 'blockera')}
					</h3>
					<p>
						{__(
							'The entire image or video is scaled to fit inside the container, maintaining its aspect ratio but might leave empty space.',
							'blockera'
						)}
					</p>
					<h3>
						<Icon icon="fit-cover" iconSize="22" />
						{__('Cover', 'blockera')}
					</h3>
					<p>
						{__(
							'The content is resized to cover the entire container, maintaining its aspect ratio and may be clipped.',
							'blockera'
						)}
					</p>
					<h3>
						<Icon icon="fit-none" iconSize="22" />
						{__('None', 'blockera')}
					</h3>
					<p>
						{__(
							'The image or video is displayed at its true size, ignoring the container size.',
							'blockera'
						)}
					</p>
					<h3>
						<Icon icon="fit-scale-down" iconSize="22" />
						{__('Scale Down', 'blockera')}
					</h3>
					<p>
						{__(
							'Behaves like "none" or "contain", whichever results in a smaller image or video.',
							'blockera'
						)}
					</p>
				</>
			}
			columns="columns-2"
			className={'blockera-object-fit'}
			{...labelProps}
		>
			<SelectControl
				controlName="select"
				columns="columns-1"
				options={[
					{
						label: __('Default', 'blockera'),
						value: '',
						icon: <Icon icon="fit-normal" iconSize="18" />,
					},
					{
						label: __('Fill', 'blockera'),
						value: 'fill',
						icon: <Icon icon="fit-fill" iconSize="18" />,
					},
					{
						label: __('Contain', 'blockera'),
						value: 'contain',
						icon: <Icon icon="fit-contain" iconSize="18" />,
					},
					{
						label: __('Cover', 'blockera'),
						value: 'cover',
						icon: <Icon icon="fit-cover" iconSize="18" />,
					},
					{
						label: __('None', 'blockera'),
						value: 'none',
						icon: <Icon icon="fit-none" iconSize="18" />,
					},
					{
						label: __('Scale Down', 'blockera'),
						value: 'scale-down',
						icon: <Icon icon="fit-scale-down" iconSize="18" />,
					},
				]}
				type="custom"
				defaultValue={defaultValue}
				onChange={(newValue, ref) =>
					handleOnChangeAttributes('blockeraFit', newValue, { ref })
				}
				{...props}
			/>

			<ControlContextProvider
				value={{
					name: generateExtensionId(block, 'fit-position'),
					value: fitPosition,
					attribute: 'blockeraFitPosition',
					blockName: block.blockName,
				}}
			>
				<PositionButtonControl
					buttonLabel={__('Fit Position', 'blockera')}
					alignmentMatrixLabel={__('Position', 'blockera')}
					size="small"
					defaultValue={fitPositionDefaultValue}
					onChange={({ top, left }, ref) => {
						handleOnChangeAttributes(
							'blockeraFitPosition',
							{
								...fitPosition,
								top,
								left,
							},
							{ ref }
						);
					}}
					{...fitPositionProps}
				/>
			</ControlContextProvider>
		</BaseControl>
	);
}
