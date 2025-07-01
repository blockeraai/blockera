export function iconReducer(iconData, action) {
	switch (action.type) {
		case 'UPDATE_ICON':
			return {
				...iconData,
				uploadSVG: '',
				renderedIcon: '',
				icon: action.icon,
				library: action.library,
			};

		case 'UPDATE_SVG':
			return {
				...iconData,
				icon: null,
				library: null,
				renderedIcon: '',
				uploadSVG: action.uploadSVG,
			};

		case 'DELETE_ICON':
			return {
				icon: '',
				library: '',
				uploadSVG: '',
				renderedIcon: '',
			};

		default:
			return iconData;
	}
}
