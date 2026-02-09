// @flow

/**
 * External dependencies
 */
import type { MixedElement } from 'react';

export const Style = ({
	clientId,
	declarations,
}: {
	clientId: string,
	declarations: string,
}): MixedElement => {
	if (!declarations) {
		return <></>;
	}

	return <style id={clientId}>{declarations}</style>;
};
