import PostView from "./PostView";

function Home({onScreenChange}: {onScreenChange: (element: {id: number, title: string}) => void}) {
    return (
        <>
            <br/>
            <br/>
            <h1 className="text-center">Recent Posts</h1>
            <br/>
            <PostView id="recent" onScreenChange={onScreenChange}/>
        </>
    );
}

export default Home;