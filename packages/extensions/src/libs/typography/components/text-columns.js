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
	BorderControl,
	InputControl,
	NoticeControl,
	ToggleSelectControl,
	useControlContext,
} from '@blockera/controls';
import { isEmpty, isUndefined } from '@blockera/utils';
import type { BorderControlBorderStyle } from '@blockera/controls/src/libs/border-control/types';

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
		onChange: (newValue, ref) => {
			if ('reset' === ref?.current?.action) {
				handleOnChangeAttributes('blockeraTextColumns', defaultValue, {
					ref,
				});
			} else {
				handleOnChangeAttributes('blockeraTextColumns', newValue, {
					ref,
				});
			}
		},
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
				label={__('Text Columns', 'blockera')}
				labelDescription={
					<>
						<p>
							{__(
								'It divides text into multiple columns, creating a newspaper-like layout, ideal for enhancing readability and aesthetic appeal in large blocks of text.',
								'blockera'
							)}
						</p>
					</>
				}
				columns="columns-2"
				className={
					display === 'flex' ? 'blockera-control-is-not-active' : ''
				}
				{...labelProps}
			>
				<ToggleSelectControl
					id={'columns'}
					singularId={'columns'}
					options={[
						{
							label: __('2 Columns Text', 'blockera'),
							value: '2-columns',
							icon: <Columns2Icon />,
						},
						{
							label: __('3 Columns Text', 'blockera'),
							value: '3-columns',
							icon: <Columns3Icon />,
						},
						{
							label: __('4 Columns Text', 'blockera'),
							value: '4-columns',
							icon: <Columns4Icon />,
						},
						{
							label: __('5 Columns Text', 'blockera'),
							value: '5-columns',
							icon: <Columns5Icon />,
						},
						{
							label: __('None', 'blockera'),
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
								'blockeraTextColumns',
								defaultValue,
								{ ref }
							);
						} else {
							handleOnChangeAttributes(
								'blockeraTextColumns',
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
								singularId={'gap'}
								label={__('Gap', 'blockera')}
								labelPopoverTitle={__(
									'Text Columns Gap',
									'blockera'
								)}
								labelDescription={
									<>
										<p>
											{__(
												'It sets the gap between text columns essential for ensuring clear separation and enhancing the overall readability of the text.',
												'blockera'
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
											'blockeraTextColumns',
											{
												..._value,
												gap: defaultValue.gap,
											},
											{ ref }
										);
									} else {
										handleOnChangeAttributes(
											'blockeraTextColumns',
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
								singularId={'divider'}
								label={__('Divider', 'blockera')}
								labelPopoverTitle={__(
									'Text Columns Divider',
									'blockera'
								)}
								labelDescription={
									<>
										<p>
											{__(
												'It creates a rule (line) between columns in a multi-column layout, similar to border, but specifically for separating columns, enhancing their distinction and readability.',
												'blockera'
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
									if ('reset' === ref?.current?.action) {
										handleOnChangeAttributes(
											'blockeraTextColumns',
											{
												..._value,
												divider: defaultValue.divider,
											},
											{ ref }
										);
									} else {
										handleOnChangeAttributes(
											'blockeraTextColumns',
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
						'blockera'
					)}
				</NoticeControl>
			)}
		</BaseControl>
	);
};
