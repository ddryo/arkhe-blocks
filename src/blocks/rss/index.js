/**
 * @WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { registerBlockType } from '@wordpress/blocks';
// import { __experimentalBlock as Block } from '@wordpress/block-editor';
import ServerSideRender from '@wordpress/server-side-render';

/**
 * @Internal dependencies
 */
import BlockControls from './_controls';
import { iconColor } from '@blocks/config';
// import blockIcon from './_icon';
import example from './_example';
import metadata from './block.json';

/**
 * @Others dependencies
 */
// import classnames from 'classnames';

/**
 * metadata
 */
const blockName = 'ark-block-rss';
const { name, category, keywords, supports } = metadata;

/**
 *
 */
registerBlockType(name, {
	title: __('RSS', 'arkhe-blocks'),
	description: __('RSSフィードを読みこみます。', 'arkhe-blocks'),
	icon: {
		foreground: iconColor,
		src: 'rss',
	},
	category,
	keywords,
	example,
	supports,
	attributes: metadata.attributes,
	edit: (props) => {
		const { attributes, className } = props;

		// ark-has-guide

		return (
			<>
				<BlockControls {...props} />
				<div className={`${blockName} ${className}`}>
					<ServerSideRender block={name} attributes={attributes} />
				</div>
			</>
		);
	},
	save: () => {
		return null;
	},
});
