<?php
namespace Arkhe_Blocks\Menu;

defined( 'ABSPATH' ) || exit;

// PAGE_NAME
$db_name   = 'shortcode';
$page_name = \Arkhe_Blocks::MENU_PAGE_PREFIX . $db_name;


\Arkhe_Blocks::add_menu_section( [
	'title'      => __( 'カスタムショートコード', 'arkhe-blocks' ),
	'key'        => 'custom_shortcode',
	'page_name'  => $page_name,
	'db'         => $db_name,
	'page_cb'    => '\Arkhe_Blocks\Menu\cb_custom_shortcode',
	'section_cb' => function() {
		echo '<p>' . esc_html__( 'ブロックツールバーから呼び出せるインライン用ショートコードを定義できます。', 'arkhe-blocks' ) . '</p>';
	},
] );

function cb_custom_shortcode( $args ) {

	for ( $i = 1; $i < 4; $i++ ) {
		echo '<div class="arkhe-menu__customFormat">';
			echo '<div class="h3 __label">カスタム書式 - ' . esc_html( $i ) . '</div>';
			\Arkhe_Blocks::output_text_field([
				'db'    => $args['db'],
				'key'   => 'shortcode_title_' . $i,
				'label' => __( '表示名', 'arkhe-blocks' ),
			]);
			\Arkhe_Blocks::output_text_field([
				'db'    => $args['db'],
				'key'   => 'shortcode_class_' . $i,
				'label' => __( 'クラス名', 'arkhe-blocks' ),
			]);
		echo '</div>';
	}

	echo '<p class="arkhe-menu__help">実際の出力時にクラス名は<code>arkb-{入力したクラス名}</code>となります</p>';

}
