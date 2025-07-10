import React, { useEffect, useState } from "react";
import TournamentCard from "../components/TournamentCard.jsx";

function MyTournament() {
    const API_URL = import.meta.env.VITE_API_BASE_URL;
    const accessToken = localStorage.getItem("accessToken");

    const [organizedTournaments, setOrganizedTournaments] = useState({ current: [], past: [] });
    const [playedTournaments, setPlayedTournaments] = useState({ current: [], past: [] });

    const [showPastOrganized, setShowPastOrganized] = useState(false);
    const [showPastPlayed, setShowPastPlayed] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMyTournaments = async () => {
            try {
                const response = await fetch(`${API_URL}/api/user/personalArea`, {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });

                const data = await response.json();

                const organized = data.data.tournaments || [];
                const playedTeams = data.data.teams || [];

                const currentOrganized = organized.filter(t => t.status === "In corso");
                const pastOrganized = organized.filter(t => t.status !== "In corso");

                const played = playedTeams.map(team => team.tournament).filter(Boolean);

                const currentPlayed = played.filter(t => t.status === "In corso");
                const pastPlayed = played.filter(t => t.status !== "In corso");

                setOrganizedTournaments({
                    current: currentOrganized,
                    past: pastOrganized,
                });

                setPlayedTournaments({
                    current: currentPlayed,
                    past: pastPlayed,
                });
            } catch (err) {
                console.error("Errore nella fetch dei tornei:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchMyTournaments();
    }, []);

    if (loading) return <p>Caricamento "I miei tornei"...</p>;

    return (
        <div className="my-tournaments">
            <h1>I miei tornei</h1>

            {/* TORNEI ORGANIZZATI */}
            <section>
                <h2>Tornei organizzati: IN CORSO</h2>
                {organizedTournaments.current.length === 0 ? (
                    <p>Nessun torneo organizzato è in corso.</p>
                ) : (
                    organizedTournaments.current.map(t => (
                        <TournamentCard key={t._id} {...t} onSubscribe={() => {}} onViewDetails={() => {}} />
                    ))
                )}

                <button onClick={() => setShowPastOrganized(!showPastOrganized)}>
                    {showPastOrganized ? "Nascondi tornei scaduti" : "Visualizza tornei scaduti"}
                </button>

                {showPastOrganized && organizedTournaments.past.map(t => (
                    <TournamentCard key={t._id} {...t} onSubscribe={() => {}} onViewDetails={() => {}} />
                ))}
            </section>

            <hr />

            {/* TORNEI GIOCATI */}
            <section>
                <h2>Tornei giocati: IN CORSO</h2>
                {playedTournaments.current.length === 0 ? (
                    <p>Non stai partecipando a nessun torneo in corso.</p>
                ) : (
                    playedTournaments.current.map(t => (
                        <TournamentCard key={t._id} {...t} onSubscribe={() => {}} onViewDetails={() => {}} />
                    ))
                )}

                <button onClick={() => setShowPastPlayed(!showPastPlayed)}>
                    {showPastPlayed ? "Nascondi tornei scaduti" : "Visualizza tornei scaduti"}
                </button>

                {showPastPlayed && playedTournaments.past.map(t => (
                    <TournamentCard key={t._id} {...t} onSubscribe={() => {}} onViewDetails={() => {}} />
                ))}
            </section>
        </div>
    );
}

export default MyTournament;
