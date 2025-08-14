const Navbar = ({ searchTerm, setSearchTerm, onSearch }) => {
  return (
    <header className="bg-gray-900 shadow-lg">
      <div className="container mx-auto px-4 py-4 flex flex-col md:flex-row items-center">
        {/* Logo e links... */}
        <div className="mt-4 md:mt-0 md:ml-auto w-full md:w-auto">
          <div className="flex">
            <input
              type="text"
              placeholder="Buscar ensaios ou artigos..."
              className="px-4 py-2 rounded-l-lg bg-gray-800 text-white w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && onSearch()}
            />
            <button 
              onClick={onSearch}
              className="bg-blue-600 px-4 py-2 rounded-r-lg"
            >
              Buscar
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};