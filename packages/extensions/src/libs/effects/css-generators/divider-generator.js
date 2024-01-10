/**
 * Publisher dependencies
 */
import { createCssRule } from '@publisher/style-engine';
import { getValueAddonRealValue } from '@publisher/hooks';

export function BeforeDividerGenerator(id, props, { media, selector }) {
	const { attributes } = props;

	if (!attributes?.publisherDivider?.length) {
		return '';
	}

	const value = DividerGenerator(attributes);

	return createCssRule({
		media,
		selector: `${selector}:before`,
		properties: value[0],
	});
}

export function AfterDividerGenerator(id, props, { media, selector }) {
	const { attributes } = props;

	if (!attributes?.publisherDivider?.length) {
		return '';
	}

	const value = DividerGenerator(attributes);

	return createCssRule({
		media,
		selector: `${selector}:after`,
		properties: value[1],
	});
}

function DividerGenerator(attributes) {
	const value = attributes?.publisherDivider?.map((item) => {
		const properties = {};
		if (!item.isVisible) {
			return {};
		}

		properties.content = '""';
		properties.position = 'absolute';
		properties.left = '0px';

		if (item.onFront) properties['z-index'] = '1000';
		else properties['z-index'] = '1';

		switch (item.position) {
			case 'top':
				{
					properties.top = '0px';
					if (item.flip) properties.transform = 'scaleX(-1)';
				}
				break;
			case 'bottom':
				{
					properties.bottom = '0px';
					if (item.flip)
						properties.transform = 'scaleX(-1) rotate(180deg)';
					else properties.transform = 'rotate(180deg)';
				}
				break;
		}

		properties.width = getValueAddonRealValue(item.size?.width) || '100%';
		properties.height =
			getValueAddonRealValue(item.size?.height) || '100px';
		properties['background-size'] = '100%';
		properties['background-repeat'] = 'no-repeat';
		properties['background-image'] = `url("${getSelectedShape(
			item.shape.id,
			item.color
		)}")`;

		return properties;
	});

	return value;
}

