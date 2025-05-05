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
				'--tooltip-bg':
					'color-mix(in srgb, var(--blockera-controls-states-color) 100%, #000000 10%)',
			};
	}
};
