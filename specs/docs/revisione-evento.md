# Revisione prima dello sviluppo

La selezione locale comprende 14 immagini con impronta SHA-256. Per gli otto JPEG Earth Observatory il confronto con il file ufficiale è registrato nella [selezione](../catalogo/campione/selezione.json). Per i quattro OpenEXR e i due PNG SVS vedere gli [originali e le impronte](../prove/dati-nasa/README.md).

Programma, guida, FAQ e brief restano collegati nella [fattibilità](fattibilita.md). Il tentativo di rilettura durante il consolidamento ha restituito errori di accesso. Per orari e regole il dossier conserva l’ultima verifica riuscita. La condizione sul riuso specifico resta aperta.

| Verifica | Cosa registrare | Esito |
|---|---|---|
| Regole e consegna | Fonte, orario di apertura e scadenza, vincoli video e pitch, provenienza e riuso ammesso dei materiali preparatori | [Orari e formato globale verificati](fattibilita.md). Riuso specifico da chiarire |
| Catalogo | Elenco completo, formati e dimensioni, crediti e diritti, data e luogo, variabile e unità o dominio soltanto visivo | [Risorse e media censiti](../catalogo/valutazione.md); qualificazione dei file aperta |
| Campione | 14 immagini pubblicate dalla NASA e otto coppie candidate | [File e fonti](../catalogo/campione/README.md). Collaudo nel lettore aperto |
| Sonificazione | Pianoforte A+, ciclo di 15 s, loop singolo e playlist completa | [Metodo scelto](sonificazione.md). Collaudo del loop e riconoscimento A/B da svolgere |
| Sito e controller | Playlist senza schermo, descrizioni facoltative, piastra simulata caldo/freddo per ogni immagine | Comportamento definito. Prove di accessibilità e integrazione da eseguire |
| Fattibilità | Stimare i ticket rispetto alle ore effettive di una persona. Riservare tempo per integrazione offline, ascolto, export, sottotitoli e invio | [Stima per una persona e scadenze locali](fattibilita.md), tre prodotti richiesti al giro dei giudici |
| Perimetro confermato | Sito solo immagini, progetto e simulatore controller, film di 29 s | [19 ticket di sviluppo](../ticket/README.md). La verifica dei prodotti segue l’implementazione |

Ordine di consegna: PC → PC con controller → confronto. Preparare il confronto nel profilo dati fin dall’inizio. Il 3D e il montaggio possono avanzare quando gli ingressi sono disponibili. Fissare il congelamento delle funzionalità e il primo invio in base alla scadenza confermata. Conservare la ricevuta e identificare la versione presentata.

## Verifica della cartella isolata

Copiando soltanto `specs/` in un percorso esterno, i due GLB, il visualizzatore e l’inventario del controller si rigenerano identici byte per byte. Le partiture delle cinque scene sono state riestratte dai JPEG con Chrome senza rete. Anche il WAV A+ del Fuji, i sei WAV del confronto sui cinque paesaggi e il registro delle misure si rigenerano identici ai riferimenti. La prova usa Python 3.14, i pacchetti del file requirements, FFmpeg e, per l’estrazione, Chrome con Playwright.

Galleria, visualizzatore ed estratto della tendina si aprono dal disco con la rete disattivata. Le impronte locali corrispondono per tutte le 14 immagini selezionate e per i sei originali SVS. I collegamenti locali nei documenti e nelle pagine del pacchetto risolvono all’interno della cartella. Le dipendenze dei 19 ticket formano un ordine di lavoro senza cicli.

## Risorse pubblicate per The Earth Information Jukebox

La [sezione Resources della challenge](https://www.spaceappschallenge.org/2026/challenges/the-earth-information-jukebox/?tab=resources) elenca questi undici riferimenti. Sono una galleria, un esempio metodologico e nove visualizzazioni terrestri.

- [Galleria Earth Information Center](https://svs.gsfc.nasa.gov/gallery/earth-information-center/)
- [Caldwell 73 — esempio di sonificazione](https://svs.gsfc.nasa.gov/13786/)
- [Luci notturne 2012–2023, versione EIC](https://svs.gsfc.nasa.gov/5313/)
- [Correnti superficiali e temperatura](https://svs.gsfc.nasa.gov/3912/#media_group_349716)
- [Aerosol GEOS](https://svs.gsfc.nasa.gov/5669/)
- [Modelli di qualità dell’aria](https://svs.gsfc.nasa.gov/5533/)
- [Perpetual Ocean 2 — correnti di bordo occidentale](https://svs.gsfc.nasa.gov/5425/)
- [CO₂ globale DYAMOND](https://svs.gsfc.nasa.gov/5196/)
- [Fulmini osservati dalla ISS](https://svs.gsfc.nasa.gov/5011/)
- [Fiume atmosferico in un modello del sistema Terra](https://svs.gsfc.nasa.gov/4960/)
- [Altezza delle foreste GEDI](https://svs.gsfc.nasa.gov/4950/)

Il [censimento esteso](../catalogo/valutazione.md) include SVS 5176 tramite Daily Visualizations, le schede raggiungibili dalle sottogallerie e i servizi esterni dei dashboard. Le fonti video restano censite. La qualifica per il lettore riguarda le immagini selezionate.
