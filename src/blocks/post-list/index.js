/**
 * @WordPress dependencies
 */
import { __, _x } from '@wordpress/i18n';
import { registerBlockType } from '@wordpress/blocks';
import { InspectorControls } from '@wordpress/block-editor';
import ServerSideRender from '@wordpress/server-side-render';
import { TabPanel } from '@wordpress/components';
import { useSelect } from '@wordpress/data';

/**
 * @Internal dependencies
 */
import { iconColor } from '@blocks/config';
import example from './_example';
import metadata from './block.json';
import DisplayControl from './panel/_display';
import PickupControl from './panel/_pickup';

/**
 * @Others dependencies
 */
// import classnames from 'classnames';

/**
 * metadata
 */
const blockName = 'ark-block-postList';
const { name, category, keywords, supports } = metadata;

/**
 *
 */
registerBlockType(name, {
	title: __('Post list', 'arkhe-blocks'),
	description: __('Create a post list with the specified conditions.', 'arkhe-blocks'),
	icon: {
		foreground: iconColor,
		src: 'screenoptions',
	},
	category,
	keywords,
	example,
	supports,
	attributes: metadata.attributes,
	edit: (props) => {
		const { attributes, className } = props;

		const authors = useSelect((select) => select('core').getAuthors());

		return (
			<>
				<InspectorControls>
					<TabPanel
						className='arkb-tabPanel'
						activeClass='is-active'
						// onSelect={(tabName) => {console.log('Selecting tab', tabName);}}
						tabs={[
							{
								name: 'display',
								title: (
									<>
										<i className='dashicons-before dashicons-admin-settings'></i>

										{_x('Settings', 'tab-panel', 'arkhe-blocks')}
									</>
								),
								className: '__display',
							},
							{
								name: 'pickup',
								title: (
									<>
										<i className='dashicons-before dashicons-post-status'></i>
										{_x('Pickup', 'tab-panel', 'arkhe-blocks')}
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
				<div className={`${blockName} ${className} ark-has-guide`}>
					<ServerSideRender block={name} attributes={attributes} />
				</div>
			</>
		);
	},
	save: () => {
		return null;
	},
});
