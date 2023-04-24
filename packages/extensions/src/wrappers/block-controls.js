/**
 * WordPress dependencies
 */
import { applyFilters } from '@wordpress/hooks';
import { useEffect, useRef, useMemo } from '@wordpress/element';
import { createHigherOrderComponent } from '@wordpress/compose';

/**
 * Internal dependencies
 */
import { getBlockEditorProp } from './utils';
import classnames from '@publisher/classnames';

/**
 * Add custom Publisher Extensions attributes to selected blocks
 *
 * @param {Object} props Block props
 * @param {Object} allowedBlockTypes Allowed Block Types
 * @return {{}|Object} Block props extended with Publisher Extensions attributes.
 */
const useAttributes = (props, allowedBlockTypes) => {
	const { name: blockName } = props;
	const extendedProps = { ...props };

	if (allowedBlockTypes.includes(blockName)) {
		extendedProps.attributes.publisherAttributes =
			extendedProps.attributes.publisherAttributes || {};

		if (
			typeof extendedProps.attributes.publisherAttributes.id ===
			'undefined'
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
		/**
		 * Allowed Block Types in Publisher Extensions Setup
		 */
		const allowedBlockTypes = applyFilters(
			'publisher.core.extensions.allowedBlockTypes',
			[]
		);
		const { name } = blockProps;
		const props = useMemo(() => {
			return {
				...useAttributes(blockProps, allowedBlockTypes),
			};
		}, [blockProps, allowedBlockTypes]);
		const blockEditRef = useRef();

		if (!allowedBlockTypes.includes(name)) {
			return <BlockEdit {...props} />;
		}

		const callbacks = getBlockEditorProp(name);
		const { sideEffect, blockControls } = callbacks;

		useEffect(() => {
			if (!sideEffect) {
				return;
			}

			sideEffect(blockEditRef, props);
		}, [blockEditRef, props, sideEffect]);

		return (
			<>
				<div
					ref={blockEditRef}
					className={classnames('extensions', 'block-edit-ref')}
				>
					<BlockEdit {...props} />
				</div>
				{'function' === typeof blockControls &&
					blockControls(name, props)}
			</>
		);
	};
}, 'withAllNeedsControls');

export default withBlockControls;
