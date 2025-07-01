import PostView from "./PostView";

function Home({onScreenChange}: {onScreenChange: (element: JSX.Element) => void}) {
    return (
        <>
            <br/>
            <br/>
            <h1 className="text-center">Recent Posts</h1>
            <br/>
            <PostView title="recent" onScreenChange={onScreenChange}/>
        </>
    );
}

export default Home;