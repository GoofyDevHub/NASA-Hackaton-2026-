# Fattibilità di ORBIT per una persona

**Obiettivo per la giuria.** Sito con 14 immagini, controller come progetto completo con simulatore e film da 29 s. Le fonti e i file locali sono disponibili. La fattibilità in sede dipende dal tempo di qualificazione e dalle prove integrate. Il riuso dei materiali preparatori segue le indicazioni degli organizzatori.

## Tempo e vincoli

Milano pubblica kickoff sabato alle 11:00, pranzo alle 13:00, ripresa alle 14:00 e chiusura sede alle 19:00. Domenica riapre alle 09:15, con pranzo alle 12:30, giro della giuria alle 13:30 e pubblicazione iniziale della pagina entro le 15:00. I dieci finalisti hanno due minuti di pitch e due minuti di domande dalle 15:30. Assumendo i due intervalli di pranzo e lavoro soltanto in sede, risultano **10 h 15 min** prima della prima valutazione (2 + 5 + 3,25 ore). Setup, mentoring e imprevisti riducono il tempo effettivo. Le ore con i giudici sono già impegnate. [Programma di Milano](https://www.spaceappschallenge.org/2026/local-events/milano/)

Il portale apre sabato alle 09:00 e chiude domenica alle 23:59, ora locale. È distinto dal kickoff e dalla scadenza della pagina iniziale di Milano. Il video globale dura al massimo 30 s, con link pubblico accessibile senza login. La pagina e i materiali collegati sono in inglese. Per una voce in italiano servono sottotitoli inglesi. La guida richiede anche di indicare dove e come sono stati usati strumenti di IA, con filigrana visibile per immagini o video generati e indicazioni in testo e metadati per audio, codice e dati generati. Le FAQ vietano di iniziare il lavoro sulla challenge prima dell’hackathon. Il piano temporale non presume che un semplice trasferimento nel repository renda riutilizzabili mockup, modelli o codice preesistenti. L’evento locale ammette team di una persona. [Guida alla consegna](https://www.spaceappschallenge.org/resources/project-submission-guide/) · [FAQ](https://www.spaceappschallenge.org/resources/participant-faqs/) · [Formazione dei team](https://www.spaceappschallenge.org/resources/team-formation-guide/)

## Sito e immagini

La [selezione di 14 immagini](../catalogo/campione/README.md) comprende quattro mappe MUR, due scene Black Marble, cinque paesaggi, due riprese del Fuji e il delta della Lena. Il [censimento delle fonti](../catalogo/valutazione.md) rimane consultabile. Ogni aggiunta richiede fonte, credito, maschera, descrizione, categoria termica e prova di ascolto. Per abilitare le sei coppie oceaniche, la coppia Florida e la coppia Fuji verificare ritaglio, allineamento e impostazioni sonore comuni per serie.

Un solo lettore gestisce elenco, globo, playlist completa e comandi simulati. Da tastiera o controller, avviare con lo schermo coperto, ascoltare, richiedere una descrizione, tornare alla musica e cambiare scena. Verificare A+ generato al gesto, loop di 15 s, confronto in mono, funzionamento senza rete e produzione delle voci offline. [Brief della challenge](https://www.spaceappschallenge.org/2026/challenges/the-earth-information-jukebox/)

## Controller

Il modello di studio rigenera due GLB identici agli originali, con 70 parti geometriche. Le forme e l’esploso permettono di mostrare la presa, i sei comandi, la manopola, la scheda, il motore e il gruppo termico. Per dimostrare la seconda funzione serve un simulatore collegato allo stesso stato del lettore: Play/Pausa, Stop, cambio, descrizione, volume, vibrazione e richiesta termica. Nell’interfaccia e nelle riprese deve leggersi “Simulated controller”. Verificare Stop, doppia pressione, perdita del collegamento e ripresa volontaria. La vibrazione di conferma segue l’accettazione del comando.

Nella consegna di progetto distinguere sorgente modificabile, assemblato, esploso, distinta con componenti identificati o candidati, schema funzionale e protocollo. L’USB serve alla logica; lo stadio termico richiede alimentazione separata. Scelta driver, ingombri, cablaggio, tolleranze e dissipazione rimangono aperti per i file esecutivi. Il progetto modificabile e il simulatore devono aprirsi sul PC della giuria insieme al sito. Presa, temperature e protezioni richiedono prototipo e banco. [Modello](../controller/README.md) · [Specifica](hardware.md)

## Film per i giudici

Conservare lo storyboard esteso come riferimento artistico. Produrre **un solo montaggio di gara da 29 s**, riutilizzabile nel pitch locale. Il secondo di margine facilita la verifica della durata effettiva dopo l’export. Il controller resta in primo piano per sei secondi.

| Tempo | Immagine e azione | Suono e testo |
|---|---|---|
| 0–3 s | Globo, orbita sottile e nome del team | “What does a changing Earth sound like?” con brevi battute di tastiera |
| 3–7 s | Cattura vera del lettore, cursore e pressione di Play | Click sincronizzato, subito seguito dal suono dell’immagine |
| 7–13 s | Raccordo sul tasto fisico del modello, simboli leggibili, scocca e componenti che si separano | “USB controller concept” e “Simulated input” nel punto opportuno. Accenti brevi |
| 13–18 s | La linea rivela la seconda immagine allineata. Un passaggio lento nel taglio breve | “Same place. Same sound rules.” Il movimento avanti–indietro–avanti resta descritto nella versione estesa |
| 18–26 s | A per quattro secondi, poi B per quattro, con le etichette visibili | Solo suono dei dati al medesimo guadagno. Verificare all’ascolto che la differenza emerga entro questa finestra |
| 26–29 s | Terra, nome e credito NASA leggibile. Crediti estesi sulla pagina pubblica | Chiusura breve. Verificare sottotitoli, durata esportata e riproduzione senza login |

## Piano per la giuria

1. Partire da una coppia del Pacifico. Sul PC target verificare un percorso completo dalla scelta al pianoforte, fino a Stop. Misurare quanto costa qualificare una scena e una coppia, inclusi descrizione e prova offline.
2. Estendere la stessa pipeline a tutte le 14 immagini. Procedere in parallelo sul progetto controller e sul premontaggio del film. Quando il trasporto è stabile, collegare il simulatore e provare cambi rapidi, pausa e arresto.
3. Catturare il lettore funzionante e l’esploso. Congelare le versioni. Eseguire l’intera playlist senza schermo, verificare ogni coppia abilitata ed esportare il film di 29 s. Con 14 scene il solo ascolto senza voce dura 3 min 30 s.
4. Prima del giro ai tavoli, aprire da una copia pulita sito, simulatore, progetto controller e film. Registrare l’esito con i ticket QA01, QA02 ed EV01. La pubblicazione successiva può usare questi stessi file.

La stima precedente di 13–25 ore riguardava una coppia e un clip. Le 10 h 15 min di presenza calcolate sopra sono una finestra di calendario. Per stimare il lavoro residuo sommare ai tempi misurati per scena e per coppia quelli del controller, del montaggio e delle prove sul PC. La generazione assistita può procedere in parallelo, mentre ascolto, prova senza schermo e revisione del film richiedono attenzione. Se la previsione supera la finestra, segnalare il ritardo e riallocare il lavoro prima del montaggio finale.
