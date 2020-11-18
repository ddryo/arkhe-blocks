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
import getNewLinkRel from '@helper/getNewLinkRel';

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
			caption,
			isNewTab,
			rel,
			// isCached,
		} = attributes;

		// プレビュー中
		if (isPreview) return exampleHtml;

		// タブ用のステート
		const [isExternal, setIsExternal] = useState(!!externalUrl);

		// 現在の記事のID
		// const currentID = useSelect((select) => select('core/editor').getCurrentPostId());
		// const blockEdit = ();

		const inputArea = isSelected ? (
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
							<TextControl
								className='__idInput'
								placeholder={__('投稿ID', 'arkhe-blocks')}
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
								placeholder={__('タイトルを入力して記事を検索', 'arkhe-blocks')}
								disableSuggestions={!isSelected}
								onChange={(url, post) => {
									// console.log(url, post);
									if (!post) {
										setAttributes({
											postTitle: url,
											postId: 0,
											externalUrl: '',
										});
									} else if (post.id) {
										let newPostTitle = post.title || url;
										newPostTitle = newPostTitle.replace('&#8211;', '-');
										setAttributes({
											postId: post.id,
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
								placeholder={__('URLを直接入力してください。', 'arkhe-blocks')}
								value={externalUrl}
								onChange={(val) => {
									setAttributes({
										externalUrl: val,
										postId: 0,
										postTitle: '',
									});
								}}
							/>
						</div>
					)}
				</div>
			</>
		) : null;

		return (
			<>
				<InspectorControls>
					<PanelBody title={__('Settings', 'arkhe-blocks')} initialOpen={true}>
						<TextControl
							label={__('キャプション', 'arkhe-blocks')}
							value={caption}
							onChange={(val) => {
								setAttributes({ caption: val });
							}}
						/>
					</PanelBody>
					<PanelBody title={__('Link settings', 'arkhe-blocks')} initialOpen={true}>
						<>
							<ToggleControl
								id='loosbtn_is_new_open'
								label={__('Open in new tab')}
								help='※ 外部サイトへのリンクでは、「新しいタブで開く」の設定は無視され、強制的にオンになります。'
								checked={isNewTab}
								// className={externalUrl ? '-is-external' : null}
								onChange={(value) => {
									const newRel = getNewLinkRel(value, rel);
									// const newRel = setBlankRel(value, rel);
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
				<div className={classnames(blockName, className)}>
					<div className={`${blockName}__preview`}>
						{postId || externalUrl ? (
							<ServerSideRender block={name} attributes={attributes} />
						) : (
							<div className={`${blockName}__none`}>
								{!isExternal
									? '※ ページを指定してください。'
									: '※ URLを入力してください。'}
							</div>
						)}
					</div>
					{inputArea}
				</div>
			</>
		);
	},
	save: () => {
		return null;
	},
});
