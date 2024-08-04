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
	Flex,
	BaseControl,
	InputControl,
	useControlContext,
} from '@blockera/controls';
import { controlClassNames } from '@blockera/classnames';

export default function ({
	item,
	itemId,
}: {
	item: Object,
	itemId: number,
}): MixedElement {
	const {
		controlInfo: { name: controlId },
		dispatch: { changeRepeaterItem },
	} = useControlContext();

	return (
		<>
			<InputControl
				id={'name'}
				type={'text'}
				columns={'columns-2'}
				defaultValue={item.label}
				onChange={(newValue) =>
					changeRepeaterItem({
						itemId,
						controlId,
						value: {
							...item,
							label: newValue,
						},
					})
				}
				label={__('Name', 'blockera')}
			/>
			<BaseControl columns="columns-1" label={__('Size', 'blockera')}>
				<Flex
					style={{
						width: '173px',
						alignSelf: 'flex-end',
					}}
				>
					<InputControl
						id={'settings.min'}
						type={'number'}
						unitType={'width'}
						columns={'columns-2'}
						defaultValue={item.settings.min}
						onChange={(newValue) =>
							changeRepeaterItem({
								itemId,
								controlId,
								value: {
									...item,
									settings: {
										...item.settings,
										min: newValue,
									},
								},
							})
						}
						placeholder="0"
						size="small"
						className={controlClassNames(
							'control-first label-center small-gap'
						)}
						label={__('Min', 'blockera')}
						aria-label={__('Min Width', 'blockera')}
					/>
					<InputControl
						id={'settings.max'}
						type={'number'}
						unitType={'width'}
						columns={'columns-2'}
						defaultValue={item.settings.max}
						onChange={(newValue) =>
							changeRepeaterItem({
								itemId,
								controlId,
								value: {
									...item,
									settings: {
										...item.settings,
										max: newValue,
									},
								},
							})
						}
						placeholder="0"
						size="small"
						className={controlClassNames(
							'control-first label-center small-gap'
						)}
						label={__('Max', 'blockera')}
						aria-label={__('Max Width', 'blockera')}
					/>
				</Flex>
			</BaseControl>
		</>
	);
}
