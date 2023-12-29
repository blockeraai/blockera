// @flow

/**
 * External dependencies
 */
import type { Element } from 'react';

/**
 * Internal dependencies
 */
import WaveOpacity from './icons/shapes/wave-opacity';
import Wave1Icon from './icons/shapes/wave-1';
import Wave2Icon from './icons/shapes/wave-2';
import Curve1Icon from './icons/shapes/curve-1';
import Curve2Icon from './icons/shapes/curve-2';
import Triangle1Icon from './icons/shapes/triangle-1';
import Triangle2Icon from './icons/shapes/triangle-2';
import Triangle3Icon from './icons/shapes/triangle-3';
import Triangle4Icon from './icons/shapes/triangle-4';
import Triangle5Icon from './icons/shapes/triangle-5';
import Triangle6Icon from './icons/shapes/triangle-6';
import Title1Icon from './icons/shapes/title-1';
import Title2Icon from './icons/shapes/title-2';
import Title3Icon from './icons/shapes/title-3';
import Title4Icon from './icons/shapes/title-4';
import Title5Icon from './icons/shapes/title-5';
import Title6Icon from './icons/shapes/title-6';
import Title7Icon from './icons/shapes/title-7';
import Title8Icon from './icons/shapes/title-8';
import Arrow1Icon from './icons/shapes/arrow-1';
import Arrow2Icon from './icons/shapes/arrow-2';
import Arrow3Icon from './icons/shapes/arrow-3';

export const shapeIcons = [
	{ id: 'wave-opacity', icon: (<WaveOpacity />: Element<any>) },
	{ id: 'wave-1', icon: (<Wave1Icon />: Element<any>) },
	{ id: 'wave-2', icon: (<Wave2Icon />: Element<any>) },
	{ id: 'curve-1', icon: (<Curve1Icon />: Element<any>) },
	{ id: 'curve-2', icon: (<Curve2Icon />: Element<any>) },
	{ id: 'triangle-1', icon: (<Triangle1Icon />: Element<any>) },
	{ id: 'triangle-2', icon: (<Triangle2Icon />: Element<any>) },
	{ id: 'triangle-3', icon: (<Triangle3Icon />: Element<any>) },
	{ id: 'triangle-4', icon: (<Triangle4Icon />: Element<any>) },
	{ id: 'triangle-5', icon: (<Triangle5Icon />: Element<any>) },
	{ id: 'triangle-6', icon: (<Triangle6Icon />: Element<any>) },
	{ id: 'title-1', icon: (<Title1Icon />: Element<any>) },
	{ id: 'title-2', icon: (<Title2Icon />: Element<any>) },
	{ id: 'title-3', icon: (<Title3Icon />: Element<any>) },
	{ id: 'title-4', icon: (<Title4Icon />: Element<any>) },
	{ id: 'title-5', icon: (<Title5Icon />: Element<any>) },
	{ id: 'title-6', icon: (<Title6Icon />: Element<any>) },
	{ id: 'title-7', icon: (<Title7Icon />: Element<any>) },
	{ id: 'title-8', icon: (<Title8Icon />: Element<any>) },
	{ id: 'arrow-1', icon: (<Arrow1Icon />: Element<any>) },
	{ id: 'arrow-2', icon: (<Arrow2Icon />: Element<any>) },
	{ id: 'arrow-3', icon: (<Arrow3Icon />: Element<any>) },
];

export const selectedShape = (selectedId: string): Object =>
	shapeIcons.find((item) => item.id === selectedId);
