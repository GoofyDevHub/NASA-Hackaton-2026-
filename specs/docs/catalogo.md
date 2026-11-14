# Catalogo delle immagini

Il [campione locale](../catalogo/campione/README.md) contiene 14 immagini. Il [registro di selezione](../catalogo/campione/selezione.json) serve a costruire e collaudare il manifest di riproduzione. La playlist comprende tutte le scene pronte, in ordine stabile. Giochi di colore, etichette, aree prive di dati e filigrane richiedono maschere esplicite. Il globo usa il luogo documentato o la vista globale. Per A/B servono stesso fenomeno, orientamento, ritaglio, scala e metodo. I filmati presenti nell’inventario delle fonti restano fuori dal lettore.

## 3. Manifest e pacchetto di una scena

Contratto proposto `orbit.catalog/1`. Una scena comprende immagine per visualizzazione, raster canonico per analisi, maschera, testo, voce locale e record delle trasformazioni. Il file sorgente resta distinto dalla copia preparata. Gli hash sono SHA-256 effettivi, prodotti durante la preparazione; nessun hash fittizio deve passare il validatore.

| Gruppo | Campi obbligatori / semantica |
|---|---|
| Identità | `sceneId`, `assetRevision`, `collectionId`, `collectionRevision`, `title`, `language` |
| Testo | `visualDescription`, `phenomenonDescription`, `mappingExplanation`, `limitations`, `shortDescription` |
| Provenienza | `sourcePage`, `sourceAssetUrl`, `sourceVersion`, `credits[]`, `rightsNote`, `rightsSourceUrl`, `retrievedAt` ISO 8601 |
| Tempi | `observationStart`, `observationEnd`, `timePrecision`, `timeSource`; se ignoti, null e motivo esplicito, mai sostituire con data download |
| Asset | `originalPath`, `originalSha256`, `displayPath`, `displaySha256`, formato, dimensioni, spazio colore |
| Preparazione | `preparedRasterPath`, `preparedSha256`, `width`, `height`, `channelEncoding`, `crop{x,y,w,h}`, trasformazioni ordinate con versione tool |
| Maschera | `maskPath`, `maskSha256`, `maskMethod`, `maskRevision`, `maskReviewer`, categorie e copertura |
| Geometria | `projection`, `centralMeridian`, `spatialExtent`, orientamento, unità delle coordinate; null motivato se non pertinente |
| Interpretazione | `featureDomain` con valori `visual` o `quantitative`, `collectionProfileId`, `normalizationBaseline`, `physicalVariable`, `physicalUnit`, `scientificBaseline`, `qualityFlags` |
| Sonificazione | `mappingVersion`, `settingsVersion`, eventuale `scorePath` e `audioPath`, `audioMode` con valori `generated-on-request` o `pregenerated`, hash e versione generatore |
| Termico | Ogni scena pronta deve avere thermalCue (caldo/freddo), thermalReason leggibile, fonte e thermalMeaning (declared-convention oppure anomaly-sign se supportato da dati). Associazione e revisione appartengono alla scena. thermalProfileId fisico può rimanere nullo. |

Due baseline distinte: `normalizationBaseline` contiene gli intervalli numerici scelti per la musica; `scientificBaseline` descrive il riferimento climatologico se documentato. Un null scientifico è ammissibile in dominio visuale, con limite esplicito. Il simulatore può esprimere una convenzione documentata anche per una scena puramente visiva. Una data non qualificata impedisce una narrazione sul confronto temporale preciso e richiede di ridurre o sostituire la raccolta.

Regole di qualificazione: stessa proiezione/estensione e stessa elaborazione; testo controllato sulle fonti; nessun asset protetto di terzi riusato senza condizioni chiare; percorsi locali relativi interni al pacchetto; errori di hash o dimensioni bloccano la scena. Il browser non scarica risorse NASA a ogni avvio.
