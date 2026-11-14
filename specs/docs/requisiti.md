# Criteri di verifica

Criteri di sviluppo e collaudo. Le priorità interne ordinano le verifiche della singola area. La priorità di consegna delle funzionalità è riportata in [Prodotto](prodotto.md). Registrare i risultati su una versione identificabile.

| ID | Priorità | Requisito | Come verificarlo |
|---|---|---|---|
| SW01 | P0 | Apertura silenziosa e una sola scena selezionata: controllo all'utente | Avvio e ricaricamento senza audio né richieste attuatori; titolo, posizione, data e fonte disponibili |
| SW02 | P0 | Precedente, Ascolta/Pausa, Successiva, Descrivi stabili | Tutti azionabili da mouse, tastiera e adapter; cambio silenzioso in ascolto singolo o in pausa, avanzamento durante il percorso avviato |
| SW03 | P0 | Riprendi diverso da Riparti; Arresta indipendente | Pausa conserva posizione; Riparti va a zero; Arresta interrompe musica/voce, azzera posizione e revoca attuatori |
| SW04 | P0 | Ultima selezione autorevole | In 20 cambi rapidi non compaiono audio, testi, immagini o comandi attuatori associati a revisioni obsolete |
| SW05 | P0 | Descrizione comprensibile, senza ripresa inattesa | Descrivi sospende musica, conserva posizione, non riparte a fine voce; testo sempre disponibile |
| SW06 | P0 | Offline dopo installazione documentata | A rete disabilitata e browser riavviato: avvio, tutte le immagini selezionate, audio, voce locale, font e crediti funzionano |
| SW07 | P0 | Errori espliciti senza audio sostitutivo ingannevole | Asset assente/non valido o feature insufficienti producono messaggio e recupero; si può cambiare immagine |
| SW08 | P0 | Stessa partitura a parità di input | Confronto canonico della partitura su tre rigenerazioni identico, incluse revisioni e impostazioni |
| SW09 | P0 | Volume musica 0–100%, iniziale 25%; voce separata | Modifica via tastiera e controlli; mute a 0; il volume non modifica feature o note |
| SW10 | P0 | Dispositivo opzionale e stato esplicito | App completa in assenza del controller; perdita link sospende esperienza con ripresa manuale disponibile |
| SW11 | P1 | Campione curato per la demo, senza limite di prodotto | Campione iniziale qualificato; copertura del catalogo ufficiale misurata separatamente secondo SW15 e SW16 |
| SW12 | P1 | Risposta percepibile e diagnostica utile | Target sul PC dichiarato: risposta UI p95 ≤150 ms, pronto all'ascolto p95 ≤2 s su 20 avvii; dopo 10 s errore recuperabile |
| SW13 | P0 | Confini indipendenti fra raccolta, mapping e UI | Sostituzione del profilo raccolta senza cambiare navigazione o contratto; test con una raccolta dimostrativa dichiarata |
| SW14 | P0 | Tracciabilità della demo | Vista Fonte/Metodo espone dominio visuale, versioni, crediti, date e stato live-generato/pre-generato/simulato |
| UX01 | P0 | Tastiera e semantica native | Percorso completo con Tab, Maiusc+Tab, Invio/Spazio e slider nativi; nomi, ruoli e stati coerenti; nessuna trappola |
| UX02 | P0 | Focus e annunci prevedibili | Focus resta sul comando; un annuncio conciso per cambio; lettura ordinaria senza flussi aria-live delle note |
| UX03 | P0 | Leggibilità, contrasto e ingrandimento | Testo ≥4,5:1 ordinario, ≥3:1 grande; componenti pertinenti ≥3:1; zoom 200%, reflow 320 CSS px; prova sulla palette del prodotto |
| UX04 | P0 | Controlli semplici anche con difficoltà visive | Target principali ≥48×48 CSS px; indicatore focus visibile; nessuna funzione solo colore, hover o trascinamento |
| UX05 | P0 | Musica, voce e lettore di schermo non competono intenzionalmente | Modalità SR senza voce automatica dell'app; descrizione leggibile; musica sospesa su richiesta e nessun ritorno automatico |
| UX06 | P0 | Alternative al movimento e allo stereo | Nessun lampeggio; animazioni riducibili; in mono restano note, ritmo, timbro e contenuti essenziali |
| UX07 | P1 | Valutazione con persone rappresentative | Protocollo e consenso preparati, risultati reali distinti dai test interni; se non eseguita, dichiarazione esplicita |
| DA01 | P0 | Catalogo aperto organizzato per famiglie coerenti | Risorse ufficiali censite senza limite numerico; profili compatibili all'interno di ogni famiglia; campione iniziale distinto dalla copertura completa |
| DA02 | P0 | Manifest completo e provenienza riproducibile | Nessun asset pubblicabile con identità, fonte, crediti, data o trasformazioni essenziali mancanti |
| DA03 | P0 | Maschere esplicite | Titoli/loghi/legenda esclusi; terre e NoData distinti da pixel validi; revisione umana sovrapposta al raster |
| DA04 | P0 | Separazione visuale/quantitativa | Dominio scritto in UI, score e manifest; nessun °C dedotto da RGB/JPEG/EXR di visualizzazione |
| DA05 | P0 | Profilo sostituibile quando cambia la raccolta | Una nuova raccolta passa lo stesso validatore; incompatibilità non risolta mediante etichette false |
| SO01 | P0 | Legame tra contenuto e partitura, ripetibile | Regola scelta sui dati ufficiali documentata e riproducibile; hash non usato come generatore casuale di musica |
| SO02 | P0 | Scala fissa per confronti | Nessun min/max per singola immagine; stessi parametri per tutta la raccolta approvata |
| SO03 | P0 | Segnale controllato | Nessun NaN/Inf o clipping; inviluppi e transizioni; picchi misurati sull'export e ascolto dei passaggi |
| SO04 | P0 | Dati insufficienti e uniformità onesti | Immagine uniforme produce motivo semplice; maschera insufficiente impedisce generazione con spiegazione |
| SO05 | P1 | Musicalità senza nascondere il mapping | Confronto fra candidati sullo stesso input, dati raccolti senza inventare gradimento |
| SO06 | P0 | Perdita informativa esplicita | Documentati aggregazione spaziale, quantizzazione e collisioni; nessuna promessa che ogni scena suoni unica |
| HW01 | P0 | Board identificata prima del cablaggio | Foto/sigla/revisione fisica confrontate con schema, pin e flash/PSRAM; tabella pin approvata per quel pezzo |
| HW02 | P0 | Comandi distinguibili senza vista | Mappa tattile, forme e distanze documentate; prova su mockup; nessuna funzione essenziale in combinazioni Braille |
| HW03 | P0 | Attuatori separati dalla logica | Schema con rail, ritorni, driver, protezioni e assorbimenti; nessun attuatore alimentato da GPIO |
| HW04 | P0 | Arresto locale indipendente dal browser | Circuito di disabilitazione attuatori, default OFF, watchdog e percorso di fault documentati; test fisico futuro distinto dal simulatore |
| HW05 | P0 | Modulo termico completo e volontario. In simulazione ogni scena pronta ha una categoria caldo/freddo motivata | Sensori superficie/dissipatore, cutoff indipendente, consenso locale temporizzato, controllo corrente e recupero previsti |
| HW06 | P0 | Nessun setpoint presentato come sicuro senza prova | Profilo di contatto non abilitabile finché limiti, inerzia, condensa e guasti non hanno misure e revisione dedicata |
| HW07 | P0 | Alimentazione termica distinta dalla USB PC | Nessun collegamento positivo fra rail esterno e VBUS; verifica anti-ritorno e livelli segnali |
| HW08 | P1 | ERM con pattern pochi e coerenti | Distinzione azione accettata/limite/fault; stop locale sempre possibile; percezione da verificare |
| HW09 | P0 | Meccanica modulare realizzabile | Parametri legati agli ingombri reali, accesso USB/stop, separazione termica, montaggio e viste definite |
| HW10 | P0 | BOM e costi trasparenti | Quantità, alternative, costi stimati o verificati distinti; acquisti non eseguiti |
| HW11 | P0 | Firmware nativo ESP-IDF | Architettura task, parser limitato, ingressi, watchdog e fault specificati; nessuna dipendenza Arduino |
| HW12 | P1 | Mostrare progetto e limiti nel video | Render e simulazioni marcati; nessun claim di vibrazione o contatto termico misurati |
| CT01 | P0 | Sessione nuova e capacità esplicite | Nessun comando attivo prima di handshake e sync; versioni incompatibili rifiutate |
| CT02 | P0 | Scena e sequenza su eventi rilevanti | Duplicati non ripetono azioni; input obsoleto respinto; nuova scena invalida richieste vecchie |
| CT03 | P0 | Scadenze locali per attuatori | Ritardo, duplicato e comando rimasto in coda non riattivano effetti scaduti |
| CT04 | P0 | Stop e perdita link deterministici | Spegnimento locale senza ACK PC; pausa PC alla perdita; riconnessione senza ripartenza |
| CT05 | P0 | Parser e code limitati | Frame spezzati/uniti, JSON invalido, overflow e messaggi fuori ordine gestiti senza bloccare la supervisione |
| CT06 | P0 | Simulazione dichiarata e riproducibile | Stessi messaggi del futuro adapter; script dei guasti e log; nessuna temperatura presentata come misura |
| CT07 | P1 | Diagnostica leggibile | Stato porta, capability, fault e ultimo motivo di rifiuto disponibili senza log tecnico nel percorso principale |
| VD01 | P0 | Beneficio comprensibile nei primi 10 s | Apertura parla dell'accesso alle immagini; un osservatore sa dire cosa si fa prima della spiegazione tecnica |
| VD02 | P0 | Mostrare il percorso reale | Selezione, ascolto, cambio, ritorno, descrizione e stop visibili o narrati coerentemente con l'app verificata |
| VD03 | P0 | Due ascolti senza copertura | Due finestre da 4 s nel film di 29 s, stesso mapping e volume; nessuna voce o musica esterna sopra |
| VD04 | P0 | Legame immagine→feature→suono | Un solo esempio leggibile e corretto, tratto dalla partitura della scena mostrata |
| VD05 | P0 | Stato di evidenza per ogni asset/claim | Software reale solo dopo test; mockup CONCEPT; hardware PROGETTO; dispositivo SIMULATO dove pertinente |
| VD06 | P0 | Accesso anche senza udire o vedere il film | Sottotitoli sincronizzati, trascrizione descrittiva, voce che spiega azioni; non dipendere da testi silenziosi essenziali |
| VD07 | P0 | Qualità leggibile e audio controllato | Export senza tagli testo, clipping o errori frame; test su laptop e in mono; true peak e loudness registrati |
| VD08 | P0 | Conformità alla consegna ufficiale | Durata, lingua, formato, crediti e modalità invio confrontati con istruzioni correnti prima dell'export |
| VD09 | P1 | Verifica del coinvolgimento, senza promesse | Sessione esplorativa con domande di comprensione; nessuna retention dichiarata senza dati |
| VD10 | P1 | Montaggio adattabile ai media e ai vincoli ufficiali | Dataset e scene A/B sostituibili, durata e testi separati dagli asset; claim ricalcolati sulle evidenze |
| GV01 | P0 | Validazione prima dei ticket | Approvazione esplicita della versione e della macroarea registrata prima della prima scheda operativa |
| GV02 | P0 | Regole e risorse aggiornate | Registro di verifica con fonte, data di consultazione e differenze; nessun annuncio futuro trattato come contenuto letto |
| GV03 | P0 | Dipendenze aperte isolate | Ogni decisione dipendente da risorse/board/limiti ha responsabile, criterio di sblocco e fallback |
| GV04 | P0 | Provenienza e T0/D dichiarati | Istruzioni evento correnti e indicazione su lavoro precedente salvate; nessun orario inventato usato come scadenza reale |
| GV05 | P0 | Piano per una persona e tempo di consegna | Durata utile calcolata sottraendo riposo/logistica; freeze e primo invio antecedenti a D |
| GV06 | P0 | Ticket autonomi e verificabili, solo successivamente | Ogni ticket futuro riferisce requisiti, versione, input, output, test, dipendenze e limiti; nessuna approvazione implicita degli acquisti |
| SW15 | P0 | Catalogo estendibile a tutte le risorse ufficiali pertinenti | Nessun limite numerico codificato; ogni risorsa pubblicata censita con stato; risorse pronte navigabili senza modifica UI |
| SW16 | P0 | Playlist di tutte le immagini, accessibile senza schermo | Da home, Play del controller o primo comando da tastiera avvia tutte le scene una volta. Titolo e posizione accessibili, descrizioni facoltative, precedente, successivo, pausa e stop. |
| SO07 | P0 | Ripetizione sonora continua e controllabile | Almeno dieci cicli di immagine senza click, buchi introdotti al confine o crescita di voci/memoria; Stop sempre disponibile |
| UX08 | P0 | Direzione visiva semplice e concreta | Bozza visiva valutata dall'utente, comandi stabili, dettagli secondari su richiesta, verifica a ingrandimento |


