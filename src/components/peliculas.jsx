import datos from '../data/peliculas.json';
function ListaPeliculas() {
    return(
        <div className='bg-gray-50 p-20'>
            <h1 className='text-3xl font-bold text-center text-blue-600 mb-8'>Lista de Peliculas</h1>
            <div className='grid sm:grid-cols-2 md:grid-cols-3 ls:grid-cols-4 gap-6'>
                {datos.peliculas.map(peliculas => (
                    <div className='bg-white shadow-md rounded-2xl p-4' key={peliculas.id}>
                        <img 
                            src={`./${peliculas.imagen}`} 
                            alt={peliculas.titulo} 
                            className='w-full rounded-2xl mb-4 h-120'
                        />
                        <h3 className='text-gray-500 text-2xl mb-5 font-semibold'>{peliculas.titulo}</h3>
                        <p className='text-gray-500 text-sm mt-1'>
                            <span className='font-bold'>Año:</span> {peliculas.año}</p>
                        <p className='text-gray-500 text-sm mt-1'>
                            <span className='font-bold'>Genero:</span> {peliculas.genero}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default ListaPeliculas;