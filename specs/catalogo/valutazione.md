# Risorse NASA per ORBIT

Il censimento comprende immagini e filmati. La [selezione per il lettore](campione/README.md) raccoglie le 14 immagini della demo. Le ipotesi sulle altre risorse servono alla consultazione del catalogo.

Il censimento parte dagli undici collegamenti pubblicati in [The Earth Information Jukebox](https://www.spaceappschallenge.org/2026/challenges/the-earth-information-jukebox/?tab=resources). Nella galleria EIC segue tutte le voci e le sottogallerie del catalogo, comprese le viste incorporate e i collegamenti ai servizi. Perimetro chiuso sulla struttura editoriale EIC: i correlati generici del sito SVS, le bibliografie e i cataloghi mondiali raggiungibili dai servizi sono destinazioni ulteriori. Un servizio Worldview può produrre molte osservazioni al variare di strato, data e area.

| Copertura | Esito |
|---|---|
| Schede SVS | 94 pagine lette tramite l’API NASA: 84 contenuti e 10 gallerie, compresa quella principale |
| Servizi | 21 destinazioni distinte nelle schede delle gallerie. Il servizio dell’indice dell’aria di Washington DC restituisce 404 |
| Media | 1.708 URL distinti pubblicati dai contenuti: immagini, filmati, indici di fotogrammi, sottotitoli e materiali accessori. Comprendono risoluzioni diverse della stessa visualizzazione. I 184 indici di fotogrammi sono contati come sequenze; i singoli frame al loro interno restano da qualificare |
| Prova di reperibilità | Controllato un URL rappresentativo per ciascuna delle 84 schede e tutti i 21 servizi: 104 risposte HTTP 200 e un 404. Il controllo degli indirizzi distingue disponibilità e integrità dei file. Per la Florida sono state scaricate e decodificate entrambe le anteprime JPEG 1024×288 |
| Anomalia del catalogo | La scheda 5126 comprende anche una voce media priva di indirizzo (elemento 458696). Le altre risorse della scheda restano presenti |

L’[inventario delle 115 voci](inventario.csv) riporta origine, fonte, formato, ipotesi sonora, condizioni per il confronto e pertinenza termica. L’[indice dei media](media.csv) permette di risalire dal file alla scheda e al gruppo di appartenenza. Un campo vuoto equivale a un dato da qualificare. Autori e ruoli del registro sono un riferimento iniziale: verificare il credito richiesto sulla specifica risorsa prima della distribuzione.

## Che cosa possiamo provare con le undici risorse principali

| Risorsa | Esperienza sonora proposta | Verifica decisiva |
|---|---|---|
| [Galleria EIC](https://svs.gsfc.nasa.gov/gallery/earth-information-center/) | Navigazione per fenomeno. La stessa legenda sonora può servire più scene della stessa famiglia. | Scegliere un profilo coerente dopo aver individuato natura e scala del contenuto. |
| [Correnti e temperatura · 3912](https://svs.gsfc.nasa.gov/3912/) | Il modello ECCO2 combina traiettorie e temperatura superficiale. Provare una voce continua per le correnti e un timbro separato per la fascia termica. | Confrontare fotogrammi dello stesso render e legenda; per caldo anomalo serve anche un riferimento climatologico. |
| [Altezza delle foreste · 4950](https://svs.gsfc.nasa.gov/4950/) | Scansione dei livelli di altezza della vegetazione da GEDI; il registro musicale può seguire le classi della legenda. | I dati aggregano aprile 2019–aprile 2020. Confronto spaziale; il rilievo 3D è esagerato. |
| [Forma del vapore · 4960](https://svs.gsfc.nasa.gov/4960/) | Seguire il bordo della fascia umida e la sua estensione. La versione senza narrazione è adatta a isolare il suono dei dati. | I movimenti della camera e le sovrimpressioni delle date vanno esclusi dalla misura. |
| [Ritmo dei fulmini · 5011](https://svs.gsfc.nasa.gov/5011/) | LIS sulla ISS, gennaio 2017–luglio 2023. Sonificare la densità regionale con brevi percussioni. | La finestra mobile è di dieci giorni. Un punto visibile in fotogrammi consecutivi può rappresentare lo stesso evento. |
| [CO₂ in volume · 5196](https://svs.gsfc.nasa.gov/5196/) | Il modello copre gennaio–marzo 2020. Associare tessitura alla distribuzione della CO₂ su viste confrontabili. | Separare zoom e rotazione dal moto fisico. Per valori in ppm servono scala e strato documentati. |
| [Confronto annuale · 5313](https://svs.gsfc.nasa.gov/5313/) | Medie annuali delle luci dal 2012 al 2023. Usare la medesima vista globale; escludere la mappa colorata delle differenze, gli zoom e le dissolvenze. | A/B temporale con anno identificato. |
| [Traiettorie e profondità · 5425](https://svs.gsfc.nasa.gov/5425/) | Il viaggio passa per Kuroshio, Agulhas e Corrente del Golfo. Il trattamento del colore distingue le correnti profonde da quelle superficiali. | Fissare area e camera; il cambio di colore non identifica da solo una temperatura. |
| [Quattro inquinanti · 5533](https://svs.gsfc.nasa.gov/5533/) | CO, PM2.5, O₃ e NOₓ offrono quattro voci selezionabili. Separare pannelli e legende prima del calcolo. | Confrontare lo stesso inquinante alla stessa scala su due istanti. |
| [Aerosol per classe · 5669](https://svs.gsfc.nasa.gov/5669/) | La scheda offre un’immagine GEOS del 19 agosto 2025 alle 20:00 UTC, varianti di impaginazione e una legenda. Usare un timbro per tipo di aerosol. | Confronto spaziale fra regioni; due impaginazioni dello stesso istante non costituiscono due osservazioni. |
| [Metodo · 13786](https://svs.gsfc.nasa.gov/13786/) | La scansione ruota attorno all’ammasso. La distanza dal centro guida l’altezza; il colore distingue i timbri. Utile per progettare una legenda udibile. | Nessuna temperatura terrestre. |

## Le raccolte interne

| Galleria | Voci esposte |
|---|---:|
| [Earth Information Center (EIC)](https://svs.gsfc.nasa.gov/gallery/earth-information-center/) | 25 |
| [Earth Now Dashboard](https://svs.gsfc.nasa.gov/gallery/earth-now-dashboard/) | 18 |
| [Climate Vital Signs Dashboard](https://svs.gsfc.nasa.gov/gallery/climate-vital-signs-dashboard/) | 9 |
| [Greenhouse Gases Dashboard](https://svs.gsfc.nasa.gov/gallery/greenhouse-gases-dashboard/) | 10 |
| [Carbon Dioxide Sources and Sinks](https://svs.gsfc.nasa.gov/gallery/carbon-dioxide-sources-sinks/) | 3 |
| [Air Quality Dashboard](https://svs.gsfc.nasa.gov/gallery/air-quality-dashboard/) | 14 |
| [Wildland Fires Dashboard](https://svs.gsfc.nasa.gov/gallery/wildland-fires/) | 9 |
| [NASA and Hurricanes](https://svs.gsfc.nasa.gov/gallery/nasaand-hurricanes/) | 7 |
| [NASA and Agriculture Video](https://svs.gsfc.nasa.gov/gallery/nasaand-agriculture/) | 14 |
| [Daily Visualizations](https://svs.gsfc.nasa.gov/gallery/daily-visualizations/) | 23 |

Le appartenenze possono sovrapporsi: una scheda collegata da più gallerie mantiene un solo record.

## Prove che distinguono le possibilità

1. **Mare, anomalia rispetto alla norma.** [SVS 5176](https://svs.gsfc.nasa.gov/5176/) compare nella galleria collegata dalla challenge. È una base per raccontare quanto il mare differisce dal riferimento su due date dello stesso prodotto. Sul suono provare segno e intensità separati. Sul controller il feedback termico rimane una proposta simulata, subordinata alla validità della corrispondenza con i dati.
2. **Mare, corrente e temperatura.** [SVS 3912](https://svs.gsfc.nasa.gov/3912/) consente di ascoltare struttura e movimento. Se mostriamo correnti colorate per temperatura, il testo del film deve parlare di temperatura superficiale. L’affermazione «più caldo della norma» richiede un riferimento ulteriore.
3. **Una differenza già documentata.** [Florida e uragano Ian](https://svs.gsfc.nasa.gov/5058/) offre due immagini distinte riferite al 30 agosto e al 30 settembre 2022. Le due anteprime sono leggibili e i PNG da 7680×2160 sono elencati per entrambe. Prima di un ascolto A/B verificare che coordinate, scala e ritaglio coincidano e mascherare testi e decorazioni. Verificare dove cambia la luce, distinguendo la variazione osservata dall’attribuzione delle cause.
4. **Forma, ritmo e timbro.** [Ghiaccio artico per anno](https://svs.gsfc.nasa.gov/5046/) per ascoltare un margine; [fulmini ISS](https://svs.gsfc.nasa.gov/5011/) per il ritmo della densità; [GEOS Aerosols](https://svs.gsfc.nasa.gov/5669/) per le classi rappresentate da strumenti diversi. Queste prove interrogano proprietà differenti e aiutano a capire se una sola regola musicale può conservarle.
5. **Misurare la comprensione.** Per ciascuna famiglia scegliere un esempio, fissare geografia e scala, preparare due ascolti allo stesso guadagno e annotare se chi ascolta riconosce posizione, estensione o classe e desidera riascoltare il suono. Per la vibrazione distinguere la conferma dei comandi da qualsiasi eventuale codifica scientifica futura. La valutazione documentale non misura il risultato all’ascolto.

La copertura del catalogo resta integrale. Crediti per asset, diritti, unità fisiche, disponibilità offline, tempi di avvio e comprensione percettiva richiedono prove specifiche prima di abilitare i singoli contenuti nell’app.
