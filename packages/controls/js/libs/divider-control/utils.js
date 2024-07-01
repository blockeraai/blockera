// @flow

/**
 * External dependencies
 */
import type { Element } from 'react';

/**
 * Internal dependencies
 */
import { default as WaveOpacity } from './shapes/wave-opacity.svg';
import { default as Wave1Icon } from './shapes/wave-1.svg';
import { default as Wave2Icon } from './shapes/wave-2.svg';
import { default as Curve1Icon } from './shapes/curve-1.svg';
import { default as Curve2Icon } from './shapes/curve-2.svg';
import { default as Triangle1Icon } from './shapes/triangle-1.svg';
import { default as Triangle2Icon } from './shapes/triangle-2.svg';
import { default as Triangle3Icon } from './shapes/triangle-3.svg';
import { default as Triangle4Icon } from './shapes/triangle-4.svg';
import { default as Triangle5Icon } from './shapes/triangle-5.svg';
import { default as Triangle6Icon } from './shapes/triangle-6.svg';
import { default as Title1Icon } from './shapes/title-1.svg';
import { default as Title2Icon } from './shapes/title-2.svg';
import { default as Title3Icon } from './shapes/title-3.svg';
import { default as Title4Icon } from './shapes/title-4.svg';
import { default as Title5Icon } from './shapes/title-5.svg';
import { default as Title6Icon } from './shapes/title-6.svg';
import { default as Title7Icon } from './shapes/title-7.svg';
import { default as Title8Icon } from './shapes/title-8.svg';
import { default as Arrow1Icon } from './shapes/arrow-1.svg';
import { default as Arrow2Icon } from './shapes/arrow-2.svg';
import { default as Arrow3Icon } from './shapes/arrow-3.svg';

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
