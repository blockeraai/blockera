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

export const useBugReporter = ({
	error,
	isReportingErrorCompleted,
	setIsReportingErrorCompleted,
}: {
	error: Object,
	isReportingErrorCompleted: boolean,
	setIsReportingErrorCompleted: (isReportingErrorCompleted: boolean) => void,
}): boolean => {
	const { blockeraOptInStatus } = window;
	const { getSelectedBlock } = select('core/block-editor');
	const selectedBlock = getSelectedBlock();

	useEffect(() => {
		if ('ALLOW' === blockeraOptInStatus) {
			if (selectedBlock && !isReportingErrorCompleted) {
				sender(error, serialize(selectedBlock), (response) => {
					setIsReportingErrorCompleted(
						response?.success ? true : false
					);
				});
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [error, selectedBlock]);

	return isReportingErrorCompleted;
};
