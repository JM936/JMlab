{Array.isArray(categories) &&
  categories.map((cat) => (
    <section key={cat.id}>
      <h2>{cat.name}</h2>
      <p>{cat.description}</p>

      <div>
        {Array.isArray(ensaios) &&
          ensaios
            .filter((ensaio) => ensaio.category === cat.id)
            .map((ensaio) => (
              <article
                key={ensaio.id}
                onClick={() => navigate(`/ensaio/${ensaio.id}`)}
                style={{ cursor: 'pointer' }}
              >
                <h3>{ensaio.title}</h3>
                <p>{ensaio.intro?.substring(0, 80) ?? ''}...</p>
              </article>
            ))}
      </div>
    </section>
  ))}
