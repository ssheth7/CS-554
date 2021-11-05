import React, { useState, useEffect } from 'react';
import ReactPaginate from 'react-paginate';
import axios from 'axios'
import '../App.css';
import Error from './Error'
import { Link } from 'react-router-dom';


const {generatePageUrl} = require('../generateUrl');


const SeriesPages = (props) => {
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [SeriesData, setSeriesData] = useState(undefined);
  const [TotalPages, setTotalPages] = useState(undefined);
  
  function handlePageClick({ selected: currentPage }) {
    props.history.push(`/series/page/${currentPage}`);
  }

  function buildAriaLabels(pageIndex, selected) {
    if (selected) {
      return "You are on page " + pageIndex;
    }
    return "Go to page" + pageIndex;
  }

  useEffect(() => {
    async function getSeries() {
      try {
        let page = Number.parseInt(props.match.params.id);
        const {data} = await axios.get(generatePageUrl("series", page));
        setCurrentPage(page);
        setTotalPages(Math.floor(data.data.total / 100));
        setSeriesData(data.data.results);
        setLoading(false);
      } catch (e) {
        return Error;
      } 
    }
      getSeries();
  }, [props.match.params.id]);


  let seriesList = SeriesData && SeriesData.map((series) => {
    let link = "/series/" + series.id;
    return (
      <Link to={link} key={series.resourceURI}>
        {series.title} <br></br>
      </Link>
)
  });
  

  if (loading) {
    return (
      <p>Loading...</p>
    );
  } else {
    return (
      <div>
        <h1> All the Marvel Series</h1>
        <ReactPaginate
          previousLabel={'previous'}
          nextLabel={'next'}
          breakLabel={'Expand'}
          pageCount={TotalPages}
          marginPagesDisplayed={1}
          initialPage = {currentPage}
          pageRangeDisplayed={3}
          onPageChange={handlePageClick}
          containerClassName={'pagination'}
          previousLinkClassName={"pagination__link"}
          nextLinkClassName={'pagination__link'}
          activeClassName={'pagination__link--active'}
          disabledClassName={'pagination__link--disabled'}
          ariaLabelBuilder={buildAriaLabels}
        />
        <ul>
          { seriesList }
        </ul>
      </div>
    ); 
  }
};

export default SeriesPages;
