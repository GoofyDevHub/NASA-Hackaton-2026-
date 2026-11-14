# Metodi sonori esplorati

Il riferimento corrente è il [pianoforte A+](../../docs/sonificazione.md). Seguono le prove e i ragionamenti che hanno preceduto la scelta.

### Precedente prova con cinque fasce

La linea legge cinque fasce, ciascuna associata a una nota fissa. Proviamo a dare il fiato a una sola fascia per volta. Entra quella il cui colore medio si distingue maggiormente dalle altre nella stessa colonna. Un vantaggio persistente fa scivolare il flauto verso la nuova nota, mentre una zona uniforme lo lascia sfumare. La regola del contrasto si applica a ogni immagine. Le priorità sono la leggibilità della melodia e la possibilità di seguirne il percorso a orecchio.

### Precedente prova RGB reversibile

Per avere un criterio univoco, la stessa regola legge direttamente i tre canali RGB di ogni scena. La posizione orizzontale determina il tempo, la riga determina il registro e ciascun canale pesa una frequenza distinta. Il confronto usa scala e guadagno fissi. La prova a 48 × 8 celle permette di ricostruire dal WAV tutte le componenti della griglia. Il ridimensionamento iniziale perde i dettagli più piccoli e la riconoscibilità all’orecchio richiede validazione.

### Precedente prova con tre voci e legenda della serie

La linea legge tre fasce orizzontali in parallelo. In ogni fascia i colori contribuiscono in proporzione alla loro presenza e alla distanza dal centro della legenda. Il registro indica la posizione verticale, il timbro distingue le famiglie cromatiche e il rapporto fra suono diretto e riflesso suggerisce rilievo. Manteniamo la scansione orizzontale uniforme e i suoni continui. La prova percettiva chiede se, a occhi chiusi, si riconosce una mappa capovolta verticalmente anche in mono.

### Esperimento di riferimento con una sola voce

Una linea verticale attraversa la zona selezionata da sinistra a destra a velocità costante. Il colore che occupa più spazio lungo la linea determina l’altezza di una sola voce tenuta. Quando cambia la prevalenza, la voce scivola fino alla nuova nota. Un piccolo margine evita oscillazioni ripetute tra due colori quasi alla pari. Sul Pacifico la prova usa cinque classi della legenda NASA e lo stesso percorso di 12 secondi per gennaio e ottobre. Il tempo conserva la posizione orizzontale. Aggregare l’intera linea perde la posizione verticale e può nascondere le zone minoritarie. Il profilo delle luci della Florida resta da tarare sulla sua legenda.


Non si invia l'immagine a un generatore chiedendo una musica a tema. Si definisce una trasformazione ripetibile: caratteristiche dell'immagine o dei dati → parametri sonori. La composizione deve dipendere da ciò che vogliamo far riconoscere.

## Esempio concreto, non algoritmo già scelto

Immagina due macchie su fondo neutro: una piccola in alto a sinistra, una grande in basso a destra. Possiamo dividere l'immagine in colonne e leggerle da sinistra a destra. Il tempo dice “dove siamo” orizzontalmente; il registro musicale distingue una zona in alto da una in basso; la persistenza descrive l'estensione; un timbro distinto descrive una classe di valore o un colore. Prima si sente una presenza breve e alta, poi una più lunga e bassa. Con una legenda appresa, l'ascoltatore può ricostruire una struttura approssimata.

Questo esempio assegna l'altezza sonora alla posizione verticale. Se la assegnassimo contemporaneamente alla temperatura, il significato diventerebbe ambiguo: non basta accumulare associazioni. Occorre scegliere poche dimensioni e dare a ciascuna un canale leggibile.

## I passaggi

1. Identificare immagine, legenda, area, data e dati eventualmente associati. Escludere scritte, cornici e zone senza dato. Una mappa e una fotografia richiedono metodi diversi.
2. Estrarre caratteristiche utili: posizione, estensione, contorni, distribuzione, oppure valori fisici se documentati. Non dedurre gradi Celsius dalla luminosità.
3. Fissare un vocabolario: quale caratteristica guida tempo, registro, timbro, durata e posizione stereo. Conservare una lettura possibile anche in mono.
4. Sintetizzare con strumenti gradevoli, attacchi morbidi e polifonia limitata. Le scelte musicali non devono cancellare proprio le differenze che vogliamo comunicare.
5. Confrontare due immagini con le stesse regole e scale. Niente normalizzazione separata che faccia sembrare uguali valori diversi.
6. Verificare se una persona riconosce differenze e struttura. Per “ricreare l'immagine”, far scegliere fra sagome alternative o disegnare una ricostruzione grossolana, non chiedere solo se il suono piace.

