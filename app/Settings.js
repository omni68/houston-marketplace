var Settings = React.createClass({
	render: function() {
		return (
			<div id="settings">
				<Statuses statuses={this.props.statuses}></Statuses>
			</div>
		);
	}
});