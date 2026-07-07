// @flow

/**
 * External dependencies
 */
import type { MixedElement } from 'react';

export const Style = ({
	declarations,
}: {
	declarations: string,
}): MixedElement => {
	if (!declarations) {
		return <></>;
	}

	return <style>{declarations}</style>;
};
