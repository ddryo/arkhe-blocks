/**
 * @WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	// MediaUpload,
	// MediaUploadCheck,
	MediaReplaceFlow,
	__experimentalLinkControl as LinkControl,
} from '@wordpress/block-editor';
import { ToolbarButton, ToolbarGroup, Popover } from '@wordpress/components';
import { Icon, alignCenter, link } from '@wordpress/icons';

/**
 * @Internal dependencies
 */
import getNewLinkRel from '@helper/getNewLinkRel';

/**
 * @Others dependencies
 */
import classnames from 'classnames';

/**
 * コンポーネント
 */
export default (props) => {
	const {
		attributes,
		setAttributes,
		onSelectImage,
		onSelectURL,
		onRemoveImage,
		isURLPickerOpen,
		setIsURLPickerOpen,
	} = props;

	const {
		textAlign,
		layout,
		imgId,
		imgUrl,
		// imgAlt,
		href,
		rel,
		isNewTab,
	} = attributes;

	// 縦並びか横並びかを変数化
	const isVertical = 'vertical' === layout;

	return (
		<>
			{isVertical && (
				<ToolbarGroup>
					<ToolbarButton
						className={classnames('components-toolbar__control', {
							'is-pressed': 'center' === textAlign,
						})}
						label={__('Center the text', 'arkhe-blocks')}
						icon={<Icon icon={alignCenter} />}
						onClick={() => {
							const newAlign = 'center' === textAlign ? '' : 'center';
							setAttributes({ textAlign: newAlign });
						}}
					/>
				</ToolbarGroup>
			)}

			<ToolbarGroup>
				<ToolbarButton
					name='link'
					icon={<Icon icon={link} />}
					title={__('Link')}
					onClick={() => {
						setIsURLPickerOpen(true);
					}}
				/>
			</ToolbarGroup>
			{/* リンク設定用のポップオーバー */}
			{isURLPickerOpen && (
				<Popover position='bottom center' onClose={() => setIsURLPickerOpen(false)}>
					<LinkControl
						className='wp-block-navigation-link__inline-link-input'
						value={{ url: href, opensInNewTab: isNewTab }}
						onChange={(changedVal) => {
							// console.log(changedVal);
							const { url = '', opensInNewTab } = changedVal;
							const newRel = getNewLinkRel(opensInNewTab, rel);

							setAttributes({
								href: url,
								isNewTab: opensInNewTab,
								rel: newRel,
							});
						}}
					/>
				</Popover>
			)}
			{/* {!imgUrl && (
				<ToolbarGroup>
					<MediaUploadCheck>
						<MediaUpload
							onSelect={onSelectImage}
							allowedTypes={'image'}
							value={imgId}
							render={({ open }) => (
								<ToolbarButton
									className='components-toolbar__control'
									label='画像を選択'
									icon='edit'
									onClick={open}
								/>
							)}
						/>
					</MediaUploadCheck>
				</ToolbarGroup>
			)} */}
			{!!imgUrl && (
				<>
					<MediaReplaceFlow
						mediaId={imgId}
						mediaURL={imgUrl}
						allowedTypes={['image']}
						accept='image/*'
						onSelect={onSelectImage}
						onSelectURL={onSelectURL}
					/>
					<ToolbarGroup>
						<ToolbarButton
							className='components-toolbar__control'
							label={__('Delete image', 'arkhe-blocks')}
							icon='no-alt'
							// icon={<Icon icon={cancelCircleFilled} />}
							onClick={onRemoveImage}
						/>
					</ToolbarGroup>
				</>
			)}
		</>
	);
};
