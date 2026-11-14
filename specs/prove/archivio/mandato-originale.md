# Mandato originale di ORBIT

Documento di archivio. Per sviluppare la versione approvata usare le [istruzioni correnti](../../AGENTS.md) e i [ticket](../../ticket/README.md).

## Testo originale

Contesto consolidato il 31 ottobre 2026. Questo testo e sufficiente per iniziare una nuova conversazione: la vecchia chat e la precedente directory del progetto verranno eliminate. Non richiedere di recuperarle. Non presumere che esistano file, codice, CAD, immagini, registrazioni o tool del progetto precedente.

## 1. Il tuo incarico e il risultato che voglio

Agisci come progettista di prodotto, software architect, specialista di accessibilita, progettista di sonificazione musicale e sistemi embedded. Lavora in italiano, con spiegazioni chiare e tecnicamente verificabili.

Voglio definire con precisione un prodotto chiamato provvisoriamente **ORBIT**, per la challenge NASA Space Apps 2026 **The Earth Information Jukebox**. L'obiettivo immediato e una specifica completa e comprensibile, con flussi utente, architettura, hardware, interazione PC-dispositivo, piano di lavoro per l'evento e racconto del prodotto attraverso uno storyboard/video.

La prima fase e definizione e progettazione. Non iniziare direttamente a sviluppare l'app, il firmware o la meccanica. Rendi prima concrete le decisioni, confronta le alternative importanti e proponi una soluzione principale. Quando la specifica e pronta, presentala per discuterla; la produzione successiva segue il perimetro concordato. Non ripetere all'infinito che servono decisioni: prepara una proposta completa con assunzioni esplicite.

Il prodotto da realizzare durante l'evento e soprattutto **un software PC funzionante e accessibile**. L'hardware immersivo deve essere progettato seriamente, ma puo essere presentato soltanto attraverso schemi, CAD, render e simulazione del collegamento. Un dispositivo fisico costruito non e necessario al successo della prima consegna.

Tutta la documentazione deve consentire a una persona o a un'altra AI di comprendere e ricreare il prodotto senza questa conversazione.

## 2. Contesto reale e decisioni dell'utente

- Pubblico principale: persone cieche e persone con importanti difficolta della vista. L'app deve essere gradevole anche per chi vede.
- Esperienza: scorrere un'immagine intera dopo l'altra, ascoltarne una descrizione e il suono generato, tornare indietro e riascoltare. La navigazione manuale fra zone, pixel, ROI o griglie e esclusa dal percorso iniziale.
- Suono: interessante, piacevole e legato all'immagine, con regole spiegabili. Non una musica generica aggiunta come sottofondo.
- Interfaccia: bella, semplice, pochi controlli, leggibile con ingrandimento e utilizzabile senza guardare lo schermo.
- Estensione hardware desiderata: comandi riconoscibili al tatto per scorrere le immagini e usare l'app, vibrazione, piastrina con caldo/freddo tramite Peltier. Deve arricchire l'esperienza senza essere necessaria all'app.
- Analisi delle immagini e sintesi audio sul PC. L'ESP32 controlla ingressi e attuatori; non e necessario fargli generare l'audio.
- Budget precedente di 50 USD preferiti / 100 USD massimi **esplicitamente sospeso**. Non reintrodurlo. Restano fattibilita, complessita proporzionata e costi documentati. Nessun acquisto e autorizzato da questo prompt.
- Scheda gia posseduta: prevista Waveshare ESP32-S3-Zero, ESP32-S3FH4R2, dal prodotto Amazon B0CSK8B4GS. Revisione fisica, pinout, flash e PSRAM devono essere confermati prima di un circuito esecutivo. Non assumere il pinout di una DevKitC.
- Firmware: ESP-IDF nativo, niente dipendenza Arduino.
- Costruzione hardware preferita: supporto modulare su millefori, non PCB personalizzata da produrre. Il termine render della scheda significa supporto con moduli e cablaggi, non Gerber gia pronti.
- Utensili e componenti di base disponibili al lavoro: saldatore, strumenti e passivi/cavetti recuperabili. Non sono disponibili a casa come dotazione personale confermata.
- Al 30 ottobre: nessun nuovo componente acquistato e nessun team formato. Dimensionare inizialmente il lavoro per una persona; un team futuro non e garantito.
- Partecipazione prevista a Milano; logistica riferita dall'utente: tavoli, prese e Wi-Fi, nessun kit o componente fornito. La demo deve funzionare senza rete.
- Pianificazione storica: evento 14-15 novembre 2026, Europe/Rome. Date, orari locali, submission e durata del pitch vanno riconfermati.
- Nome ORBIT provvisorio: non inventare un acronimo obbligatorio o una certificazione del prodotto.

