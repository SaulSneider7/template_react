import datos from '../data/peliculas.json';
function ListaPeliculas() {
    return(
        <div className='bg-gray-100 p-20'>
            <h1 className='text-center text-3xl fond-bold text-blue-600 mb-8'>Lista de Peliculas</h1>
            <div className='grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
                {datos.peliculas.map(peliculas => (
                    <div key={peliculas.id}
                        className='bg-white shadow-md p-4 rounded-2xl'
                        >
                        <img 
                            src={`./${peliculas.imagen}`} 
                            alt={peliculas.titulo} 
                            className='w-full rounded-2xl mb-4'
                            />
                        <h3 className='text-lg font-semibold mb-2'>{peliculas.titulo}</h3>
                        <p className='text-gray-500 font-semibold'>Año: {peliculas.año}</p>
                        <p className='text-gray-500 font-semibold'>Genero: {peliculas.genero}</p>
                        <p className='text-gray-500 font-semibold mt-5'>Sinopsis: {peliculas.sinopsis}</p>
                        <p className='text-gray-800 font-semibold mt-5'>Calificacion: {peliculas.calificacion}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default ListaPeliculas;