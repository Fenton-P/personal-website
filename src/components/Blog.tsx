import PostView from "./PostView";
import post_data from '../posts.json';

function Blog({onScreenChange}: {onScreenChange: (element: { id: number; title: string; }) => void}) {
    return (
        <>
            <br/>
            <br/>
            <h1 className="text-center">All Posts</h1>
            
            {getOrderedPosts().map((post) => <><br/><PostView id={post.title} onScreenChange={onScreenChange}/></>)}
        </>
    );
}

function getOrderedPosts() {
    let arr = post_data.posts;

    //temporary sorting algorithm
    let change = true;
    while(change) {
        change = false;
        for(let i = 0;i<arr.length-1;i++) {
            if(Date.parse(arr[i].date) < Date.parse(arr[i+1].date)) {
                swap(arr, i, i+1);
                change = true;
            }
        }
    }

    return arr;
}

function swap<T>(array: T[], i: number, j: number): void {
  if (
    Array.isArray(array) &&
    i >= 0 && j >= 0 &&
    i < array.length && j < array.length
  ) {
    [array[i], array[j]] = [array[j], array[i]];
  }
}

export default Blog;