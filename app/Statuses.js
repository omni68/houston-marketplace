var Statuses = React.createClass({
	render: function() {
		return (
			<ul>
				<li>{this.props.statuses.available}</li>
				<li>{this.props.statuses.pending}</li>
				<li>{this.props.statuses.sold}</li>
			</ul>
		);
	}
});