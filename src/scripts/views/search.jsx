var React = require('react');
var Item = require('./item.jsx');

var toHash = function(str) {
  var hash = 0, i, chr;
  if (str.length == 0) return hash;
  for (i = 0; i < str.length; i++) {
    chr = str.charCodeAt(i);
    hash = ((hash<<5)-hash)+chr;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash;
}

var Search = React.createClass({

  getInitialState: function(){
    return { 
      searchString: '',
      libraries: []
    };
  },

  componentDidMount: function() {

    var self = this;
    var url = this.props.jsonURL;
    var request = new XMLHttpRequest();

    request.open('GET', url, true);
    request.onload = (function(){
      if (request.status >= 200 && request.status < 400) {
        var result = JSON.parse(request.responseText);              
        var libraries = result.map(function(p){

          return { 
            name: p.name, 
            url: p.url,
            tags: p.tags,
            image: p.image,
            desc: p.description
          };

        });

        self.setState({ libraries: libraries });

      } else {
        // We reached our target server, but it returned an error
      }       
    }).bind(this);

    request.onerror = function() {
      // There was a connection error of some sort
    };

    request.send();

  },

  handleChange: function(e){
    this.setState( {searchString:e.target.value} );
  },

  handleThatEvent: function(e){
    this.setState( {searchString: '#' + e.target.innerHTML } );
  },

  render: function() {

    var that = this,
        libraries = this.state.libraries,
        searchString = this.state.searchString.trim().toLowerCase(),
        re = /^#/,
        re2 = /^(#author|#news|#hola)/;


    if( searchString.length > 0 && !re.test(searchString) ){
      // Searching by string
      libraries = libraries.filter(function(l){
        return l.name.toLowerCase().match( searchString );
      });
    } 
    else if( searchString.length > 0 && re.test(searchString) ){
      // Searching by tags
      libraries = libraries.filter(function(l){
        return l.tags.indexOf( searchString.replace(re, '') ) !== -1;
      });
    }


    return (
      <div className='container text--center'>
        <div className='main-search top'>
          <label>
            <svg className="search-icon" 
              dangerouslySetInnerHTML={{__html: "<use xlink:href='assets/img/symbols.svg#icon-search'/>"}}>
            </svg>
            <input type="text" value={this.state.searchString} onChange={this.handleChange} placeholder="Search..." />
          </label>
        </div>
          <div className='items'> 
            { libraries.map(function(l){
              return <Item 
                  title={l.name} 
                  desc={l.desc} 
                  link={l.url} 
                  tags={l.tags} 
                  key={ toHash(l.name) } 
                  image={l.image} 
                  onSomeEvent={that.handleThatEvent}
                  ></Item>
            }) }
          </div>
        </div>
    );

  }

});

module.exports = Search;