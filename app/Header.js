var Header = React.createClass({
	render: function() {
		return (
			<div id="header">
				<div id="settings-icon">
					<a onClick={this.props.toggleFlyout}>
						<span></span>
						<span></span>
						<span></span>
					</a>
				</div>
				<h2>Westbury/Myerland Trading</h2>
				<AjaxLoading></AjaxLoading>
			</div>
		);
	}
});