## 3. Provenienza, regole e fonti da verificare

Il 30 ottobre 2026 la pagina ufficiale Details era stata letta integralmente. Riassunto della consultazione, da riconfermare alla data del tuo lavoro:

- La challenge propone di associare visualizzazioni dell'Earth Information Center a sonificazioni dinamiche.
- Gli Objectives ammettono esperienze interattive e anche raccolte curate di audio originale generato, accompagnato dalle immagini e dalla spiegazione del processo.
- Accessibilita, interpretazione dei dati e musicalita sono temi centrali.
- Le Potential Considerations erano esplicitamente facoltative; MCU, Peltier, ML e streaming satellitare live non risultavano obblighi.
- Resources mostrava l'annuncio di disponibilita per venerdi 13 novembre. Non assumere che l'elenco sia gia disponibile o che sia rimasto invariato.
- Il banner ricordava di non iniziare i progetti prima dell'hackathon. La precedente preparazione comprendeva documentazione, CAD, codice di banco e un video concept: il riuso competitivo deve essere dichiarato e chiarito con gli organizzatori. La cancellazione dei file non cambia la provenienza del lavoro. Mostrare soltanto un progetto hardware non risolve automaticamente l'ammissibilita.

Verifica le fonti ufficiali attuali, separando contenuto letto, annuncio futuro e informazione non accessibile. Non usare vecchie FAQ di altri anni o staging come regole 2026 definitive. Se una pagina non si apre, non dichiararla inesistente. Non bloccare tutta la progettazione per un dettaglio logistico non verificabile: rendi esplicita l'incertezza.

Fonti iniziali:

- Evento: https://www.spaceappschallenge.org/2026/
- Challenge: https://www.spaceappschallenge.org/2026/challenges/the-earth-information-jukebox/?tab=details
- Resources: https://www.spaceappschallenge.org/2026/challenges/the-earth-information-jukebox/?tab=resources
- FAQ: https://www.spaceappschallenge.org/resources/participant-faqs/
- Eventi locali: https://www.spaceappschallenge.org/2026/local-events/
- Galleria NASA EIC: https://svs.gsfc.nasa.gov/gallery/daily-visualizations/
- Candidato SST Anomaly: https://svs.gsfc.nasa.gov/5176/
- Altro candidato storico, luci notturne EIC: https://svs.gsfc.nasa.gov/5313/
- Precedente metodologico di scansione sonora, non dati EIC: https://www.chandra.si.edu/photo/2020/sonify/
- Board: https://docs.waveshare.com/ESP32-S3-Zero
- ESP-IDF: https://docs.espressif.com/projects/esp-idf/en/v5.5.1/esp32s3/
- Web Serial: https://developer.chrome.com/docs/capabilities/serial
- WCAG: https://www.w3.org/TR/WCAG22/

Questi URL sono punti di partenza e non prove gia raccolte nella nuova sessione. Versioni software, prezzi e disponibilita devono essere verificati quando diventano scelte effettive.

## 4. Confini del prodotto e presentazione onesta

Definisci due risultati coordinati:

**A. Software PC da dimostrare funzionante:** raccolta EIC, navigazione, descrizioni, algoritmo, audio, accessibilita, offline e gestione errori.

