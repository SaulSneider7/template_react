import datos from '../data/peliculas.json';
function ListaPeliculas() {
    return(
        <div>
            {datos.peliculas.map(peliculas => (
                <div key={peliculas.id}>
                    <h3>{peliculas.titulo}</h3>
                    <p>Año: {peliculas.año}</p>
                    <p>Genero: {peliculas.genero}</p>
                </div>
            ))}
        </div>
    )
}

export default ListaPeliculas;