## Piano delle prove

**Stato di tutte le prove di prodotto sotto: DA ESEGUIRE.** Le evidenze sono artefatti richiesti per il futuro, non file già presenti. La classificazione finale deve citare il test effettivamente svolto, l'ambiente, la data, la versione e l'esito; un test fallito non viene sostituito da un'affermazione narrativa.

| Verifica | Requisiti coperti | Metodo futuro | Risultato atteso | Evidenza da conservare | Limite |
|---|---|---|---|---|---|
| V-SW1 Percorso completo | SW01–03, SW09, UX01 | Avvio e sequenza tastiera Ascolta/Pausa/Riprendi/Riparti/cambio/stop | Stati e posizione coerenti, nessun autoplay | Registrazione, checklist, versioni OS/browser | Non copre tutte le tecnologie assistive |
| V-SW2 Concorrenza | SW04, SW07, CT02 | 20 cambi rapidi, callback ritardate, doppio input PC/device | Nessun output appartenente a scene vecchie | Log SceneRef/playbackGeneration, cattura | Verifica logica, non misura termica |
| V-SW3 Voce e SR | SW05, UX02, UX05 | NVDA sul target, modalità guidata e lettura testo | Focus stabile, annunci singoli, nessuna ripresa inattesa | Trascrizione azioni e registrazione autorizzata | Una combinazione non prova compatibilità universale |
| V-SW4 Offline e distribuzione | SW06, SW11–14, DA01/02/05 | Ambiente documentato, rete spenta, profilo browser pulito; sostituzione catalogo | Asset completi e percorso con tutte le scene selezionate; tempi registrati | Lista dipendenze, manifest, hash e misure 20 avvii | Non prova computer non testati o rete prima installazione |
| V-SW5 Errori | SW07, DA03, SO04 | Asset assente/corrotto, copertura insufficiente, timeout | Nessun brano generico o contenuto errato, recupero possibile | Casi di prova e log errori | Dati corrotti di ogni formato non esaustivamente coperti |
| V-UX1 Leggibilità | UX03/04/06 | Contrasto negli stati del lettore, 200%, 400%, 320 px, motion ridotta | Controlli e focus raggiungibili, no perdita informazioni | Screenshot e misure contrasto | Non equivale a test con utenti ipovedenti |
| V-DATA Provenienza | DA01–05, SW14, VD04 | Revisione manifest, crop/maschera sovrapposta, confronto fonte e legenda | Nessun claim quantitativo da RGB, date/crediti qualificati | Schede fonti, manifest, report maschera | Non ricostruisce automaticamente la climatologia |
| V-AUD1 Determinismo | SW08, SO01/02 | Fixture numerica, tre generazioni, soglie e immagine uniforme | Score identico, eventi previsti dal metodo approvato, mapping fisso | Score canonici, diff, versioni | Non promette PCM identico su browser diversi |
| V-AUD2 Segnale e ascolto | SO03–06, UX06/07 | Picchi, NaN, click, mono, confronto A/B e protocollo percettivo | Segnale controllato e limiti documentati; nessun risultato inventato | File audio, misure, schede anonime se svolte | Livello digitale non è SPL; campione piccolo |
| V-CT1 Sessione e parser | CT01–03, CT05 | Frammenti/unioni, overflow, replay, nonce, scene vecchie | Rifiuto o disarmo, niente riesecuzione | Transcript e clock virtuale | Non prova il driver USB Windows |
| V-CT2 Fault e fallback | SW10, CT03/04/06/07 | Link perso, pagina sospesa, guasti, reconnect e Stop | App riprendibile da PC, nessun attuatore riavviato | Log e video del simulatore etichettato | Non prova cutoff fisico né temperatura residua |
| V-HW1 Revisione documentale | HW01–03, HW07, HW09–11 | Schema, pin, BOM, bilanci, CAD e architettura firmware confrontati | Coerenza e liste di verifiche aperte; netlist/pin esecutivi solo dopo identificazione | Checklist tecnica e revisione documenti | Progetto credibile non significa costruito |
| V-HW2 Banco elettrico | HW01/03/04/07/08/11 | Continuità, alimentazioni, back-power, ERM, watchdog e Stop | Valori entro progetto esecutivo e disabilitazione reale | Foto, strumenti, firmware build e log | Solo se hardware effettivamente assemblato; fuori dal perimetro della consegna |
| V-HW3 Banco termico | HW04–06 | Sensori indipendenti, curve, inerzia, condensa e guasti senza contatto | Profilo e soglie determinati o termico escluso | Tracce strumentali e rapporto dimensionamento | Non autorizza automaticamente contatto umano |
| V-HW4 Ergonomia/contatto futuro | HW02/06/08/09, UX07 | Mockup inerte poi eventuale protocollo fisico qualificato | Comandi riconoscibili, limiti e risultati reali | Verbale e osservazioni volontarie | Richiede passi precedenti; nessun esito simulabile |
| V-VID1 Verità narrativa | VD01–05/10, HW12 | Confronto ogni scena con manifest, score e stato prodotto | Claim e label coerenti, due ascolti originali | Registro asset/claim e storyboard finale | Non misura coinvolgimento del pubblico |
| V-VID2 Qualità export | VD06–08 | Ispezione file finale, durata/frame, testo, sottotitoli, audio e link | Export leggibile, crediti e formato conformi | Report QA, hash MP4, SRT/VTT, trascrizione | Non basta controllare solo il progetto sorgente |
| V-VID3 Comprensione | VD09, UX07 | Domande a osservatori secondo protocollo | Distingue software/progetto e visuale/quantitativo | Conteggi reali e note | Nessuna retention o efficacia universale dedotta |
| V-GOV1 Validazione e differenze | GV01–04, GV06 | Verifica dell’approvazione e del registro delle decisioni | Schede operative solo su specifiche validate; dipendenze bloccate chiaramente | Esito utente, fonti, changelog futuro | Non sostituisce autorizzazione organizzatori |
| V-GOV2 Evento e consegna | GV04/05, VD08 | Calcolo H da orari ufficiali, freeze, verifica invio | Scopo proporzionato e ricevuta della consegna | Piano datato, link/ricevuta e hash | Invio non effettuato in questa fase |