**B. Controller immersivo da presentare come progetto realizzabile:** architettura, interazione, componenti e alimentazioni, firmware previsto, progetto termico, meccanica, viste e piano di verifica. Il collegamento puo essere verificato logicamente con un simulatore dichiarato.

Non trasformare la scelta di mostrare soltanto il progetto in un oggetto esteticamente bello ma elettricamente irrealizzabile. Non dichiarare connessione reale, contatto termico sicuro, prestazioni, utenti soddisfatti o accessibilita validata senza prove.

Il prodotto precedente aveva un banco ESP-IDF compilato, un DSP granulare sulla MCU e un case con batteria. Non ereditarne pin, dimensioni, BOM, protocollo, obiettivi di autonomia o roadmap: quei file non sono necessari e la nuova direzione e diversa. Considera tutto da ricostruire dalla specifica, con implementazione NASA ancora da fare.

Usa sempre stati distinti: proposta, specificato, implementato, compilato, simulato, esportato, costruito, misurato, verificato con utenti.

## 5. Flusso utente PC da specificare

Proposta di base coerente con le richieste:

1. Apertura senza audio automatico, con titolo e presentazione breve.
2. Una sola immagine selezionata, con titolo, posizione nella raccolta, data/intervallo, descrizione e fonte accessibili.
3. Quattro comandi principali stabili: Precedente, Ascolta/Pausa, Successiva, Descrivi.
4. Volume musica e Arresta sempre raggiungibili. Riprendi conserva la posizione; Riparti e un comando secondario distinto.
5. Il cambio immagine sfuma e ferma il vecchio suono, annulla elaborazioni e richieste vecchie, aggiorna identita e contenuti, comunica il nuovo titolo e attende un nuovo Ascolta. Una modalita playlist continua puo essere futura.
6. Il focus rimane sul comando azionato; non saltare fra immagine, pannelli e testo.
7. Ai limiti della raccolta comunicare inizio/fine senza ritorno circolare inatteso.
8. Descrivi sospende la musica per rendere comprensibile il testo. Specifica se e come riprendere dopo, evitando ripartenze inattese.
9. Per confrontare due immagini basta tornare indietro e riascoltare con identico mapping.

Definisci una macchina a stati per almeno: avvio, pronto, caricamento, riproduzione, pausa, descrizione, errore e fine brano. Definisci separatamente lo stato della connessione al controller. Descrivi le conseguenze di pressioni rapide, input contemporanei PC/controller, fine raccolta, asset mancante, generazione fallita e perdita della porta USB.

La selezione di un'immagine deve avere un identificativo/revisione: un'elaborazione vecchia non puo aggiornare immagine, audio, descrizione o attuatori di una scena nuova.

## 6. Interfaccia e accessibilita

Progetta un'interfaccia comune con preferenze accessibili, senza costringere l'utente in un percorso semplificato separato e incompleto.

Direzione visiva: immagine protagonista, titolo grande, controlli in posizione stabile sotto l'immagine, spazio libero, descrizione breve e pannello secondario per fonte/legenda/preferenze. Nessun testo essenziale sopra immagini variabili. Nessun pannello da sintetizzatore nella schermata principale.

Requisiti da trasformare in criteri verificabili:

