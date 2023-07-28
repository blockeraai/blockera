export function getBackgroundItemBGProperty(item) {
	switch (item.type) {
		case 'image':
			if (!item.image) {
				return '';
			}

			// Image
			return item.image;

		case 'linear-gradient':
			if (!item['linear-gradient']) {
				return '';
			}

			let gradient = item['linear-gradient'];

			if (item['linear-gradient-repeat'] === 'repeat') {
				gradient = gradient.replace(
					'linear-gradient(',
					'repeating-linear-gradient('
				);
			}

			gradient = gradient.replace(
				/\((\d.*)deg,/im,
				item['linear-gradient-angel']
			);

			return gradient;

		case 'radial-gradient':
			if (!item['radial-gradient']) {
				return '';
			}

			let radialGradient = item['radial-gradient'];

			if (item['radial-gradient-repeat'] === 'repeat') {
				radialGradient = radialGradient.replace(
					'radial-gradient(',
					'repeating-radial-gradient('
				);
			}

			// Gradient Position
			if (
				item['radial-gradient-position-left'] &&
				item['radial-gradient-position-top']
			) {
				radialGradient = radialGradient.replace(
					'gradient(',
					`gradient( circle at ${item['radial-gradient-position-left']} ${item['radial-gradient-position-top']}, `
				);
			}

			// Gradient Size
			if (item['radial-gradient-size']) {
				radialGradient = radialGradient.replace(
					'circle at ',
					`circle ${item['radial-gradient-size']} at `
				);
			}

			return radialGradient;
	}

	return '';
}
