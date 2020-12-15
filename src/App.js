import React, { useState, useEffect } from 'react'
import { FaSearch } from 'react-icons/fa'
import Photo from './Photo'
const clientID = '?client_id=f7N-c7ynV9x6FAE3c1mP35-_1uRQeFNKMYlRro55XGA'
const mainUrl = `https://api.unsplash.com/photos/`
const searchUrl = `https://api.unsplash.com/search/photos/`

function App() {
  const [loading, setLoading] = useState(false);
  const [photos, setPhotos] = useState([]);
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(0);

  const fetchImages = async () => {
    setLoading(true)
    let url
    const urlPage = `&page=${page}`
    const urlQuery = `&query=${query}`
    if (query) {
      url = `${searchUrl}${clientID}${urlPage}${urlQuery}`
    } else {
      url = `${mainUrl}${clientID}${urlPage}`
    }
    try {
      const response = await fetch(url)
      const data = await response.json()
      setPhotos((oldPhotos) => {
        if (query && page === 1) {
          return data.results
        } else if (query) {
          return [...oldPhotos, ...data.results]
        } else {
          // console.log(data);
          return [...oldPhotos, ...data]
        }
      })
 
      // console.log(data);
      setLoading(false)
    } catch (error) {
      console.log(error)
      setLoading(false)
    }
  }

  useEffect(() => {
    const event = window.addEventListener('scroll', () => {
      if ((!loading && window.innerHeight + window.scrollY) >= document.body.scrollHeight - 2) {
        setPage(oldPage=> oldPage+1)
      }
    })
  
    return  () => { window.removeEventListener('scroll', event)
    }
  }, []);

  useEffect(() => {
    fetchImages()
  },[page, query])

  const handleSubmit = e => {
    e.preventDefault()
    setPage(1)
  }
  return (
    <main>
      <section className="search">
        <form className="search-form">
          <input type="text" className="form-input" placeholder='search' value={query} onChange={(e)=> setQuery(e.target.value)} />
          <button className="submit-btn" type='submit' onClick={handleSubmit}>
            <FaSearch/>
          </button>
        </form>
      </section>
      <section className="photos">
        <div className="photos-center">
          {photos.map((image, index) => {
            return <Photo key={index} {...image}/>
          })}
        </div>
        {loading && <h2 className="loading">Loading...</h2> }
      </section>
    </main>
  )
}

export default App
