import React, { useState, useEffect } from 'react';
import ReactPaginate from 'react-paginate';
import axios from 'axios'
import '../App.css';
import Error from './Error'
import { Link } from 'react-router-dom';

const {generatePageUrl} = require('../generateUrl');


const CharactersPages = (props) => {
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [CharactersData, setCharactersData] = useState(undefined);
  const [TotalPages, setTotalPages] = useState(undefined);
  
  function handlePageClick({ selected: currentPage }) {
    props.history.push(`/characters/page/${currentPage}`);
  }

  function buildAriaLabels(pageIndex, selected) {
    if (selected) {
      return "You are on page " + pageIndex;
    }
    return "Go to page" + pageIndex;
  }

  useEffect(() => {
    async function getCharacters() {
      try {
        let page = Number.parseInt(props.match.params.id);
        const {data} = await axios.get(generatePageUrl("characters", page));
        setCurrentPage(page);
        setTotalPages(Math.floor(data.data.total / 100));
        setCharactersData(data.data.results);
        setLoading(false);
      } catch (e) {
        return Error;
      } 
    }
      getCharacters();
  }, [props.match.params.id]);


  let charactersList = CharactersData && CharactersData.map((character) => {
    let link = "/characters/" + character.id;
    return (
            <Link to={link} key={character.name}>
                  {character.name} <br></br>
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
        <h1> All the Marvel Characters</h1>
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
          { charactersList }
        </ul>
      </div>
    ); 
  }
};

export default CharactersPages;
