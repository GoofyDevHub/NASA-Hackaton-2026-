// Italian text for what the site says aloud: place names, descriptions, sound keys, limits and sources.
// The interface itself stays in English; these strings are used when the listener chooses IT for voice.

export const IT = {
  phenomenon: { lightning: 'fulmini', ocean: 'oceano', aerosols: 'aerosol' },
  region: { amazon: 'Amazzonia', congo: 'Congo', antarctica: 'Antartide' },

  place: {
    'amazon-lightning': 'Amazzonia',
    'congo-lightning': 'Congo',
    'antarctica-lightning': 'Penisola Antartica',
    'antarctica-ocean': 'Oceano Meridionale',
    'amazon-ocean': 'Atlantico, foce del Rio delle Amazzoni',
    'congo-aerosols': 'Congo',
    'congo-ocean': 'Atlantico, foce del Congo',
    'amazon-aerosols': 'Amazzonia',
    'antarctica-aerosols': 'Penisola Antartica'
  },

  description: {
    'amazon-lightning': 'Regione amazzonica, nord del Sud America. È la mappa NASA di quanto spesso cadono i fulmini in un anno medio, costruita con dati satellitari raccolti tra il 1995 e il 2002. Quasi tutta la vista è blu, la parte bassa della legenda, con macchie azzurre più chiare sul bacino e una piccola zona gialla e rossa nell\'angolo a nord-ovest. L\'acqua scura a nord-est è l\'Atlantico.',
    'congo-lightning': 'Regione del Congo, Africa centrale. Stessa mappa NASA dei fulmini e stessa legenda della vista amazzonica, con dati satellitari tra il 1995 e il 2002. Qui la terra è azzurra e verde, con un centro giallo e arancione e una macchia rosso scuro a est, la parte alta della legenda. Il blu scuro nell\'angolo a sud-ovest è l\'Atlantico.',
    'antarctica-lightning': 'Settore della Penisola Antartica. Stessa mappa NASA dei fulmini, con dati satellitari tra il 1995 e il 2002. La vista mostra la penisola chiara sull\'acqua scura e nessuna sovrapposizione colorata di fulmini. La copertura dei satelliti vicino al polo è troppo limitata per distinguere i dati mancanti da un\'attività bassa.',
    'antarctica-ocean': 'Oceano Meridionale, la larga fascia d\'acqua attorno all\'Antartide. La visualizzazione ECCO2 della NASA disegna le correnti di superficie come linee sottili, colorate secondo la temperatura superficiale del mare, per un periodo tra marzo 2007 e marzo 2008. La fascia è blu scuro, con fili azzurri e verdi lungo il bordo nord, la parte fredda della legenda, sopra la terra grigia dell\'Antartide. L\'immagine mostra un dettaglio della fascia; il suono ne usa tutta la larghezza.',
    'amazon-ocean': 'Oceano Atlantico accanto alla foce del Rio delle Amazzoni. La visualizzazione ECCO2 della NASA disegna le correnti di superficie come linee colorate secondo la temperatura superficiale del mare, per un periodo tra marzo 2007 e marzo 2008. Linee arancione acceso si avvolgono in un grande vortice al largo della costa, la parte calda della legenda. La terra grigia è in basso a sinistra.',
    'congo-aerosols': 'Regione del Congo, Africa centrale. Un fotogramma del modello atmosferico GEOS della NASA per il 19 agosto 2025 alle 20 UTC. I colori arancione e rosso del fumo, indicati come carbonio nero nella legenda, coprono più di metà della vista, con un nucleo chiaro rosa e bianco vicino al centro e una macchia verde di solfati sul bordo est.',
    'congo-ocean': 'Oceano Atlantico accanto alla foce del Congo. La visualizzazione ECCO2 della NASA disegna le correnti di superficie come linee colorate secondo la temperatura superficiale del mare, per un periodo tra marzo 2007 e marzo 2008. Linee gialle e arancioni corrono lungo la costa, verso la parte calda della legenda, con la terra grigia a destra.',
    'amazon-aerosols': 'Regione amazzonica, nord del Sud America. Un fotogramma del modello atmosferico GEOS della NASA per il 19 agosto 2025 alle 20 UTC. La vista è in gran parte verde scuro, con piccoli punti rossi sparsi di carbonio nero e una foschia grigio-viola a nord-est.',
    'antarctica-aerosols': 'Settore della Penisola Antartica. Un fotogramma del modello atmosferico GEOS della NASA per il 19 agosto 2025 alle 20 UTC. Una foschia verde scuro copre l\'oceano, con la penisola chiara in basso a sinistra e una macchia bianca nell\'angolo in alto a sinistra.'
  },

  soundKey: {
    'amazon-lightning': 'Si sentono 15 secondi di pioggia, senza tuoni. Il suono scorre la mappa colonna per colonna: colori più accesi portano pioggia più fitta.',
    'congo-lightning': 'Si sente pioggia più intensa con nove gruppi di tuoni in 15 secondi, fatta con la stessa registrazione e la stessa regola della traccia amazzonica. Tuoni più frequenti e più forti significano che qui la mappa mostra colori più alti. Il confronto è tra due luoghi, non tra due date.',
    'antarctica-lightning': 'Si sente un vento leggero sintetizzato. È un segnale illustrativo scelto dal gruppo. Non è una registrazione e non deriva da una misura.',
    'antarctica-ocean': 'Si sente una voce maschile bassa che canta tre frasi lunghe. I colori freddi scelgono il registro basso del cantante, e tre sezioni della fascia cambiano leggermente il volume di ogni frase. Il cantante mantiene la sua altezza naturale.',
    'amazon-ocean': 'Si sente un soprano in quattro frasi. I colori caldi scelgono la voce acuta, e quattro sezioni della vista spostano leggermente l\'altezza di ogni frase, entro tre semitoni.',
    'congo-aerosols': 'Si sentono tredici gruppi di colpi di tosse registrati, con brevi intervalli. La parte della vista coperta dai colori del fumo decide quanti colpi di tosse ci sono e quanto sono ravvicinati. È una risposta artistica ai colori del fumo.'
  },

  limits: {
    lightning: 'È un\'immagine sonora dei colori di una mappa di medie di lungo periodo. Non è il meteo di oggi, né un conteggio dei fulmini, né una misura dell\'intensità dei temporali.',
    ocean: 'La voce segue i colori relativi di un\'immagine fissa. Non dà temperature in gradi né condizioni attuali.',
    aerosols: 'Sono i colori di un\'immagine prodotta da un modello. Non sono un indice di qualità dell\'aria, né una stima di esposizione, né un\'affermazione sulla salute di qualcuno.',
    'antarctica-lightning': 'Questa scena non può dire quanti fulmini cadono qui né quanto vento c\'è. La copertura polare della fonte è insufficiente.'
  },

  source: {
    lightning: 'NASA SVS 3144. Climatologia annuale dai sensori LIS, 1998–2002, e OTD, 1995–1999.',
    ocean: 'NASA SVS 3912. Visualizzazione ECCO2 da marzo 2007 a marzo 2008. L\'istante esatto dell\'immagine non è registrato.',
    aerosols: 'NASA SVS 5669. Fotogramma del modello GEOS del 19 agosto 2025, ore 20 UTC.'
  },

  imageOnly: 'Solo immagine. Per questa vista non è stato approvato alcun suono, quindi il tour la salta. Sono disponibili la descrizione e la fonte.'
};