- Operazioni complete con tastiera, ordine logico, nessuna trappola, focus visibile.
- Controlli HTML semantici, nome/ruolo/stato leggibili; non mettere tutta l'interazione in un canvas.
- Titolo, data e posizione annunciati al cambio; niente aria-live continuo delle feature musicali.
- Testi significativi per immagini e fenomeni: non descrizioni dedotte arbitrariamente dai colori.
- Temi chiaro/scuro entrambi verificati e rispetto delle preferenze del sistema dove appropriato. Non dichiarare uno schema universalmente migliore per ipovedenti.
- Contrasto almeno 4,5:1 per testo ordinario, 3:1 per testo grande, oltre ai requisiti pertinenti per controlli/focus da verificare nelle fonti.
- Comandi principali almeno 48 x 48 CSS px come scelta progettuale nostra; non presentarla come soglia minima AA universale.
- Testo di base intorno a 20 px come proposta, scalabile; verifica a 200% e reflow a 400% su viewport iniziale 1280 px. Controlli e testo non devono sparire.
- Nessuna funzione essenziale affidata a colore, hover, trascinamento o animazione.
- Movimento riducibile e assenza di lampeggi.
- Nessun avvio sonoro automatico. Volume della musica indipendente dal volume di sistema e arresto facile.
- Voce guidata opzionale, volume distinto. Modalita per lettore di schermo che eviti duplicazioni. Non presumere di poter rilevare automaticamente un lettore di schermo o sapere quando sta parlando.
- Descrizioni registrate o sintesi vocale locale provata offline: non presumere che tutte le voci browser siano locali.
- Informazioni principali conservate in mono; stereo come arricchimento.

Prepara flussi distinti per uso visivo con ingrandimento, tastiera con lettore di schermo e controller futuro. Non chiamare accessibile un prodotto solo perche possiede pulsanti o etichette Braille. Coinvolgere persone rappresentative e un obiettivo; se non disponibili, dichiarare i limiti del test interno.

## 7. Sonificazione: ipotesi da trasformare in algoritmo preciso

Obiettivo: audio originale generato dalle immagini, musicalmente controllato, ripetibile e piacevole da esplorare. La gradevolezza non e garantibile per ogni immagine e ogni persona: controlla il segnale e confronta ascolti reali.

Proposta principale ancora da valutare, non algoritmo approvato:

- Una raccolta curata iniziale di circa sei immagini coerenti di un fenomeno EIC; estensione a 6-12 solo se sostenibile.
- Composizione ambient morbida di circa 20-30 secondi, senza loop automatico.
- Massimo tre strati: fondo armonico, motivo riconoscibile, pulsazione discreta.
- Scala e tonalita comuni alla raccolta; pentatonica come ipotesi iniziale.
- Profilo interno di circa otto fasce verticali per il motivo. La scansione e automatica: l'utente naviga immagini intere.
- Luminosita del profilo -> note nella scala; proporzioni cromatiche -> miscela di timbri compatibili; dettaglio/contrasto -> densita limitata degli eventi.
- Informazione fisica verificata, quando disponibile -> una voce o parametro con legenda specifica del fenomeno.

Confronta questa proposta con una variante piu melodica basata sulle stesse feature. Scegli una direzione principale motivata. La scansione diretta pixel-suono e il granulare possono essere riferimenti, senza ricostruire tre motori audio per principio.

La specifica deve definire formule, dominio dei valori, normalizzazione, statistiche, maschere, quantizzazione musicale, registro, timbri, tempo, durate, inviluppi, numero di voci, scheduling, transizioni e gestione dei casi limite. Non fermarti a una tabella vaga colore -> emozione.

Vincoli essenziali:

- Stesso asset preparato, versione del mapping e impostazioni -> stessa partitura. Un hash puo identificare l'asset, ma non sostituire il legame fra contenuto e note.
- Baseline/scale fisse per raccolta o confronto, non riscalate per ogni immagine.
- Crop e maschere escludono titoli, legende, date, loghi, terre/NoData secondo il prodotto. Mai nero=NoData per automatismo.
- Immagini a falsi colori e fotografie richiedono interpretazioni distinte.
- Luminanza RGB non e temperatura, radiance, NDVI o energia. Non invertire un JPEG per dichiarare misure precise.
- Il tempo della scansione musicale non e tempo dell'osservazione satellitare.
- Un'immagine uniforme genera un risultato semplice, non dettagli inventati per renderla interessante.
- Dati insufficienti producono uno stato esplicito e fermano la generazione; non un brano generico che nasconde il problema.
- Immagini simili possono suonare simili. Misura quanta distinzione si perde; non aggiungere differenze arbitrarie.
- Evitare clipping digitale, click, picchi e brusche variazioni. Inviluppi graduali, mix con margine e protezione dei picchi. Volume iniziale moderato e controllabile; un limiter non garantisce da solo un livello acustico sicuro sul PC.
- Volume generale come preferenza dell'utente, non variabile scientifica essenziale. Non cancellare con normalizzazione una grandezza che dichiari di codificare nel livello.
- Documenta perdita informativa e scelte artistiche, senza presentare il suono generato come registrazione della Terra.

