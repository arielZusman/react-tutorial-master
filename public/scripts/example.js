var data = [
  {id: 1, author: "Pete Hunt", text: "This is one comment"},
  {id: 2, author: "Jordan Walke", text: "This is *another* comment"}
];

let CommentBox = React.createClass({
  loadCommentsFromServer: function() {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      cache: false,
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  // executes exactly once during the lifecycle of the component
  //  and sets up the initial state of the component.
  getInitialState: function() {
    return {data: []}
  },
  // called automatically by React after a component is rendered for the first time
  componentDidMount: function() {
    this.loadCommentsFromServer()
    setInterval(this.loadCommentsFromServer, this.props.pollInterval)
  },
  render: function() {
    return (
      <div className="CommentBox">
        <h1>Comments</h1>
      <CommentList data={this.state.data}/>
        <CommentForm/>
      </div>
    )
  }
})

let CommentList = React.createClass({
    render: function () {
      var commentNodes = this.props.data.map((comment) => {
        return (
          <Comment author={comment.author} key={comment.id}>
            {comment.text}
          </Comment>
        )
      })
      return (
        <div className="CommentList">
          {commentNodes}
        </div>
        )
    }
})

let CommentForm = React.createClass({
    getInitialState: function () {
        return {author: '', text: ''}
    },
    handleAuthorChange: function (e) {
        this.setState({author: e.target.value})
    },
    handleTextChange: function (e) {
        this.setState({text: e.target.value})
    },
    handleSubmit: function (e) {
        e.preventDefault()
        const author = this.state.author.trim()
        const text = this.state.text.trim()
        if(!text || !author) {
            return
        }
        // clears the form after submit
        this.setState({author: '', text: ''})
    },
    render: function () {
      return (
        <form className="CommentForm" onSubmit={this.handleSubmit}>
            <input type="text"
                   placeholder="Your name"
                   value={this.state.author}
                   onChange={this.handleAuthorChange}
            />
            <input type="text"
                   placeholder="Say something..."
                   value={this.state.text}
                   onChange={this.handleTextChange}
            />
            <input type="submit" value="Post"/>
        </form>
      )
    }
})

let Comment = React.createClass({
    rawMarkup: function () {
      let md = new Remarkable()
      let rawMarkup = md.render(this.props.children.toString())
      return {__html:rawMarkup}
    },
    render: function () {
      return (
        <div className="comment">
          <h2 className="commentAuthor">
            {this.props.author}
          </h2>
          <span dangerouslySetInnerHTML={this.rawMarkup()}/>
        </div>
      )
    }
})

ReactDOM.render(
  <CommentBox url="/api/comments" pollInterval={2000}/>,
  document.getElementById('content')
)
