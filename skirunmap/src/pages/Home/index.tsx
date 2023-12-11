import {
  DocumentData,
  QueryOrderByConstraint,
  collection,
  getDocs,
  orderBy,
  query,
  where
} from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { db } from '../../auth/CloudStorage'
import SearchBar from '../../components/SearchBar'

const Home = () => {
  const [allRoutes, setAllRoutes] = useState<DocumentData[]>([])
  const [hasFilter, setHasFilter] = useState(false)
  const [filter, setFilter] = useState<string>('All')

  const handleFilterIconClick = () => {
    setHasFilter((prev) => !prev)
  }

  const handleFilterSectionMouseLeave = () => {
    setHasFilter(false)
  }

  const handleFilterClick = (filter: string) => {
    setFilter(filter)
  }

  useEffect(() => {
    console.log(filter)
    const filterOptions: Record<string, QueryOrderByConstraint | null> = {
      All: null,
      Newest: orderBy('createTime', 'desc'),
      'Most likes': orderBy('likeCount', 'desc'),
      'Most views': orderBy('viewCount', 'desc')
    }

    const getRoutes = async () => {
      let q = query(
        collection(db, 'routes'),
        where('isSubmitted', '==', true),
        where('isPublic', '==', true)
      )

      if (filter) {
        const order = filterOptions[filter]
        if (order) {
          q = query(q, order)
        }
      }

      if (q) {
        const querySnapshot = await getDocs(q)
        const routeDocData: DocumentData[] = []
        querySnapshot.forEach((doc) => {
          routeDocData.push(doc.data())
        })
        setAllRoutes(routeDocData)
      }
    }

    getRoutes()
  }, [filter])

  return (
    <div className='flex w-full flex-col items-center'>
      <div className='home-bg-image flex h-[600px] w-full justify-center'>
        <div className='mt-36 flex h-max w-max flex-col items-center'>
          <p className='mb-2 w-max text-3xl font-bold'>Find routes</p>
          <SearchBar />
        </div>
      </div>
      <div className='flex w-full flex-col items-center p-8'>
        <div className='mb-2 flex w-full justify-between'>
          <p className='text-3xl font-bold'>{filter} Routes</p>
          <div
            className='relative flex items-center gap-2'
            onClick={handleFilterIconClick}
            onMouseLeave={handleFilterSectionMouseLeave}
          >
            <p className='text-xl font-bold'>filter</p>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
              className='h-full w-6 cursor-pointer text-gray-600'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d='M4 6h16M6 12h12M8 18h8'
              />
            </svg>
            {hasFilter && (
              <div className='absolute right-0 top-8 flex w-24 flex-col items-center rounded-md bg-white pb-2 pt-2 shadow-lg'>
                <button
                  className={`w-full cursor-pointer hover:bg-zinc-100 ${
                    filter === 'All' && 'font-bold'
                  }`}
                  onClick={() => handleFilterClick('All')}
                >
                  All
                </button>
                <button
                  className={`w-full cursor-pointer hover:bg-zinc-100 ${
                    filter === 'Newest' && 'font-bold'
                  }`}
                  onClick={() => handleFilterClick('Newest')}
                >
                  Newest
                </button>
                <button
                  className={`w-full cursor-pointer hover:bg-zinc-100 ${
                    filter === 'Most likes' && 'font-bold'
                  }`}
                  onClick={() => handleFilterClick('Most likes')}
                >
                  Most Likes
                </button>
                <button
                  className={`w-full cursor-pointer hover:bg-zinc-100 ${
                    filter === 'Most views' && 'font-bold'
                  }`}
                  onClick={() => handleFilterClick('Most views')}
                >
                  Most Views
                </button>
              </div>
            )}
          </div>
        </div>
        <div className='mb-6 w-full border border-zinc-300' />
        <div className='flex w-fit flex-wrap gap-4'>
          {allRoutes.map((map, index) => (
            <Link
              key={index}
              to={`/route/${map.routeID}`}
              className='h-48 w-48 cursor-pointer rounded-2xl bg-zinc-300 p-4'
            >
              <p>Title: {map.routeTitle}</p>
              <p>User: {map.username}</p>
              <p>Tag: {map.tags}</p>
              <p>Snow Buddy: {map.snowBuddies}</p>
              <p>LikeCount: {map.likeCount}</p>
              <p>viewCount: {map.viewCount}</p>
              <div className='flex gap-1'>
                {map.spots[0].imageUrls.map((url: string, index: number) => (
                  <img key={index} src={url} alt={`Image ${index}`} className='h-auto w-6' />
                ))}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Home