Prepara un esempio numerico completo immagine/feature -> partitura e un piano per confrontare comprensibilita, piacevolezza e affaticamento. Sono necessari ascolti futuri: non inventarne gli esiti.

## 8. Immagini e dati NASA

Seleziona una raccolta piccola e scientificamente comprensibile prima di proporre importazione di immagini arbitrarie.

Per ogni immagine definisci un manifest con almeno: identita, titolo, descrizione visuale, descrizione del fenomeno, fonte, crediti, versione, observationStart/End, retrievedAt, hash, formato/dimensioni, crop/maschera, proiezione quando pertinente, trasformazioni, featureDomain visuale/quantitativo, baseline e limiti del mapping.

Mantieni distinti momento dell'osservazione, recupero del file, posizione nella composizione e clock audio. Replay storico e audio generato al momento non equivalgono a dati live.

Candidato interessante per integrare il termico: **SST Anomaly, NASA SVS 5176**. Nella consultazione precedente mostrava vista equirettangolare e legenda blu-bianco-rosso da -4 a +4 gradi Celsius, ed era nella galleria EIC. Da verificare: frame adatti, date, baseline dell'anomalia, distinzione terre/NoData/neutro e relazione con i dati originali MUR. Un EXR non garantisce valori scientifici originali; il link a MUR non basta a spiegare come ricostruire l'anomalia mostrata.

Un'anomalia positiva rispetto alla climatologia e diversa dall'aumento fra due date. Caldo/freddo devono avere uno dei due significati dichiarato, non passare dall'uno all'altro.

Questo candidato non e obbligatorio. Luci notturne EIC e altri fenomeni possono essere valutati. Non scegliere un dataset soltanto per giustificare la Peltier. Non aggiungere GIBS, mappe, CMR/Harmony o collezioni quantitative se non servono al percorso scelto.

## 9. Software PC e architettura

Prima proposta: app web locale per PC Windows, TypeScript, HTML semantico e sintesi audio nel browser; browser/versioni da verificare. Vite e un possibile strumento di sviluppo, non una dipendenza funzionale da imporre senza motivo. Evita backend/cloud/framework aggiuntivi senza vantaggio concreto.

Nessun servizio AI a pagamento, API key o abbonamento necessario al funzionamento. Prima installazione puo richiedere rete; la demo deve poi avviarsi con asset, font, campioni e descrizioni locali. Documenta i prerequisiti per un PC nuovo, non solo il computer dello sviluppatore.

Separazione logica:

1. Catalogo e manifest NASA.
2. Selezione, navigazione, stato e preferenze.
3. Analisi immagine e mapping versionato.
4. Partitura e motore audio/mix.
5. Descrizioni, tastiera e accessibilita.
6. Interfaccia astratta del dispositivo con adapter simulato e futuro adapter USB.
7. Log di errori e misure senza dati personali non necessari.

Definisci moduli, responsabilita, dipendenze e dati scambiati; scegli uno stack principale, un solo trasporto iniziale e un fallback. Non progettare contemporaneamente web, desktop nativo, BLE, Wi-Fi e piu backend audio.

## 10. Controller immersivo: specifica da produrre

Controller piccolo da tavolo, stabile e orientabile al tatto. Non fissare dimensioni prima degli ingombri dei componenti e del dissipatore.

