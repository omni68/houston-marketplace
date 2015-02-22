var Comments = React.createClass({
	render: function() {
		var post = this.props.post;
		var comments = this.props.data.map(function(data) {
			return (
				<Comment post={post} data={data} key={data.id}/>
			);
	    });

		return  (
			<div className="comments">{comments}</div>
		);
	}
});

var Comment = React.createClass({
	render: function() {
		return  (
			<div className="comment">
				<div className="commenter">{this.props.data.from.name} ({this.props.data.created_time})</div><div className="message">{this.props.data.message}</div><br/>
			</div>
		);
	}
});