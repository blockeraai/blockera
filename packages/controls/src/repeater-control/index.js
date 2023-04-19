/**
 * WordPress dependencies.
 */
import { plus } from '@wordpress/icons';
import { useEffect, useCallback } from '@wordpress/element';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { useImmerReducer } from 'use-immer';

/**
 * Internal dependencies.
 */
import { RepeaterContextProvider } from './context';
import repeaterItemsReducer from './store/reducer';
import {
	addRepeaterItem,
	removeRepeaterItem,
	changeRepeaterItem,
} from './store/actions';
import { InspectElement, Button, Icon } from '@publisher/components';

//CSS dependencies
import './style.scss';
import { getBaseClassNames } from '../global-helpers';

const RepeaterControl = ({
	title,
	name,
	label,
	attributes,
	setAttributes,
	initialState,
	InnerComponents,
}) => {
	const updateBlockAttributes = useCallback(
		(boxShadowItems) => {
			setAttributes({
				...attributes,
				publisherAttributes: {
					boxShadowItems,
				},
			});
		},
		[setAttributes]
	);
	const { publisherAttributes } = attributes;

	const [repeaterItems, dispatch] = useImmerReducer(
		repeaterItemsReducer,
		!publisherAttributes[name].length
			? [initialState]
			: publisherAttributes[name]
	);

	useEffect(
		() => updateBlockAttributes(repeaterItems),
		[repeaterItems, updateBlockAttributes]
	);

	const defaultRepeaterState = {
		dispatch,
		initialState,
		repeaterItems,
		changeItem: (itemId, value) =>
			dispatch(changeRepeaterItem(itemId, value)),
		addNewItem: () => dispatch(addRepeaterItem(initialState)),
		removeItem: (itemId) => dispatch(removeRepeaterItem(itemId)),
	};

	return (
		<RepeaterContextProvider {...defaultRepeaterState}>
			<InspectElement title={title} initialOpen={true}>
				<div className={classnames(getBaseClassNames(), 'repeater')}>
					<InnerComponents items={repeaterItems} />
					<Button
						className="add-new-item"
						onClick={defaultRepeaterState.addNewItem}
					>
						<Icon type="wp" icon={plus} size={17} />
						{label}
					</Button>
				</div>
			</InspectElement>
		</RepeaterContextProvider>
	);
};

export default RepeaterControl;