Ingressi previsti: precedente, successiva, ascolta/pausa, descrivi, volume e arresto. Una richiesta termica volontaria puo richiedere un comando dedicato; definiscilo senza nascondere una funzione essenziale in un gesto difficile.

Pulsanti fisici con forma/spaziatura distinguibili. Eventuali etichette Braille corrette e verificate; non e richiesta una tastiera Braille a combinazioni ne un display Braille dinamico. L'utente deve poterlo usare senza conoscere quel codice.

Uscite:

- Vibrazione: conferma di azioni e/o intensita di un aspetto del fenomeno, con pattern distinti e pochi significati. Conferma locale della pressione e conferma dell'azione realmente eseguita dall'app sono diverse.
- Peltier: uno stato lento sintetico dell'immagine, legato a una variabile o convenzione dichiarata. Non segue ogni nota; non e obbligatorio che ogni immagine attivi il termico. Se il significato manca, disabilitare il canale e spiegarlo.
- Nessun OLED necessario alla prima funzione. Valutalo solo con un beneficio concreto.

Progetta alimentazioni, driver, protezioni, connettori, fissaggi e componenti reperibili. ERM con driver semplice o LRA con driver dedicato sono alternative da confrontare; non collegare attuatori direttamente ai GPIO.

Sistema termico completo: cella, piastrina arrotondata e isolata elettricamente, interfacce, dissipatore, eventuale ventola, driver bidirezionale con corrente limitata, sensori superficie/dissipazione, cutoff indipendente, arresto e alimentazione adeguata. Il dissipatore smaltisce anche la potenza elettrica consumata. Un ponte H generico non e automaticamente un controller TEC completo.

Richiesta termica temporizzata e volontaria; limiti locali indipendenti dal browser; timeout link; sensori aperti/corti e altre anomalie portano a disattivazione. Definisci stato neutro, preparazione, pronto, attivazione, recupero e fault. Spegnimento elettrico non significa superficie subito neutra: inerzia termica e condensa vanno valutate.

Non fissare intervalli di temperatura, tempi di contatto o potenze come sicuri senza dimensionamento e verifica. Prima prove strumentali senza contatto umano. Non promettere alimentazione del termico dalla sola USB del PC: puo servire alimentazione separata con separazione dei rail e prevenzione dei ritorni verso la porta.

Fornisci BOM con alternative, costi verificati o stime marcate, bilancio elettrico/termico, schema e scelta pin verificata. Per la meccanica: modello parametrico, supporto modulare, accesso ai comandi, cavi, dissipazione, montaggio e render della scheda, del contenitore e dell'esploso. Il grado di dettaglio iniziale deve essere sufficiente a dimostrare fattibilita, senza inventare misure reali.

## 11. Contratto PC-controller

Il PC e autorevole per immagine selezionata, stato dell'esperienza e audio; il controller e autorevole per i propri limiti fisici, fault e arresto degli attuatori. Il PC non invia PWM o temperature senza limiti.

Specifica eventi di navigazione dal controller, risposta dell'app, capacita disponibili, richieste aptiche/termiche limitate, stato e guasti. Scegli USB bidirezionale: Web Serial e candidata, da verificare con la board e con il selettore di porta accessibile. L'emulazione di tastiera da sola non risolve automaticamente il feedback bidirezionale.

Ogni messaggio rilevante deve avere sessione, sequenza e riferimento alla scena/revisione corrente. Le richieste attuatore devono scadere; definisci handshake, heartbeat, timeout, coda, duplicati, riconnessione e incompatibilita di versione. I numeri precisi sono scelte da motivare, non valori gia approvati.

Obblighi:

