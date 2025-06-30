import PostView from "./PostView";

function Home() {
    return (
        <>
            <br/>
            <br/>
            <h1 className="text-center">Recent Posts</h1>
            <br/>
            <PostView title="recent"/>
        </>
    );
}

export default Home;