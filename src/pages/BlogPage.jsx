{isLoadingBlogPosts ? (
  Array.from({ length: 3 }, (_, i) => <SkeletonLoader key={i} />)
) : (
  Array.isArray(blogPosts) && blogPosts.length > 0 ? (
    blogPosts.map(post => (
      <div key={post.id} onClick={() => navigate(`/blog/${post.id}`)}>
        <h3>{post.title}</h3>
        <p>{post.snippet}</p>
      </div>
    ))
  ) : (
    <p>Nenhuma postagem encontrada.</p>
  )
)}
