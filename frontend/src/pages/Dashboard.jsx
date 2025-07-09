import { TournamentList } from "../components/TournamentList";

export default function Dashboard() {
    return (
        <div style={{ padding: "2rem" }}>
            <h1>Benvenuto nella Dashboard</h1>
            <p>Ecco i tornei disponibili:</p>
            <TournamentList />
        </div>
    );
}
