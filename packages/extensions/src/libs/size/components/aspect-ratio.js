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
	InputControl,
	SelectControl,
	useControlContext,
} from '@blockera/controls';
import { Flex } from '@blockera/components';

/**
 * Internal dependencies
 */
import type { TBlockProps, THandleOnChangeAttributes } from '../../types';

export default function AspectRatio({
	block,
	ratio,
	handleOnChangeAttributes,
	defaultValue = {
		value: '',
		width: '',
		height: '',
	},
	...props
}: {
	block: TBlockProps,
	ratio: { value: string, width: string, height: string },
	defaultValue: { value: string, width: string, height: string },
	handleOnChangeAttributes: THandleOnChangeAttributes,
}): MixedElement {
	const { value, attribute, blockName, resetToDefault } = useControlContext({
		onChange: (newValue, ref) =>
			handleOnChangeAttributes('blockeraRatio', newValue, { ref }),
		defaultValue,
		mergeInitialAndDefault: true,
		valueCleanup: (newValue) => {
			if (newValue?.value === undefined || newValue?.value === '') {
				return defaultValue;
			}

			return newValue;
		},
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
			columns="columns-2"
			controlName="toggle-select"
			label={__('Aspect Ratio', 'blockera-core')}
			labelDescription={
				<>
					<p>
						{__(
							'Aspect Ratio Control allows for maintaining a specific width-to-height ratio for blocks, ensuring consistent and responsive sizing across devices.',
							'blockera-core'
						)}
					</p>
					<p>
						{__(
							'Crucial for media blocks like images and videos, this feature preserves the original proportions, enhancing visual appeal and preventing distortion.',
							'blockera-core'
						)}
					</p>
					<p>
						{__(
							'The aspect ratio is calculated in this format:',
							'blockera-core'
						)}{' '}
						<>
							<code>width</code>
							{' / '}
							<code>height</code>
						</>
					</p>
				</>
			}
			{...labelProps}
		>
			<SelectControl
				id="value"
				singularId={'value'}
				aria-label={__('Ratio', 'blockera-core')}
				options={[
					{
						label: __('Original', 'blockera-core'),
						value: '',
					},
					{
						label: __('Square 1:1', 'blockera-core'),
						value: '1',
					},
					{
						label: __('Standard 4:3', 'blockera-core'),
						value: '4/3',
					},
					{
						label: __('Portrait 3:4', 'blockera-core'),
						value: '3/4',
					},
					{
						label: __('Landscape 3:2', 'blockera-core'),
						value: '3/2',
					},
					{
						label: __('Classic Portrait 2:3', 'blockera-core'),
						value: '2/3',
					},
					{
						label: __('Widescreen 16:9', 'blockera-core'),
						value: '16/9',
					},
					{
						label: __('Tall 9:16', 'blockera-core'),
						value: '9/16',
					},
					{
						label: __('Custom', 'blockera-core'),
						value: 'custom',
					},
				]}
				type="native"
				defaultValue={defaultValue.value}
				onChange={(newValue, ref) => {
					if (newValue === '') {
						handleOnChangeAttributes(
							'blockeraRatio',
							defaultValue,
							{
								ref,
							}
						);
					} else {
						handleOnChangeAttributes(
							'blockeraRatio',
							{
								...ratio,
								value: newValue,
							},
							{ ref }
						);
					}
				}}
				{...props}
			/>

			{ratio?.value === 'custom' && (
				<Flex alignItems="flex-start">
					<InputControl
						id="width"
						singularId={'width'}
						columns="columns-1"
						className="control-first label-center small-gap"
						label={__('Width', 'blockera-core')}
						labelDescription={
							<>
								<p>
									{__(
										'Represents the width part of the ratio.',
										'blockera-core'
									)}
								</p>
								<p>
									{__(
										'In the "16 / 9" example, 16 is the width.',
										'blockera-core'
									)}
								</p>
							</>
						}
						style={{ margin: '0px' }}
						type="number"
						min={0}
						defaultValue={defaultValue.width}
						onChange={(newValue, ref) => {
							handleOnChangeAttributes(
								'blockeraRatio',
								{
									...ratio,
									width:
										newValue === undefined ? '' : newValue,
								},
								{ ref }
							);
						}}
					/>

					<p className="blockera-colon">/</p>

					<InputControl
						id="height"
						singularId={'height'}
						columns="columns-1"
						className="control-first label-center small-gap"
						label={__('Height', 'blockera-core')}
						labelDescription={
							<>
								<p>
									{__(
										'Represents the height part of the ratio.',
										'blockera-core'
									)}
								</p>
								<p>
									{__(
										'In the "16 / 9" example, 9 is the height.',
										'blockera-core'
									)}
								</p>
							</>
						}
						style={{ margin: '0px' }}
						min={0}
						type="number"
						defaultValue={defaultValue.height}
						onChange={(newValue, ref) =>
							handleOnChangeAttributes(
								'blockeraRatio',
								{
									...ratio,
									height: newValue,
								},
								{ ref }
							)
						}
					/>
				</Flex>
			)}
		</BaseControl>
	);
}
