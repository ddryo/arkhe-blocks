/**
 * @WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { InspectorControls } from '@wordpress/block-editor';

import { TabPanel } from '@wordpress/components';
import { useSelect } from '@wordpress/data';

/**
 * @Internal dependencies
 */
import DisplayControl from './panel/_display';
import PickupControl from './panel/_pickup';

/**
 * @Others dependencies
 */
// import classnames from 'classnames';

export default function (props) {
	// const { attributes, setAttributes } = props;
	// const { numColor, theLabel, theNum, isHideNum, isHideLabel } = attributes;

	const authors = useSelect((select) => select('core').getAuthors());

	return (
		<InspectorControls>
			<TabPanel
				className='swell-tab-panel -postList'
				activeClass='is-active'
				// onSelect={(tabName) => {console.log('Selecting tab', tabName);}}
				tabs={[
					{
						name: 'display',
						title: (
							<>
								<i className='dashicons-before dashicons-admin-settings'></i>
								Settings
							</>
						),
						className: '__display',
					},
					{
						name: 'pickup',
						title: (
							<>
								<i className='dashicons-before dashicons-post-status'></i>
								Pickup
							</>
						),
						className: '__pickup',
					},
				]}
				initialTabName='display'
			>
				{(tab) => {
					if ('pickup' === tab.name) {
						return <PickupControl {...props} authors={authors} />;
					} else if ('display' === tab.name) {
						return <DisplayControl {...props} />;
					}
				}}
			</TabPanel>
		</InspectorControls>
	);
}
