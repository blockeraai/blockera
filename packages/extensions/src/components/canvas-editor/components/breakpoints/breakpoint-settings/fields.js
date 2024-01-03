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
	InputControl,
	useControlContext,
} from '@publisher/controls';
import { Flex } from '@publisher/components';
import { controlClassNames } from '@publisher/classnames';

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
				label={__('Name', 'publisher-core')}
			/>
			<BaseControl
				columns="columns-1"
				label={__('Size', 'publisher-core')}
			>
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
						label={__('Min', 'publisher-core')}
						aria-label={__('Min Width', 'publisher-core')}
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
						label={__('Max', 'publisher-core')}
						aria-label={__('Max Width', 'publisher-core')}
					/>
				</Flex>
			</BaseControl>
		</>
	);
}
