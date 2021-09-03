import React, { Component } from 'react'
import Loader from './Loader';
import NewsItem from './NewsItem'
import PropTypes from 'prop-types'

export class News extends Component {

    static defaultProps = {
        country: 'in',
        pageSize: 20,
        category: 'general'
    }

    static propTypes = {
        country: PropTypes.string,
        pageSize: PropTypes.number,
        category: PropTypes.string
    }

    constructor(props) {
        super(props);

        this.state = {
            articles: [],
            loading: true,
            page: 1,
            totalResults: 0
        }

        document.title = `${this.props.category.charAt(0).toUpperCase() + this.props.category.slice(1)} - NewsHall`
    }

    async updateNewsArticles() {
        this.setState({loading: true})
        let url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=4d34a09cf8d8405eb176dd3be5e00526&page=${this.state.page}&pageSize=${this.props.pageSize}`;
        let data = await fetch(url);
        let parsedData = await data.json();
        this.setState({articles: parsedData.articles, totalResults: parsedData.totalResults, loading: false})
    }

    async componentDidMount() {
        this.updateNewsArticles()
    }

    handleNextClick = async () => {
        this.setState({page: this.state.page + 1})
        this.updateNewsArticles()
    }

    handlePrevClick = async () => {
        this.setState({page: this.state.page - 1})
        this.updateNewsArticles()
    }

    render() {
        return (
            <div className="container my-3">
                <h1 className="text-center" style={{margin: '35px 0px'}}>NewsHall - Top {this.props.category.charAt(0).toUpperCase() + this.props.category.slice(1)} Headlines</h1>
                {this.state.loading && <Loader/>}
                <div className="row">
                    {!this.state.loading && this.state.articles.map((element) => {
                        return <div key={element.url} className="col-md-4">
                            <NewsItem title={element.title ? element.title : ''} description={element.description ? element.description : ''} author={element.author ? element.author : 'Unknown'} date={element.publishedAt} imageUrl={element.urlToImage} newsUrl={element.url} source={element.source.name}/>
                        </div>
                    })}
                </div>
                <div className="d-flex justify-content-between">
                    <button disabled={this.state.page <= 1} className="btn btn-dark" onClick={this.handlePrevClick}>&larr; Previous</button>
                    <button disabled={this.state.page + 1 > Math.ceil(this.state.totalResults/this.props.pageSize)} className="btn btn-dark" onClick={this.handleNextClick}>Next &rarr;</button>
                </div>
            </div>
        )
    }
}

export default News
