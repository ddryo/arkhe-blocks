<?php
namespace Arkhe_Blocks\Block\Page_List;

defined( 'ABSPATH' ) || exit;

/**
 * 固定ページリストブロック
 */
$block_name = 'page-list';

register_block_type_from_metadata(
	ARKHE_BLOCKS_PATH . 'src/gutenberg/blocks/' . $block_name,
	[
		'render_callback'  => '\Arkhe_Blocks\Block\Page_List\cb',
	]
);


function cb( $attrs, $content ) {

	if ( ! class_exists( 'Arkhe' ) ) return;

	$target  = $attrs['target'];
	$orderby = $attrs['orderby'];
	$order   = $attrs['order'];

	$query_args = [
		'post_type'      => 'page',
		'post_status'    => 'publish',
		'order'          => $order,
		'orderby'        => $orderby,
	];

	// 子ページを取得するかどうか
	if ( 'children' === $target ) {
		$query_args['post_parent']    = get_the_ID();
		$query_args['posts_per_page'] = -1;
	} elseif ( 'id' === $target ) {

		// 投稿IDで直接指定
		$query_args['post__in'] = array_map( 'intval', explode( ',', $attrs['postID'] ) );

	}

	$list_args = [
		'list_type' => $attrs['listType'],
		'h_tag'     => $attrs['hTag'],
	];

	if ( isset( $attrs['excerptLength'] ) ) {
		\Arkhe::$excerpt_length = $attrs['excerptLength'];
	}

	// リストを囲むクラス名
	$list_wrapper_class = 'ark-block-pageList';
	if ( $attrs['className'] ) {
		$list_wrapper_class .= ' ' . $attrs['className'];
	}

	ob_start();
	echo '<div class="' . esc_attr( $list_wrapper_class ) . '">';

	\Arkhe_Blocks::get_part( 'page_list', [
		'query_args' => $query_args,
		'list_args'  => $list_args,
	] );

	echo '</div>';

	// リセット
	\Arkhe::$excerpt_length = ARKHE_EXCERPT_LENGTH;

	return ob_get_clean();
}
