/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { useContext } from '@wordpress/element';

/**
 * Publisher dependencies
 */
import {
	BaseControl,
	ControlContextProvider,
	InputControl,
	ToggleSelectControl,
} from '@publisher/controls';

/**
 * Internal dependencies
 */
import { generateExtensionId } from '../utils';
import { BlockEditContext } from '../../hooks';
import { isActiveField } from '../../api/utils';
import { default as OverflowVisibleIcon } from './icons/overflow-visible';
import { default as OverflowHiddenIcon } from './icons/overflow-hidden';
import { default as OverflowScrollIcon } from './icons/overflow-scroll';

export function SizeExtension({ children, config, ...props }) {
	const {
		sizeConfig: { publisherWidth, publisherHeight, publisherOverflow },
	} = config;

	const { attributes, setAttributes } = useContext(BlockEditContext);

	return (
		<>
			{isActiveField(publisherWidth) && (
				<ControlContextProvider
					value={{
						name: generateExtensionId(props, 'width'),
						value: attributes.publisherWidth,
					}}
				>
					<BaseControl
						controlName="input"
						label={__('Width', 'publisher-core')}
					>
						<InputControl
							{...{
								...props,
								unitType: 'essential',
								min: 0,
								defaultValue: '',
								onChange: (newValue) =>
									setAttributes({
										...attributes,
										publisherWidth: newValue,
									}),
							}}
						/>
					</BaseControl>
				</ControlContextProvider>
			)}

			{isActiveField(publisherHeight) && (
				<ControlContextProvider
					value={{
						name: generateExtensionId(props, 'height'),
						value: attributes.publisherHeight,
					}}
				>
					<BaseControl
						controlName="input"
						label={__('Height', 'publisher-core')}
					>
						<InputControl
							{...{
								...props,
								unitType: 'essential',
								min: 0,
								defaultValue: '',
								onChange: (newValue) =>
									setAttributes({
										...attributes,
										publisherHeight: newValue,
									}),
							}}
						/>
					</BaseControl>
				</ControlContextProvider>
			)}

			{isActiveField(publisherOverflow) && (
				<ControlContextProvider
					value={{
						name: generateExtensionId(props, 'overflow'),
						value: attributes.publisherOverflow,
					}}
				>
					<BaseControl
						controlName="toggle-select"
						label={__('Overflow', 'publisher-core')}
					>
						<ToggleSelectControl
							options={[
								{
									label: __('Visible', 'publisher-core'),
									value: 'visible',
									icon: <OverflowVisibleIcon />,
								},
								{
									label: __('Hidden', 'publisher-core'),
									value: 'hidden',
									icon: <OverflowHiddenIcon />,
								},
								{
									label: __('Scroll', 'publisher-core'),
									value: 'scroll',
									icon: <OverflowScrollIcon />,
								},
							]}
							//
							defaultValue="visible"
							onChange={(newValue) =>
								setAttributes({
									...attributes,
									publisherOverflow: newValue,
								})
							}
						/>
					</BaseControl>
				</ControlContextProvider>
			)}
		</>
	);
}
