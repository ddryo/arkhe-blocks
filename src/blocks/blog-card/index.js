/**
 * @WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import { registerBlockType } from '@wordpress/blocks';
import { URLInput, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, ToggleControl, TextControl } from '@wordpress/components';
// import { PanelBody, ToggleControl, TextControl } from '@wordpress/components';
import ServerSideRender from '@wordpress/server-side-render';

/**
 * @Internal dependencies
 */
import { iconColor } from '@blocks/config';
import metadata from './block.json';
// import blockIcon from './_icon';
import example from './_example';
import exampleHtml from './_exampleHtml';
// import SwellTab from '@swell-guten/components/swell-tab.js';
// import BlockControl from './_panels';

/**
 * @Others dependencies
 */
import classnames from 'classnames';

/**
 * metadata
 */
const blockName = 'ark-block-blogCard';
const { name, category, keywords, supports } = metadata;

/**
 * 関連記事ブロック
 */
registerBlockType(name, {
	title: __('関連記事', 'arkhe-blocks'),
	description: __('関連記事をブログカード型で表示します。', 'arkhe-blocks'),
	icon: {
		foreground: iconColor,
		src: 'admin-links',
	},
	category,
	keywords,
	supports,
	example,
	attributes: metadata.attributes,
	edit: (props) => {
		const { attributes, className, setAttributes, isSelected } = props;
		const {
			isPreview,
			postId,
			postTitle,
			externalUrl,
			// isCached,
		} = attributes;

		// プレビュー中
		if (isPreview) return exampleHtml;

		// タブ用のステート
		const [isExternal, setIsExternal] = useState(!!externalUrl);

		// 現在の記事のID
		// const currentID = useSelect((select) => select('core/editor').getCurrentPostId());
		// const blockEdit = ();

		return (
			<>
				<InspectorControls>{/* <BlockControl {...props} /> */}</InspectorControls>
				<div className={classnames(blockName, className)}>
					<div className={`${blockName}__preview`}>
						{postId || externalUrl ? (
							<ServerSideRender block={name} attributes={attributes} />
						) : (
							<div className={`${blockName}__none`}>
								{!isExternal
									? '※ ブログカードとして表示したい投稿を指定してください。'
									: '※ ブログカードとして表示したいURLを入力してください。'}
							</div>
						)}
					</div>
					{isSelected && (
						<>
							<ToggleControl
								label={__('外部リンクを利用する', 'arkhe-blocks')}
								checked={isExternal}
								onChange={(val) => {
									setIsExternal(val);
								}}
							/>
							<div className={`${blockName}__inputWrapper`}>
								{!isExternal && (
									<div className='__internalArea'>
										<input
											type='text'
											className='__idInput'
											value={postId}
											placeholder='IDを入力'
											onChange={(e) => {
												e.preventDefault();
												setAttributes({
													postId: parseInt(e.target.value),
													externalUrl: '',
												});
											}}
										/>
										<URLInput
											value={postTitle}
											className='__urlInput'
											// autoFocus={isSelected}
											hasBorder
											placeholder='タイトルを入力して記事を検索'
											disableSuggestions={!isSelected}
											onChange={(url, post) => {
												let newPostTitle = url;
												if (post && post.title) {
													// newPostTitle = decodeURIComponent(post.title);
													newPostTitle = post.title;
													// 文字化け対策
													newPostTitle = newPostTitle.replace(
														'&#8211;',
														'-'
													);
												}
												if (post && post.id) {
													setAttributes({
														postId: post.id,
														externalUrl: '',
													});
												}
												setAttributes({
													postTitle: newPostTitle,
												});
											}}
										/>
									</div>
								)}
								{isExternal && (
									<div className='__externalArea'>
										<TextControl
											// label='外部リンクのURL'
											className='__externalInput'
											placeholder='URLを直接入力してください。'
											value={externalUrl}
											onChange={(val) => {
												setAttributes({
													externalUrl: val,
													postId: 0,
													postTitle: '',
													isNewTab: false,
												});
											}}
										/>
									</div>
								)}
							</div>
						</>
					)}
				</div>
			</>
		);
	},
	save: () => {
		return null;
	},
});
