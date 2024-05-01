import { deletePropertyByPath, include } from '../index';

describe('Testing Object utilities', function () {
	const attributes = {
		blockeraIcon: {},
		blockeraIconPosition: '',
		blockeraIconGap: '',
		blockeraIconSize: '',
		blockeraIconColor: '',
		blockeraIconLink: {},
	};

	it('should include keys without "blockera" prefix', function () {
		expect(include(attributes, ['blockeraIcon'], 'blockera')).toEqual({
			icon: {},
		});
	});

	describe('deletePropertByPath', () => {
		it('should delete property of object with passed path', () => {
			const object = {
				x: {
					b: [
						{
							g: 3,
						},
					],
				},
			};

			deletePropertyByPath(object, 'x.b.0');

			expect(object).toEqual({
				x: {
					b: [],
				},
			});
		});
		it('should delete property of object with passed complex path', () => {
			const object = {
				x: {
					b: [
						{
							g: 3,
						},
						{
							m: [
								{
									bb: 5,
								},
							],
						},
					],
				},
			};

			deletePropertyByPath(object, 'x.b.1.m.0.bb');

			expect(object).toEqual({
				x: {
					b: [
						{
							g: 3,
						},
						{
							m: [{}],
						},
					],
				},
			});
		});

		it('should delete property of object with passed complex path', () => {
			const object = {
				content: '',
				dropCap: false,
				blockeraFontColor: '',
				blockeraFontSize: '',
				blockeraLineHeight: '',
				blockeraTextAlign: '',
				blockeraTextDecoration: '',
				blockeraFontStyle: '',
				blockeraTextTransform: '',
				blockeraDirection: '',
				blockeraTextShadow: [],
				blockeraLetterSpacing: '',
				blockeraWordSpacing: '',
				blockeraTextIndent: '',
				blockeraTextOrientation: {
					'writing-mode': '',
					'text-orientation': '',
				},
				blockeraTextColumns: {
					columns: '',
					gap: '',
					divider: {
						width: '',
						color: '',
						style: 'solid',
					},
				},
				blockeraTextStroke: {
					color: '',
					width: '',
				},
				blockeraWordBreak: 'normal',
				blockeraBackground: [],
				blockeraBackgroundColor: '',
				blockeraBackgroundClip: 'none',
				blockeraBoxShadow: [
					{
						isOpen: false,
						display: true,
						cloneable: true,
						isVisible: true,
						deletable: true,
						selectable: false,
						visibilitySupport: true,
						type: 'inner',
						x: '10px',
						y: '10px',
						blur: '10px',
						spread: '0px',
						color: '#000000ab',
					},
				],
				blockeraOutline: [],
				blockeraBorder: {},
				blockeraBorderRadius: {},
				blockeraOpacity: '100%',
				blockeraTransform: [],
				blockeraTransformSelfPerspective: '',
				blockeraTransformSelfOrigin: {
					top: '',
					left: '',
				},
				blockeraBackfaceVisibility: '',
				blockeraTransformChildPerspective: '',
				blockeraTransformChildOrigin: {
					top: '',
					left: '',
				},
				blockeraTransition: [],
				blockeraFilter: [],
				blockeraBackdropFilter: [],
				blockeraCursor: 'default',
				blockeraBlendMode: 'normal',
				blockeraSpacing: {
					margin: {
						top: '',
						right: '',
						bottom: '',
						left: '',
					},
					padding: {
						top: '',
						right: '',
						bottom: '',
						left: '',
					},
				},
				blockeraPosition: {},
				blockeraZIndex: '',
				blockeraWidth: '',
				blockeraHeight: '',
				blockeraMinWidth: '',
				blockeraMinHeight: '',
				blockeraMaxWidth: '',
				blockeraMaxHeight: '',
				blockeraOverflow: '',
				blockeraRatio: {
					value: '',
					width: '',
					height: '',
				},
				blockeraFit: '',
				blockeraFitPosition: {
					top: '',
					left: '',
				},
				blockeraDisplay: '',
				blockeraFlexDirection: {
					value: 'row',
					reverse: false,
				},
				blockeraAlignItems: '',
				blockeraJustifyContent: '',
				blockeraGap: {
					lock: true,
					gap: '',
					columns: '',
					rows: '',
				},
				blockeraFlexWrap: {
					value: 'nowrap',
					reverse: false,
				},
				blockeraAlignContent: '',
				blockeraFlexChildSizing: '',
				blockeraFlexChildGrow: '',
				blockeraFlexChildShrink: '',
				blockeraFlexChildBasis: '',
				blockeraFlexChildAlign: '',
				blockeraFlexChildOrder: '',
				blockeraFlexChildOrderCustom: '',
				blockeraIcon: {
					icon: '',
					library: '',
					uploadSVG: '',
				},
				blockeraIconPosition: '',
				blockeraIconGap: '',
				blockeraIconSize: '',
				blockeraIconColor: '',
				blockeraIconLink: {},
				blockeraAttributes: [],
				blockeraCSSProperties: [],
				blockeraBlockStates: [
					{
						isOpen: true,
						display: true,
						cloneable: true,
						isVisible: true,
						deletable: false,
						selectable: true,
						visibilitySupport: false,
						type: 'normal',
						label: 'Normal',
						breakpoints: [
							{
								type: 'desktop',
								label: 'Desktop',
							},
							{
								type: 'tablet',
								label: 'Tablet',
								attributes: {},
							},
							{
								type: 'mobile',
								label: 'Mobile',
								attributes: {},
							},
						],
						isSelected: false,
					},
					{
						isOpen: true,
						display: true,
						cloneable: true,
						isVisible: true,
						deletable: true,
						selectable: true,
						visibilitySupport: true,
						type: 'hover',
						label: 'Hover',
						breakpoints: [
							{
								type: 'desktop',
								label: 'Desktop',
								attributes: {
									blockeraOutline: [],
									blockeraBoxShadow: [
										{
											isOpen: false,
											display: true,
											cloneable: true,
											isVisible: true,
											deletable: true,
											selectable: false,
											visibilitySupport: true,
											type: 'outer',
											x: '10px',
											y: '10px',
											blur: '10px',
											spread: '0px',
											color: '#000000ab',
										},
									],
								},
							},
							{
								type: 'tablet',
								label: 'Tablet',
								attributes: {},
							},
							{
								type: 'mobile',
								label: 'Mobile',
								attributes: {},
							},
						],
						isSelected: true,
					},
				],
				blockeraCurrentState: 'hover',
				blockeraPropsId: '111921473052',
			};

			const expected = { ...object };

			delete expected.blockeraBlockStates[1].breakpoints[0].attributes
				.blockeraBoxShadow;

			const actual = deletePropertyByPath(
				object,
				'blockeraBlockStates.1.breakpoints.0.attributes.blockeraBoxShadow'
			);

			expect(actual).toEqual(expected);
		});
	});
});
