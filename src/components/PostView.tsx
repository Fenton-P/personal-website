import post_data from '../posts.json';
import Post from './Post';


function PostView({title, onScreenChange}: {title: string, onScreenChange: (element: JSX.Element) => void}) {
    let post = getPost(title);

    return (
        <div className="round bg-dark bordered w-75 centered padded">
            <h3 className="over inline toPost" onClick={() => onScreenChange(<Post title={post.title}/>)}>{post.title}</h3>
            <h3 className="w-5 inline text-center">-</h3>
            <h5 className="second inline">{post.summary}</h5>
        </div>
    )
}

function getPost(title: string) {
    if(title == "recent") {
        let mostRecent = post_data.posts[0];

        for(let i = 1;i<post_data.posts.length;i++) {
            if(Date.parse(mostRecent.date) < Date.parse(post_data.posts[i].date)) {
                mostRecent = post_data.posts[i];
            }
        }

        return mostRecent;
    }

    for(let i = 0;i<post_data.posts.length;i++) {
        if(post_data.posts[i].title == title) return post_data.posts[i];
    }

    return post_data.posts[0];
}

export default PostView;