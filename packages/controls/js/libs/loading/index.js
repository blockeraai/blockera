// @flow

/**
 * External dependencies
 */
import type { MixedElement } from 'react';

export const LoadingComponent = ({
	loadingDescription,
}: {
	loadingDescription: string,
}): MixedElement => (
	<div style={{ textAlign: 'center', padding: '50px 0' }}>
		<h1>{loadingDescription}</h1>
		<div
			className="blockera-loading-circle"
			style={{
				width: '40px',
				height: '40px',
				margin: '20px auto',
				border: '4px solid #f3f3f3',
				borderTop: '4px solid #3498db',
				borderRadius: '50%',
				animation: 'blockera-spin 1s linear infinite',
			}}
		/>
		<style>
			{`
						@keyframes blockera-spin {
							0% { transform: rotate(0deg); }
							100% { transform: rotate(360deg); }
						}
					`}
		</style>
	</div>
);
