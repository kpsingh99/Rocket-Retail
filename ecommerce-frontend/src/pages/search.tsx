import { useState } from "react"
import ProductCard from "../components/product-card";
import { useCategoriesQuery, useSearchProductsQuery } from "../redux/api/productAPI";
import { CustomError } from "../types/api-types";
import toast from "react-hot-toast";
import { Skeleton } from "../components/loader";
import { CartItem } from "../types/types";
import { UseDispatch, useDispatch } from "react-redux";
import { addToCart } from "../redux/reducer/cartReducer";
const Search = () => {

  const {
    data: CategoriesResponse,
    isLoading: loadingCategories,
    isError,
    error,


  } = useCategoriesQuery("");


  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");
  const [maxPrice, setMaxPrice] = useState(10000000);
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);

  const { isLoading: productLoading, data: searchedData ,
    isError: productIsError, 
    error: productError
  } = useSearchProductsQuery({
    search,
    sort,
    category,
    page,
    price: maxPrice,
  })
  const dispatch = useDispatch();

  const addToCartHandler = (cartItem: CartItem) => {
    if(cartItem.stock < 1) return toast.error("Out of stock !");

    dispatch(addToCart (cartItem));
    toast.success("Added to Cart.");

  };

  const isNextPage = page < 4;
  const isPreviousPage = page > 1;

  if (isError) {
    console.log("there is something wrong.")
    const err = error as CustomError;
    toast.error(err.data.message);
  }
  if(productIsError){
    const err = productError as CustomError;
    toast.error(err.data.message);
  }

  return (
    <div className="product-search-page">
      <aside>
        <h2>Filters</h2>
        <div><h4>Sort</h4>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="">None</option>
            <option value="asc">Price (Low to High)</option>
            <option value="dsc">Price (High to Low) </option>


          </select></div>

        <div><h4>Max Price : {maxPrice || ""}</h4>
          <input
            type="range"
            min={100}
            max={100000}
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
          >
          </input></div>


        <div><h4>Category</h4>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">All</option>
            {
              !loadingCategories && CategoriesResponse?.categories.map((i) => (
                <option key={i} value={i}>{i}</option>
              ))
            }
          </select></div>
      </aside>
      <main>

        <h1>Product</h1>
        <input type="text"
          placeholder="Search by name.."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {
          productLoading ? <Skeleton  lenght={10}/> : (<div className="search-product-list">
            {
              searchedData?.products.map((i) => (
                <ProductCard
                  key={i._id}
                  productId={i._id}
                  name={i.name}
                  price={i.price}
                  stock={i.stock}
                  handler={addToCartHandler}
                  photo={i.photo}
                />
              ))
            }
  
          </div>)
          
        }
        

        {
          searchedData && searchedData.totalPage > 1 && (
            <article>
              <button
                disabled={!isPreviousPage}
                onClick={() => setPage(prev => prev - 1)}>Prev</button>
              <span >
                {page} of {4}
              </span>
              <button disabled={!isNextPage} onClick={() => setPage(next => next + 1)}>Next</button>

            </article>
          )
        }

      </main>
    </div>
  )
}

export default Search
