# Ascoltare il Pacifico e la Florida

Prova di ascolto con sei immagini originali NASA. La proposta unisce una scansione da ovest a est e una sintesi per risonanze. Le note formano un arpeggio aperto di la e mi. Ogni voce mantiene lo stesso registro lungo il percorso. La trama musicale cambia perché cambia la superficie colorata che ciascun timbro rappresenta.

## Ascolti

- [Pacifico · gennaio e ottobre](pacifico-ab.wav). Due letture dello stesso ritaglio equatoriale. Per un primo ascolto seguire la voce più bassa nei secondi centrali. Si sente ancora il colpo di vetro, oppure prevale una corda che continua a vibrare?
- [Florida · prima e dopo Ian](florida-ab.wav). Seguire i tocchi che rappresentano le luci intorno a Fort Myers. Ripetere mantenendo il volume fermo.
- Per ripetere un giro intero usare i singoli file con la ripetizione attiva nel lettore. Pacifico: [gennaio](gennaio.wav), [aprile](aprile.wav), [luglio](luglio.wav), [ottobre](ottobre.wav). Florida: [prima](prima.wav), [dopo](dopo.wav).

Ogni giro dura 9,6 s. Nei due file dimostrativi la prima immagine occupa 0–9,6 s, seguono 0,5 s di pausa e la seconda occupa 10,1–19,7 s. Le code dei singoli giri attraversano il punto di ripetizione mediante sovrapposizione circolare. Solo il montaggio A/B applica una dissolvenza di 25 ms alle estremità dei due estratti.

## Dall’immagine alla partitura

1. Aprire il file originale della serie e leggere sempre lo stesso rettangolo. Coordinate in pixel dall’angolo in alto a sinistra: per il Pacifico (1904, 916), dimensioni 1152 × 216 sul fotogramma 4096 × 2048. Per la Florida (96, 240), dimensioni 1728 × 1512 nel pannello sinistro del PNG 7680 × 2160. La scelta inquadra una zona e lascia fuori date e legende.
2. Dividere il rettangolo in 16 colonne e 3 fasce. Ogni colonna dura 0,6 s. Le fasce da sud a nord attaccano dopo 0, 50 e 100 ms e suonano rispettivamente La3, Mi4 e La4. Una zona estesa in orizzontale ritorna in più battiti consecutivi.
3. Nel Pacifico contare separatamente i pixel in cui il rosso supera il blu di oltre 12 livelli RGB su 255 e quelli in cui il blu supera il rosso della stessa quantità. Dividere ogni conteggio per l’intera superficie della cella. Ai primi corrisponde una corda sfregata con attacco morbido, ai secondi un vetro percosso dal decadimento breve. Nella stessa cella i due timbri possono suonare insieme. I pixel cromaticamente neutri restano silenziosi. Questa classificazione visiva approssima i due lati della palette. Valori prossimi al neutro, aree senza dato e sfondi possono risultare indistinguibili.
4. In Florida contare la quota di pixel il cui canale RGB massimo supera il minimo di almeno 32 livelli. Una voce pizzicata segue l’estensione dei colori sovrapposti al fondale grigio. Nomi delle città e fondale grigio vengono in larga parte esclusi dalla soglia, con possibili residui ai bordi. La copertura descrive la visualizzazione delle luci. Per stimare radianza o utenze senza elettricità servono dati diversi.
5. L’ampiezza di ciascuna voce è proporzionale alla radice quadrata della quota di pixel della classe. La radice rende udibili anche regioni piccole. Scala, soglie e guadagno restano fissi per l’intera serie. Il suono mono comunica ogni distinzione anche con un solo altoparlante.

La griglia conserva la disposizione delle classi a una risoluzione di 48 celle. Due immagini che ridistribuiscono i colori all’interno di una cella mantenendo le stesse quote producono la stessa partitura. Il profilo delle luci e quello del mare consentono confronti entro la rispettiva serie. Un video richiederà una regola temporale e una prova di sincronizzazione dedicate.

## Risultato verificabile

Nel Pacifico, prendendo le otto colonne centrali della fascia sud (da 2,4 a 7,2 s in ciascun giro), a gennaio il blu occupa l’86,9% dei pixel e i colori caldi l’11,4%. In ottobre le rispettive quote sono 0,2% e 92,9%. Nel ritaglio della Florida la copertura colorata passa dal 18,5% al 4,8%. Sono percentuali di pixel filtrati. [Originali e crediti](../../dati-nasa/README.md) · [Mappe del mare, NASA SVS](https://svs.gsfc.nasa.gov/5176/) · [Luci della Florida, NASA SVS](https://svs.gsfc.nasa.gov/5058/)

Due esecuzioni con gli stessi originali e le stesse versioni locali di Node e FFmpeg hanno prodotto otto WAV identici byte per byte. Per riprodurre la prova eseguire `node genera.cjs` in questa cartella con FFmpeg disponibile. Il rapporto registra hash delle sorgenti e dei singoli giri, griglie estratte, picchi e differenza fra ultimo e primo campione. [Generatore](genera.cjs) · [Misure](misure.json)

## Decisione all’ascolto

Ascoltare prima a schermo spento. Indicare dove si avverte la differenza (inizio, centro, fine), quale voce cambia (grave, media, acuta) e se si desidera ripetere un altro giro. Se distingui A da B ma fatichi a seguire il luogo, provare due fasce anziché tre. Se il luogo è chiaro ma il suono stanca, mantenere la griglia e intervenire sugli attacchi e sugli armonici. Prima della scelta definitiva ripetere la prova con ordine nascosto e con persone cieche e ipovedenti.
