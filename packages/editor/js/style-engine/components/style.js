// @flow

/**
 * External dependencies
 */
import type { MixedElement } from 'react';

export const Style = ({
	selector,
	cssDeclaration,
}: {
	selector: string,
	cssDeclaration: Array<string>,
}): MixedElement => {
	if (!cssDeclaration.length) {
		return <></>;
	}

	return (
		<>
			{selector}
			{'{'}
			{cssDeclaration}
			{'}'}
		</>
	);
};
