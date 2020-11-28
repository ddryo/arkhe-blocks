/**
 * @WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { registerBlockType } from '@wordpress/blocks';
import { BlockControls, useBlockProps } from '@wordpress/block-editor';
import ServerSideRender from '@wordpress/server-side-render';

/**
 * @Internal dependencies
 */
import TheSidebar from './_sidebar';
import { iconColor } from '@blocks/config';
// import blockIcon from './_icon';
import example from './_example';
import metadata from './block.json';
import { ArkheMarginControl } from '@components/ArkheMarginControl';

/**
 * @Others dependencies
 */
// import classnames from 'classnames';

/**
 * metadata
 */
const blockName = 'ark-block-rss';
const { apiVersion, name, category, keywords, supports } = metadata;

/**
 *
 */
registerBlockType(name, {
	apiVersion,
	title: __('RSS', 'arkhe-blocks'),
	description: __('Create a list of RSS feeds.', 'arkhe-blocks'),
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
		const { attributes, setAttributes } = props;

		const blockProps = useBlockProps({
			className: blockName,
		});

		return (
			<>
				<BlockControls>
					<ArkheMarginControl attributes={attributes} setAttributes={setAttributes} />
				</BlockControls>
				<TheSidebar {...props} />
				<div {...blockProps}>
					<ServerSideRender block={name} attributes={attributes} />
				</div>
			</>
		);
	},
	save: () => {
		return null;
	},
});