## Un limite da decidere insieme

Una composizione breve comprime molte informazioni: non permette automaticamente di ricostruire ogni pixel. L'obiettivo proposto è **ricostruire mentalmente le principali strutture e differenze**, con descrizione facoltativa per contesto e dettagli. Se si richiede una ricostruzione spaziale più fedele, serviranno più tempo, un'esplorazione guidata o una risoluzione più grossolana dichiarata.

Gradevolezza, capacità di distinguere e fedeltà spaziale vanno valutate separatamente. L'accordo della Marea spettrale, per esempio, può descrivere la distribuzione ma non distinguere due immagini con gli stessi valori disposti diversamente. Per il nuovo obiettivo non è sufficiente da solo.

Per scegliere il metodo, preparare due esempi con i media ufficiali e confrontarli per gradevolezza, riconoscibilità della struttura e costo di elaborazione. Le prove sintetiche precedenti restano esperimenti, non scelta approvata.

## Metodi candidati

### A. Canone orbitale — una zona chiama, un'altra voce risponde

Una scansione attraversa zone fisse della mappa; ciascuna emette una frase breve, seguita da una risposta più tenue all'ottava. Al ritorno dell'orbita si ritrova la stessa struttura. La risposta è una duplicazione musicale dichiarata, non una seconda osservazione scientifica.

Mapping candidato: posizione lungo il percorso → istante della frase; intensità assoluta rispetto al riferimento → altezza su scala fissa; segno → due timbri stabili; posizione orizzontale → panoramica accessoria. La suddivisione geografica deve essere identica in A e B. Il timing, non lo stereo, porta l'informazione spaziale essenziale.

Vantaggio: struttura memorizzabile e adatta al loop, buona base per capire dove cambia qualcosa. Rischio: armonizzare comprime i valori; cambi piccoli possono cadere sulla stessa nota. Possibile secondo indicatore continuo nel timbro, da verificare senza sovraccarico. Nessuna tonalità scelta automaticamente per ciascuna immagine.

Fattibilità relativa: la più favorevole delle tre prove, perché estende la scansione già ipotizzata. La sua identità dipende da timbro, risposta e chiarezza del mapping, non solo da note gradevoli.

### B. Marea spettrale — la distribuzione diventa un accordo vivo

Una banca di risonanze fisse rappresenta intervalli di valore. La quantità di area in ciascun intervallo alimenta la corrispondente risonanza. Ne risulta un tessuto continuo che cambia colore armonico: più area in una classe significa più presenza della sua voce.

Per classi con centri c_j e larghezza h, il peso può essere `w_j = media(max(0, 1 - abs(z-c_j)/h))` sui campioni validi, con pesi geografici quando necessari. Il segnale è la somma di voci a frequenze fisse con ampiezze proporzionali ai pesi. Una lieve respirazione periodica, uguale per tutte le scene, è arrangiamento e non una variazione del fenomeno.

Vantaggio: identità immersiva, transizioni naturali per i video. Rischio decisivo: due mappe con la stessa distribuzione ma regioni in posizioni diverse suonano uguali. Non basta come unico motore se il compito è riconoscere spostamenti. Possibile suddivisione in poche macrozone, a costo di più voci e minore chiarezza.

Fattibilità relativa: media. Serve controllare il mascheramento fra voci e verificare che l'aumento di una classe sia percepibile senza rendere tutto più forte.

### C. Arcipelago risonante — le regioni diventano strumenti

Le regioni contigue sopra una soglia dichiarata diventano oggetti sonori. Una regione estesa risuona più a lungo; una più intensa ha un registro diverso; il centro geografico colloca il suo ingresso nel giro. Immaginare poche risonanze morbide, simili a vetro o corde pizzicate, non una cascata casuale di campanelli.

