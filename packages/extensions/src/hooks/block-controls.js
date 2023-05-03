/**
 * WordPress dependencies
 */
import { select } from '@wordpress/data';
import { applyFilters } from '@wordpress/hooks';
import { useEffect, useRef, useMemo } from '@wordpress/element';
import { createHigherOrderComponent } from '@wordpress/compose';

/**
 * Internal dependencies
 */
import { hasAllProperties } from '../api';
import { STORE_NAME } from '../store/constants';
import { extensionClassNames } from '@publisher/classnames';
import { getFileExtracts } from './utils';

/**
 * Add custom Publisher Extensions attributes to selected blocks
 *
 * @param {Object} props Block props
 * @return {{}|Object} Block props extended with Publisher Extensions attributes.
 */
const useAttributes = (props: Object): Object => {
	const { name: blockName } = props;
	const extendedProps = { ...props };

	extendedProps.attributes.publisherAttributes =
		extendedProps.attributes.publisherAttributes || {};

	if (
		typeof extendedProps.attributes.publisherAttributes.id === 'undefined'
	) {
		const d = new Date();
		extendedProps.attributes.publisherAttributes = Object.assign(
			{},
			extendedProps.attributes.publisherAttributes,
			{
				id:
					'' +
					d.getMonth() +
					d.getDate() +
					d.getHours() +
					d.getMinutes() +
					d.getSeconds() +
					d.getMilliseconds(),
			}
		);
	}

	return extendedProps;
};

/**
 * Add custom publisher extensions controls to selected blocks
 *
 * @param {Function} BlockEdit Original component.
 * @return {string} Wrapped component.
 */
const withBlockControls = createHigherOrderComponent((BlockEdit) => {
	return (blockProps) => {
		const { name } = blockProps;
		const registeredBlockExtension =
			select(STORE_NAME).getBlockExtension(name);

		if (
			!registeredBlockExtension ||
			!registeredBlockExtension.hasOwnProperty('edit')
		) {
			return <BlockEdit {...blockProps} />;
		}

		getFileExtracts(registeredBlockExtension.edit);

		return <BlockEdit {...blockProps} />;

		const props = useMemo(() => {
			return {
				...useAttributes(blockProps),
			};
		}, [blockProps]);

		const blockEditRef = useRef();
		const { edit: sideEffect, blockControls } = registeredBlockExtension;

		useEffect(() => {
			if ('function' !== typeof sideEffect) {
				return;
			}

			sideEffect(blockEditRef, props);
		}, [blockEditRef, props, sideEffect]);

		return (
			<>
				<BlockEdit
					{...props}
					className={extensionClassNames(
						'publisher-extension-ref',
						`client-id-${props.clientId}`,
						props.className
					)}
				/>
				{'function' === typeof blockControls &&
					blockControls(name, props)}
			</>
		);
	};
}, 'withAllNeedsControls');

export default withBlockControls;
