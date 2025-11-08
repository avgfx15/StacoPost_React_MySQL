import React from 'react';

// | Recent Post Item Component
import RecentPostItem from './RecentPostItem';

import InfiniteScroll from 'react-infinite-scroll-component';

// | Import TanStackQuery
import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchAllPostsAction } from '../Actions/PostActions';
import { useSearchParams } from 'react-router';

// & Recent Posts Component
const RecentPostsComponent = () => {
  // % SearchParams Hook from react-router-dom
  const [searchParams] = useSearchParams();

  // ` Configure TanStack Query For Data

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    // isFetching,
    // isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ['posts', searchParams.toString()],
    queryFn: ({ pageParam = 1 }) =>
      fetchAllPostsAction(pageParam, searchParams),
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages) =>
      lastPage.hasMore ? pages.length + 1 : undefined,
  });

  const allPosts = data?.pages.flatMap((page) => page.allPost) || [];

  if (!allPosts || allPosts.length === 0) {
    return (
      <div className='flex flex-col justify-center items-center gap-4 lg:text-2xl w-9/12 font-bold h-full'>
        No posts found
      </div>
    );
  }

  if (status === 'loading') return 'Loading...';

  if (status === 'error') return 'Something went wrong!';

  if (error) return 'An error has occurred: ' + error.message;

  // ^ Render Recent Posts Items
  return (
    <div className='flex flex-col gap-12 mb-5'>
      <InfiniteScroll
        dataLength={allPosts.length} //This is important field to render the next data
        next={fetchNextPage}
        hasMore={!!hasNextPage}
        loader={<h4>Loading.More Posts...</h4>}
        endMessage={
          <p style={{ textAlign: 'center' }}>
            <b>All posts loaded!</b>
          </p>
        }
      >
        {allPosts.map((post) => (
          <RecentPostItem key={post.id} post={post} />
        ))}
      </InfiniteScroll>
    </div>
  );
};

//~ Recent Post Item Export
export default RecentPostsComponent;
