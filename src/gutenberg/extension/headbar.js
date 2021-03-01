/**
 * @WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { render } from '@wordpress/element';

const PostlinkBtn = ({ currentPostLink, linkText }) => {
	return (
		<>
			<a href={currentPostLink} target='_blank' rel='noopener noreferrer'>
				{linkText}
			</a>
		</>
	);
};

wp.domReady(function () {
	if (window.arkbSettings.disableHeaderLink) return;

	setTimeout(() => {
		// ヘッダーツールバーを取得
		const headerToolbar = document.querySelector('.edit-post-header__toolbar');

		if (null === headerToolbar) return;
		// 投稿データ
		const currentPost = wp.data.select('core/editor').getCurrentPost();
		if (!currentPost) return;

		// URLを取得する
		const currentPostLink = currentPost.link; // currentPost.permalink_template も同じ？
		if (!currentPostLink) return;

		// 投稿タイプを取得
		const postType = wp.data.select('core/editor').getCurrentPostType();

		// 表示テキスト
		let linkText = '';
		if ('post' === postType) {
			linkText = __('View Post', 'arkhe-blocks');
		} else if ('page' === postType) {
			linkText = __('View Page', 'arkhe-blocks');
		} else {
			return false;
		}

		// ヘッダーツールバーにdiv追加
		headerToolbar.insertAdjacentHTML(
			'beforeend',
			'<div class="ark-custom-header-toolbar"></div>'
		);

		render(
			<PostlinkBtn currentPostLink={currentPostLink} linkText={linkText} />,
			document.querySelector('.ark-custom-header-toolbar')
		);
	}, 20);
});
