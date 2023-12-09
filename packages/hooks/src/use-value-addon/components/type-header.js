// @flow
/**
 * External dependencies
 */
import type { Element } from 'react';

export default function ({ name, ...props }: { name: string }): Element<any> {
	return (
		<div
			style={{
				fontSize: '12px',
				fontWeight: '600',
				color: 'var(--publisher-controls-primary-color)',
			}}
			{...props}
		>
			{name}
		</div>
	);
}
