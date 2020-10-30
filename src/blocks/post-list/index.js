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
const blockName = 'ark-block-postList';
const { name, category, keywords, supports } = metadata;

/**
 *
 */
registerBlockType(name, {
	title: __('投稿リスト', 'arkhe-blocks'),
	description: __('投稿リストを呼び出すことができます。', 'arkhe-blocks'),
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

		return (
			<>
				<BlockControls {...props} />
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
