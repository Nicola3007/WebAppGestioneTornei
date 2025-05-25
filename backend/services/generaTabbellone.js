const Torneo = require('../models/Torneo');
const Iscrizione = require('../models/Iscrizione');
const Partita = require('../models/Partita');

const fasi = {
    4: 'semifinale',
    8: 'quarti',
    16: 'ottavi',
    32: 'sedicesimi',
};

async function generaTabellone(torneoId) {
    // Recupera il torneo
    const torneo = await Torneo.findById(torneoId);
    if (!torneo) throw new Error('Torneo non trovato');

    // Recupera tutte le iscrizioni al torneo
    const iscrizioni = await Iscrizione.find({ torneo: torneoId });

    const n = iscrizioni.length;
    if (![4, 8, 16, 32].includes(n)) {
        throw new Error('Numero di squadre non valido: deve essere 4, 8, 16 o 32');
    }

    // Mescola le iscrizioni in modo casuale
    const shuffled = iscrizioni.sort(() => 0.5 - Math.random());

    // Crea le partite del primo turno
    const faseIniziale = fasi[n];
    const partite = [];

    for (let i = 0; i < n; i += 2) {
        const partita = new Partita({
            torneo: torneoId,
            squadraA: shuffled[i]._id,
            squadraB: shuffled[i + 1]._id,
            fase: faseIniziale,
            dataPartita: new Date(Date.now() + 1000 * 60 * 60 * i), // es. ora dopo ora
        });
        partite.push(partita.save());
    }

    await Promise.all(partite);

    // Cambia stato torneo → in corso
    torneo.statoTorneo = 'in corso';
    await torneo.save();

    return { message: 'Tabellone generato con successo' };
}

module.exports = { generaTabellone };
