/**
 * WordPress dependencies
 */
import { applyFilters } from '@wordpress/hooks';
import { cloneElement } from '@wordpress/element';

const withCustomizeSaveElement = (element, blockType) => {
	if (!element) {
		return;
	}

	/**
	 * Allowed Block Types in Publisher Extensions Setup
	 */
	const allowedBlockTypes = applyFilters(
		'publisher.core.extensions.allowedBlockTypes',
		[]
	);

	if (!allowedBlockTypes.includes(blockType?.name)) {
		return element;
	}

	const { children } = element.props;

	return cloneElement(element, {
		// children: concatChildren(
		// children ? children : <></>,
		// <Icon icon={getIcon(attributes.icon, 'wp')} />
		// ),
		children: children ? children : <></>,
	});
};

export default withCustomizeSaveElement;
