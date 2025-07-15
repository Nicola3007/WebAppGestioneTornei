import React, { useEffect, useState } from 'react';
import TournamentCard from "./../components/TournamentCard.jsx";
import { useNavigate } from "react-router-dom";
import '../styles/tournamentsPanel.css'

function SignedUpTournaments() {
    const API_URL = import.meta.env.VITE_API_TOURNAMENTS_URL;
    const API_USER_URL = import.meta.env.VITE_API_USER_URL;
    const [tournaments, setTournaments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const [newAccessToken, setNewAccessToken] = useState(()=>localStorage.getItem('accessToken'));

    useEffect(() => {
        const fetchMyTournaments = async (accessTokenParam) => {
            try {
                let accessToken = accessTokenParam || localStorage.getItem("accessToken");

                let response = await fetch(`${API_URL}/signedUpTournaments`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${accessToken}`,
                    },
                    credentials: "include"
                });

                // Caso 401: token scaduto, provo refresh
                if (response.status === 401) {
                    const responseAccessToken = await fetch(`${API_USER_URL}/refresh`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        credentials: "include"
                    });

                    const dataNewToken = await responseAccessToken.json();

                    if (responseAccessToken.status === 401) {
                        console.log('refresh token scaduto, rifare il login');
                        navigate('/login');
                        return;
                    }

                    accessToken = dataNewToken.accessToken;
                    localStorage.setItem("accessToken", accessToken);
                    setNewAccessToken(accessToken);

                    return await fetchMyTournaments(accessToken);
                }

                if (!response.ok) {
                    const error = await response.json();
                    throw new Error(error.message || "Errore durante il fetch");
                }

                const myTournaments = await response.json();

                setTournaments(myTournaments);
                setError(null);
            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        };

        fetchMyTournaments();
    }, [newAccessToken]);


    if (loading) return <p>Caricamento tornei iscritti...</p>;
    if (error) return <p> {error.message}</p>;

    return (
        <>
            {tournaments.length === 0 ? (
                <p>Non sei iscritto a nessun torneo.</p>
            ) : (
                <>
                <h1 className='subscribe-title'>Tornei a cui sei iscritto:</h1>
                <div className="griglia-tornei">
                    {tournaments.map((t) => (
                        <TournamentCard
                            key={t._id}
                            {...t}
                            showButtonSubscribe={false}
                            showButtonUpdate={false}
                        />

                    ))}
                </div>
                </>
            )}
        </>
    );
}

export default SignedUpTournaments;