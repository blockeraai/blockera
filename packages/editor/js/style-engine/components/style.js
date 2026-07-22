// @flow

/**
 * External dependencies
 */
import type { MixedElement } from 'react';
import { memo } from '@wordpress/element';

const StyleComponent = ({
	declarations,
}: {
	declarations: string,
}): MixedElement => {
	if (!declarations) {
		return <></>;
	}

	return <style>{declarations}</style>;
};

export const Style = memo(
	StyleComponent,
	(prev, next) => prev.declarations === next.declarations
);
