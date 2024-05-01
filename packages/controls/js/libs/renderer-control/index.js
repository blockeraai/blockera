// @flow

/**
 * External dependencies
 */
import type { MixedElement } from 'react';

/**
 * Blockera dependencies
 */
import {
	LinkControl,
	BaseControl,
	InputControl,
	SearchControl,
	SelectControl,
} from '../../libs';

/**
 * Internal dependencies
 */
import { useControlContext } from '../../context';
import type { RendererControlProps } from './types';
import { isEnableRenderer, normalizedSelectOptions } from './helpers';

export const RendererControl = ({
	id,
	key,
	type,
	label,
	columns,
	options = [],
	defaultValue,
	conditions = [],
	parentDefaultValue,
	...props
}: RendererControlProps): MixedElement => {
	const {
		value,
		controlInfo: { name: controlId },
		dispatch: { modifyControlValue },
	} = useControlContext();

	const handleOnChange = (newValue) => {
		modifyControlValue({
			controlId,
			value: {
				...value,
				[id]: newValue,
			},
		});
	};

	// Assume conditions falsy!
	if (!isEnableRenderer(conditions, value)) {
		return <></>;
	}

	let Component;

	switch (type) {
		case 'text':
			Component = (
				<InputControl
					id={id}
					singularId={id}
					onChange={handleOnChange}
					defaultValue={defaultValue || value[id]}
					{...props}
				/>
			);
			break;

		case 'select':
			Component = (
				<SelectControl
					id={id}
					singularId={id}
					onChange={handleOnChange}
					defaultValue={defaultValue || value[id]}
					options={normalizedSelectOptions(options)}
					{...props}
				/>
			);
			break;

		case 'link':
			Component = (
				<LinkControl
					id={id}
					singularId={id}
					defaultValue={defaultValue || value[id]}
					//
					onChange={handleOnChange}
					{...props}
				/>
			);
			break;

		case 'search':
			Component = (
				<SearchControl
					id={id}
					singularId={id}
					//
					onChange={handleOnChange}
					defaultValue={defaultValue || value[id]}
					{...props}
				/>
			);
			break;
	}

	return (
		<BaseControl label={label} columns="columns-2">
			{Component}
		</BaseControl>
	);
};
