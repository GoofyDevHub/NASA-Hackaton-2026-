# Fonti e provenienza

Per lo stato più recente consultare la [revisione evento](revisione-evento.md), la [fattibilità](fattibilita.md) e i [file locali con fonti e crediti](../catalogo/campione/README.md). Le tabelle qui sotto conservano gli esiti delle prime consultazioni.

## 2. Fonti evento e NASA

| ID | Fonte | Esito della consultazione iniziale | Utilizzo consentito e limite |
|---|---|---|---|
| F01 | [Evento 2026](https://www.spaceappschallenge.org/2026/) | Lettura diretta fallita: 502 del servizio | Nessuna conferma corrente di date/orari da questa lettura |
| F02 | [Challenge Details](https://www.spaceappschallenge.org/2026/challenges/the-earth-information-jukebox/?tab=details) | Pagina con tab non accessibile; URL senza tab restituisce 502. Ricerca indicizza il titolo, non l'intero brief | Riassunto del 30 ottobre nel master trattato come fonte fornita dall'utente; nessuna regola ricostruita dal solo titolo |
| F03 | [Challenge Resources](https://www.spaceappschallenge.org/2026/challenges/the-earth-information-jukebox/?tab=resources) | Non accessibile dal servizio; anche tentativo diretto locale fallito per connessione TLS | Disponibilità riportata nel documento di progetto. Verificare i contenuti sulla pagina ufficiale alla pubblicazione. |
| F04 | [Participant FAQ](https://www.spaceappschallenge.org/resources/participant-faqs/) | Lettura fallita: 502 | Ammissibilità preparazione, audio pre-generato e istruzioni submission restano aperte |
| F05 | [Eventi locali](https://www.spaceappschallenge.org/2026/local-events/) | Lettura fallita: 502; nessun programma Milano verificato | Tavoli/prese/Wi-Fi e date storiche rimangono indicazioni dell'utente |
| F06 | [Galleria EIC](https://svs.gsfc.nasa.gov/gallery/daily-visualizations/) | Timeout nella lettura | Non dichiarata letta; appartenenza EIC dei candidati verificata sulle rispettive schede |
| F07 | [NASA SVS 5176](https://svs.gsfc.nasa.gov/5176/) | Prima lettura timeout; URL senza slash finale poi leggibile | SST anomaly, vista equirettangolare, legenda e collegamento MUR; non prova che tutti i frame siano già qualificati |
| F08 | [Indice frame SST](https://svs.gsfc.nasa.gov/vis/a000000/a005100/a005176/frames/4096x2048_2x1_30p/sst_mur_anomaly/) | Indice leggibile, file datati elencati | Disponibilità dell'indice; non download, hash o prova del contenuto scientifico dei singoli EXR |
| F09 | [MUR v4.1 PO.DAAC](https://podaac.jpl.nasa.gov/dataset/MUR-JPL-L4-GLOB-v4.1) | Scheda leggibile | Fonte del prodotto dati e accesso; non chiude la ricostruzione esatta dell'anomalia/maschera della visualizzazione |
| F10 | [NASA SVS 5313](https://svs.gsfc.nasa.gov/5313/) | Scheda leggibile | Alternativa EIC sulle luci notturne; annuali, differenze e zoom da non mescolare |
| F11 | [NASA media guidelines](https://www.nasa.gov/nasa-brand-center/images-and-media/) | Linee guida lette nelle sezioni uso media e materiali di terzi | Controllare crediti per asset e non implicare endorsement; non trattare qualsiasi contenuto sul sito come liberamente riutilizzabile |

I siti non accessibili non sono dichiarati inesistenti. Le ricerche hanno restituito anche siti locali/terzi e uno staging: **non sono stati usati come regole globali definitive 2026**. Nessun contatto con organizzatori o autore NASA è stato effettuato.

Il candidato metodologico Chandra indicato nel master non è necessario alla soluzione proposta e non è stato usato come prova dell'algoritmo ORBIT. Il mapping qui specificato è una scelta originale di progetto e non un algoritmo NASA validato.

## 3. Fonti tecniche

| ID | Fonte consultata | Cosa supporta | Limite |
|---|---|---|---|
| F12 | [Waveshare ESP32-S3-Zero](https://docs.waveshare.com/ESP32-S3-Zero) | Varianti, risorse board e funzioni riservate | Modello e revisione fisica dell'utente ancora da confrontare |
| F13 | [Waveshare risorse](https://docs.waveshare.com/ESP32-S3-Zero/Resources-And-Documents) e [schema PDF](https://files.waveshare.com/wiki/ESP32-S3-Zero/ESP32-S3-Zero-Sch.pdf) | Segnali esposti e schema del modello FH4R2 | Lettura documentale; nessuna misura di continuità o schema ORBIT esecutivo |
| F14 | [ESP-IDF USB Device Stack v5.5.1](https://docs.espressif.com/projects/esp-idf/en/v5.5.1/esp32s3/api-reference/peripherals/usb_device.html) | TinyUSB/CDC e USB S3 | Versione di riferimento consultata, non ultima versione garantita né build effettuata |
| F15 | [ESP-IDF GPIO S3](https://docs.espressif.com/projects/esp-idf/en/v5.5.1/esp32s3/api-reference/peripherals/gpio.html) | ADC e pin con vincoli di boot/USB/memoria | Pin finali subordinati alla board e ai moduli |
| F16 | [Web Serial — Chrome](https://developer.chrome.com/docs/capabilities/serial) | API bidirezionale, selezione porta su gesto | Compatibilità e accessibilità dell'ambiente specifico da testare |
| F17 | [W3C Web Audio](https://www.w3.org/TR/webaudio/) | Nodi, buffer e clock di rendering | URL attuale restituisce Working Draft 1.1; usare solo API realmente supportate e provate |
| F18 | [TI DRV2605L](https://www.ti.com/product/DRV2605L) | Driver aptico ERM/LRA come alternativa | Non selezione del modulo pronto né risultato percettivo |
| F19 | [TI DRV8833](https://www.ti.com/product/DRV8833) | Driver motore con regolazione corrente; esempio dei limiti del semplice ponte H | Non adottato come controller TEC completo |
| F20 | [Meerstetter, efficienza Peltier](https://www.meerstetter.ch/customer-center/compendium/71-peltier-element-efficiency) | Necessità di considerare dissipazione, corrente e ripple | Esempi del produttore non trasferiti come misure ORBIT |
| F21 | [Meerstetter TEC-1091](https://www.meerstetter.ch/products/tec-controllers/tec-1091) | Esempio di controller dedicato, sensori e interfacce; prezzo base rilevato nella consultazione citata: 318 CHF, imposte escluse | Configurazione/licenze/accessori/spedizione da qualificare; nessun acquisto |

La ricerca di componenti non equivale a una BOM esecutiva o a un invito ad assemblare il sistema di contatto. Stime EUR nel dossier sono stime progettuali; il solo prezzo verificato usato nella BOM è quello identificato in F21.

## 4. Accessibilità: riferimenti e scope

Riferimento normativo: [WCAG 2.2](https://www.w3.org/TR/WCAG22/). Controlli pertinenti includono alternative testuali (1.1.1), struttura (1.3.1), contrasto (1.4.3/1.4.11), ridimensionamento (1.4.4), tastiera e assenza trappole (2.1.1/2.1.2), ordine/visibilità focus (2.4.3/2.4.7), nome/ruolo/stato (4.1.2), messaggi di stato (4.1.3). Questo elenco è una base di verifica del percorso, non un audit completo di conformità.

| ID | Fonte specifica | Distinzione da mantenere |
|---|---|---|
| F22 | [WCAG 2.2](https://www.w3.org/TR/WCAG22/) | Le scelte ORBIT non sono requisiti NASA; un test interno non certifica accessibilità per tutti |
| F23 | [Understanding Reflow](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html) | 1280 px a zoom 400% corrisponde a 320 CSS px; testo e controlli devono restare utilizzabili. Le eccezioni per mappe non giustificano controlli nascosti |
| F24 | [Focus Not Obscured Minimum](https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum.html) | AA richiede che il componente focalizzato non sia interamente nascosto; ORBIT propone di mantenerlo interamente visibile |
| F25 | [Target Size Minimum](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html) | 24×24 CSS px con eccezioni è il criterio AA; 48×48 è una scelta di progetto ORBIT |

Per il video prevedere sottotitoli e trascrizione descrittiva; la sola trascrizione non risolve necessariamente tutti i criteri applicabili al video preregistrato. Il player e la piattaforma di consegna vanno inclusi nella verifica futura.
