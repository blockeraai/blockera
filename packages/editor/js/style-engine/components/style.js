// @flow

/**
 * External dependencies
 */
import type { MixedElement } from 'react';

export const Style = ({
	selector,
	clientId,
	cssDeclaration,
}: {
	selector: string,
	clientId: string,
	cssDeclaration: Array<string>,
}): MixedElement => {
	if (!cssDeclaration.length) {
		return <></>;
	}

	return (
		<style id={clientId}>
			{selector}
			{'{'}
			{cssDeclaration}
			{'}'}
		</style>
	);
};
