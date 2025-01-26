// @flow

/**
 * External dependencies
 */
import { select } from '@wordpress/data';
import { serialize } from '@wordpress/blocks';
import { useEffect } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { sender } from '../sender';

export const useDebugLogger = ({
	error,
	isReported,
	setIsReported,
}: {
	error: Object,
	isReported: boolean,
	setIsReported: (isReported: boolean) => void,
}) => {
	const { blockeraOptInStatus } = window;
	const { getSelectedBlock } = select('core/block-editor');
	const selectedBlock = getSelectedBlock();

	useEffect(() => {
		if (blockeraOptInStatus === 'ALLOW') {
			if (selectedBlock && !isReported) {
				sender(error, serialize(selectedBlock));
				setIsReported(true);
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [error, selectedBlock]);

	return isReported;
};
