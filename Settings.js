var Settings = React.createClass({
	getSettingsDOM: function() {
		return this.props.settings.map(function(setting) {
			return (<Setting key={setting.id} setting={setting}></Setting>);
		});
	},
	render: function() {
		var settings = this.getSettingsDOM();
		return (
			<div id="settings">
				<ul>
					<li>{settings}</li>
				</ul>
			</div>
		);
	}
});

var Setting = React.createClass({
	render: function() {
		return (
			<div className="setting">{this.props.setting.name}</div>
		);
	}
});