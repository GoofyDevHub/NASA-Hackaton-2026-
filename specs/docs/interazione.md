# ORBIT — revisione di interazione, movimento e suono del video

L’utente ha accolto le schermate del sito, la forma del controller e i dieci fotogrammi del video come mockup. Resta da validare la chiarezza del menu di ascolto. Il ritmo dell’estratto è risultato macchinoso e sarà rivisto in sviluppo. Per le immagini il riferimento scelto è A+ al pianoforte.

## Identità comune

Palette: #21232E, #F0F0F0, #FE8500. Terra naturale, orbita sonora sottile, titoli editoriali e controlli leggibili. Lo stesso sistema deve apparire nel sito, nel video e nella presentazione del controller. Materiali del controller: scocca grafite opaca, tasti chiari/arancio, metallo satinato. Le immagini generate possono variare leggermente; il futuro design system fisserà font, spaziature, materiali e colori esatti.

Riferimento dell'orbita: `../images/identita/orbit-earth-in-tune.png`. Riprenderne il ritmo delle barrette, non l'intensità del bagliore. Proposta: una sola ellisse, tratto 1–2 px alla scala desktop, barrette prevalentemente di pochi pixel, picchi limitati; spessore verificato al ridimensionamento. Nessuna informazione essenziale dipende dall'orbita.

Durante la riproduzione, le barrette seguono l'audio effettivo con variazioni smussate. In pausa e prima di Ascolta restano ferme: non simulare un segnale che non esiste. Nel mockup sono un disegno statico. Riduzione movimento: orbita statica, nessuna rotazione automatica del globo. Deve essere possibile fermare separatamente la rotazione senza fermare il suono.

## Menu del singolo contenuto

Nel popup il titolo identifica l’immagine e lo stato dice «Pronto all’ascolto», «In ascolto» oppure «In pausa». Il pulsante principale cambia da «Ascolta l’immagine» a «Pausa» e poi a «Riprendi». «Ascolta la descrizione» è separato e sempre volontario. Arresta è disponibile durante la voce, la musica e la pausa. Volume, ripetizione e cambio immagine hanno una posizione stabile sotto i comandi di ascolto.

Per validare il menu, chiedere a chi lo vede per la prima volta di avviare il suono dell’immagine, richiedere la voce e tornare alla musica dalla pausa. In sviluppo ripetere la prova con sola tastiera e lettore di schermo, verificando che si senta quale comando ha il focus e se la musica è attiva o sospesa.

## Due modalità di ascolto

**Esplorazione singola:** scelta tramite globo o elenco equivalente; apertura silenziosa; Descrivi su richiesta; Ascolta avvia il contenuto; Ripeti può mantenerlo in loop. Nessun passaggio automatico ad altro contenuto.

**Playlist completa.** Il primo comando della pagina, «Avvia playlist», avvia una volta tutte le immagini pronte nell’ordine del catalogo. Rendere disponibili titolo e posizione, ad esempio «Malaspina, 9 di 14», al cambio. L'utente sceglie se includere le descrizioni; inizialmente sono escluse. Con descrizioni incluse: descrizione → breve separazione → sonificazione → prossimo contenuto. Senza descrizioni: solo titolo/stato accessibile e sonificazione. Non sovrapporre annunci del lettore di schermo, descrizione e audio dati; modalità di annunci da provare con un lettore reale.

Regole della playlist:

- Un ciclo di 15 s per immagine. Ripeti è disponibile nel lettore singolo.
- Pausa conserva posizione e fase. Riprendi riparte da lì. Arresta annulla la sequenza e qualsiasi avanzamento programmato, riportando il focus su «Avvia playlist»; serve un nuovo gesto per ricominciare.
- Precedente/Successivo durante la riproduzione passa al contenuto richiesto e continua il percorso già avviato; da fermo o in pausa cambia selezione restando silenzioso. Nessuna doppia riproduzione su pressioni rapide.
- Descrivi durante la sonificazione la sospende; al termine resta in pausa finché l'utente riprende. Un cambio manuale di catalogo esce dal percorso, senza ripartenza nascosta.
- Al termine della sequenza: arresto, stato “Percorso concluso”, nessun riavvio infinito. In caso di errore: stop e messaggio comprensibile, senza saltare silenziosamente contenuti.
- La categoria caldo/freddo segue ogni immagine. All’avvio della musica il controller simulato la rappresenta automaticamente con il canale simulato inizialmente abilitato. Termico consente di disabilitarlo e riabilitarlo. La preferenza vale anche ai cambi di scena. Stop, pausa, descrizione, guasto o scollegamento spengono l’uscita. Il loop conserva la categoria senza ripetere impulsi.

## Mouse, tastiera, controller

Stessi comandi e stati attraverso tutti gli ingressi. Nel sito: controlli HTML con nome visibile, ordine di focus coerente e indicatore evidente. Il percorso è avviabile senza usare la Terra. Popup con focus gestito e ritorno alla selezione, niente navigazione dello sfondo mentre è aperto.

