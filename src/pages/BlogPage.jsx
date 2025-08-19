{isLoadingBlogPosts ? (
  [...Array(3)].map((_, i) => <SkeletonLoader key={i} />)
) : (
  Array.isArray(blogPosts) && blogPosts.map(post => (
    <div key={post.id} onClick={() => navigate(`/blog/${post.id}`)}>
      <h3>{post.title}</h3>
      <p>{post.snippet}</p>
    </div>
  ))
)}
