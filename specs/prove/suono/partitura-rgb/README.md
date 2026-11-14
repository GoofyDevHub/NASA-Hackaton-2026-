# Una regola per ogni immagine

Usare la stessa trasformazione su qualunque immagine RGB opaca. Il risultato codifica la sua struttura visiva. Identificare gli edifici, l’altitudine o un valore fisico richiede informazioni ulteriori. Le tre prove usano i due ritagli già ascoltati del Pacifico ([gennaio](../linea-continua/gennaio-ritaglio.png) e [ottobre](../linea-continua/ottobre-ritaglio.png)) e l’intera anteprima NASA delle [luci della Florida](../../../catalogo/campione/black_marble_aug2160_print.jpg).

- [Pacifico, gennaio](pacifico-gennaio.wav)
- [Pacifico, ottobre](pacifico-ottobre.wav)
- [Florida, agosto](florida.wav)

## Regola e dominio di unicità

L’ingresso della partitura è una griglia rettangolare di 48 colonne e 8 righe, con tre numeri interi da 0 a 255 per cella. Il ridimensionamento per area usa tutto il raster passato al programma. La sinistra si ascolta prima della destra. Dal basso verso l’alto le otto fondamentali sono 104, 136, 152, 184, 232, 296, 344 e 424 Hz. In ogni riga rosso, verde e blu pesano rispettivamente la fondamentale, la sua ottava e la frequenza tripla. Tutte e 24 le frequenze sono distinte. Ogni componente pesa sempre uguale per lo stesso valore RGB. Il nero produce silenzio e il bianco attiva tutte e tre le componenti di quella cella.

Ogni colonna dura 250 ms. Nella prima metà le ampiezze sono stabili; nella seconda si raccordano alla colonna successiva con una curva coseno, senza riattaccare le note. L’ultima si raccorda alla prima. Le onde compiono un numero intero di cicli in 125 ms. Nel WAV mono PCM a 24 kHz il decodificatore misura ciascuna frequenza con un prodotto scalare nella metà stabile e arrotonda al livello RGB più vicino.

Perché è univoco sulla griglia: nella finestra stabile le 24 sinusoidi sono ortogonali. L’ampiezza di una singola frequenza identifica quindi una sola componente RGB. Con guadagno fisso 0,035 per componente, il massimo assoluto è al più 24 × 0,035 = 0,84. L’arrotondamento a PCM 16 bit introduce un errore al più pari a 255/(32767 × 0,035), cioè meno di 0,23 livelli dopo la decodifica, entro il mezzo livello richiesto. La ricostruzione usa il WAV generato e il contratto fisso. Una copia compressa, registrata dal microfono o alterata nel volume richiede verifiche separate.

Due foto diverse possono generare la stessa griglia ridotta. Il raster originale ad alta risoluzione contiene dettagli ulteriori. L’identità fra file audio è una proprietà verificabile anche quando una differenza acustica è troppo piccola per una persona.

## Verifica

Con Node e FFmpeg disponibili, eseguire `node genera.cjs`. Il generatore scrive i tre WAV e il decodificatore li rilegge dal disco. Per ciascuno verifica tutti i 1.152 livelli e la ripetibilità della codifica. Controlli aggiuntivi coprono il bianco pieno e un singolo incremento di un livello in ciascuno dei tre canali su fondo nero. La gradevolezza e la capacità di seguire le forme a orecchio restano da provare. [Codificatore e decodificatore](genera.cjs)
