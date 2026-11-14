# Contratto PC–controller e simulatore

Versione proposta `orbit.device/1.0` · Nessun firmware o simulatore implementato · [Indice](prodotto.md).

La [playlist](interazione.md) aggiorna il significato termico di ogni scena. Nel simulatore la resa caldo/freddo segue la musica quando il canale è abilitato. Il tasto Termico alterna il canale simulato. Questa preferenza resta valida ai cambi di immagine. Ripeti conserva lo stato. Stop, perdita del collegamento e guasti disarmano le uscite. Sul dispositivo fisico ogni futuro ciclo di potenza resta sottoposto al consenso e alle protezioni locali descritti sotto.

## 1. Autorità, trasporto e requisiti

Il PC decide immagine, revisione, audio e risultato delle azioni. Il controller decide se i propri attuatori possono funzionare e può rifiutare qualsiasi richiesta. Nessun pacchetto PC può modificare limiti fisici, spegnere protezioni, azzerare un fault locale o inviare PWM grezzo.

Trasporto fisico proposto: USB CDC ACM, accesso Web Serial da Chrome sul PC. [La documentazione Chrome](https://developer.chrome.com/docs/capabilities/serial) descrive il collegamento bidirezionale e il selettore di porta attivato da un gesto. Accessibilità del selettore, driver Windows e compatibilità della board effettiva devono essere provati. Se non funzionano, il fallback è tastiera più adapter simulato; non si aggiungono altri trasporti fisici al primo sviluppo.

| ID | Priorità | Requisito e motivo | Criterio di completamento futuro |
|---|---|---|---|
| CT01 | P0 | Sessione nuova e capacità esplicite | Nessun comando attivo prima di handshake e sync; versioni incompatibili rifiutate |
| CT02 | P0 | Scena e sequenza su eventi rilevanti | Duplicati non ripetono azioni; input obsoleto respinto; nuova scena invalida richieste vecchie |
| CT03 | P0 | Scadenze locali per attuatori | Ritardo, duplicato e comando rimasto in coda non riattivano effetti scaduti |
| CT04 | P0 | Stop e perdita link deterministici | Spegnimento locale senza ACK PC; pausa PC alla perdita; riconnessione senza ripartenza |
| CT05 | P0 | Parser e code limitati | Frame spezzati/uniti, JSON invalido, overflow e messaggi fuori ordine gestiti senza bloccare la supervisione |
| CT06 | P0 | Simulazione dichiarata e riproducibile | Stessi messaggi del futuro adapter; script dei guasti e log; nessuna temperatura presentata come misura |
| CT07 | P1 | Diagnostica leggibile | Stato porta, capability, fault e ultimo motivo di rifiuto disponibili senza log tecnico nel percorso principale |

## 2. Stati della connessione, separati dall'esperienza

`ASSENTE → RICHIESTA_PORTA → HANDSHAKE → SINCRONIZZAZIONE → CONNESSO`.

Esiti alternativi: `SIMULATO`, `PERSO`, `INCOMPATIBILE`, `ERRORE_PORTA`. Un annullamento del selettore torna ad ASSENTE. Il simulatore può emulare gli stati interni del collegamento ma l'indicazione esterna «SIMULATO — nessun dispositivo fisico» resta sempre presente.

Connessione non cambia automaticamente lo stato audio. Al collegamento il dispositivo riceve solo uno snapshot della scena e resta disarmato. Alla perdita, il coordinatore PC sospende musica e voce una volta; il dispositivo revoca gli stimoli. Scollegamento volontario durante ascolto segue lo stesso comportamento prevedibile. Perdita mentre già assente non genera avvisi ripetuti.

## 3. Formato dei messaggi

JSON UTF-8 delimitato da LF, massimo **2048 byte per riga**, niente newline letterali dentro stringhe. Parser incrementale, buffer massimo 4096 byte; overflow scarta fino al delimitatore, registra errore e disarma. Limite 32 messaggi in coda e 50/s per direzione, con aggregazione volume e telemetria. Superamento persistente per 1 s porta a errore link; non sacrificare STOP per una coda di telemetria. Sono valori di progetto da validare al banco.

Envelope dopo handshake:

```json
{
  "protocol": "orbit.device/1.0",
  "sessionId": "example-session-a",
  "seq": 17,
  "type": "INPUT",
  "scene": {"id": "example-scene-a", "assetRevision": "1", "selectionRevision": 4},
  "payload": {"action": "NEXT"}
}
```

Gli identificativi sopra sono esempi di contratto, non asset realmente acquisiti. Sessioni operative: token casuale a 128 bit o UUID equivalente generato dal PC. `seq`: intero positivo crescente **per mittente**, entro intervallo sicuro JSON; prima di esaurimento si riapre una sessione. `replyTo` nei risultati riferisce `seq` della richiesta dell'altro mittente. `scene=null` per handshake, fault globali, heartbeat e stop; gli altri messaggi portano la scena esatta. `assetRevision` distingue contenuto; `selectionRevision` distingue visite alla stessa immagine.

| Tipo | Direzione | Payload e semantica |
|---|---|---|
| HELLO | PC→device | Versioni accettate, nonce PC; nessuna autorità fisica |
| HELLO_ACK | device→PC | Nonce PC, nonce device, `bootId`, board/firmware, capability (`buttons`,`haptics`,`thermal`), `thermalProfileId`, stato fault |
| SESSION_START | PC→device | Nuovo sessionId e i due nonce; completa associazione al boot corrente |
| STATE_SYNC | PC→device | Scena, stato esperienza, volume, termico disponibile o motivo indisponibilità |
| STATE_ACK | device→PC | Snapshot applicato, attuatori disarmati, stato recupero; nessun avvio fisico |
| INPUT | device→PC | PREV, NEXT, TOGGLE_PLAY, DESCRIBE, VOLUME_DELTA; scena attesa |
| ACTION_RESULT | PC→device | `replyTo`, applied/rejected/boundary, motivo, scena risultante e stato |
| PING / PONG | bidirezionale | Sfida corrente e risposta, senza vecchi timestamp usati come validità |
| HAPTIC_REQUEST | PC→device | Pattern enumerato, durata massima, token lease corrente, evento associato |
| THERMAL_CONSENT | device→PC | Token monouso creato da pressione fisica, scena, fase prepare/activate |
| THERMAL_REQUEST | PC→device | Consenso, categoria cool/neutral/warm, profileId, fase; mai °C/PWM dal PC |
| ACTUATOR_RESULT | device→PC | accepted/rejected/completed, motivo e stato reale del controller |
| STOP | entrambe | Arresto globale, motivo; la ricezione disarma immediatamente |
| STATUS / FAULT | device→PC | Stato locale, codici guasto, origine measured/simulated; nessuna falsa misura |

Campi obbligatori errati, NaN, enum ignote o comandi non supportati ricevono NACK quando possibile e non attivano nulla. Versione major diversa → INCOMPATIBILE. Minor superiore accettabile solo con capability negoziate e campi opzionali ignoti ignorabili; nessun tipo nuovo eseguito per supposizione. Debug non mescolato a righe del protocollo.

## 4. Handshake e cambi scena

1. Utente sceglie Collega; PC apre porta (115200 come parametro iniziale dell'API, da provare; non è una misura di velocità USB).
2. Dispositivo al boot ha enable OFF, buffer vuoti, `bootId` nuovo e nessun consenso valido.
3. Scambio HELLO/ACK/SESSION_START entro 3 s. I nonce impediscono di accettare una vecchia apertura rimasta nel buffer.
4. STATE_SYNC della scena corrente; il dispositivo cancella tutti i token attuatore, aggiorna revisione e restituisce STATE_ACK. Finché manca ACK, niente stimoli.
5. PC abilita navigazione dal controller; termico rimane subordinato a capability, profilo fisico e significato della scena.

Cambio scena: PC interrompe audio/voce secondo specifica, invia STOP e poi STATE_SYNC; non attende il dispositivo per mostrare la nuova scena. Il dispositivo passa in recupero, svuota effetti e consensi; ACK significa «nuova scena acquisita», non «superficie neutra». Richieste attuatore della nuova scena ammesse solo dopo ACK, salvo termico ancora in recupero. Se la porta si blocca, il timeout locale disarma; il PC continua a essere utilizzabile.

Un INPUT NEXT proveniente dalla scena 4 può produrre la scena 5. ACTION_RESULT include `replyTo` e scena risultante; non è rifiutato perché differente dalla scena richiesta. La conferma aptica di navigazione segue STATE_ACK della scena 5. Un secondo INPUT ancora marcato scena 4 riceve `STALE_SCENE`: l'utente può riprovare dopo sincronizzazione. Le pressioni PC restano immediate attraverso il coordinatore, senza aspettare la seriale.

## 5. Scadenze, duplicati e sicurezza temporale

Valori iniziali da approvare:

| Parametro | Valore proposto | Ragione e comportamento |
|---|---:|---|
| Heartbeat | 250 ms | Il dispositivo emette PING; il PC risponde con PONG; entrambi sorvegliano la risposta |
| Perdita link | 1000 ms senza heartbeat valido | Quattro periodi; disarma e invalida sessione. Non è un limite termico di contatto |
| ACK azioni/sync | 500 ms | Ritardo dichiarato; una ritrasmissione con stessa seq per messaggi idempotenti |
| Lease aptico | 500 ms dall'emissione della sfida device | Non basta ricevere un vecchio messaggio per rinnovare il tempo |
| Consenso termico | 1000 ms dalla pressione locale | La risposta PC tardiva è respinta; nuova pressione esplicita necessaria |
| Massimo effetto aptico | 500 ms | Limite locale indipendente dalla validità del link |
| Durate preparazione/pronto/contatto | Non impostate per hardware reale | Devono provenire dal profilo fisico verificato; simulatore usa tempi dichiarati astratti |

Il device include nel PING un `leaseToken` con deadline calcolata sul **suo** clock monotono. HAPTIC_REQUEST deve riportarlo; il device controlla sessione, scena, deadline e durata ≤500 ms. Deadline del comando è `min(scadenzaLease, istanteRicezione+durataRichiesta)`. Ritrasmissioni non estendono la durata. La coda può conservare il messaggio, ma il token vecchio non torna valido.

Il consenso termico è più restrittivo: token monouso creato solo dal gesto locale, legato a sessione/scena/fase e scade secondo clock device. Ricevuta THERMAL_REQUEST valida, il token è consumato; un duplicato restituisce il risultato memorizzato senza riattivazione. Il timer dell'esperienza è quello del profilo locale e non viene prolungato dai heartbeat. Un nuovo ciclo richiede recupero concluso e nuovo gesto. La simulazione del significato della scena funziona anche senza un profilo fisico qualificato.

Per ogni direzione si memorizzano gli ultimi 64 risultati associati a seq e hash del messaggio. Duplicato identico → stesso risultato senza effetti; stessa seq con contenuto diverso → errore protocollo e disarmo. Seq inferiore alla massima e non presente in cache → rifiuto, mai riesecuzione. Un salto avanti è accettabile per messaggi non attuativi; i messaggi attuativi richiedono comunque token valido e stato coerente. Connessione seriale ordinata non esonera dalla prova dei pacchetti ritardati e rigiocati.

STOP fisico non aspetta alcun parser o collegamento. STOP ricevuto, anche riferito a una vecchia scena, può solo disarmare; non abilita nulla. Alla ricezione di STOP per una sessione ignota si disarma comunque senza accettare ulteriori messaggi della sessione ignota. Arresta PC revoca musica/voce prima di inviare; Arresta hardware invia INPUT/STOP ma non può garantire di fermare l'audio laptop se il collegamento è già guasto. Il pulsante PC resta indipendente.

## 6. Esempi di esiti

```json
{
  "protocol":"orbit.device/1.0", "sessionId":"example-session-a", "seq":23,
  "type":"ACTION_RESULT", "replyTo":17,
  "scene":{"id":"example-scene-b","assetRevision":"1","selectionRevision":5},
  "payload":{"result":"applied","state":"PRONTO","action":"NEXT"}
}
```

```json
{
  "protocol":"orbit.device/1.0", "sessionId":"example-session-a", "seq":24,
  "type":"HAPTIC_REQUEST",
  "scene":{"id":"example-scene-b","assetRevision":"1","selectionRevision":5},
  "payload":{"pattern":"accepted","durationMs":80,"leaseToken":"example-lease-9","eventSeq":17}
}
```

Il secondo esempio è valido solo dopo STATE_ACK della scena b e con lease non scaduto. Il token non è un segreto né una certificazione: serve a rendere verificabile la freschezza temporale nella sessione locale.

```json
{
  "protocol":"orbit.device/1.0", "sessionId":"example-session-a", "seq":41,
  "type":"ACTUATOR_RESULT", "replyTo":30,
  "scene":{"id":"example-scene-b","assetRevision":"1","selectionRevision":5},
  "payload":{"result":"rejected","code":"MEANING_UNAVAILABLE","thermalState":"DISABILITATO"}
}
```

## 7. Simulatore previsto e prove

Il simulatore implementa il medesimo adapter e la medesima macchina a stati con un clock virtuale controllabile. Pannello secondario accessibile con pulsanti per gli ingressi fisici, connessione/disconnessione, ritardo, sensore guasto, fault e capacità mancanti. La UI principale continua a usare il coordinatore reale. Nessuna porta seriale finta presentata come collegamento fisico.

Nel simulatore provare tutte le scene NASA, alternare i due stati e leggere la spiegazione. Usare una fixture separata per token, guasti e scadenze del circuito fisico. Nessuna simulazione produce una misura della superficie.

| Scenario | Risultato atteso | Evidenza futura |
|---|---|---|
| Handshake riuscito / major errata | Comandi attivi solo nel primo caso | Transcript JSON e stato |
| NEXT poi NEXT vecchio | Una selezione applicata, secondo input rifiutato | SceneRevision e ACTION_RESULT |
| Navigazione durante rendering | Risultato vecchio scartato | Log token audio/scene e assenza suono obsoleto |
| Haptic ritardato oltre lease | Nessun impulso simulato | Clock virtuale e NACK |
| THERMAL_REQUEST duplicato | Un ciclo, nessun rinnovo | Token consumato e risultato ripetuto |
| Link perso / pagina sospesa | Attuatori OFF entro timeout locale, esperienza in pausa | Timeline logica; nessun claim su inerzia fisica |
| Riconnessione / riavvio MCU | Sessione nuova, nessun replay | Sessioni e stato disarmato |
| JSON frammentato, più righe insieme, overflow | Parser bounded, recupero o chiusura controllata | Vettori di prova e log |
| Arresta durante fault e coda piena | Disarmo prioritario | Ordine degli effetti |
| Sensore fault e ripristino link | Fault permane; niente reset remoto | Stato latch simulato |

Il simulatore verifica il contratto e l'interazione, non corrente, temperature, isolamento, ergonomia o percezione della vibrazione.
