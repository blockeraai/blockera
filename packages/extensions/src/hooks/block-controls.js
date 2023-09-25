/**
 * External dependencies
 */
import { useMemo } from '@wordpress/element';
import { createHigherOrderComponent } from '@wordpress/compose';

/**
 * Publisher dependencies
 */
import { extensionClassNames } from '@publisher/classnames';

/**
 * Internal dependencies
 */
import { useAttributes } from './utils';
import { useBlockExtensions } from './hooks';

/**
 * Add custom publisher extensions controls to selected blocks
 *
 * @param {Function} BlockEdit Original component.
 * @return {string} Wrapped component.
 */
const withBlockControls = createHigherOrderComponent((BlockEdit) => {
	return (blockProps) => {
		const { name } = blockProps;
		const { currentExtension } = useBlockExtensions(name);

		if (!currentExtension) {
			return <BlockEdit {...blockProps} />;
		}

		//Extended Block Properties with publisherPropsId when changes blockProps!
		const props = useMemo(() => {
			return {
				...useAttributes(blockProps),
			};
		}, [blockProps]);

		const classnames = extensionClassNames({
			[props.className]: true,
			[`publisher-client-id-${props.clientId}`]: true,
		});

		return <BlockEdit {...props} className={classnames} />;
	};
}, 'withAllNeedsControls');

export default withBlockControls;
