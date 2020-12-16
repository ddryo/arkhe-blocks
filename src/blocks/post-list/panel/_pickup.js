/**
 * @WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useSelect } from '@wordpress/data';
import {
	PanelBody,
	TextControl,
	BaseControl,
	CheckboxControl,
	SelectControl,
	ButtonGroup,
	Button,
	RadioControl,
	TreeSelect,
} from '@wordpress/components';

/**
 * @Internal dependencies
 */
import buildTermsTree from '@src/helper/build-terms-tree';

export default ({ attributes, setAttributes, authors }) => {
	const {
		postID,
		catID,
		tagID,
		taxName,
		termID,
		catRelation,
		tagRelation,
		termRelation,
		queryRelation,
		excID,
		exCatChildren,
		authorID,
		postType,
	} = attributes;
	const catIDs = catID.split(',');
	const tagIDs = tagID.split(',');
	const termIDs = termID.split(',');

	const categoryData = useSelect((select) =>
		select('core').getEntityRecords('taxonomy', 'category', {
			per_page: -1,
		})
	);
	const tagData = useSelect((select) =>
		select('core').getEntityRecords('taxonomy', 'post_tag', {
			per_page: -1,
		})
	);

	const termData = useSelect(
		(select) =>
			select('core').getEntityRecords('taxonomy', taxName, {
				per_page: -1,
			}),
		[taxName]
	);

	// 全ポストタイプを取得
	const postTypeList = useSelect((select) => {
		const postTypes = select('core').getPostTypes({ per_page: -1 });

		const _postTypeList = [
			{
				label: __('All', 'arkhe-blocks'),
				value: 'any',
			},
		];
		if (postTypes !== null) {
			for (const pt of postTypes) {
				// publicな投稿タイプかどうか
				const isViewable = pt.viewable;

				// 表示しない投稿タイプ
				const ignoreTypes = ['attachment', 'lp'];

				//配列につっこむ
				if (isViewable && ignoreTypes.indexOf(pt.slug) === -1) {
					_postTypeList.push({
						label: pt.name,
						value: pt.slug,
					});
				}
			}
		}
		return _postTypeList;
	}, []);
	// console.log( 'postTypes', postTypes );

	// 著者の選択用セレクトボックスのデータ
	const authorsArray = [{ label: '----', value: 0 }];
	authors.forEach((author) => {
		authorsArray.push({ label: author.name, value: author.id });
	});

	// タームの関係性
	const getTermBtnGroup = (IDs, relation, attrName) => {
		return (
			<ButtonGroup className='arkb-btns--small'>
				{1 < IDs.length ? (
					<>
						<Button
							isSecondary={'IN' !== relation}
							isPrimary={'IN' === relation}
							onClick={() => {
								setAttributes({
									[attrName]: 'IN',
								});
							}}
						>
							{__('Having at least one', 'arkhe-blocks')}
						</Button>
						<Button
							isSecondary={'AND' !== relation}
							isPrimary={'AND' === relation}
							onClick={() => {
								setAttributes({
									[attrName]: 'AND',
								});
							}}
						>
							{__('Having all', 'arkhe-blocks')}
						</Button>
					</>
				) : (
					<Button
						isSecondary={'NOT IN' === relation}
						isPrimary={'NOT IN' !== relation}
						onClick={() => {
							setAttributes({
								[attrName]: 'IN',
							});
						}}
					>
						{__('Having', 'arkhe-blocks')}
					</Button>
				)}
				<Button
					isSecondary={'NOT IN' !== relation}
					isPrimary={'NOT IN' === relation}
					onClick={() => {
						setAttributes({
							[attrName]: 'NOT IN',
						});
					}}
				>
					{__('Not having', 'arkhe-blocks')}
				</Button>
			</ButtonGroup>
		);
	};

	return (
		<>
			<PanelBody title={__('Narrow down by post ID', 'arkhe-blocks')} initialOpen={true}>
				<TextControl
					label={__('Specify the post ID directly', 'arkhe-blocks')}
					placeholder='ex) 8,120,272'
					help={
						'※ ' +
						__('If there are multiple, enter them separated by ",".', 'arkhe-blocks')
					}
					value={postID || ''}
					onChange={(value) => {
						setAttributes({
							postID: value,
						});
					}}
				/>
				<TextControl
					label={__('Post ID to exclude', 'arkhe-blocks')}
					placeholder='ex) 6,112,264'
					help={
						'※ ' +
						__('If there are multiple, enter them separated by ",".', 'arkhe-blocks')
					}
					value={excID || ''}
					onChange={(value) => {
						setAttributes({
							excID: value,
						});
					}}
				/>
			</PanelBody>

			{!postID && (
				<>
					<PanelBody
						title={__('Narrow down by post type', 'arkhe-blocks')}
						initialOpen={true}
					>
						<SelectControl
							value={postType}
							options={postTypeList}
							onChange={(val) => {
								setAttributes({ postType: val });
							}}
						/>
					</PanelBody>
					<PanelBody
						title={__('Taxonomy condition setting', 'arkhe-blocks')}
						initialOpen={true}
						className='arkb-panel--pickupTax'
					>
						<RadioControl
							label={__('For the following taxonomy conditions,', 'arkhe-blocks')}
							selected={queryRelation}
							options={[
								{
									label: __('Whether at least one is true', 'arkhe-blocks'),
									value: 'OR',
								},
								{
									label: __('Whether all is true', 'arkhe-blocks'),
									value: 'AND',
								},
							]}
							onChange={(val) => {
								setAttributes({ queryRelation: val });
							}}
						/>

						<hr />

						<div className='u-mb-20'>
							{__(
								'You can select multiple categories and tags by holding down the "command" key on Mac and the "ctrl" key on Windows.',
								'arkhe-blocks'
							)}
						</div>
						<TreeSelect
							label={__('Categories', 'arkhe-blocks')}
							className='arkb-select--category'
							noOptionLabel='----'
							onChange={(val) => {
								setAttributes({ catID: val.join(',') });
							}}
							selectedId={catIDs}
							tree={buildTermsTree(categoryData)}
							multiple
						/>

						<CheckboxControl
							className='arkb-check--exCatChild'
							label={__('Exclude articles in child categories only', 'arkhe-blocks')}
							checked={exCatChildren}
							onChange={(checked) => {
								setAttributes({ exCatChildren: checked });
							}}
						/>

						{catID && (
							<>
								<BaseControl className='arkb-btns--relation'>
									<BaseControl.VisualLabel>
										{__('Relationship of selected categories', 'arkhe-blocks')}
									</BaseControl.VisualLabel>
									{getTermBtnGroup(catIDs, catRelation, 'catRelation')}
								</BaseControl>
							</>
						)}

						<TreeSelect
							label={__('Tags', 'arkhe-blocks')}
							className='arkb-select--tag'
							noOptionLabel='----'
							onChange={(val) => setAttributes({ tagID: val.join(',') })}
							selectedId={tagIDs}
							tree={buildTermsTree(tagData)}
							multiple
						/>
						{tagID && (
							<BaseControl className='arkb-btns--relation'>
								<BaseControl.VisualLabel>
									{__('Relationship of selected tags', 'arkhe-blocks')}
								</BaseControl.VisualLabel>
								{getTermBtnGroup(tagIDs, tagRelation, 'tagRelation')}
							</BaseControl>
						)}

						<TextControl
							label={__('Taxonomy', 'arkhe-blocks')}
							placeholder={__('Enter the taxonomy name (slug)', 'arkhe-blocks')}
							value={taxName || ''}
							onChange={(value) => {
								setAttributes({
									taxName: value,
								});
								if (!value) {
									setAttributes({
										termID: '',
									});
								}
							}}
						/>
						{taxName && (
							<>
								<TreeSelect
									label={__('Terms', 'arkhe-blocks')}
									className='arkb-select--term'
									noOptionLabel='----'
									onChange={(val) => {
										setAttributes({
											termID: val.join(','),
										});
									}}
									selectedId={termIDs}
									tree={buildTermsTree(termData)}
									multiple
								/>
								{termID && (
									<BaseControl className='arkb-btns--relation'>
										<BaseControl.VisualLabel>
											{__('Relationship of selected terms', 'arkhe-blocks')}
										</BaseControl.VisualLabel>
										{getTermBtnGroup(termIDs, termRelation, 'termRelation')}
									</BaseControl>
								)}
							</>
						)}
					</PanelBody>
				</>
			)}
			<PanelBody
				title={__('Narrowing down by author', 'arkhe-blocks')}
				initialOpen={true}
				className='arkb-panel-postList--author'
			>
				<SelectControl
					value={authorID}
					options={authorsArray}
					onChange={(val) => {
						setAttributes({ authorID: val });
					}}
				/>
			</PanelBody>
		</>
	);
};
