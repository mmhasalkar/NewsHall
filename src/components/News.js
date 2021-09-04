import React, { useState, useEffect } from 'react'
import Loader from './Loader';
import NewsItem from './NewsItem'
import PropTypes from 'prop-types'
import InfiniteScroll from 'react-infinite-scroll-component';

const News = (props) => {
    const [articles, setArticles] = useState([])
    const [loading, setLoading] = useState(true)
    const [page, setPage] = useState(1)
    const [totalResult, setTotalResult] = useState(0)

    const updateNewsArticles = async () => {
        setLoading(true)
        props.setProgress(20);

        let url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apiKey}&page=${page}&pageSize=${props.pageSize}`;
        let data = await fetch(url);

        props.setProgress(50);

        let parsedData = await data.json();

        props.setProgress(70);

        setArticles(parsedData.articles)
        setTotalResult(parsedData.totalResults)
        setLoading(false)

        props.setProgress(100);
    }

    useEffect(() => {
        document.title = `${props.category.charAt(0).toUpperCase() + props.category.slice(1)} - NewsHall`
        updateNewsArticles()
        // eslint-disable-next-line
    }, [])

    const fetchMoreData = async () => {
        let url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apiKey}&page=${page + 1}&pageSize=${props.pageSize}`;
        setPage(page + 1)
        let data = await fetch(url);
        let parsedData = await data.json();

        setArticles(articles.concat(parsedData.articles))
        setTotalResult(parsedData.totalResults)
    };

    return (
        <>
            <h1 className="text-center" style={{ margin: '90px 0 35px 0' }}>NewsHall - Top {props.category.charAt(0).toUpperCase() + props.category.slice(1)} Headlines</h1>
            {loading && <Loader />}
            <InfiniteScroll
                dataLength={articles.length}
                next={fetchMoreData}
                hasMore={articles.length < totalResult}
                loader={<Loader />}
            >
                <div className="container">
                    <div className="row">
                        {!loading && articles.map((element) => {
                            return <div key={element.url} className="col-md-4">
                                <NewsItem title={element.title ? element.title : ''} description={element.description ? element.description : ''} author={element.author ? element.author : 'Unknown'} date={element.publishedAt} imageUrl={element.urlToImage} newsUrl={element.url} source={element.source.name} />
                            </div>
                        })}
                    </div>
                </div>
            </InfiniteScroll>
        </>
    )

}

News.defaultProps = {
    country: 'in',
    pageSize: 20,
    category: 'general'
}

News.propTypes = {
    country: PropTypes.string,
    pageSize: PropTypes.number,
    category: PropTypes.string
}

export default News
