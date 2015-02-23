var Header = React.createClass({
	render: function() {
		return (
			<div id="header">
				<button onClick={this.props.toggleFlyout}>MENU</button>
				<span>Westbury/Myerland Trading</span>
				<span>({this.props.posts.length})</span>
				<AjaxLoading></AjaxLoading>
				<a onClick={this.handleFilterSold}>sold filter</a>
			</div>
		);
	}
});