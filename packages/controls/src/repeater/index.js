/**
 * WordPress dependencies.
 */
import { __ } from '@wordpress/i18n';
import { isEmpty } from 'lodash';
import { Button } from '@wordpress/components';
import { memo, useEffect, useState } from '@wordpress/element';
import { applyFilters } from '@wordpress/hooks';

/**
 * Internal dependencies.
 */
import { InspectElement } from '@publisher/components';
import RepeaterItem from './components/repeater-item';

const Repeater = ( {
	title,
	innerItem,
	addLabel,
	attributes,
	setAttributes,
} ) => {
	const [ buffer, setBuffer ] = useState( null );
	const [ items, setItems ] = useState( {} );
	const [ flatItems, setFlatItems ] = useState( [] );
	const [ toggleVisibility, setToggleVisibility ] = useState( [] );

	useEffect( () => {
		if ( ! Boolean( attributes?.repeaterItems?.length ) ) {
			return;
		}

		let repeaterItems = [
			...attributes.repeaterItems?.filter( ( i ) => ! isEmpty( i ) ),
		];

		if ( ! Boolean( repeaterItems.length ) ) {
			repeaterItems = undefined;
		}

		setAttributes( { repeaterItems } );
	}, [] );

	const addGroup = () => {
		const repeaterItems = [ ...( attributes.repeaterItems || [] ) ];
		repeaterItems.push( [ {} ] );
		setAttributes( { repeaterItems } );
	};

	const removeGroup = ( n ) => {
		let repeaterItems = [ ...attributes.repeaterItems ];
		repeaterItems.splice( n, 1 );

		if ( ! Boolean( repeaterItems.length ) ) {
			repeaterItems = undefined;
		}

		setAttributes( { repeaterItems } );
	};

	const addNewItem = ( index ) => {
		const repeaterItems = [ ...attributes.repeaterItems ];
		repeaterItems[ index ].push( {} );
		setAttributes( { repeaterItems } );
	};

	const removeItem = ( index, key ) => {
		const repeaterItems = [ ...attributes.repeaterItems ];
		repeaterItems[ index ].splice( key, 1 );

		if ( 0 === repeaterItems[ index ] ) {
			repeaterItems.splice( index, 1 );
		}

		setAttributes( { repeaterItems } );
	};

	//FIXME: incorrect functionality
	const changeItem = ( value, index, key ) => {
		const repeaterItems = [ ...attributes.repeaterItems ];

		const attrs = applyFilters(
			'publisher.blockItems.defaults',
			{},
			value
		);

		if ( 'userRoles' === value || 'postAuthor' === value ) {
			attrs.visibility = true;
		}

		if ( 'none' === value ) {
			repeaterItems[ index ][ key ] = {};
		} else {
			repeaterItems[ index ][ key ] = {
				type: value,
				...attrs,
			};
		}

		setAttributes( { repeaterItems } );
	};

	const changeArrayValue = ( value, index, key, type ) => {
		const repeaterItems = [ ...attributes.repeaterItems ];
		repeaterItems[ index ][ key ][ type ] = value;
		setAttributes( { repeaterItems } );
	};

	const changeVisibility = ( value, index, key ) => {
		const repeaterItems = [ ...attributes.repeaterItems ];
		repeaterItems[ index ][ key ].visibility =
			'true' === value ? true : false;
		setAttributes( { repeaterItems } );
	};

	const changeValue = ( value, index, key, field ) => {
		const repeaterItems = [ ...attributes.repeaterItems ];
		if ( null !== value ) {
			repeaterItems[ index ][ key ][ field ] = value;
		} else {
			delete repeaterItems[ index ][ key ][ field ];
		}
		setAttributes( { repeaterItems } );
	};

	return (
		<InspectElement title={ title } initialOpen={ true }>
			{ attributes.repeaterItems &&
				attributes.repeaterItems.map( ( group, index ) => {
					return (
						<RepeaterItem
							innerItem={ innerItem }
							key={ index }
							group={ group }
							index={ index }
							addLabel={ addLabel }
							attributes={ attributes }
							setAttributes={ setAttributes }
							addGroup={ addGroup }
							addNewItem={ addNewItem }
							removeItem={ removeItem }
							changeItem={ changeItem }
							removeGroup={ removeGroup }
							toggleVisibility={ toggleVisibility }
							setToggleVisibility={ setToggleVisibility }
							changeValue={ changeValue }
							changeVisibility={ changeVisibility }
						/>
					);
				} ) }

			<Button
				isSecondary
				className="p-blocks-conditions__add"
				onClick={ addGroup }
			>
				{ addLabel }
			</Button>

			{ applyFilters( 'publisher.blockRepeater.notices', '' ) }

			<div className="p-blocks-fp-wrap">
				{ applyFilters( 'publisher.feedback', '', 'conditions' ) }
				{ applyFilters( 'publisher.poweredBy', '' ) }
			</div>
		</InspectElement>
	);
};

export default memo( Repeater );
