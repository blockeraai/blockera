/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Component } from '@wordpress/element';

/**
 * Internal dependencies
 */
import Repeater from '../repeater';
import BoxShadowItem from './components/box-shadow-item';

class BoxShadow extends Component {
	state = {
		x: 0,
		y: 0,
		blur: 0,
		spread: 0,
		color: '#f00',
		inset: false,
	};

	constructor(props) {
		super(props);
	}

	updateStates(object) {
		this.setState(object);
	}

	renderInnerItem(i, n, parentProps) {
		return (
			<BoxShadowItem
				i={i}
				n={n}
				parentState={this.state}
				parentProps={parentProps}
				key={`${parentProps.index}_${n}`}
				setState={this.updateStates.bind(this)}
			/>
		);
	}

	headerItem() {}

	render() {
		return (
			<Repeater
				{...this.props}
				innerItem={this.renderInnerItem.bind(this)}
				title={__('Box Shadow', 'publisher-blocks')}
				addLabel={__('Add Box Shadow', 'publisher-blocks')}
			/>
		);
	}
}

export default BoxShadow;