Mapping candidato: area → decadimento; valore medio → altezza; segno → famiglia timbrica; posizione → ingresso. Limitare la polifonia, mantenendo un riepilogo udibile delle regioni escluse invece di farle sparire senza dirlo. Soglie e numero di voci identici nel confronto.

Vantaggio: una zona che si espande può essere riconosciuta come una risonanza che persiste di più. Ottimo collegamento concettuale con impulsi aptici agli ingressi delle regioni.

Rischi: piccoli cambi vicino alla soglia possono spezzare o fondere regioni, producendo grandi salti sonori; nei video l'identità delle regioni deve essere tracciata nel tempo. È più difficile del canone. Necessarie isteresi, soglie documentate e prove di stabilità, non segmentazione generativa opaca.

Fattibilità relativa: media sulle immagini, più incerta sui video. La prova audio usa gruppi su una linea di otto campioni, non una segmentazione geografica già realizzata.

### D. Eclisse differenziale — ascoltare ciò che compare o scompare

Estensione del confronto: dopo A e B, ascoltare una composizione ottenuta da `delta = B - A` su dati allineati e compatibili. Ciò che resta uguale non genera eventi; aumenti e diminuzioni hanno firme sonore diverse, per esempio coppie ascendenti e discendenti. Il modulo usa lo stesso percorso spaziale del motore principale.

Vantaggio: la domanda «che cosa cambia?» ha una risposta sonora diretta. Potenziale elemento più riconoscibile del progetto, da dimostrare con casi controllati.

Rischi: il silenzio può essere scambiato per un guasto; va annunciato esplicitamente «nessuna differenza rilevata nel limite del metodo». Differenze di legenda, scala, maschera o proiezione non sono differenze del fenomeno. Il confronto quantitativo richiede dati con unità, calibrazione e riferimenti compatibili; su immagini visuali si deve parlare soltanto di differenze della rappresentazione. Una soglia di rumore non può essere arbitrariamente presentata come significatività scientifica.

Fattibilità relativa: favorevole solo dopo aver risolto compatibilità e allineamento. La sottrazione è semplice; dimostrare il significato del risultato è il lavoro vero.

### E. Tessitura granulare — la mappa diventa una materia sonora

Molti grani brevi derivati da un campione originale registrato o sintetizzato si addensano in base alla struttura del campo. Varianza locale → densità; estensione → durata del tessuto; intensità → inviluppo spettrale. Seed e ordine dei grani fissi per mantenere ripetibilità.

Vantaggio: può creare un'identità tattile, organica e molto diversa da un pianoforte. Rischio: la texture può diventare frusciante, faticosa o difficile da spiegare; un'ottima atmosfera non equivale a comprensione. Più indicata come timbro del motore scelto che come ulteriore modalità nella UX.

Fattibilità relativa: media; il lavoro maggiore è la progettazione sonora e la verifica percettiva. Da scartare se nasconde la differenza tra i dati.

### F. Campo di traiettorie — seguire il movimento come una corrente musicale

Su dati vettoriali reali, particelle virtuali percorrono il campo: direzione → movimento della frase, velocità → frequenza degli eventi, convergenza → addensamento delle voci. Un insieme di percorsi limitato e deterministico rende riconoscibile il movimento.

Vantaggio: il suono può far seguire un fenomeno dinamico invece di leggerne una fotografia. Rischio: SST o una fotografia non forniscono automaticamente velocità e direzione fisiche. Il moto stimato da immagini sarebbe moto apparente, da dichiarare; non inventare correnti a partire dal colore.

La fattibilità dipende dal contenuto e dalla risoluzione temporale delle risorse ufficiali. Candidata soltanto se vengono forniti dati adatti, senza farne una dipendenza obbligatoria.



La selezione avviene sul campione ufficiale. Le tre registrazioni sintetiche del laboratorio pre-evento servono per confrontare i timbri.

Il precedente esperimento di arpeggio per le [sei immagini ufficiali](../../catalogo/campione/README.md) usa sedici colonne percorse da ovest a est e tre registri che identificano le fasce da sud a nord. Nel Pacifico due timbri rivelano quanto spazio occupano i colori caldi e freddi. In Florida la copertura delle luci regola la forza dei pizzicati. Il metodo selezionato per la demo è il pianoforte A+ descritto nella specifica musicale.