Dalla schermata iniziale Play sul controller avvia direttamente l’intera playlist. Nel lettore singolo Play comanda la sola immagine. Durante la playlist Play/Pausa alterna pausa e ripresa, Precedente e Successivo cambiano scena, Descrivi legge quella corrente, Termico alterna il canale simulato e la manopola regola il volume. Stop nella playlist annulla la coda e riporta il focus su «Avvia playlist». Al primo elemento Precedente resta sul primo e segnala il limite. Successivo sull’ultimo conclude la playlist.

L'automazione riduce i gesti necessari, ma da sola non garantisce accessibilità: verificare contrasto, ingrandimento, focus, nomi dei controlli, lettore di schermo e comprensione dei feedback. Evitare hotkey globali che intercettino i comandi del lettore di schermo. Prove fisiche su forme tattili e distanze del controller ancora da svolgere.

## Video — riferimenti di movimento dello storyboard esteso

I tempi sotto descrivono i riferimenti artistici. Per il film di gara usare il [montaggio di 29 s](fattibilita.md#film-per-i-giudici). Non implicano tastiera sonora, pop o effetti obbligatori nel sito.

| Tempo | Movimento proposto | Suono del montaggio |
|---|---|---|
| 0–2 s | Dettaglio Terra, rotazione lenta; titolo entra per brevi gruppi di parole | Pochi colpi di tastiera morbidi sincronizzati, poi stop |
| 2–5 s | Orientamento verso il luogo, marker compare, leggero avvicinamento | Un pop breve sul marker, nessun suono continuo di movimento |
| 5–9 s | Cursore raggiunge Ascolta, pressione visibile e ritorno; piccolo movimento del volume compiuto dal cursore | Click secco al contatto, rilascio più tenue; avvio dati solo dopo la pressione |
| 9–14 s | Indicatore collegato al metodo sonoro, globo sullo sfondo lento o fermo | Soltanto sonificazione, senza voce, pop, tastiera o musica aggiunta |
| 14–18 s | Taglio coerente dal pulsante dell'app a quello del controller, vista a tre quarti | Un accento breve sul taglio; non imitare una prova fisica realmente avvenuta |
| 18–24 s | Esploso in tre movimenti: scocca, logica, gruppo aptico/termico | Tre accenti leggeri, uno per gruppo; niente raffica per ciascun pezzo |
| 24–28 s | Dettaglio dei materiali, ricomposizione; titoli brevi | Breve tastiera sul titolo, poi spazio alla voce |
| 28–38 s | Immagine A come base; B sovrapposta con maschera. Linea avanti → indietro → avanti | Pop all'ingresso del confronto; fruscio breve facoltativo solo nella dimostrazione visiva |
| 38–48 s | Finestra A 5 s e B 5 s: tendina ferma agli estremi, indicatore A/B evidente | Due ascolti separati, stesso guadagno, niente effetti sovrapposti |
| 48–56 s | App e controller, poi Terra lentamente rotante e chiusura | Coda breve originale; stop dei suoni di tastiera prima dei crediti |

Dal secondo 28 al 38 la tendina tiene A per 0,8 s, passa a B in 2,6 s, torna ad A in 2,6 s e rivela ancora B in 2,6 s. B rimane visibile negli ultimi 1,4 s. Due immagini illustrative del mare occupano la stessa inquadratura. Per il film con dati ufficiali, verificare geografia, ritaglio, unità e scala cromatica. Seguono cinque secondi di ascolto per immagine, da provare sul fenomeno scelto.

Nel sito un eventuale confronto a tendina avrà uno slider comandabile anche da tastiera, opzioni “Mostra A” e “Mostra B” e descrizione testuale. Non deve essere l'unico modo di confrontare, né legare il gesto visivo al suono senza una scelta esplicita.

Il movimento del volume nel film mostra una scelta dell'utente: non una funzione che aumenta il volume da sola dopo Play. L'enfasi cinematografica non deve cambiare il guadagno relativo di A e B. Mix da giudicare con ascolto reale; nessun “pop” obbligatorio a ogni taglio se distrae dal contenuto.

## Controller: cosa migliorare dopo la prima forma

La [variante a due mani](../controller/controller-3d.html) introduce due impugnature arrotondate e sei comandi con simboli in rilievo. Nel [render del controller](../images/controller/presa.png) si valuta la finitura, nel modello si controllano disposizione e ingombri. Migliorare riconoscibilità tattile (Play distinto da Stop, riferimenti percepibili per precedente/successivo e Descrivi), collocazione USB e presa esterna, accesso ai comandi senza toccare la piastra, protezione e ventilazione del vano termico. Validare i rilievi su un campione inerte.

Il modello GLB contiene volumi interni modificabili. Le immagini artistiche dell'esploso non sono tavole ingegneristiche: prima della produzione finale le etichette devono seguire il componente corretto e la pila termica deve mantenere l'ordine piastra → TEC → dissipatore → ventola. Il montaggio finale userà il modello validato.
