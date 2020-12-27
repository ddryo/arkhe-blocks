/**
 * @WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import { registerBlockType } from '@wordpress/blocks';
import { URLInput, BlockControls, InspectorControls, useBlockProps } from '@wordpress/block-editor';
import { PanelBody, ToggleControl, TextControl } from '@wordpress/components';
import ServerSideRender from '@wordpress/server-side-render';

/**
 * @Internal dependencies
 */
import { iconColor } from '@blocks/config';
import metadata from './block.json';
import blockIcon from './_icon';
import example from './_example';
import exampleHtml from './_exampleHtml';
import getNewLinkRel from '@helper/getNewLinkRel';
import { ArkheMarginControl } from '@components/ArkheMarginControl';

/**
 * @Others dependencies
 */
// import classnames from 'classnames';

/**
 * metadata
 */
const blockName = 'ark-block-blogCard';
const { apiVersion, name, category, keywords, supports } = metadata;

/**
 * 関連記事ブロック
 */
registerBlockType(name, {
	apiVersion,
	title: __('Blog card', 'arkhe-blocks') + '(β)',
	description: __('Create a card-type link for related articles.', 'arkhe-blocks'),
	icon: {
		foreground: iconColor,
		src: blockIcon,
	},
	category,
	keywords,
	supports,
	example,
	attributes: metadata.attributes,
	edit: (props) => {
		const { attributes, setAttributes, isSelected } = props;
		const {
			isPreview,
			postId,
			postTitle,
			externalUrl,
			caption,
			isNewTab,
			rel,
			useCache,
			showExerptPC,
			showExerptSP,
		} = attributes;

		// プレビュー中
		if (isPreview) return exampleHtml;

		// タブ用のステート
		const [isExternal, setIsExternal] = useState(!!externalUrl);

		// 現在の記事のID
		// const currentID = useSelect((select) => select('core/editor').getCurrentPostId());
		// const blockEdit = ();

		const inputArea = isSelected ? (
			<div className={`${blockName}__controls`}>
				<ToggleControl
					label={__('Link to an external site', 'arkhe-blocks')}
					checked={isExternal}
					onChange={(val) => {
						setIsExternal(val);
					}}
				/>
				<div className={`${blockName}__inputWrapper`}>
					{!isExternal && (
						<div className='__internalArea'>
							<TextControl
								className='__idInput'
								placeholder={__('Post ID', 'arkhe-blocks')}
								type='number'
								value={postId}
								onChange={(newID) => {
									setAttributes({
										postId: newID,
										externalUrl: '',
									});
								}}
							/>
							<URLInput
								value={postTitle}
								className='__urlInput'
								// autoFocus={isSelected}
								hasBorder
								placeholder={__(
									'Enter a title to search for articles',
									'arkhe-blocks'
								)}
								disableSuggestions={!isSelected}
								onChange={(url, post) => {
									if (!post) {
										setAttributes({
											postTitle: url,
											postId: '',
											externalUrl: '',
										});
									} else if (post.id) {
										let newPostTitle = post.title || url;
										newPostTitle = newPostTitle.replace('&#8211;', '-');
										setAttributes({
											postId: post.id + '',
											externalUrl: '',
											postTitle: newPostTitle,
										});
									}
								}}
							/>
						</div>
					)}
					{isExternal && (
						<div className='__externalArea'>
							<TextControl
								className='__externalInput'
								placeholder={__('Enter the URL.', 'arkhe-blocks')}
								value={externalUrl}
								onChange={(val) => {
									setAttributes({
										externalUrl: val,
										postId: '',
										postTitle: '',
									});
								}}
							/>
						</div>
					)}
				</div>
			</div>
		) : null;

		const blockProps = useBlockProps({
			className: blockName,
		});

		return (
			<>
				<BlockControls>
					<ArkheMarginControl {...{ className: attributes.className, setAttributes }} />
				</BlockControls>
				<InspectorControls>
					<PanelBody title={__('Settings', 'arkhe-blocks')} initialOpen={true}>
						<ToggleControl
							label={__('Show excerpt', 'arkhe-blocks') + ' (PC)'}
							checked={showExerptPC}
							onChange={(val) => {
								setAttributes({ showExerptPC: val });
							}}
						/>
						<ToggleControl
							label={__('Show excerpt', 'arkhe-blocks') + ' (SP)'}
							checked={showExerptSP}
							onChange={(val) => {
								setAttributes({ showExerptSP: val });
							}}
						/>
						<TextControl
							label={__('Caption at the bottom right of the card', 'arkhe-blocks')}
							value={caption}
							onChange={(val) => {
								setAttributes({ caption: val });
							}}
						/>
						<ToggleControl
							label={__('Use the cache', 'arkhe-blocks')}
							help={__(
								'If you want to clear the cache, turn it off only once.',
								'arkhe-blocks'
							)}
							checked={useCache}
							onChange={(val) => {
								setAttributes({ useCache: val });
							}}
						/>
					</PanelBody>
					<PanelBody title={__('Link settings', 'arkhe-blocks')} initialOpen={true}>
						<>
							<ToggleControl
								label={__('Open in new tab')}
								checked={isNewTab}
								onChange={(value) => {
									const newRel = getNewLinkRel(value, rel);
									setAttributes({
										isNewTab: value,
										rel: newRel,
									});
								}}
							/>
							<TextControl
								label={__('Link rel')}
								value={rel || ''}
								onChange={(value) => {
									setAttributes({ rel: value });
								}}
							/>
						</>
					</PanelBody>
				</InspectorControls>
				<div {...blockProps}>
					{postId || externalUrl ? (
						<ServerSideRender
							block={name}
							attributes={attributes}
							className={`${blockName}__preview`}
						/>
					) : (
						<div className={`${blockName}__preview -none`}>
							{!isExternal
								? `※ ${__('Specify the page.', 'arkhe-blocks')}`
								: `※ ${__('Enter the URL.', 'arkhe-blocks')}`}
						</div>
					)}
					{inputArea}
				</div>
			</>
		);
	},
	save: () => {
		return null;
	},
});