- Nessun dispositivo: app completa utilizzabile, collegamento opzionale.
- Dispositivo simulato: stato visibile nella vista demo; nessun claim di azione fisica.
- Connesso: comandi e conferme sincronizzati con l'immagine corrente.
- Cambio immagine: richieste vecchie annullate; per il termico rispettare recupero e nuova attivazione volontaria.
- Arresto: attuatori disattivati localmente e richiesta al PC; l'arresto audio del laptop dipende dal collegamento/app. Mantieni un comando PC indipendente e raggiungibile.
- Link perso: attuatori disattivati localmente; l'app annuncia il problema, sospende l'esperienza e permette ripresa esplicita da tastiera. Nessun blocco permanente dell'app per mancanza hardware.
- Riconnessione: handshake nuovo, nessun vecchio comando termico ripreso automaticamente.

Definisci un simulatore del contratto per dimostrare la futura integrazione. Test del simulatore significa verifica logica: temperature, vibrazioni percepite e comportamento elettrico restano non provati.

## 12. Racconto del prodotto e possibile video

Prepara una descrizione breve del prodotto, una spiegazione estesa e una sceneggiatura con storyboard. Prima specifica cosa fa il prodotto, poi come mostrarlo.

Il video deve far capire:

1. Il problema: accedere a visualizzazioni scientifiche senza dipendere dalla vista.
2. L'azione semplice: scegliere un'immagine, ascoltare, cambiare, tornare indietro, chiedere descrizione.
3. Il legame immagine -> caratteristiche -> composizione, con un esempio leggibile.
4. L'estensione fisica: gli stessi comandi piu vibrazione e termico, mostrati tramite progetto.
5. Cosa e stato realmente implementato, simulato, progettato o lasciato futuro.

Proponi un video di prodotto di circa 60-90 secondi come ipotesi narrativa, da adattare ai limiti ufficiali. Non trattare questa durata o il formato come requisito NASA verificato. Un eventuale taglio social e separato e secondario.

Lo storyboard deve contenere per scena: durata, obiettivo, inquadratura, UI o render, azione, voce, testo a schermo, suono originale, asset necessari e stato dell'evidenza. Inserisci pause sufficienti ad ascoltare almeno due risultati; non coprirli con una musica di sottofondo estranea.

Prevedi sottotitoli, trascrizione, testi leggibili e narrazione che descriva le azioni. Render o animazioni del termico devono essere etichettati progetto/simulazione; non rappresentare una reazione umana come prova reale se e una ricostruzione. Mockup PC pre-implementazione etichettati concept. Usa crediti NASA e licenze degli asset.

In questa fase consegna script e storyboard. La produzione del video e successiva alla specifica e alla disponibilita degli asset, salvo ulteriore richiesta esplicita. Non assumere che esistano render, registrazioni o vecchi video riutilizzabili.

## 13. Piano del giorno dell'evento

Produce un piano eseguibile per una persona, con variante per collaboratori eventuali. Non assegnare tre ruoli a tre persone inesistenti.

Prima fissa T0, inizio autorizzato, e D, la piu precoce scadenza applicabile fra sede/submission/pitch. Verifica orari, timezone, durata utile, pause e prerequisiti. Non assumere 48 ore consecutive di sviluppo: una finestra sabato 09:00-domenica 23:59 e circa 39 ore e non e confermata qui.

Ogni blocco deve indicare: input, compito, dipendenze, risultato verificabile, tempo previsto, criterio di avanzamento, fallback e lavoro eliminabile.

Ordine principale:

1. Regole e perimetro, raccolta e crediti.
2. Primo percorso reale: un'immagine EIC -> feature -> audio -> controlli accessibili.
3. Seconda immagine e navigazione precedente/successiva ripetibile.
4. Descrizioni e primo test tastiera/lettore di schermo.
5. Piccola raccolta coerente, offline e gestione errori.
6. Confronto musicale e correzione dei problemi udibili.
7. Simulatore del controller e progetto hardware entro il margine disponibile, senza compromettere il percorso PC.
8. Prove finali, freeze, registrazione demo, video/pitch, crediti e submission.

Riserva tempo reale per riposo, preparazione della consegna e problemi di rete. Proponi freeze entro D-5 ore, registrazione/documenti entro D-4, primo invio entro D-1, adattandoli alla finestra confermata. Non promettere la costruzione termica durante l'evento.

