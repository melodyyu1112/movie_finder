const Movie = (props) => {
    const { Title, Year, imdbID, Type, Poster } = props.movie;  // ES6 destructuring
  
    return (
      <div className="row my-4">
        <div className="col-5 mb-3">
          <a href={`https://www.imdb.com/title/${imdbID}/`} target="_blank">
            <img src={Poster} className="img-fluid" />
          </a>
        </div>
        <div className="col-7 mb-3 d-flex align-items-center justify-content-center">
          <a href={`https://www.imdb.com/title/${imdbID}/`} target="_blank">
            <h4>{Title}</h4>
            <p>{Type} | {Year}</p>
          </a>
        </div>
        <hr/>
      </div>
    )
  }

class MovieFinder extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        searchTerm: '',
        results: [],
        error: ''
      };
  
      this.handleChange = this.handleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
    }
  
    handleChange(event) {
      this.setState({ searchTerm: event.target.value });
    }
  
    handleSubmit(event) {
        event.preventDefault();
        let { searchTerm } = this.state;
        searchTerm = searchTerm.trim();
        if (!searchTerm) {
            return;
        }
        fetch(`https://www.omdbapi.com/?s=${searchTerm}&apikey=b7da8d63`).then((response) => {
            if (response.ok) {
                // .ok returns true if response status is 200-299
                return response.json();
            }
            throw new Error('Request was either a 404 or 500');
            }).then((data) => {
            if (data.Response === 'False') {
                throw new Error(data.Error);
            }

            if (data.Response === 'True' && data.Search) {
                this.setState({ results: data.Search, error: '' });
            }
            }).catch((error) => {
            this.setState({ error: error.message });
            console.log(error);
            })
    }
  
      render() {
        const { searchTerm, results, error } = this.state;
    
        return (
          <div className="container text-center">
            <div className="row my-3">
                <div className = "col-12 border">
                    <h1 className = "mt-5"> Movie Finder </h1>
                    <div className = "col-12">
                        <h3>OMDB API</h3>
                        <div className = "row">
                        <div className="col-12 my-2">
                            <form onSubmit={this.handleSubmit} className="form-inline mb-4 d-flex justify-content-center">
                                <input
                                    type="text"
                                    className="form-control mr-sm-2"
                                    placeholder="frozen"
                                    value={searchTerm}
                                    onChange={this.handleChange}
                                />
                                <button type="submit" className="btn btn-primary">Submit</button>
                                
                            </form>
                            {(() => {
                            if (error) {
                                return error;
                            }
                            return results.map((movie) => {
                                return <Movie key={movie.imdbID} movie={movie} />;
                            })
                            })()}
                        </div>
                    </div>
                </div>
            </div>
            </div>
          </div>
        )
      }
    }
  
  
  ReactDOM.render(
    <MovieFinder />,
    document.getElementById('root')
  );