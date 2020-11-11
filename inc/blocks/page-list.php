<?php
namespace Arkhe_Blocks;

defined( 'ABSPATH' ) || exit;

/**
 * 投稿リストブロック
 */
$block_name = 'page-list';

register_block_type_from_metadata(
	ARKHE_BLOCKS_PATH . 'src/blocks/' . $block_name,
	[
		'render_callback'  => '\Arkhe_Blocks\cb_page_list',
	]
);


function cb_page_list( $attrs, $content ) {

	if ( ! class_exists( 'Arkhe' ) ) return;

	// $rss_url       = $attrs['rssUrl'];
	// $use_cache     = $attrs['useCache'];
	// $list_count_pc = $attrs['listCountPC'];
	// $list_count_sp = $attrs['listCountSP'];

	ob_start();
	echo '<div class="ark-block-pageList c-postContent">';

	// 投稿リスト
	\Arkhe_Blocks\get_page_list();

	echo '</div>';

	// $thumb = wp_get_attachment_image( 49, 'full', false, [
	// 	'class' => 'hoge',
	// 	'alt'   => 'hohoho',
	// ] );

	// $img = '<figure class="wp-block-image size-full is-resized"><img src="http://localhost:2222/wp-content/uploads/2020/10/8wz1Q4Q_XAg.jpg" alt="" class="wp-imag-e-49" width="1050" height="700"/><figcaption>キャプションaaaaaだよ</figcaption></figure>';
	// echo $img;

	return ob_get_clean();
}


/**
 * RSS記事のサムネイル取得
 */
function get_page_list( $url = '' ) {

	// echo get_the_ID();
	$numberposts = -1;

	$query_args = [
		'post_parent'    => get_the_ID(),
		'post_type'      => 'page',
		'posts_per_page' => $numberposts,
		'post_status'    => 'publish',
	];

	// 「順序」通りに並べる
	if ( 1 ) {
		$query_args['order']   = 'ASC';
		$query_args['orderby'] = 'menu_order';
	}

	$list_args = [];

	// 投稿リスト
	\Arkhe::$ex_parts_path = ARKHE_BLOCKS_PATH;
	// \Arkhe::get_part( 'page_list', [
	// 	'query_args' => $query_args,
	// 	'list_args'  => $list_args,
	// ] );
	\Arkhe::get_part( 'test', [
		'query_args' => $query_args,
		'list_args'  => $list_args,
	] );
	\Arkhe::$ex_parts_path = '';
}
