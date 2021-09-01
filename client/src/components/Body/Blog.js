import '../../index.css';
import httpCommon from '../../http-common';
import React, { useEffect, useState } from "react";
import $ from 'jquery';

function Blog() {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  var [posts, setposts] = useState([{ name: '', image: '' }, { name: '', image: '' }, { name: '', image: '' }]);

  const setpostid = (id) => {
    httpCommon.get('/blog/' + id)
      .then(
        (result) => {
          setIsLoaded(true);
          setposts(result.data);
        },
        (error) => {
          setIsLoaded(true);
          setError(error);
        }
      )
  }

  useEffect(() => {
    httpCommon.get('/blog/all')
      .then(
        (result) => {
          setIsLoaded(true);
          setposts(result.data);
        },
        (error) => {
          setIsLoaded(true);
          setError(error);
        }
      )
  }, [])

  if (error) {
    return <div>Error: {error.message}</div>;
  } else {
    return (
      <div>
        <div class="container">
          <div class="row">
            {posts.length > 1 && posts.map(post => (

              <div class="col-sm-4 box" >
                <div style={{ backgroundColor: '#f1f1f1' }}>
                  <div>
                    <h3>{post.name}</h3>
                    <a onClick={() => setpostid(post.id)}>
                      {post.image != '' && <img src={post.image} width="355px" height="200px" />}
                      {post.image == '' && <div style={{ paddingTop: '200px', paddingLeft: '355px' }} />}
                    </a></div>
                </div>
              </div>
            ))}
            
            {posts.length == 1 && posts.map(post => (
              <div>
                <div class="col-sm-2"></div>
                <div class="thumbnail text-center col-sm-8">
                  <h1>{post.name}</h1>
                  <img src={post.image} width="766px" height="431px" />
                  <h3 style={{ color: 'grey' }}>Posted by {post.author} on {post.date.
                    replace(/T/, ' ').replace(/\..+/, '').replace(/-/g, '/')}</h3>
                  <p>{post.message}</p>
                </div>
                <div class="col-sm-2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
}

export default Blog;