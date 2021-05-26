<?php
namespace Arkhe_Blocks\Block\Post_List;

defined( 'ABSPATH' ) || exit;

register_block_type_from_metadata(
	ARKHE_BLOCKS_PATH . 'src/gutenberg/blocks/post-list',
	[
		'render_callback'  => '\Arkhe_Blocks\Block\Post_List\cb',
	]
);

function cb( $attrs, $content ) {

	// ここでは defined('REST_REQUEST')  = true になる //サーバーサイドレンダー？

	$anchor        = $attrs['anchor'] ?? '';
	$className     = $attrs['className'] ?? '';
	$list_count_pc = $attrs['listCountPC'];
	$list_count_sp = $attrs['listCountSP'];

	// リスト表示用データ
	$list_args = [
		'list_type'      => $attrs['listType'],
		'show_cat'       => $attrs['showCat'],
		'show_date'      => $attrs['showDate'],
		'show_modified'  => $attrs['showModified'],
		'show_author'    => $attrs['showAuthor'],
		'h_tag'          => $attrs['hTag'],
		'list_count_pc'  => $list_count_pc,
		'list_count_sp'  => $list_count_sp,
	];

	// クエリ生成用データ
	$query_args = [
		'post_type'           => $attrs['postType'],
		'order'               => $attrs['order'],
		'orderby'             => $attrs['orderby'],
		'no_found_rows'       => true,
		'ignore_sticky_posts' => true,
	];

	// 先頭固定表示
	if ( $attrs['showStickyPosts'] ) {
		$query_args['ignore_sticky_posts'] = false;

		$sticky_posts  = get_option( 'sticky_posts' ) ?: [];
		$sticky_ct     = count( $sticky_posts );
		$list_count_pc = $list_count_pc - $sticky_ct;
		$list_count_sp = $list_count_sp - $sticky_ct;
	}

	$query_args['posts_per_page'] = max( $list_count_pc, $list_count_sp );

	if ( $attrs['postID'] ) {

		// 投稿IDで直接指定されている場合
		$query_args['post__in'] = array_map( 'intval', explode( ',', $attrs['postID'] ) );

	} else {

		// 投稿IDでの指定がなければ、ターム条件を生成
		$tax_query = [];

		// カテゴリーの指定
		$cat_id = $attrs['catID'];
		if ( $cat_id ) {
			// int化して配列に
			$cat_array = array_map( 'intval', explode( ',', $cat_id ) );

			// tax_query追加
			$tax_query[] = [
				'taxonomy'         => 'category',
				'field'            => 'id',
				'terms'            => $cat_array,
				'operator'         => $attrs['catRelation'],
				'include_children' => ! $attrs['exCatChildren'],
			];
		}

		// タグの指定
		$tag_id = $attrs['tagID'];
		if ( $tag_id ) {

			$tag_array   = array_map( 'intval', explode( ',', $tag_id ) );
			$tax_query[] = [
				'taxonomy'         => 'post_tag',
				'field'            => 'id',
				'terms'            => $tag_array,
				'operator'         => $attrs['tagRelation'],
				'include_children' => false,
			];
		}

		// タクソノミーの指定
		$taxonomy = $attrs['taxName'];
		$term_id  = $attrs['termID'];

		if ( $taxonomy && $term_id ) {

			$term_array  = array_map( 'intval', explode( ',', $term_id ) );
			$tax_query[] = [
				'taxonomy' => $taxonomy,
				'field'    => 'id',
				'terms'    => $term_array,
				'operator' => $attrs['termRelation'],
			];
		}

		// tax_query あればさらに追加
		if ( ! empty( $tax_query ) ) {
			$tax_query['relation']   = $attrs['queryRelation'];
			$query_args['tax_query'] = $tax_query;
		}
	}

	// 除外ID
	$exc_id = $attrs['excID'];
	if ( $exc_id ) {
		$query_args['post__not_in'] = array_map( 'intval', explode( ',', $exc_id ) );
	}

	// 著者での絞り込み
	$author_id = $attrs['authorID'];
	if ( $author_id ) {
		$query_args['author'] = $author_id;
	}

	// 抜粋文の文字数
	if ( isset( $attrs['excerptLength'] ) ) {
		$list_args['excerpt_length'] = $attrs['excerptLength'];
	}

	// リストを囲むクラス名
	$block_class = 'ark-block-postList';
	if ( $className ) {
		$block_class .= ' ' . $className;
	}

	// 属性
	$block_props = 'class="' . esc_attr( $block_class ) . '"';
	if ( $anchor ) {
		$block_props .= ' id="' . esc_attr( $anchor ) . '"';
	}

	ob_start();
	echo '<div ' . $block_props . '>'; // phpcs:ignore
	// 投稿リスト
	\Arkhe::get_part( 'post_list/sub_query', [
		'query_args' => $query_args,
		'list_args'  => $list_args,
	] );
	echo '</div>';
	return ob_get_clean();
}
