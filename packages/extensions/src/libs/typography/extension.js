/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useState, useContext } from '@wordpress/element';

/**
 * Publisher dependencies
 */
import {
	ColorField,
	Field,
	InputField,
	TextShadowField,
} from '@publisher/fields';
import { Popover, Button } from '@publisher/components';
import { controlInnerClassNames } from '@publisher/classnames';

/**
 * Internal dependencies
 */
import { BlockEditContext } from '../../hooks';
import { isActiveField } from '../../api/utils';
import TypographyButtonIcon from './icons/typography-button';
import './style.scss';

export function TypographyExtension({ children, config, ...props }) {
	const {
		typographyConfig: {
			publisherFontColor,
			publisherTextShadow,
			publisherFontSize,
			publisherLineHeight,
		},
	} = config;

	const { attributes, setAttributes } = useContext(BlockEditContext);
	const [isVisible, setIsVisible] = useState(false);
	const toggleVisible = () => {
		setIsVisible((state) => !state);
	};

	return (
		<>
			<Field
				field="typography"
				label={__('Typography', 'publisher-core')}
			>
				<Button
					size="input"
					style="primary"
					className={
						isVisible ? 'is-focus toggle-focus' : 'toggle-focus'
					}
					onClick={toggleVisible}
				>
					<TypographyButtonIcon />
					{__('Customize', 'publisher-core')}
				</Button>

				{isVisible && (
					<Popover
						offset={125}
						placement="left-start"
						className={controlInnerClassNames('group-popover')}
					>
						{isActiveField(publisherFontSize) && (
							<InputField
								label={__('Font Size', 'publisher-core')}
								settings={{
									type: 'css',
									unitType: 'essential',
									range: true,
									min: 0,
									max: 200,
									initValue: '14px',
								}}
								//
								initValue=""
								value={attributes.publisherFontSize}
								onValueChange={(newValue) =>
									setAttributes({
										...attributes,
										publisherFontSize: newValue,
									})
								}
							/>
						)}

						{isActiveField(publisherLineHeight) && (
							<InputField
								label={__('Line Height', 'publisher-core')}
								settings={{
									type: 'css',
									unitType: 'essential',
									range: true,
									min: 0,
									max: 100,
									initValue: '14px',
								}}
								//
								initValue=""
								value={attributes.publisherLineHeight}
								onValueChange={(newValue) =>
									setAttributes({
										...attributes,
										publisherLineHeight: newValue,
									})
								}
							/>
						)}
					</Popover>
				)}
			</Field>

			{isActiveField(publisherFontColor) && (
				<ColorField
					{...{
						...props,
						label: __('Color', 'publisher-core'),
						//
						initValue: '',
						value: attributes.publisherFontColor,
						onValueChange: (newValue) =>
							setAttributes({
								...attributes,
								publisherFontColor: newValue,
							}),
					}}
				/>
			)}

			{isActiveField(publisherTextShadow) && (
				<TextShadowField
					{...{
						...props,
						config: publisherTextShadow,
						attribute: 'publisherTextShadow',
						label: __('Text Shadow', 'publisher-core'),
					}}
				/>
			)}
		</>
	);
}
