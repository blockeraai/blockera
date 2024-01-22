// @flow
/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import type { MixedElement } from 'react';

/**
 * Publisher dependencies
 */
import {
	BaseControl,
	BorderControl,
	InputControl,
	NoticeControl,
	ToggleSelectControl,
	useControlContext,
} from '@publisher/controls';
import { isEmpty, isUndefined } from '@publisher/utils';
import type { BorderControlBorderStyle } from '@publisher/controls/src/libs/border-control/types';

/**
 * Internal dependencies
 */
import NoneIcon from '../icons/none';
import type { THandleOnChangeAttributes } from '../../types';
import Columns2Icon from '../icons/columns-2';
import Columns3Icon from '../icons/columns-3';
import Columns4Icon from '../icons/columns-4';
import Columns5Icon from '../icons/columns-5';

export const TextColumns = ({
	value,
	defaultValue,
	display,
	handleOnChangeAttributes,
	...props
}: {
	value: {
		columns: string,
		gap: string,
		divider: {
			width: string,
			style: string,
			color: string,
		},
	},
	defaultValue: {
		columns: string,
		gap: string,
		divider: {
			width: string,
			style: BorderControlBorderStyle,
			color: string,
		},
	},
	display: string,
	handleOnChangeAttributes: THandleOnChangeAttributes,
}): MixedElement => {
	const {
		value: _value,
		attribute,
		blockName,
		resetToDefault,
	} = useControlContext({
		onChange: (newValue) => handleOnChangeAttributes(newValue),
		defaultValue,
		mergeInitialAndDefault: true,
	});

	const labelProps = {
		value: _value,
		attribute,
		blockName,
		resetToDefault,
		mode: 'advanced',
		path: attribute,
		defaultValue,
	};

	return (
		<BaseControl columns="columns-1">
			<BaseControl
				controlName="toggle-select"
				label={__('Text Columns', 'publisher-core')}
				labelDescription={
					<>
						<p>
							{__(
								'It divides text into multiple columns, creating a newspaper-like layout, ideal for enhancing readability and aesthetic appeal in large blocks of text.',
								'publisher-core'
							)}
						</p>
					</>
				}
				columns="columns-2"
				className={
					display === 'flex' ? 'publisher-control-is-not-active' : ''
				}
				{...labelProps}
			>
				<ToggleSelectControl
					id={'columns'}
					options={[
						{
							label: __('2 Columns Text', 'publisher-core'),
							value: '2-columns',
							icon: <Columns2Icon />,
						},
						{
							label: __('3 Columns Text', 'publisher-core'),
							value: '3-columns',
							icon: <Columns3Icon />,
						},
						{
							label: __('4 Columns Text', 'publisher-core'),
							value: '4-columns',
							icon: <Columns4Icon />,
						},
						{
							label: __('5 Columns Text', 'publisher-core'),
							value: '5-columns',
							icon: <Columns5Icon />,
						},
						{
							label: __('None', 'publisher-core'),
							value: 'none',
							icon: <NoneIcon />,
						},
					]}
					isDeselectable={true}
					defaultValue={defaultValue?.columns}
					onChange={(newValue, ref) => {
						if (
							'reset' === ref?.current?.action ||
							newValue === ''
						) {
							handleOnChangeAttributes(
								'publisherTextColumns',
								defaultValue,
								{ ref }
							);
						} else {
							handleOnChangeAttributes(
								'publisherTextColumns',
								{
									...value,
									columns: newValue,
								},
								{ ref }
							);
						}
					}}
					{...props}
				/>
				{!isEmpty(_value?.columns) &&
					_value?.columns !== 'none' &&
					!isUndefined(_value?.columns) && (
						<>
							<InputControl
								id={'gap'}
								controlName="input"
								label={__('Gap', 'publisher-core')}
								labelPopoverTitle={__(
									'Text Columns Gap',
									'publisher-core'
								)}
								labelDescription={
									<>
										<p>
											{__(
												'It sets the gap between text columns essential for ensuring clear separation and enhancing the overall readability of the text.',
												'publisher-core'
											)}
										</p>
									</>
								}
								columns="columns-2"
								unitType="essential"
								range={false}
								arrows={true}
								min={0}
								max={200}
								defaultValue={defaultValue?.gap}
								onChange={(newValue, ref) => {
									if ('reset' === ref?.current?.action) {
										handleOnChangeAttributes(
											'publisherTextColumns',
											{
												..._value,
												gap: defaultValue.gap,
											},
											{ ref }
										);
									} else {
										handleOnChangeAttributes(
											'publisherTextColumns',
											{
												..._value,
												gap: newValue,
											},
											{ ref }
										);
									}
								}}
							/>

							<BorderControl
								id={'divider'}
								controlName="border"
								label={__('Divider', 'publisher-core')}
								labelPopoverTitle={__(
									'Text Columns Divider',
									'publisher-core'
								)}
								labelDescription={
									<>
										<p>
											{__(
												'It creates a rule (line) between columns in a multi-column layout, similar to border, but specifically for separating columns, enhancing their distinction and readability.',
												'publisher-core'
											)}
										</p>
									</>
								}
								columns="columns-1"
								className="control-first label-center small-gap"
								linesDirection="vertical"
								customMenuPosition="top"
								defaultValue={defaultValue?.divider}
								onChange={(newValue, ref) => {
									console.log(newValue, ref);
									if ('reset' === ref?.current?.action) {
										handleOnChangeAttributes(
											'publisherTextColumns',
											{
												..._value,
												divider: defaultValue.divider,
											},
											{ ref }
										);
									} else {
										handleOnChangeAttributes(
											'publisherTextColumns',
											{
												..._value,
												divider: newValue,
											},
											{ ref }
										);
									}
								}}
							/>
						</>
					)}
			</BaseControl>

			{display === 'flex' && (
				<NoticeControl type="information">
					{__(
						"Text columns can't be applied for flex blocks. Disable the flex on this block or wrap it in another container and apply the flex to the container.",
						'publisher-core'
					)}
				</NoticeControl>
			)}
		</BaseControl>
	);
};
