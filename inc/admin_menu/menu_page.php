<?php
namespace Arkhe_Blocks\Menu;

defined( 'ABSPATH' ) || exit;

// 設定タブのリスト
$setting_tabs = \Arkhe_Blocks::$menu_tabs;

// 現在のタブを取得
$now_tab = isset( $_GET['tab'] ) ? $_GET['tab'] : 'general'; //phpcs:ignore

// 設定保存完了時、$_REQUEST でデータが渡ってくる
//phpcs:ignore
if ( isset( $_REQUEST['settings-updated'] ) && $_REQUEST['settings-updated'] ) {
	$green_message = __( 'Your settings have been saved.', 'arkhe-blocks' ); // 「設定を保存しました。」
	echo '<div class="notice updated is-dismissible"><p>' . esc_html( $green_message ) . '</p></div>';
}

?>

<div id="arkhe-menu" class="arkhe-menu wrap">

	<div class="arkhe-menu__head">
		<h1 class="arkhe-menu__title">
			<?=esc_html__( 'Arkhe Blocks Settings', 'arkhe-blocks' )?>
		</h1>

		<div class="nav-tab-wrapper">
			<?php
				foreach ( $setting_tabs as $key => $val ) :
				$tab_url   = admin_url( 'admin.php?page=' . \Arkhe_Blocks::MENU_SLUG ) . '&tab=' . $key;
				$nav_class = ( $now_tab === $key ) ? 'nav-tab nav-tab-active' : 'nav-tab';

				echo '<a href="' . esc_url( $tab_url ) . '" class="' . esc_attr( $nav_class ) . '">' . esc_html( $val ) . '</a>';
				endforeach;
			?>
		</div>
	</div>
	<div class="arkhe-menu__body">
		<form method="POST" action="options.php">
			<?php
				// 設定項目の出力
				do_settings_sections( \Arkhe_Blocks::MENU_PAGE_PREFIX . $now_tab );

				// nonceなどを出力
				settings_fields( \Arkhe_Blocks::MENU_GROUP_PREFIX . $now_tab );

				// 保存ボタン
				submit_button( '', 'primary large', 'submit_' . $now_tab );
			?>
		</form>
	</div>
</div>
