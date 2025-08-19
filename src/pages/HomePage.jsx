{Array.isArray(categories) && categories.map(cat => (
  <div key={cat.id} onClick={() => navigate(`/ensaios/${cat.id}`)}>
    <h3>{cat.name}</h3>
    <p>{cat.description}</p>
  </div>
))}

{Array.isArray(ensaios) && ensaios.slice(0, 3).map(ensaio => (
  <div key={ensaio.id} onClick={() => navigate(`/ensaio/${ensaio.id}`)}>
    <h3>{ensaio.title}</h3>
    <p>{ensaio.intro?.substring(0, 100)}...</p>
  </div>
))}

{Array.isArray(blogPosts) && blogPosts.slice(0, 3).map(post => (
  <div key={post.id} onClick={() => navigate(`/blog/${post.id}`)}>
    <h3>{post.title}</h3>
    <p>{post.snippet}</p>
  </div>
))}
