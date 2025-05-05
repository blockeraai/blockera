//@flow

export const getTooltipStyle = (itemType: string): Object => {
	switch (itemType) {
		case 'inner-block':
		case 'element':
			return {
				'--tooltip-padding': '15px',
				'--tooltip-bg': 'var(--blockera-controls-inner-blocks-color)',
			};

		case 'state':
		default:
			return {
				'--tooltip-padding': '15px',
				'--tooltip-bg': 'var(--blockera-controls-states-color)',
			};
	}
};
