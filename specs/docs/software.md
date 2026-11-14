# Software PC

[Flusso del lettore e del percorso guidato](interazione.md) · [Requisiti verificabili](requisiti.md) · [Tavole](../images/galleria.html#sito). La tabella degli stati descrive il contenuto singolo. Nel percorso guidato avviato esplicitamente si applicano le regole di avanzamento descritte nel flusso.

## 2. Architettura principale

Scelta: TypeScript, DOM/HTML semantico, CSS, Web Audio e Worker per analisi. Vite può servire a sviluppo e build; non è il server indispensabile della demo. Runtime: file statici distribuiti con un piccolo launcher locale, legato a `127.0.0.1`, avviato con Node LTS già installato e provato offline. Nel ticket SW01 registrare le versioni di Node, browser e dipendenze usate sul PC target. Nessuna promessa che un PC privo di prerequisiti funzioni immediatamente.

Non distribuire una semplice pagina `file://`: il servizio locale deve offrire i tipi MIME corretti e gli asset sullo stesso origin. Nessuna CDN, font remoto o richiesta esterna nel percorso demo. Nessun backend applicativo, autenticazione, telemetria remota o service worker necessario. I link alle fonti possono aprire il web su richiesta e sono marcati come esterni; una scheda locale riporta comunque crediti e metodo.

| Modulo | Responsabilità | Input → output | Dipendenze consentite |
|---|---|---|---|
| Catalogo | Validare manifest, caricare asset e profilo raccolta | Cartella locale → SceneRecord validati o errori | Loader; non conosce DOM/audio/dispositivo |
| Coordinatore | Unico stato autorevole e ordinamento azioni | Action → AppState, effetti con token | Catalogo, audio, voce, adapter |
| Analisi | Feature pure del raster preparato | PreparedImage+mask+profile → FeatureSet | Worker, nessuna UI né rete |
| Mapping | Partitura deterministica | FeatureSet+mappingVersion → Score | Nessun clock reale o casualità |
| Audio | Generazione, trasporto, mix | Score+offset+gain → segnale e stato | Web Audio; non cambia scena |
| Descrizione | Testo e registrazione locale | SceneRecord+speechMode → testo/voce | Stesso coordinatore; token separato di riproduzione |
| UI accessibile | Controlli, annunci, preferenze | AppState → DOM; gesti → Action | Non scrive direttamente in attuatori/audio |
| DeviceAdapter | Contratto astratto identico | Eventi/intent ↔ messaggi | `None`, `Simulator`, `WebSerial` |
| Diagnostica | Errori e misure bounded | Eventi tecnici → esportazione volontaria | No dati personali; niente registrazione della voce dell'utente |

`SceneRef={sceneId, assetRevision, selectionRevision}`. `selectionRevision` cresce a ogni cambio anche se si torna alla stessa immagine. `playbackGeneration` cresce a Stop, cambio, pausa/nuova sorgente e interruzione: invalida callback audio rimaste in volo. Una risposta asincrona entra nello stato soltanto se entrambi i riferimenti pertinenti coincidono con quelli correnti. Cache di feature/partiture indicizzata da hash raster+maschera+profilo+versione mapping, mai dal solo titolo.

Caricare i contenuti su richiesta. Invalidare analisi e buffer obsoleti al cambio della selezione. Stimare il budget sul campione ufficiale e sul PC di consegna.

Il motore preparerà la partitura in base al metodo scelto. Per la riproduzione usare il clock audio e verificare la continuità del loop.

## 3. Macchina a stati dell'esperienza

Stati: `AVVIO`, `CARICAMENTO`, `PRONTO`, `RIPRODUZIONE`, `PAUSA`, `DESCRIZIONE`, `ERRORE`, `FINE_BRANO`. Dati ortogonali: `offset`, `speechMode`, `musicVolume`, `voiceVolume`, scena e stato connessione. Nessun cambio scena automatico.

| Stato / evento | Stato successivo | Effetti obbligatori |
|---|---|---|
| AVVIO / catalogo valido | CARICAMENTO | Seleziona prima immagine, carica; nessun suono |
| CARICAMENTO / scena pronta | PRONTO | Mostra contenuti coerenti e annuncia titolo/data/posizione |
| PRONTO / Ascolta | CARICAMENTO poi RIPRODUZIONE | Genera se necessario; `pendingPlay=true` legato al token e al gesto; se riesce parte da zero |
| CARICAMENTO audio / Arresta o cambio | PRONTO o nuovo CARICAMENTO | Azzera `pendingPlay`, invalida risultato e revoca attuatori |
| RIPRODUZIONE / Pausa | PAUSA | Salva offset, rampa 30 ms, ferma sorgente; sospende anche eventuale esperienza attuatori |
| PAUSA / Riprendi | RIPRODUZIONE | Nuova sorgente dal medesimo offset, rampa 30 ms; termico non riattivato |
| PRONTO, PAUSA, RIPRODUZIONE, FINE_BRANO / Descrivi | DESCRIZIONE | Salva offset ove pertinente; sospende musica, revoca attuatori; su richiesta avvia la voce locale oppure rende disponibile il testo al lettore di schermo |
| DESCRIZIONE / fine voce o secondo Descrivi | PAUSA se offset >0, altrimenti PRONTO | Ferma voce, conserva testo; nessun avvio musica |
| DESCRIZIONE / Ascolta | RIPRODUZIONE (o caricamento audio) | Interrompe la voce e riprende offset su gesto esplicito |
| RIPRODUZIONE / fine ciclo, Ripeti attivo | RIPRODUZIONE | Ripete lo stesso contenuto senza interruzioni audio introdotte dal confine; non rinnova stimoli fisici |
| RIPRODUZIONE / fine ciclo, Ripeti disattivo | FINE_BRANO | Arresta sorgente e attuatori; annuncia fine una volta; Ascolta sarà etichettato Riascolta |
| FINE_BRANO / Riascolta | RIPRODUZIONE | Da zero; comportamento successivo secondo Ripeti |
| Stato con scena / Riparti | PRONTO | Musica/voce ferme, offset zero; serve Ascolta, per evitare avvio inatteso |
| Qualsiasi stato / Arresta | PRONTO se scena valida, altrimenti ERRORE | Rampa audio 30 ms, annulla voce e operazioni pendenti, offset zero, revoca attuatori |
| Stato con raccolta / Precedente o Successiva valido | CARICAMENTO | Fade vecchia musica 80 ms, stop voce, invalida token, cambia scena, offset zero, nessun pendingPlay |
| Primo/ultimo elemento / spostamento fuori raccolta | Invariato | Annuncia Inizio/Fine raccolta; non cambia indice né interrompe il brano corrente |
| Operazione / errore | ERRORE | Nessun suono residuo; testo con Riprova e navigazione; mantiene identità della scena fallita |
| ERRORE / Riprova | CARICAMENTO | Nuovo token, niente autoplay |

Nella modalità lettore di schermo `Descrivi` sospende e annuncia una sola volta il testo breve attraverso una regione dedicata, mantenendo il focus. Il testo esteso resta navigabile sotto l'immagine. Non si può conoscere la fine della lettura: lo stato torna subito a PAUSA/PRONTO e l'utente sceglie quando Ascolta. Nessuna stima automatica del tempo di parola.

Il caricamento conserva la cornice e i pulsanti: Ascolta è temporaneamente indisponibile con stato accessibile; Precedente, Successiva, Arresta restano attivi. Gli input di navigazione vengono elaborati in ordine, ma si carica solo la selezione finale. Vietato accumulare ascolti da eseguire dopo.

## 4. Concorrenza, interruzioni ed errori

- Tutti gli input PC/controller entrano nello stesso riduttore seriale. Parità temporali risolta con un contatore locale crescente, senza confrontare gli orologi dei due dispositivi. Arresta ha priorità sugli effetti ancora da eseguire. Due pressioni intenzionali distinte non sono eliminate come duplicati.
- Input USB contiene scena attesa: se obsoleta, il PC risponde `STALE_SCENE` e nuovo stato. Non si applica per errore un comando alla nuova immagine. Dettagli nel [contratto](protocollo-controller.md).
- `keydown.repeat` non ripete Ascolta/Descrivi/Navigazione. Slider volume può ripetersi; encoder aggregato in delta controllati. Debounce fisico previsto 30 ms, da verificare.
- Fine frase o risposta fetch vecchia non cambia lo stato corrente: controlli dei token su ogni callback, incluse voce e conferme del simulatore.
- Link perso durante riproduzione: pausa, voce fermata, nessun blocco della tastiera. Messaggio «Controller scollegato. Puoi riprendere dal PC». Se il dispositivo non era mai collegato, nessuna interruzione per semplice assenza.
- Background della pagina o sospensione del computer: pausa/revoca; al ritorno ripresa manuale. I timer browser possono essere rallentati: la protezione fisica appartiene al dispositivo.
- Asset mancante: identificativo e azione Riprova, nessuna miniatura della scena precedente con nuovo titolo. Audio fallito: testo e immagine disponibili, errore specifico, navigazione libera. Catalogo completamente invalido: messaggio iniziale e nessun pulsante che finga una raccolta valida.
- Voce mancante: descrizione testuale integra e annuncio di indisponibilità; nessuna chiamata TTS online nascosta. Preferenze corrotte: valori iniziali, spiegazione sintetica.

## Avvio senza schermo

Dalla home il primo controllo raggiungibile è «Avvia playlist». Il Play del controller simulato richiama lo stesso comando. Usare un solo lettore per l’intera lista, per la scena singola e per A/B. I cambi di scena aggiornano titolo, indice, descrizione, partitura e categoria termica con lo stesso identificatore. [Regole del trasporto](interazione.md).
