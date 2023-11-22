// @flow
/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import type { MixedElement } from 'react';

/**
 * Publisher dependencies
 */
import {
	BaseControl,
	InputControl,
	ToggleSelectControl,
	ControlContextProvider,
} from '@publisher/controls';
import { Button, Popover } from '@publisher/components';
import { controlInnerClassNames } from '@publisher/classnames';

/**
 * Internal dependencies
 */
import type { TBlockProps, THandleOnChangeAttributes } from '../../types';
import { generateExtensionId } from '../../utils';
import { OriginIcon } from './origin-icon';
import { SelfOrigin } from './self-origin';
import { ChildOrigin } from './child-origin';

export const TransformSettings = ({
	setIsTransformSettingsVisible,
	transformSelfPerspective,
	block,
	handleOnChangeAttributes,
	backfaceVisibility,
	transformChildPerspective,
	props,
	transformChildOrigin,
	transformSelfOrigin,
}: {
	setIsTransformSettingsVisible: (arg: boolean) => any,
	transformSelfPerspective: string | void,
	block: TBlockProps,
	handleOnChangeAttributes: THandleOnChangeAttributes,
	backfaceVisibility: string | void,
	transformChildPerspective: string | void,
	props: Object,
	transformChildOrigin: Object,
	transformSelfOrigin: Object,
}): MixedElement => {
	const [isSelfOriginVisible, setIsSelfOriginVisible] = useState(false);
	const [isChildOriginVisible, setIsChildOriginVisible] = useState(false);

	return (
		<Popover
			title={__('Transform Settings', 'publisher-core')}
			offset={35}
			placement="left-start"
			className={controlInnerClassNames('transform-settings-popover')}
			onClose={() => {
				setIsTransformSettingsVisible(false);
			}}
		>
			<ControlContextProvider
				value={{
					name: generateExtensionId(block, 'self-perspective'),
					value: transformSelfPerspective,
				}}
			>
				<BaseControl
					label={__('Self Perspective', 'publisher-core')}
					columns="columns-2"
					className={'publisher-transform-self-perspective'}
				>
					<InputControl
						controlName="input"
						{...{
							...props,
							unitType: 'essential',
							range: true,
							min: 0,
							max: 2000,
							initialPosition: 100,
							defaultValue: '0px',
							onChange: (newValue) =>
								handleOnChangeAttributes(
									'publisherTransformSelfPerspective',
									newValue
								),
						}}
					/>
					<Button
						label={__('Self Perspective Origin', 'publisher-core')}
						showTooltip={true}
						tooltipPosition="top"
						onClick={() => {
							setIsSelfOriginVisible(!isSelfOriginVisible);
						}}
						size="small"
						style={{
							padding: '5px',
							width: '30px',
							height: '30px',
							color:
								!transformSelfOrigin?.top ||
								!transformSelfOrigin?.left
									? 'var(--publisher-controls-color)'
									: 'var(--publisher-controls-border-color-focus)',
						}}
					>
						{OriginIcon(
							transformSelfOrigin?.top,
							transformSelfOrigin?.left
						)}
					</Button>
					{isSelfOriginVisible && (
						<SelfOrigin
							transformSelfOrigin={transformSelfOrigin}
							handleOnChangeAttributes={handleOnChangeAttributes}
							setIsSelfOriginVisible={setIsSelfOriginVisible}
							block={block}
						/>
					)}
				</BaseControl>
			</ControlContextProvider>

			<ControlContextProvider
				value={{
					name: generateExtensionId(block, 'backface-visibility'),
					value: backfaceVisibility,
				}}
			>
				<ToggleSelectControl
					controlName="toggle-select"
					label={__('Backface Visibility', 'publisher-core')}
					columns="columns-2"
					options={[
						{
							label: __('Visible', 'publisher-core'),
							value: 'visible',
						},
						{
							label: __('Hidden', 'publisher-core'),
							value: 'hidden',
						},
					]}
					defaultValue="visible"
					onChange={(newValue) =>
						handleOnChangeAttributes(
							'publisherBackfaceVisibility',
							newValue
						)
					}
				/>
			</ControlContextProvider>

			<ControlContextProvider
				value={{
					name: generateExtensionId(block, 'child-perspective'),
					value: transformChildPerspective
						? transformChildPerspective
						: '0px',
				}}
			>
				<BaseControl
					label={__('Child Perspective', 'publisher-core')}
					columns="columns-2"
					className={'publisher-transform-child-perspective'}
				>
					<InputControl
						controlName="input"
						{...{
							...props,
							unitType: 'essential',
							range: true,
							min: 0,
							max: 2000,
							defaultValue: '0px',
							onChange: (newValue) =>
								handleOnChangeAttributes(
									'publisherTransformChildPerspective',
									newValue
								),
						}}
					/>
					<Button
						onClick={() => {
							setIsChildOriginVisible(!isChildOriginVisible);
						}}
						label={__('Child Perspective Origin', 'publisher-core')}
						showTooltip={true}
						tooltipPosition="top"
						size="small"
						style={{
							padding: '5px',
							width: '30px',
							height: '30px',
							color:
								!transformChildOrigin.top ||
								!transformChildOrigin.left
									? 'var(--publisher-controls-color)'
									: 'var(--publisher-controls-border-color-focus)',
						}}
					>
						{OriginIcon(
							transformChildOrigin.top,
							transformChildOrigin.left
						)}
					</Button>
					{isChildOriginVisible && (
						<ChildOrigin
							setIsChildOriginVisible={setIsChildOriginVisible}
							transformChildOrigin={transformChildOrigin}
							block={block}
							handleOnChangeAttributes={handleOnChangeAttributes}
						/>
					)}
				</BaseControl>
			</ControlContextProvider>
		</Popover>
	);
};
