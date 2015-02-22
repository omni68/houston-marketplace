var Header = React.createClass({
	render: function() {
		return (
			<div className="header">
				<Settings settings={this.props.settings}></Settings>
				<span>Westbury/Myerland Trading</span>
				<span>({this.props.posts.length})</span>
				<AjaxLoading></AjaxLoading>
				<a onClick={this.handleFilterSold}>sold filter</a>
			</div>
		);
	}
});