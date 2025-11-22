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
	return <style id={clientId}>{declarations}</style>;
};
