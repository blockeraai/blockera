// @flow
/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import type { MixedElement, ComponentType } from 'react';

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
import { renderSelectOptionChangesetPreview } from '../../../../components';
import { generateExtensionId } from '../../utils';
import type { TBlockProps, THandleOnChangeAttributes } from '../../types';

function getObjectFitSelectOptions(iconSize: number = 18): any {
	return [
		{
			label: __('Default', 'blockera'),
			value: '',
			icon: <Icon icon="fit-normal" iconSize={iconSize} />,
		},
		{
			label: __('Fill', 'blockera'),
			value: 'fill',
			icon: <Icon icon="fit-fill" iconSize={iconSize} />,
		},
		{
			label: __('Contain', 'blockera'),
			value: 'contain',
			icon: <Icon icon="fit-contain" iconSize={iconSize} />,
		},
		{
			label: __('Cover', 'blockera'),
			value: 'cover',
			icon: <Icon icon="fit-cover" iconSize={iconSize} />,
		},
		{
			label: __('None', 'blockera'),
			value: 'none',
			icon: <Icon icon="fit-none" iconSize={iconSize} />,
		},
		{
			label: __('Scale Down', 'blockera'),
			value: 'scale-down',
			icon: <Icon icon="fit-scale-down" iconSize={iconSize} />,
		},
	];
}

function renderObjectFitChangesetPreview(resolved: mixed): MixedElement | null {
	return renderSelectOptionChangesetPreview({
		value: resolved,
		getOptions: (iconSize) => getObjectFitSelectOptions(iconSize),
		showIcon: true,
		showLabel: true,
		iconSize: 16,
		gap: '4px',
		emptyValueMeansNoPreview: false,
		showUnmatchedValue: true,
	});
}

export const ObjectFit: ComponentType<Object> = ({
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
}): MixedElement => {
	const { value, attribute, blockName, resetToDefault } = useControlContext({
		onChange: (newValue, ref) =>
			handleOnChangeAttributes('blockeraFit', newValue, { ref }),
		defaultValue,
	});

	const labelProps = {
		value,
		attribute,
		blockName,
		defaultValue,
		resetToDefault,
		mode: 'advanced',
		path: attribute,
		changesetGraphPreviewRender: renderObjectFitChangesetPreview,
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
						<Icon icon="fit-fill" iconSize="18" />
						{__('Fill', 'blockera')}
					</h3>
					<p>
						{__(
							'The image or video is stretched to fill the container, which may lead to distortion.',
							'blockera'
						)}
					</p>
					<h3>
						<Icon icon="fit-contain" iconSize="18" />
						{__('Contain', 'blockera')}
					</h3>
					<p>
						{__(
							'The entire image or video is scaled to fit inside the container, maintaining its aspect ratio but might leave empty space.',
							'blockera'
						)}
					</p>
					<h3>
						<Icon icon="fit-cover" iconSize="18" />
						{__('Cover', 'blockera')}
					</h3>
					<p>
						{__(
							'The content is resized to cover the entire container, maintaining its aspect ratio and may be clipped.',
							'blockera'
						)}
					</p>
					<h3>
						<Icon icon="fit-none" iconSize="18" />
						{__('None', 'blockera')}
					</h3>
					<p>
						{__(
							'The image or video is displayed at its true size, ignoring the container size.',
							'blockera'
						)}
					</p>
					<h3>
						<Icon icon="fit-scale-down" iconSize="18" />
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
			columns="1fr 2.5fr"
			className={'blockera-object-fit'}
			{...labelProps}
		>
			<SelectControl
				columns="columns-1"
				options={getObjectFitSelectOptions()}
				type="custom"
				defaultValue={defaultValue}
				onChange={(newValue, ref) =>
					handleOnChangeAttributes('blockeraFit', newValue, {
						ref,
					})
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
					popoverTitle={__('Media Fit Position', 'blockera')}
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
};
