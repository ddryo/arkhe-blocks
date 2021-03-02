<?php
namespace Arkhe_Blocks\Menu;

defined( 'ABSPATH' ) || exit;

// PAGE_NAME
$db_name   = 'shortcode';
$page_name = \Arkhe_Blocks::MENU_PAGE_PREFIX . $db_name;


\Arkhe_Blocks::add_menu_section( [
	'title'      => __( 'Custom shortcode', 'arkhe-blocks' ),
	'key'        => 'custom_shortcode',
	'page_name'  => $page_name,
	'db'         => $db_name,
	'page_cb'    => '\Arkhe_Blocks\Menu\cb_custom_shortcode',
	// 'section_cb' => function() {
	// 	echo '<p>' . esc_html__( 'ブロックツールバーから呼び出せるインライン用ショートコードを定義できます。', 'arkhe-blocks' ) . '</p>';
	// },
] );

function cb_custom_shortcode( $args ) {

	for ( $i = 1; $i < 4; $i++ ) {
		$label = __( 'Custom shortcode', 'arkhe-blocks' ) . ' - ' . $i;
		echo '<div class="arkhe-menu__customFormat">';
			echo '<div class="h3 __label">' . esc_html( $label ) . '</div>';
			\Arkhe_Blocks::output_text_field([
				'db'    => $args['db'],
				'key'   => 'shortcode_title_' . $i,
				'label' => __( 'Display name', 'arkhe-blocks' ),
			]);
			\Arkhe_Blocks::output_text_field([
				'db'    => $args['db'],
				'key'   => 'shortcode_class_' . $i,
				'label' => __( 'Code to call', 'arkhe-blocks' ),
			]);
		echo '</div>';
	}

	echo '<p class="arkhe-menu__help">実際の出力時にクラス名は<code>arkb-{入力したクラス名}</code>となります</p>';

}
