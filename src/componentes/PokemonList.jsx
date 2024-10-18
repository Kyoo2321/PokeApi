import React, { useState, useEffect } from 'react';

const PokemonList = () => {
    const [currentList, setCurrentList] = useState([]);
    const [url, setUrl] = useState("https://pokeapi.co/api/v2/pokemon?limit=6&offset=0");
    const [next, setNext] = useState("");
    const [previous, setPrevious] = useState("");
    const [pokeList, setPokeList] = useState([]);
    const [pokemonData, setPokemonData] = useState([]);

    const handleAnterior = () => {
        previous && setUrl(previous);
    };

    const handleSiguiente = () => {
        setUrl(next);
    };

    const toUpperCase = (text) => {
        return text.toUpperCase();
    };

    useEffect(() => {
        fetch(url)
            .then((resp) => resp.json())
            .then((data) => {
                setCurrentList(data);
                setNext(data.next);
                setPrevious(data.previous);
            });
    }, [url]);

    useEffect(() => {
        if (currentList.results) {
            const urls = currentList.results.map((poke) => poke.url);
            setPokeList(urls);
        }
    }, [currentList]);

    useEffect(() => {
        if (pokeList.length > 0) {
            const fetchPokemonData = async () => {
                const promises = pokeList.map((url) => fetch(url).then((resp) => resp.json()));
                const results = await Promise.all(promises);
                setPokemonData(results);
            };
            fetchPokemonData();
        }
    }, [pokeList]);

    return (
        <div>
            <h1>POKEDEX</h1>
            {currentList.results && (
                <div className='container'>
                    <div className='pokemon'>
                        {pokemonData.map((pokemon) => (
                            <div key={pokemon.name}>
                                <h3>{toUpperCase(pokemon.name)}</h3>
                                <img src={pokemon.sprites?.front_default} alt={pokemon.name} />
                                <p>ID: {pokemon.id}</p>
                                <p>Altura: {pokemon.height} </p>
                                <p>Peso: {pokemon.weight}</p>
                            </div>
                        ))}
                    </div>
                    <div className='botones'>
                        <button onClick={handleAnterior}>Anterior</button>
                        <button onClick={handleSiguiente}>Siguiente</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PokemonList;
