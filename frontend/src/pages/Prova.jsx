import React, {useEffect, useState} from "react";
import TournamentCard from "../components/TournamentCard.jsx";

function Prova(){
    const [tournaments, setTournaments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const API_URL= 'http/localhost:3001';

    useEffect(()=>{
        const fetchTournaments = async()=> {
           const data = JSON.parse(localStorage.getItem("user"))._id
            console.log(data)
            try {
                const response = await fetch(`${API_URL}/api/tournaments/search?createdBy=${data}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                })

                const data = await response.json();
                setTournaments(data);
            } catch (error) {
                console.log("Errore nella fetch: ", error);
            } finally {
                setLoading(false);
            }
        }

            fetchTournaments();
        }, []);

    if (loading) return <p>Caricamento tornei</p>;
        if (error) return <p>{error}</p>;

        return (
            <div className="pagina-tornei">
                <h1>Tornei disponibili</h1>
                <div className="griglia-tornei">
                    {tournaments.map((t) => (
                        <TournamentCard
                            key={t._id}
                            {...t}
                            onSubscribe={() => {}}
                            onViewDetails={() => {}}
                        />
                    ))}
                </div>
            </div>
        );
    };


    export default Prova;