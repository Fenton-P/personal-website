import { Component, ReactElement } from 'react';
import post_data from '../posts.json'
import parse from 'html-react-parser';
import PointOnPolygon from './PointOnPolygon';
import TriangulationExample from './TriangulationExample';

function customParse(html: string) {

    for(let i = 0;i<html.length-1;i++) {
        if(html[i] == '^' && html[i+1] == '^') {
            let end = html.indexOf('^^', i+2);
            if(end == -1) continue;

            let tag = html.substring(i+2, end).split(", ");
            let beginning = html.substring(0, i);
            let ending = html.substring(end+2, html.length);
            let fin = '<p className="text-center p-25 f-30">' + beginning + '</p>';
            let fin2 = '<p className="text-center p-25 f-30">' + ending + '</p>';
            let fin3 = parse(fin);
            let fin4 = parse(fin2);
            
            switch(tag[0]) {
                case "PointOnPolygon":
                    return <>{fin3} <PointOnPolygon /> {fin4}</>;
                case "Image":
                    if(tag.length < 3) return <p>NO SOURCE OR DESCRIPTION FOUND</p>;
                    let src = tag[1];
                    let description = tag[2];

                    return (
                        <>
                            {fin3}
                            <div className="text-center">
                                <img src={src} alt="Error" className="w-50"/>
                                <p className="p-25 second">{description}</p>
                            </div>
                            {fin4}
                        </>
                    );
                case "Link":
                    if(tag.length < 3) return <p>NO LINK OR DESCRIPTION FOUND</p>;
                    let link = tag[1];
                    let linkDescription = tag[2];

                    let fin1 = '<p className="text-center p-25 f-30">' + beginning + " <a href='" + link + "'>" + linkDescription + "</a>" + ending + '</p>';

                    return parse(fin1);
                case "TriangulationExample":
                    return <>{fin3}<TriangulationExample/>{fin4}</>
            }
        }
    }

    return parse('<p className="text-center p-25 f-30">' + html + '</p>');
}

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
            {post.body.map(para => <><br/>{customParse(para)}</>)}
            <br/>
            <br/>
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