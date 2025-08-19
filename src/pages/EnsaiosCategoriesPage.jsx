{Array.isArray(categories) && categories.map(cat => (
  <div key={cat.id}>
    <h2>{cat.name}</h2>
    <p>{cat.description}</p>

    <div>
      {Array.isArray(ensaios) &&
        ensaios.filter(e => e.category === cat.id).map(ensaio => (
          <div key={ensaio.id} onClick={() => navigate(`/ensaio/${ensaio.id}`)}>
            <h3>{ensaio.title}</h3>
            <p>{ensaio.intro?.substring(0, 80)}...</p>
          </div>
        ))}
    </div>
  </div>
))}
