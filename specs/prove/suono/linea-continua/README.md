# Linea continua · prova sul Pacifico

Un solo suono segue il colore predominante lungo una linea verticale che attraversa il ritaglio da sinistra a destra. Il confronto usa lo stesso ritaglio di 1152 × 216 pixel delle prove precedenti, con origine (1904, 916) nei due originali NASA. Ascolti mono da 12 secondi: [gennaio](gennaio.wav) e [ottobre](ottobre.wav). In entrambi i file, a 6 secondi la linea si trova a metà della stessa area.

## Regole della prova

1. La linea scorre a velocità costante. Per ogni posizione si contano i pixel lungo tutta l’altezza e si includono fino a quattro colonne vicine per lato. Questo riduce l’effetto di un singolo pixel.
2. Si campionano 65 colori lungo il centro della [legenda originale NASA SVS 5176](https://svs.gsfc.nasa.gov/vis/a000000/a005100/a005176/sst_mur_anomaly_auto_colorbar_01.exr). Ogni pixel riceve la classe del campione RGB più vicino. I cinque intervalli della legenda si separano al 31,25%, 43,75%, 56,25% e 68,75% del percorso da sinistra a destra. La soglia di cromaticità (8 livelli RGB) e la distanza massima (55 in RGB) scartano fondale grigio e colori incerti. È un’approssimazione visiva specifica per questo ritaglio. A una copertura valida inferiore al 15% il suono si attenua e a copertura nulla tende al silenzio.
3. La classe più frequente sceglie la nota. Dal blu più scuro al rosso scuro le cinque altezze sono Re3, Fa3, Sol3, La3, Do4. Si conta la superficie occupata da ciascuna classe, così una piccola macchia intensa pesa solo per i pixel che copre. Quando due colori sono quasi alla pari si conserva il precedente finché quello in testa lo supera di quattro punti percentuali. All’inizio si parte dalla classe centrale come riferimento per risolvere i casi incerti.
4. Una sola voce tenuta suona la nota, con due armonici più deboli che le danno corpo. Posizione e frequenza sono interpolate continuamente. La transizione di altezza si distribuisce su circa un quarto di secondo (finestra di 25 colonne); la fase dell’onda prosegue. Il percorso contiene solo i cambi suggeriti dalla mappa.
5. Gli ultimi 180 ms raccordano il margine destro all’inizio per consentire il loop, con una correzione di intonazione sotto 0,3 centesimi di semitono nei due file. Questo raccordo è una scelta di riproduzione. Non indica una regione osservata.

## Cosa si può riconoscere

Il tempo identifica la posizione orizzontale e la persistenza di un colore. La lettura aggrega tutta l’altezza. Spostare lo stesso gruppo di pixel da nord a sud dentro una colonna lascia invariata la nota. Un colore minoritario può restare inudibile. Le note indicano categorie della legenda. I valori scientifici esatti richiedono i dati associati. Il profilo della Florida, con la sua legenda delle luci e un fondale diverso, va tarato separatamente.

In gennaio la classe centrale prevale dopo il filtro di stabilità in 864 posizioni su 1152. In ottobre il rosso scuro prevale in 859 posizioni. La prova d’ascolto consiste nel verificare se si coglie questa differenza e se si desidera lasciare la voce in loop. La durata del giro, la scelta delle cinque altezze e la rapidità del passaggio restano da validare.

Riproduzione con `node genera.cjs`, Node e FFmpeg. Il programma stampa per ciascuna immagine l’impronta del WAV, i conteggi per classe, il picco e il minimo livello RMS su finestre di 50 ms. [Generatore](genera.cjs) · [Legenda locale](legenda-svs-5176.exr) · [Originali delle mappe](../../dati-nasa/README.md)