function getSelectedShape(id, color = '#000000') {
	const formattedColor = `%23${color.split('#')[1]}`;

	const selectedShape = [
		{
			id: 'wave-opacity',
			encodedSvg: `data:image/svg+xml,%3Csvg width='230' height='16' viewBox='0 0 230 16' fill='${formattedColor}' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 3.88727C20.0142 8.16327 60.4337 0.621963 105.221 3.88727C150.074 6.99709 194.861 8.31876 230 3.03207V0H0V3.88727Z' fill='${formattedColor}'/%3E%3Cpath opacity='0.5' d='M0 7.77454C20.6661 13.9942 47.5255 4.82021 65.4535 3.49854C83.3815 2.17687 125.757 14.9271 148.053 13.6054C170.414 12.2838 178.367 7.07483 194.014 6.84159C209.66 6.6861 230 13.6832 230 13.6832V0H0V7.77454Z' fill='${formattedColor}'/%3E%3Cpath opacity='0.5' d='M0 13.5105C16.6893 7.10265 50.068 11.1944 76.8623 10.268C103.591 9.34153 121.584 5.5586 139.317 8.10629C157.115 10.654 175.89 17.139 195.448 15.8266C215.006 14.3597 226.284 9.49594 230 9.34153V0H0V13.5105Z' fill='${formattedColor}'/%3E%3C/svg%3E%0A`,
		},
		{
			id: 'wave-1',
			encodedSvg: `data:image/svg+xml,%3Csvg width='1200' height='70' viewBox='0 0 1200 70' fill='${formattedColor}' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 17.6406C104.422 37.0453 315.306 2.8225 548.98 17.6406C782.993 31.7531 1016.67 37.7509 1200 13.7597V0H0V17.6406Z' fill='${formattedColor}'/%3E%3C/svg%3E%0A`,
		},
		{
			id: 'wave-2',
			encodedSvg: `data:image/svg+xml,%3Csvg width='1200' height='70' viewBox='0 0 1200 70' fill='${formattedColor}' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 34.0136C107.823 61.2245 247.959 21.0884 341.497 15.3061C435.034 9.52381 656.122 65.3061 772.449 59.5238C889.116 53.7415 930.612 30.9524 1012.24 29.932C1093.88 29.2517 1200 59.8639 1200 59.8639V0H0V34.0136Z' fill='${formattedColor}'/%3E%3C/svg%3E%0A`,
		},
		{
			id: 'curve-1',
			encodedSvg: `data:image/svg+xml,%3Csvg width='1200' height='70' viewBox='0 0 1200 70' fill='${formattedColor}' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0V4.4879C0 40.6704 268.63 70 600 70C931.37 70 1200 40.6704 1200 4.4879V0H0Z' fill='${formattedColor}'/%3E%3C/svg%3E%0A`,
		},
		{
			id: 'curve-2',
			encodedSvg: `data:image/svg+xml,%3Csvg width='1200' height='70' viewBox='0 0 1200 70' fill='${formattedColor}' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1200 0H0C0 13.6849 291 70.696 741 69.9347C1186.4 72.2187 1200 13.9133 1200 0Z' fill='${formattedColor}'/%3E%3C/svg%3E%0A`,
		},
		{
			id: 'triangle-1',
			encodedSvg: `data:image/svg+xml, %3Csvg width='230' height='16' viewBox='0 0 230 16' fill='${formattedColor}' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0H230L115 16L0 0Z' fill='${formattedColor}'/%3E%3C/svg%3E%0A`,
		},
		{
			id: 'triangle-2',
			encodedSvg: `data:image/svg+xml,%3Csvg width='1200' height='70' viewBox='0 0 1200 70' fill='${formattedColor}' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath opacity='0.5' d='M0 0H1200L600 70L0 0Z' fill='${formattedColor}'/%3E%3Cpath opacity='0.5' d='M0 0H1200L600 56L0 0Z' fill='${formattedColor}'/%3E%3Cpath d='M0 0H1200L600 39L0 0Z' fill='${formattedColor}'/%3E%3C/svg%3E%0A`,
		},
		{
			id: 'triangle-3',
			encodedSvg: `data:image/svg+xml,%3Csvg width='1200' height='70' viewBox='0 0 1200 70' fill='${formattedColor}' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0H1200L300 70L0 0Z' fill='${formattedColor}'/%3E%3C/svg%3E`,
		},
		{
			id: 'triangle-4',
			encodedSvg: `data:image/svg+xml,%3Csvg width='1200' height='70' viewBox='0 0 1200 70' fill='${formattedColor}' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath opacity='0.5' d='M0 0H1200L300 70L0 0Z' fill='${formattedColor}'/%3E%3Cpath opacity='0.5' d='M0 0H1200L300 56L0 0Z' fill='${formattedColor}'/%3E%3Cpath d='M0 0H1200L300 39L0 0Z' fill='${formattedColor}'/%3E%3C/svg%3E%0A`,
		},
		{
			id: 'triangle-5',
			encodedSvg: `data:image/svg+xml,%3Csvg width='1200' height='70' viewBox='0 0 1200 70' fill='${formattedColor}' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0H1200L900 70L0 0Z' fill='${formattedColor}'/%3E%3C/svg%3E%0A`,
		},
		{
			id: 'triangle-6',
			encodedSvg: `data:image/svg+xml, %3Csvg width='230' height='16' viewBox='0 0 230 16' fill='${formattedColor}' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath opacity='0.5' d='M0 0H230L172.5 16L0 0Z' fill='${formattedColor}'/%3E%3Cpath opacity='0.5' d='M0 0H230L172.5 12.8L0 0Z' fill='${formattedColor}'/%3E%3Cpath d='M0 0H230L172.5 8.91429L0 0Z' fill='${formattedColor}'/%3E%3C/svg%3E%0A`,
		},
		{
			id: 'title-1',
			encodedSvg: `data:image/svg+xml,%3Csvg width='1200' height='70' viewBox='0 0 1200 70' fill='${formattedColor}' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0H1200V70L0 0Z' fill='${formattedColor}'/%3E%3C/svg%3E%0A`,
		},
		{
			id: 'title-2',
			encodedSvg: `data:image/svg+xml,%3Csvg width='1200' height='70' viewBox='0 0 1200 70' fill='${formattedColor}' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath opacity='0.5' d='M0 0H1200V70L0 0Z' fill='${formattedColor}'/%3E%3Cpath d='M0 0H1200V47L0 0Z' fill='${formattedColor}'/%3E%3C/svg%3E%0A`,
		},
		{
			id: 'title-3',
			encodedSvg: `data:image/svg+xml,%3Csvg width='1200' height='70' viewBox='0 0 1200 70' fill='${formattedColor}' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath opacity='0.5' d='M0 0H1200V70L0 0Z' fill='${formattedColor}'/%3E%3Cpath opacity='0.5' d='M0 0H1200V53L0 0Z' fill='${formattedColor}'/%3E%3Cpath d='M0 0H1200V36L0 0Z' fill='${formattedColor}'/%3E%3C/svg%3E%0A`,
		},
		{
			id: 'title-4',
			encodedSvg: `data:image/svg+xml,%3Csvg width='1200' height='70' viewBox='0 0 1200 70' fill='${formattedColor}' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0H1200L0 70V0Z' fill='${formattedColor}'/%3E%3C/svg%3E%0A`,
		},
		{
			id: 'title-5',
			encodedSvg: `data:image/svg+xml,%3Csvg width='230' height='16' viewBox='0 0 230 16' fill='${formattedColor}' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath opacity='0.5' d='M0 0H230L0 16V0Z' fill='${formattedColor}'/%3E%3Cpath d='M0 0H230L0 10.7429V0Z' fill='${formattedColor}'/%3E%3C/svg%3E%0A`,
		},
		{
			id: 'title-6',
			encodedSvg: `data:image/svg+xml,%3Csvg width='1200' height='70' viewBox='0 0 1200 70' fill='${formattedColor}' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath opacity='0.5' d='M0 0H1200L0 70V0Z' fill='${formattedColor}'/%3E%3Cpath opacity='0.5' d='M0 0H1200L0 53V0Z' fill='${formattedColor}'/%3E%3Cpath d='M0 0H1200L0 36V0Z' fill='${formattedColor}'/%3E%3C/svg%3E%0A`,
		},
		{
			id: 'title-7',
			encodedSvg: `data:image/svg+xml,%3Csvg width='1200' height='70' viewBox='0 0 1200 70' fill='${formattedColor}' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath opacity='0.5' d='M0 0H1200V47L0 0Z' fill='${formattedColor}'/%3E%3Cpath d='M0 0H1200L0 70V0Z' fill='${formattedColor}'/%3E%3C/svg%3E%0A`,
		},
		{
			id: 'title-8',
			encodedSvg: `data:image/svg+xml,%3Csvg width='1200' height='70' viewBox='0 0 1200 70' fill='${formattedColor}' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath opacity='0.5' d='M0 0H1200L0 47V0Z' fill='${formattedColor}'/%3E%3Cpath d='M0 0H1200V70L0 0Z' fill='${formattedColor}'/%3E%3C/svg%3E%0A`,
		},
		{
			id: 'arrow-1',
			encodedSvg: `data:image/svg+xml,%3Csvg width='1200' height='70' viewBox='0 0 1200 70' fill='${formattedColor}' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1200 0H0V4H550.03L599.91 58.12L649.97 4H1200V0Z' fill='${formattedColor}'/%3E%3C/svg%3E%0A`,
		},
		{
			id: 'arrow-2',
			encodedSvg: `data:image/svg+xml,%3Csvg width='230' height='16' viewBox='0 0 230 16' fill='${formattedColor}' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M230 -0.00012207H0V0.914164L36.4224 3.42845L45.9827 15.7987L55.5776 3.42845L230 0.914164V-0.00012207Z' fill='${formattedColor}'/%3E%3C/svg%3E%0A`,
		},
		{
			id: 'arrow-3',
			encodedSvg: `data:image/svg+xml,%3Csvg width='1200' height='70' viewBox='0 0 1200 70' fill='${formattedColor}' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1200 0H0L910.03 15L959.91 69.12L1009.97 15L1200 0Z' fill='${formattedColor}'/%3E%3C/svg%3E%0A`,
		},
	].find((icon) => icon.id === id).encodedSvg;

	return selectedShape;
}
