import React from "react";
import Card from './Card';
import SearchBar from './SearchBar';
import { useSearchParams, useLocation } from "react-router-dom";

export default function Store(props) {
  const [searchParams, setSearchParams] = useSearchParams()
  const location = useLocation();
  const [sortValue, setSortValue] = React.useState('');
  const [hideOutOfStock, setHideOutOfStock] = React.useState(false);
  const [searchInput, setSearchInput] = React.useState('');
  const [itemsPerPage, setItemsPerPage] = React.useState(10);
  const [currentPage, setCurrentPage] = React.useState(1);

  const productsPerPageOptions = [5, 10, 20];

  const [items, setItems] = React.useState([]);

  function updateFiltersFromURL() {
    const params = new URLSearchParams(location.search);

    const newSortValue = params.get('sort') || '';
    const newHideOutOfStock = params.get('hideOutOfStock') === 'true';
    const newSearchInput = params.get('search') || '';
    const newItemsPerPage = parseInt(params.get('itemsPerPage')) || 10;
    const newPage = parseInt(params.get('page')) || 1;

    setSortValue(newSortValue);
    setHideOutOfStock(newHideOutOfStock);
    setSearchInput(newSearchInput);
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(newPage);
  }

  React.useEffect(() => {
    updateFiltersFromURL();
    applyFilters();
  }, [location.search]);

  React.useEffect(() => {
    applyFilters();
  }, [sortValue, hideOutOfStock, itemsPerPage, currentPage])

  React.useEffect(() => {
    setItems(generateItems());
  }, [props.products, props.addedToCartMap, itemsPerPage, currentPage])

  React.useEffect(() => {
    props.resetAddedToCartMap();
  }, [])

  function handleSortChange(e) {
    setSortValue(e.target.value);
    handleFilterChange('sort', e.target.value)
  }

  function handleStockFilter(e) {
    setHideOutOfStock(e.target.checked);
    handleFilterChange('hideOutOfStock', e.target.checked.toString());
  }

  function handleItemsPerPageChange(e) {
    const newItemsPerPage = parseInt(e.target.value);
    setItemsPerPage(newItemsPerPage);
    handleFilterChange('itemsPerPage', newItemsPerPage.toString());
  }

  function applyFilters() {
    props.setProducts([...props.originalProducts]);

    if (sortValue === 'a-z') {
      props.setProducts(prevProducts => prevProducts.sort((a, b) => a.title.localeCompare(b.title)));
    } else if (sortValue === 'z-a') {
      props.setProducts(prevProducts => prevProducts.sort((a, b) => b.title.localeCompare(a.title)));
    } else if (sortValue === 'priceHigh-Low') {
      props.setProducts(prevProducts => prevProducts.sort((a, b) => b.price - a.price));
    } else if (sortValue === 'priceLow-High') {
      props.setProducts(prevProducts => prevProducts.sort((a, b) => a.price - b.price));
    }

    if (hideOutOfStock) {
      props.setProducts(prevProducts => prevProducts.filter(product => product.inStock));
    }

    if (searchInput.length > 0) {
      props.setProducts(prevProducts => prevProducts.filter(product => product.title.toLowerCase().startsWith(searchInput.toLowerCase())));
    }

    const itemsPerPage = parseInt(searchParams.get('itemsPerPage')) || 10;
    const maxPages = (props.products.length === 0) ? 1 : Math.ceil(props.products.length / itemsPerPage);

    if (currentPage > maxPages) {
        setCurrentPage(maxPages);
        setSearchParams(prevParams => {
            prevParams.set('page', maxPages.toString());
            return prevParams;
        });
    }
  }

  function handleFilterChange(key, value) {
    setSearchParams(prevParams => {
      if (value === null || value === '') {
        prevParams.delete(key)
      } else {
        prevParams.set(key, value)
      }

      if (key === 'page') {
        const currentPage = parseInt(value) || 1;
        if (currentPage === 1) {
            prevParams.delete('page');
        } else {
            prevParams.set('page', currentPage.toString());
        }
      }

      if (key === 'itemsPerPage') {
        const currentItemsPerPage = parseInt(searchParams.get('itemsPerPage')) || 10;
        const totalItems = items.length;
        const newItemsPerPage = parseInt(value) || 10;
        const currentPage = parseInt(searchParams.get('page')) || 1;

        let newPage = Math.ceil((currentPage - 1) * currentItemsPerPage / newItemsPerPage) + 1;

        const totalPages = Math.ceil(totalItems / newItemsPerPage);
        newPage = Math.min(newPage, totalPages);

        if (newPage === 1) {
            prevParams.delete('page');
        } else {
            prevParams.set('page', newPage.toString());
        }

        if (newItemsPerPage === 10) {
            prevParams.delete('itemsPerPage');
        }
      }

      if (key === 'hideOutOfStock') {
        setHideOutOfStock(value === 'true');
        if (value === 'false') prevParams.delete('hideOutOfStock');
        const newPage = parseInt(searchParams.get('page')) || 1;
        setCurrentPage(newPage);
      }

      return prevParams
    })
  }

  function generateItems() {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const slicedProducts = props.products.slice(startIndex, endIndex);

    return slicedProducts.map(product => (
      <Card
        key={product.id}
        id={product.id}
        title={product.title}
        url={product.url}
        description={product.description}
        price={product.price}
        inStock={product.inStock}
        addToCart={props.addToCart}
        removeFromCart={props.removeFromCart}
        quantity={props.quantity}
        upQuantity={props.upQuantity}
        downQuantity={props.downQuantity}
        filters={{ 
            sort: sortValue, 
            hideOutOfStock: hideOutOfStock, 
            search: searchInput,
            page: currentPage,
            itemsPerPage: itemsPerPage
        }}
        addedToCart={props.addedToCartMap[product.id]}
      />
    ));
  }

  function handlePageChange(newPage) {
    setCurrentPage(newPage);
    handleFilterChange('page', newPage.toString());
  }

  const totalPages = Math.ceil(props.products.length / itemsPerPage);

  return (
    <div>
      <div className="storeHeader">
      <div className="storeTitle">
        <h1>Store</h1>
      </div>
      <div className="storeFilters">
        <SearchBar
          applyFilters={applyFilters}
          searchInput={searchInput}
          setSearchInput={setSearchInput}
          handleFilterChange={handleFilterChange}
        />
        <div className="filter">
          <label>Sort by:</label>
          <select value={sortValue} onChange={handleSortChange}>
            <option value="">-</option>
            <option value="a-z">Product name A-Z</option>
            <option value="z-a">Product name Z-A</option>
            <option value="priceLow-High">Price ascending</option>
            <option value="priceHigh-Low">Price descending</option>
          </select>
        </div>
        <div className="filter">
          <label>Only show products in stock</label>
          <input type="checkbox" checked={hideOutOfStock} onChange={handleStockFilter}></input>
        </div>
        <div className="filter">
          <label>Show per page:</label>
          <select value={itemsPerPage} onChange={handleItemsPerPageChange}>
            {productsPerPageOptions.map(option => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
    <div className="storeCards">{items}</div>
    {totalPages > 1 && (
      <div className="pagination">
        <button
          className="pagination-btn"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          &lt; Prev
        </button>
        {Array.from({ length: totalPages }, (_, index) => index + 1).map(pageNumber => (
          <button
            key={pageNumber}
            className={`pagination-btn ${pageNumber === currentPage ? 'active' : ''}`}
            onClick={() => handlePageChange(pageNumber)}
          >
            {pageNumber}
          </button>
        ))}
        <button
          className="pagination-btn"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next &gt;
        </button>
      </div>
    )}
  </div>
  );
}

