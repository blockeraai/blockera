export function iconReducer(iconData, action) {
	switch (action.type) {
		case 'UPDATE_ICON':
			return {
				...iconData,
				svgString: '',
				uploadSVG: '',
				renderedIcon: '',
				icon: action.icon,
				library: action.library,
			};

		case 'UPDATE_SVG':
			const { uploadSVG, svgString } = action;

			return {
				...iconData,
				svgString,
				uploadSVG,
				icon: null,
				library: null,
				renderedIcon: '',
			};

		case 'DELETE_ICON':
			return {
				icon: '',
				library: '',
				svgString: '',
				uploadSVG: '',
				renderedIcon: '',
			};

		default:
			return iconData;
	}
}
