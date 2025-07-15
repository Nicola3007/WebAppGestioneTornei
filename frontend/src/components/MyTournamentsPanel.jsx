import React, { useEffect, useState } from "react";
import {useNavigate} from "react-router-dom";
import TournamentCard from "./TournamentCard.jsx";
import '../styles/tournamentsPanel.css'

function MyTournamentsPanel() {
    const [tournaments, setTournaments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const API_URL = import.meta.env.VITE_API_TOURNAMENTS_URL;

    const navigate = useNavigate();

    useEffect(() => {

        const fetchTournaments = async () => {
            try {
                const user = JSON.parse(localStorage.getItem("user"));
                if (!user || !user._id) {
                }

                console.log(`${API_URL}/search?createdBy=${user._id.toString()}`);

                const response = await fetch(`${API_URL}/search?createdBy=${user._id.toString()}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                const data = await response.json();

                if(response.status===400 || response.status===404){
                    setError(true);
                }

                setTournaments(data);

            } catch (error) {
                console.log("Errore nella fetch: ", error);
                setError(true);
            } finally {
                setLoading(false);
            }
        };

         fetchTournaments();

    }, []);


    if (loading) return <p>Caricamento tornei</p>;
    if (error) return <p className='no-tournaments'>Non hai ancora organizzato nessun torneo!</p>;


    return (
        <div className="pagina-tornei">
            <h1>I miei tornei</h1>
            <div className="griglia-tornei">
                {tournaments.map((t) => (
                    <TournamentCard
                        key={t._id}
                        {...t}
                        showButtonSubscribe={false}
                        showButtonUpdate={true}
                        onUpdate={()=>navigate('/dashboard/update-tournaments',
                            {
                                state: {
                                    params: {
                                        tournament: t
                                    }
                                }
                            }
                        )}
                    />
                ))}

            </div>
        </div>
    );
}

export default MyTournamentsPanel;
