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
			<BaseControl controlName={__('Size', 'publisher-core')}>
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
					label={__('Min', 'publisher-core')}
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
					label={__('Max', 'publisher-core')}
				/>
			</BaseControl>
		</>
	);
}
