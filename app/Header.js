var Header = React.createClass({
	render: function() {
		return (
			<div id="header">
				<button onClick={this.props.toggleFlyout}>MENU</button>
				<h2>Westbury/Myerland Trading</h2>
				<AjaxLoading></AjaxLoading>
			</div>
		);
	}
});