Fallback ordinati: meno immagini ma curate; mapping piu semplice ma tracciabile; audio originale pre-generato con metodo documentato e presentato come tale; galleria locale se la sintesi live fallisce; hardware solo progettato; video breve con cattura schermo anziche animazioni complesse. Verifica l'ammissibilita di ogni fallback nelle guide correnti. Non dichiarare live un file audio preregistrato.

## 14. Verifica e definizione di completamento

Prepara una matrice requisito -> metodo -> risultato atteso -> evidenza -> limite. I target numerici ancora non scelti vanno motivati, senza trattare il vecchio obiettivo embedded di 100 ms come risultato o requisito corrente.

Prove software previste:

- Avvio su ambiente documentato, poi rete spenta e asset tutti disponibili.
- Percorso completo con tastiera e lettore di schermo: ascolto, cambio, ritorno, descrizione, volume e arresto.
- Contrasto e zoom nei vari stati, nessuna azione nascosta all'ingrandimento.
- Stesso input/versione/impostazioni -> stessa partitura.
- Passaggi rapidi senza suono, testo o richieste attuatore di immagini precedenti.
- Immagine uniforme, mancante, non valida e con dati insufficienti gestite esplicitamente.
- Mix controllato e ascolti comparativi; affaticamento e gradevolezza descritti con limiti del campione.
- Modalita mono e interazione fra musica, voce guidata e lettore di schermo.
- App completa senza controller; simulatore con collegamento, fault e timeout.

Le prove fisiche future richiedono evidenze proprie: continuita, alimentazioni, driver, protezioni, guasti, dissipazione, inerzia, contatto e percezione. CAD o simulatore non le chiudono.

La prima consegna e riuscita se l'app consente il percorso completo senza vista e senza hardware, con dati e suono tracciabili e demo offline; il controller e descritto in modo tecnicamente credibile con stato di verifica onesto. Accessibilita e gradevolezza non si certificano con una sola demo interna.

## 15. Elaborati richiesti e modo di lavorare

Consegna un dossier autonomo, in Markdown, con un indice di lettura e almeno:

1. Visione del prodotto e perimetro della consegna.
2. Registro decisioni: confermate dall'utente, proposte tue, assunzioni, verifiche aperte.
3. Specifica software con requisiti identificati, flussi e macchine a stati.
4. Specifica di sonificazione con formule, esempio e piano degli ascolti.
5. Specifica hardware con architettura, alimentazione, attuatori, meccanica, rischi concreti e verifiche necessarie.
6. Contratto PC-controller con esempi, stati, timeout e simulatore previsto.
7. Specifica UX/accessibilita e bozze delle schermate, etichettate concept.
8. Piano evento dipendente dalla scadenza e checklist della consegna.
9. Narrazione del prodotto, script e storyboard del video.
10. Fonti, date di consultazione, provenienza e matrice di verifica.

Ogni requisito deve avere priorita, motivo e criterio di completamento. Controlla che software, hardware, storyboard e roadmap raccontino lo stesso prodotto. Elimina duplicazioni contraddittorie. Non fissare prima una bella animazione e poi inventare funzioni per giustificarla.

Non servono decine di documenti ripetitivi: scegli una struttura compatta con fonti autorevoli chiare e collegamenti coerenti. Scrivi le ragioni delle scelte in modo che possano essere riconsiderate senza ricostruire la chat.

Comincia verificando le fonti ufficiali attuali e sintetizzando decisioni confermate e questioni aperte. Poi prepara la prima specifica completa, con una raccomandazione concreta su raccolta, algoritmo, UX, interazione e piano evento. Chiedi soltanto informazioni mancanti che cambiano davvero il progetto; nel resto procedi con proposte dichiarate.

Non fermarti a un elenco di idee o a una generica offerta di aiuto. La prima fase deve produrre un risultato definito e discutibile prima di sviluppare.
