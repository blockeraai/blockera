/**
 * External dependencies
 */
import type { CSSProperties, ReactElement, ReactNode } from 'react';

/**
 * Preset group wrapper: mirrors CSS variables from extensions `Container` without editor store hooks.
 */
export const PresetStateContainer = ({
	activeColor,
	children,
}: {
	activeColor: string;
	children: ReactNode;
}): ReactElement => {
	const style = {
		color: 'inherit',
		'--blockera-controls-primary-color': activeColor,
		'--blockera-tab-panel-active-color': activeColor,
	} as CSSProperties;

	return (
		<div className="blockera-state-colors-container" style={style}>
			{children}
		</div>
	);
};
