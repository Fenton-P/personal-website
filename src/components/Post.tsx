import post_data from '../posts.json'
import parse from 'html-react-parser';

interface Prop {
    title: string
}

function Post(prop: Prop) {
    let post = getPost(prop.title);
    
    return (
        <>
            <br/>
            <br/>
            <h1 className="text-center">{post.title}</h1>
            <h3 className="second text-center">{post.summary}</h3>
            <br/>
            <br/>
            {post.body.map(para => <><br/>{parse('<p className="text-center p-25 f-30">' + para + '</p>')}</>)}
        </>
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

export default Post;